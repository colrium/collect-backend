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
import { AuthModule } from './auth.module';

async function bootstrap() {
	const logger = new Logger('bootstrap');
	const app = await NestFactory.create(AuthModule, {
		logger: ['error', 'warn', 'debug', 'verbose']
	});
	const configService = app.get(DynamicConfigService);
	const rmqService = app.get<RmqService>(RmqService);

	const APP_SERTVICE_HOST = configService.get('SERVICE_AUTH_HOST');
	const APP_SERTVICE_PORT = configService.get('SERVICE_AUTH_PORT');

	const APP_FAVICON = configService.get('APPS_FAVICON');
	const APP_NAME = configService.get('APP_AUTH_NAME');
	const APP_DESCRIPTION = configService.get('APP_AUTH_DESCRIPTION');
	const APP_VERSION = configService.get('APP_AUTH_VERSION');
	const PORT = configService.get('APP_AUTH_PORT', 8081);

	app.use(helmet());
	// app.use(csurf())
	app.useGlobalPipes(new ValidationPipe({ transform: true }));
	app.use(cookieParser());

	app.connectMicroservice<RmqOptions>(rmqService.getOptions('AUTH', true));
	app.connectMicroservice({
		transport: Transport.TCP,
		options: {
			host: APP_SERTVICE_HOST,
			port: APP_SERTVICE_PORT
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
