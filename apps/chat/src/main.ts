import { DynamicConfigService } from '@app/common';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import {
	DocumentBuilder,
	SwaggerCustomOptions,
	SwaggerModule
} from '@nestjs/swagger';
import helmet from 'helmet';
import { ChatModule } from './chat.module';

async function bootstrap() {
	const logger = new Logger('bootstrap');
	const app = await NestFactory.create(ChatModule, {
		logger: ['error', 'warn', 'debug', 'verbose']
	});
	const configService = app.get(DynamicConfigService);

	const APP_FAVICON = configService.get('FAVICON');
	const APP_NAME = configService.get('CHAT_APP_NAME', 'CBE Chat');
	const APP_DESCRIPTION = configService.get(
		'CHAT_APP_DESCRIPTION',
		'Collect Chat Application'
	);
	const APP_VERSION = configService.get('CHAT_APP_VERSION', '1.0.0');
	const PORT = configService.get('CHAT_APP_PORT', 8087);
	app.use(helmet());
	app.useGlobalPipes(new ValidationPipe({ transform: true }));
	const swaggerConfigBuilder = new DocumentBuilder()
		.setTitle(APP_NAME)
		.setDescription(APP_DESCRIPTION)
		.setVersion(APP_VERSION)
		.addBearerAuth();
	// .addCookieAuth("Authentication")
	const swaggerConfig = swaggerConfigBuilder.build();
	const customOptions: SwaggerCustomOptions = {
		customSiteTitle: APP_NAME,
		customfavIcon: APP_FAVICON,
		swaggerOptions: {
			persistAuthorization: true
		}
	};
	const document = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup('/docs', app, document, customOptions);
	app.connectMicroservice({
		transport: Transport.MQTT,
		options: {
			url: 'mqtt://localhost:1883'
		}
	});

	await app.listen(PORT);
	logger.verbose(`${APP_NAME} listening on port: ${PORT}`);
}
bootstrap();
