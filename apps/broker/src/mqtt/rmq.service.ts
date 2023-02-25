import { DynamicConfigService } from '@app/common//dynamic';
import { Injectable } from '@nestjs/common';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class RmqService {
	constructor(private readonly configService: DynamicConfigService) {}

	getOptions(queue: string, noAck = false): RmqOptions {
		return {
			transport: Transport.RMQ,
			options: {
				urls: [this.configService.get('RABBIT_MQ_URI')],
				queue: `${queue}_QUEUE`,
				noAck,
				persistent: true
			}
		};
	}

	ack(context: RmqContext) {
		const channel = context.getChannelRef();
		const originalMessage = context.getMessage();
		channel.ack(originalMessage);
	}
}
