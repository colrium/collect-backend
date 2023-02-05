import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import {
	IsObjectIdString,
	MongoBaseDocument,
	MongoSchema
} from '../../dynamic/mongo';
import { Role } from '../types';

export type UserRoleDocument = UserRole & Document;

@MongoSchema({
	collection: 'user.role'
})
export class UserRole extends MongoBaseDocument {
	@ApiProperty({
		example: uuidv4(),
		description: "The user's Id"
	})
	@IsObjectIdString()
	@Prop({ type: String, required: true })
	userId: string;

	@ApiProperty({
		example: Role.GUEST,
		description: 'The user role'
	})
	@Prop({ type: String, enum: Role, required: true })
	role: string;
}

const ModelSchema = SchemaFactory.createForClass(UserRole);

ModelSchema.index({
	role: 'text'
});

export { ModelSchema as UserRoleSchema };
