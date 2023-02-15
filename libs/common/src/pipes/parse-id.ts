import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectId } from 'bson';
import uuid from 'uuid';
@Injectable()
export class ParseId implements PipeTransform<any, any> {
	transform(id: any): ObjectId {
		if (!id || (!ObjectId.isValid(id) && !uuid.validate(id))) {
			throw new BadRequestException('Invalid id');
		}
		return ObjectId.isValid(id)
			? ObjectId.createFromHexString(id)
			: uuid.parse(id);
	}
}
