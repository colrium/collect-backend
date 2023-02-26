import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';
// import { IsValidUUID } from '../../decorators';
import { MongoSchema } from './decorators';

@MongoSchema({
	removePrivatePaths: true
})
export class MongoBaseDocument {
	// @Exclude()
	// @Prop({ type: SchemaTypes.ObjectId, private: true })
	// _id: Types.ObjectId;

	@ApiProperty({
		example: uuidv4(),
		description: 'The id of the record'
	})
	// @IsValidUUID()
	@Prop({ type: String, default: uuidv4(), unique: true, index: true })
	id: string;

	@Exclude()
	@Prop({ type: Date, default: Date.now, private: true })
	createdAt: Date;

	@Exclude()
	@Prop({ type: Date, default: null, private: true })
	updatedAt: Date;

	// @Exclude()
	// @Prop({ type: Date, default: null, private: false })
	// deletedAt: Date;
}
