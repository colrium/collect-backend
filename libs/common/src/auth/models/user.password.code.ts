import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import uuid from 'uuid';
import { IsValidUUID } from '../../decorators';
import { MongoBaseDocument, MongoSchema } from '../../dynamic/mongo';

export type UserPasswordCodeDocument = UserPasswordCode & Document;

@MongoSchema({
	collection: 'user.password.reset.code',
})
export class UserPasswordCode extends MongoBaseDocument {
	@ApiProperty({
		example: uuid.v4(),
		description: "The user's Id",
	})
	@IsString()
	@IsValidUUID()
	@Prop({ type: String, required: true })
	userId: string;
	@ApiProperty({
		example: uuid.v4(),
		description: "The teams's Id",
	})
	@Prop({ type: String, required: true })
	code: string;

	@Prop({ type: Date, expires: '2m', default: Date.now })
	setOn: Date;
}

const ModelSchema = SchemaFactory.createForClass(UserPasswordCode);

ModelSchema.index({
	name: 'text',
	description: 'text',
});

export { ModelSchema as UserPasswordCodeSchema };
