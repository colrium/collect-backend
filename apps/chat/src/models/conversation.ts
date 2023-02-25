import { IsValidUUID } from '@app/common';
import { MongoBaseDocument, MongoSchema } from '@app/common/dynamic/mongo';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
export enum ConversationType {
	GROUP = 'group',
	INDIVIDUAL = 'individual',
	BOT = 'bot',
	APP = 'app'
}

export enum ConversationStatus {
	OPEN = 'open',
	CLOSED = 'closed',
	ADMIN = 'admins_only'
}

export type ConversationDocument = Conversation & Document;

@MongoSchema({
	collection: 'chat.conversations'
})
export class Conversation extends MongoBaseDocument {
	@ApiPropertyOptional({
		type: String,
		example: ConversationType.INDIVIDUAL,
		description: 'The type of the conversation'
	})
	@Prop({
		type: String,
		enum: ConversationType,
		default: ConversationType.INDIVIDUAL
	})
	type: ConversationType;

	@ApiProperty({
		example: uuidv4(),
		description: 'Owner user id'
	})
	@IsString()
	@IsValidUUID()
	@Prop({ type: String, required: true })
	ownerId: string;

	@ApiPropertyOptional({
		example: 'Team A Chat',
		description: 'Conversation Title'
	})
	@IsString()
	@Prop({ type: String, default: null })
	title: string;

	@ApiPropertyOptional({
		example: 'Team A Chat Description',
		description: 'Conversation description'
	})
	@IsString()
	@Prop({ type: String, default: null })
	description: string;

	@ApiPropertyOptional({
		type: String,
		example: ConversationStatus.OPEN,
		description: 'The status of the conversation'
	})
	@Prop({
		type: String,
		enum: ConversationStatus,
		default: ConversationStatus.OPEN
	})
	status: ConversationStatus;
}

const ModelSchema = SchemaFactory.createForClass(Conversation);

ModelSchema.index({
	type: 'text',
	title: 'text',
	description: 'text',
	ownerId: 'text',
	status: 'text'
});

export { ModelSchema as ConversationSchema };
