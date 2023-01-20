import { Injectable } from '@nestjs/common';
import { DynamicConfigService } from '../dynamic';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class RmqService {
	constructor(private readonly configService: DynamicConfigService) {}

	getOptions(queue: string, noAck = false): RmqOptions {
		return {
			transport: Transport.RMQ,
			options: {
				urls: [this.configService.get('RABBIT_MQ_URI')],
				queue: this.configService.get(
					`RABBIT_MQ_${queue}_QUEUE`
				),
				noAck,
				persistent: true,
			},
		};
	}

	ack(context: RmqContext) {
		const channel = context.getChannelRef();
		const originalMessage = context.getMessage();
		channel.ack(originalMessage);
	}
}
