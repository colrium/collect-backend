import { DynamicMongoRepository } from '@app/common/dynamic/mongo';
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Message } from '../models';

@Injectable()
export class MessageRepository extends DynamicMongoRepository<Message> {
	protected readonly logger = new Logger(MessageRepository.name);

	constructor(
		@InjectModel(Message.name) model: Model<Message>,
		@InjectConnection() connection: Connection
	) {
		super(model, connection);
	}
}
