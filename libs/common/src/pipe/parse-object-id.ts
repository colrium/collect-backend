import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common"
import { Types } from "mongoose"

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any, Types.ObjectId> {
	transform(value: any): Types.ObjectId {
		if (!value || (typeof value === "string" && !Types.ObjectId.isValid(value))) {
			throw new BadRequestException("Invalid ObjectId")
		}
		return value instanceof Types.ObjectId ? value : Types.ObjectId.createFromHexString(value)
	}
}
