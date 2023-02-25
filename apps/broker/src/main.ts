import { DynamicConfigService } from '@app/common';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './broker.module';
// import * as cookieParser from 'cookie-parser';
// import helmet from 'helmet';

async function bootstrap() {
	const logger = new Logger('bootstrap');
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		AppModule,
		{
			transport: Transport.MQTT,
			options: {
				// url: 'mqtt://broker.emqx.io:1883',
				url: 'mqtt://localhost:1883'
			}
		}
	);
	const configService = app.get(DynamicConfigService);
	const APP_NAME = configService.get('BROKER_APP_NAME', 'CBE BROKER');

	await app.listen();
	logger.verbose(`${APP_NAME} listening`);
}
bootstrap();
