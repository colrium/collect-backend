import { ApiProperty, ApiHeader } from "@nestjs/swagger"
export interface PaginationMeta {
	total: number
	count: number
	pagination: number
	pages: number
	page: number
}

export class PaginatedDto<TData> {
	items: TData[]
	meta: PaginationMeta
}
