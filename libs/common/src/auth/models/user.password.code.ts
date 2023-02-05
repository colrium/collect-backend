import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { IsValidUUID } from '../../decorators';
import { MongoBaseDocument, MongoSchema } from '../../dynamic/mongo';

export type UserPasswordCodeDocument = UserPasswordCode & Document;

@MongoSchema({
	collection: 'user.password.reset.code',
})
export class UserPasswordCode extends MongoBaseDocument {
	@ApiProperty({
		example: uuidv4(),
		description: "The user's Id",
	})
	@IsString()
	@IsValidUUID()
	@Prop({ type: String, required: true })
	userId: string;
	@ApiProperty({
		example: uuidv4(),
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
