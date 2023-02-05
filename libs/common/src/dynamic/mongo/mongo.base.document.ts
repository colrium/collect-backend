import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { SchemaTypes, Types } from 'mongoose';
// import { MongoSchema } from './decorators';
import { v4 as uuidv4 } from 'uuid';
import { IsValidUUID } from '../../decorators';

@Schema({
	toJSON: {
		virtuals: true,
		getters: true,
	},
	toObject: { virtuals: true, getters: true },
	versionKey: false,
})
export class MongoBaseDocument {
	@Exclude()
	@Prop({ type: SchemaTypes.ObjectId })
	_id: Types.ObjectId;

	@ApiProperty({
		example: uuidv4(),
		description: 'The id of the record',
	})
	@Expose({ name: 'id' })
	@IsValidUUID()
	@Prop({ type: String, required: true })
	id: string = uuidv4();

	@Prop({ type: Date, default: Date.now })
	createdAt: Date;

	@Prop({ type: Date, default: null })
	updatedAt: Date;

	@Prop({ type: Date, default: null })
	deletedAt: Date;
}
