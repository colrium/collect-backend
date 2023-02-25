import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
    ClientProxy,
    Ctx,
    MessagePattern,
    MqttContext,
    Payload
} from '@nestjs/microservices';

@Controller()
export class GatewayController {
	constructor(
		@Inject('MQTT_SERVICE') private mqttClient: ClientProxy,
		private eventEmmitter: EventEmitter2
	) {}

	@Get('notifications')
	getNotifications() {
		return this.mqttClient.send(
			'chat_channel',
			"It's a Message From Client"
		);
	}
	@Post('message')
	sendMessage(@Body() body: any) {
		this.eventEmmitter.emit('message.send', body);
		return this.mqttClient.send('chat_channel', body);
	}

	@MessagePattern('chat_channel')
	getchats(@Payload() data, @Ctx() context: MqttContext) {
		console.log('GatewayController getchats: data', data);
		console.log('GatewayController getchats: context', context);
		return `I Got Message From Client: ${data}`;
	}
	@MessagePattern('process_channel')
	getProcessClientData(@Payload() data) {
		console.log('Client data in getProcessClientData for process', data);
		const result = data.split('');
		return result;
	}
}
