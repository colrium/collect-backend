// import { IsValidUUID } from '@app/common';
import { MongoBaseDocument, MongoSchema } from '@app/common/dynamic/mongo';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
export enum MessageType {
	TEXT = 'text',
	IMAGE = 'image',
	AUDIO = 'audio',
	VIDEO = 'video',
	FILE = 'file'
}

export enum MessageStatus {
	SENT = 'sent',
	RECEIVED = 'received',
	READ = 'read'
}

export type MessageDocument = Message & Document;

@MongoSchema({
	collection: 'chat.messages'
})
export class Message extends MongoBaseDocument {
	@ApiProperty({
		example:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Egestas maecenas pharetra convallis posuere morbi leo.',
		description: 'Message Body'
	})
	@IsString()
	@IsNotEmpty()
	@Prop({ type: String, required: true })
	body: string;

	@ApiPropertyOptional({
		type: String,
		example: MessageType.TEXT,
		description: 'The type of the message'
	})
	@Prop({
		type: String,
		enum: MessageType,
		default: MessageType.TEXT
	})
	type: MessageType;

	@ApiProperty({
		example: uuidv4(),
		description: 'Sender user id'
	})
	@IsString()
	@Prop({ type: String, required: true })
	senderId: string;

	@ApiProperty({
		example: uuidv4(),
		description: 'Conversation id'
	})
	@IsString()
	@Prop({ type: String, required: true })
	conversationId: string;

	@ApiPropertyOptional({
		type: Boolean,
		example: false
	})
	@IsOptional()
	@IsBoolean()
	@Prop({ type: Boolean, required: false, default: false })
	isReaction: boolean;

	@ApiPropertyOptional({
		type: Boolean,
		example: false
	})
	@IsOptional()
	@IsBoolean()
	@Prop({ type: Boolean, required: false, default: false })
	isReply: boolean;

	@ApiPropertyOptional({
		example: uuidv4(),
		description: 'Parent Message id'
	})
	@IsString()
	@IsOptional()
	@Prop({ type: String, default: null })
	parentMessageId: string;

	@ApiPropertyOptional({
		type: String,
		example: MessageStatus.SENT,
		description: 'The status of the message'
	})
	@Prop({
		type: String,
		enum: MessageStatus,
		default: MessageStatus.SENT
	})
	status: MessageStatus;
}

const ModelSchema = SchemaFactory.createForClass(Message);

ModelSchema.index({
	body: 'text',
	type: 'text',
	conversationId: 'text',
	senderId: 'text',
	status: 'text',
	parentMessageId: 'text'
});

export { ModelSchema as MessageSchema };
