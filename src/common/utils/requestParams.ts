import { IsNumber, IsNumberString, IsString, IsMongoId, Min, IsOptional } from "class-validator"
import { Type } from "class-transformer"

export class RequestParams {
	@IsOptional()
	@IsString()
	searchQuery?: string

	@IsOptional()
	@IsMongoId()
	startId?: string

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	@Min(0)
	skip?: number

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	@Min(1)
	limit?: number
}
export default RequestParams
