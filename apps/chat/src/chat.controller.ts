import { Controller, Get, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ChatService } from './chat.service';

@Controller()
export class ChatController {
	logger: Logger = new Logger(ChatController.name);
	constructor(private readonly chatService: ChatService) {}

	@Get()
	getHello(): string {
		return this.chatService.getHello();
	}

	// @MessagePattern({ role: 'chat', cmd: 'create-message' })
	@OnEvent('chat.create-message')
	async createMessage(data): Promise<any> {
		this.logger.log('createMessage', data);
		return;
		try {
			return await this.chatService.createMessage(data);
		} catch (err) {
			this.logger.error(`createMessage error`, err);
			return;
		}
	}
}
