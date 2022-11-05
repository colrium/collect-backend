interface PaginationMeta {
	totalItems: number
	itemCount: number
	itemsPerPage: number
	totalPages: number
	currentPage: number
}

class PaginationDto<TData> {
	items: TData[]
	meta: PaginationMeta
}

export { PaginationMeta, PaginationDto }
