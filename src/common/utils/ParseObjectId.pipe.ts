import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common"
import { ObjectId } from "mongodb"

@Injectable()
export default class ParseObjectIdPipe implements PipeTransform<any, ObjectId> {
	transform(value: any): ObjectId {
		const validObjectId = ObjectId.isValid(value)

		if (!validObjectId) {
			throw new BadRequestException("Invalid ObjectId")
		}

		return ObjectId.createFromHexString(value)
	}
}
