import { Prop } from '@nestjs/mongoose';
import { Exclude, Expose } from 'class-transformer';
import { SchemaTypes, Types } from 'mongoose';
import uuid from 'uuid';
import { IsValidUUID } from '../../decorators';
import { MongoSchema } from './decorators';

@MongoSchema()
export class MongoBaseDocument {
	@Exclude()
	@Prop({ type: SchemaTypes.ObjectId })
	_id: Types.ObjectId;

	@Expose({ name: 'id' })
	@IsValidUUID()
	@Prop({ type: String, default: uuid.v4(), required: true })
	id: string;

	@Prop({ type: Date, default: Date.now })
	createdAt: Date;

	@Prop({ type: Date, default: null })
	updatedAt: Date;

	@Prop({ type: Date, default: null })
	deletedAt: Date;
}
