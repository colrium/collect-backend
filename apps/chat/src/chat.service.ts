import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
	getHello(): string {
		return 'Hello World!';
	}

	async createMessage(message): Promise<any> {
		return 'Hello World!';
	}
}
