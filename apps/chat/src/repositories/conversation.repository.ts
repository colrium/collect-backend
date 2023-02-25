import { DynamicMongoRepository } from '@app/common/dynamic/mongo';
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Conversation } from '../models';

@Injectable()
export class ConversationRepository extends DynamicMongoRepository<Conversation> {
	protected readonly logger = new Logger(ConversationRepository.name);

	constructor(
		@InjectModel(Conversation.name) model: Model<Conversation>,
		@InjectConnection() connection: Connection
	) {
		super(model, connection);
	}
}
