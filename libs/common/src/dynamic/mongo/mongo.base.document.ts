import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { SchemaTypes, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IsValidUUID } from '../../decorators';
import { MongoSchema } from './decorators';

@MongoSchema()
export class MongoBaseDocument {
	@Exclude()
	@Prop({ type: SchemaTypes.ObjectId })
	_id: Types.ObjectId;

	@ApiProperty({
		example: uuidv4(),
		description: 'The id of the record'
	})
	@Expose({ name: 'id' })
	@IsValidUUID()
	@Prop({ type: String, default: uuidv4() })
	id: string;

	@Exclude()
	@Prop({ type: Date, default: Date.now })
	createdAt: Date;

	@Exclude()
	@Prop({ type: Date, default: null })
	updatedAt: Date;

	@Exclude()
	@Prop({ type: Date, default: null })
	deletedAt: Date;
}
