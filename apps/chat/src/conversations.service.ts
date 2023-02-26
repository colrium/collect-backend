import {
	Inject,
	Injectable,
	InternalServerErrorException,
	UnprocessableEntityException
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { FilterQuery } from 'mongoose';
import { Conversation, ConversationType } from './models';
import { ConversationRepository } from './repositories';

@Injectable()
export class ConversationsService {
	constructor(
		@Inject('MQTT_SERVICE') private mqttClient: ClientProxy,
		private eventEmmitter: EventEmitter2,
		private readonly repository: ConversationRepository
	) {}
	async create(data: Omit<Conversation, '_id'>) {
		const exists = await this.conversationExists(data);
		if (exists) {
			throw new UnprocessableEntityException(
				'Conversation already exists.'
			);
		} else {
			const conversation = await this.repository.create(data);
			this.mqttClient.send('chat_channel', {
				name: 'new-conversation',
				data: conversation
			});
			return conversation;
		}
	}

	private conversationExists = async (
		data: Omit<Conversation, '_id'>
	): Promise<boolean> => {
		let count: number;
		try {
			count = await this.repository.count({
				type: ConversationType.INDIVIDUAL,
				$or: [
					{
						$and: [
							{ ownerId: data.ownerId },
							{
								participantIds: { $in: data.participantIds }
							}
						]
					},
					{
						$and: [
							{ ownerId: data.participantIds[0] },
							{
								participantIds: { $in: [data.ownerId] }
							}
						]
					}
				]
			});
		} catch (error) {
			// throw err
			throw new InternalServerErrorException('Something Went wrong');
		}
		return count > 0;
	};

	async findOne(
		filterQuery: FilterQuery<Conversation>
	): Promise<Conversation> {
		return await this.repository.findOne(filterQuery);
	}

	async find(filterQuery: FilterQuery<Conversation>): Promise<Document[]> {
		return await this.repository.find(filterQuery);
	}
}
