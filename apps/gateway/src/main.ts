import { DynamicConfigService, RmqService } from '@app/common';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { RmqOptions, Transport } from '@nestjs/microservices';
import {
	DocumentBuilder,
	SwaggerCustomOptions,
	SwaggerModule
} from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { WebsocketAdapter } from './gateway.adapter';
import { GatewayModule } from './gateway.module';

async function bootstrap() {
	const logger = new Logger('bootstrap');
	const app = await NestFactory.create(GatewayModule, {
		logger: ['error', 'warn', 'debug', 'verbose']
	});
	const configService = app.get(DynamicConfigService);
	const rmqService = app.get<RmqService>(RmqService);
	const adapter = new WebsocketAdapter(app);
	app.useWebSocketAdapter(adapter);

	const APP_HOST = configService.get('USERS_GATEWAY_HOST');
	const APP_PORT = configService.get('USERS_GATEWAY_PORT', 8086);

	const APP_FAVICON = configService.get('APPS_FAVICON');
	const APP_NAME = configService.get('GATEWAY_APP_NAME', 'CBE Gateway');
	const APP_DESCRIPTION = configService.get(
		'GATEWAY_APP_DESCRIPTION',
		'Collect Gateway Application'
	);
	const APP_VERSION = configService.get('GATEWAY_APP_VERSION', '1.0.0');
	const PORT = configService.get('GATEWAY_APP_PORT', 8085);
	app.use(helmet());
	// app.use(csurf())
	app.useGlobalPipes(new ValidationPipe({ transform: true }));
	app.use(cookieParser());

	app.connectMicroservice<RmqOptions>(rmqService.getOptions('GATEWAY', true));
	app.connectMicroservice({
		transport: Transport.TCP,
		options: {
			host: APP_HOST,
			port: APP_PORT
		}
	});
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

	await app.startAllMicroservices();
	await app.listen(PORT);
	logger.verbose(`${APP_NAME} listening on port: ${PORT}`);
}
bootstrap();
