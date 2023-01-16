import { ApiProperty, ApiBody } from "@nestjs/swagger"
import { IsArray } from "class-validator"
import { PageMetaDto } from "./page-meta.dto"

export class PageDto<T> {
	@IsArray()
	@ApiProperty({ isArray: true })
	readonly data: T[]

	@ApiProperty({ type: () => PageMetaDto })
	readonly meta: PageMetaDto

	// @ApiResponse({
	// 	status: 200,
	// 	description: "The found records",
	// 	headers: {
	// 		"X-Total-Count": {
	// 			description: "Total number of records",
	// 			example: 123,
	// 			type: "number",
	// 		},
	// 	},
	// 	type: [User],
	// })

	constructor(data: T[], meta: PageMetaDto) {
		this.data = data
		this.meta = meta
	}
}
