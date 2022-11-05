import {
	applyDecorators,
	BadRequestException,
	createParamDecorator,
	ExecutionContext,
	Type,
} from "@nestjs/common"
import {
	ApiExtraModels,
	ApiResponse,
	getSchemaPath,
	ApiOperation,
} from "@nestjs/swagger"
import { Request } from "express"
const FIRST_PAGE: number = 1
const DEFAULT_NUMBER_OF_RESULTS: number = 10

export interface IApiPagination {
	model?: Type<any>
	summary?: string
	resource?: string
}

export const ApiPagination = <TModel extends Type<any>>(
	options: IApiPagination
) => {
	return applyDecorators(
		ApiOperation({
			summary:
				options.summary ||
				`Get ${options.model?.name || ""} list`,
			parameters: [
				{
					name: "per_page",
					in: "query",
					description: "The limit number of items to return",
					required: false,
					schema: {
						type: "integer",
						example: 10,
					},
				},
				{
					name: "page",
					in: "query",
					description: "The page number",
					required: false,
					schema: {
						type: "integer",
						example: 1,
					},
				},
			],
		})
	)
}


export interface IApiPaginationResponse {
	model: Type<any>
	description?: string
	resource?: string
	status?: number
}

export const ApiPaginationResponse = <TModel extends Type<any>>(
	options: IApiPaginationResponse
) => {
	return applyDecorators(
		ApiResponse({
			description:
				options.description || "Successfully received data list",
			status: options.status || 200,
			content: {
				"application/json": {
					schema: {
						type: "array",
						items: {
							$ref: getSchemaPath(options.model),
						},
					},
				},
			},
			headers: {
				Link: {
					description: "The pagination link",
					schema: {
						type: "string",
						example: `<${options.resource || ""}?per_page=10&page=15>; rel="next", <${options.resource || ""}?per_page=10&page=34>; rel="last", <${options.resource || ""}?per_page=10&page=1>; rel="first", <${options.resource || ""}?per_page=10&page=13>; rel="prev"`,
					},
				},

			},
		})
	)
}


export interface IPagination {
	limit: number
	skip: number
}

export const Pagination = createParamDecorator(
		(
			{
				pageName = "page",
				perPageName = "per_page",
			}: { pageName?: string; perPageName?: string } = {},
			ctx: ExecutionContext
		): IPagination => {
			const request = ctx.switchToHttp().getRequest()
			const page: number = Number(request.query[pageName]) || FIRST_PAGE
			const limit: number =
				Number(request.query[perPageName]) || DEFAULT_NUMBER_OF_RESULTS
			if (page <= 0 || limit <= 0) {
				throw new BadRequestException("Bad pagination request")
			}
			return {
				limit,
				skip: (page - 1) * limit,
			}
		}
	)
