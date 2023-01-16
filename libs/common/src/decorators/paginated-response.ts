import { applyDecorators, Type } from "@nestjs/common"
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger"
import { PageDto } from "../dto/page.dto"

export const PaginatedResponse = <TModel extends Type<any>>(model: TModel) => {
	return applyDecorators(
		ApiOkResponse({
			// title: `PaginatedResponseOf ${model.name}`,
			description: `Successfully received ${model.name} list`,
			headers: {
				"Pagination-Count": {
					description: `Total size of ${model.name} result list`,
					// type: "number",
				},
				"Pagination-Page": {
					description: `Current page of total ${model.name} list`,
					// type: "number",
				},
				"Pagination-Limit": {
					description: `Current ${model.name} list records per page`,
					// type: "number",
				},
				Link: {
					description: `Links associated with the resulting ${model.name} list`,

					// type: "string",
				},
			},
			schema: {
				type: "array",
				items: { $ref: getSchemaPath(model) },
			},
		})
	)
}
