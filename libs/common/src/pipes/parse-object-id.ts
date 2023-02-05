import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ObjectId } from 'bson';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any, ObjectId> {
	transform(value: any): ObjectId {
		if (!value || (typeof value === 'string' && !ObjectId.isValid(value))) {
			throw new BadRequestException('Invalid ObjectId');
		}
		return value instanceof ObjectId
			? value
			: ObjectId.createFromHexString(value);
	}
}
