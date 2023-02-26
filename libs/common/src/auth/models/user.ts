import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { model } from 'mongoose';
import { MongoBaseDocument, MongoSchema } from '../../dynamic/mongo';
import { Role } from '../types';

export type UserDocument = User & Document;

@MongoSchema({
	collection: 'users'
})
export class User extends MongoBaseDocument {
	@ApiProperty({
		example: 'user@example.com',
		description: 'The email of the User'
	})
	@IsEmail()
	@IsString()
	@Prop({ type: String, required: true, unique: true })
	email: string;

	@ApiProperty({ example: 'John', description: 'The first name of the User' })
	@IsString()
	@IsNotEmpty()
	@Prop({ type: String, required: true })
	firstName: string;

	@ApiProperty({ example: 'Doe', description: 'The last name of the User' })
	@Prop({ type: String, required: true })
	lastName: string;

	fullName?: string;

	@ApiProperty({
		example: '070000000',
		description: 'The phone number of the User'
	})
	@IsString()
	@IsNotEmpty()
	@Prop({ type: String, default: null })
	phoneNumber?: string;

	@ApiProperty({
		type: 'array',
		items: {
			type: 'string'
		},
		example: [Role.GUEST],
		description: 'The roles of the User'
	})
	@Prop([{ type: String, enum: Role, default: [Role.GUEST], private: true }])
	roles: Role[];

	@ApiProperty({ example: 'USER001', description: "The user's Staff ID" })
	@Prop({ type: String, default: null })
	staffId: string;

	@ApiProperty({ example: 'active', description: 'Status of the user' })
	@IsString()
	@IsNotEmpty()
	@Prop({
		type: String,
		default: 'active'
	})
	status: string;
}

const ModelSchema = SchemaFactory.createForClass(User);

ModelSchema.index({
	email: 'text',
	phoneNumber: 'text',
	firstName: 'text',
	lastName: 'text',
	status: 'text',
	staffId: 'text'
});

ModelSchema.virtual('fullName').get(function (this: UserDocument) {
	return `${this.firstName} ${this.lastName}`;
});

const Model = model<User>('User', ModelSchema);

export { ModelSchema as UserSchema, Model as UserModel };
