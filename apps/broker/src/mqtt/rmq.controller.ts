import { Controller } from '@nestjs/common';
import {
	Ctx,
	MessagePattern,
	MqttContext,
	Payload
} from '@nestjs/microservices';

@Controller()
export class RmqController {
	@MessagePattern('chat_channel')
	getchats(@Payload() data, @Ctx() context: MqttContext) {
		console.log('MQTT getchats: data', data);
		return `I Got Message From Client: ${data}`;
	}
	@MessagePattern('process_channel')
	getProcessClientData(@Payload() data) {
		console.log('Client data in getProcessClientData for process', data);
		const result = data.split('');
		return result;
	}
}
