import { applyDecorators, Type } from "@nestjs/common"
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger"
import { PaginatedDto } from "../dto/paginated.dto"

export interface IPaginatedResponse {
	model: Type<any>
	description?: string
}

export const IsPaginatedResponse = <TModel extends Type<any>>(options: IPaginatedResponse) => {
	return applyDecorators(
		ApiExtraModels(PaginatedDto),
		ApiOkResponse({
			description: options.description || "Successfully received model list",
			schema: {
				allOf: [
					{ $ref: getSchemaPath(PaginatedDto) },
					{
						properties: {
							items: {
								type: "array",
								items: { $ref: getSchemaPath(options.model) },
							},
							meta: {
								type: "any",
								default: {
									totalItems: 2,
									itemCount: 2,
									itemsPerPage: 2,
									totalPages: 1,
									currentPage: 1,
								},
							},
						},
					},
				],
			},
		})
	)
}
