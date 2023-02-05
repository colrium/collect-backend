import { NestFactory } from '@nestjs/core';
import { RmqService } from '@app/common';
import { RmqOptions } from '@nestjs/microservices';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser';
import {
	DocumentBuilder,
	SwaggerCustomOptions,
	SwaggerModule,
} from '@nestjs/swagger';
import { Transport } from '@nestjs/microservices';
import { DynamicConfigService } from '@app/common';
import { UsersModule } from './users.module';

async function bootstrap() {
	const logger = new Logger('bootstrap');
	const app = await NestFactory.create(UsersModule, {
		logger: ['error', 'warn', 'debug', 'verbose'],
	});
	const configService = app.get(DynamicConfigService);
	const rmqService = app.get<RmqService>(RmqService);

	const APP_SERTVICE_HOST = configService.get('USERS_SERVICE_HOST');
	const APP_SERTVICE_PORT = configService.get('USERS_SERVICE_PORT', 8084);

	const APP_FAVICON = configService.get('APPS_FAVICON');
	const APP_NAME = configService.get('USERS_APP_NAME', 'CBE Users');
	const APP_DESCRIPTION = configService.get(
		'USERS_APP_DESCRIPTION',
		'Collect Users Application'
	);
	const APP_VERSION = configService.get('USERS_APP_VERSION', '1.0.0');
	const PORT = configService.get('USERS_APP_PORT', 8083);
	logger.verbose(`APP_FAVICON ${APP_FAVICON}`);
	app.use(helmet());
	// app.use(csurf())
	app.useGlobalPipes(new ValidationPipe({ transform: true }));
	app.use(cookieParser());

	app.connectMicroservice<RmqOptions>(rmqService.getOptions('AUTH', true));
	app.connectMicroservice({
		transport: Transport.TCP,
		options: {
			host: APP_SERTVICE_HOST,
			port: APP_SERTVICE_PORT,
		},
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
			persistAuthorization: true,
		},
	};
	const document = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup('/docs', app, document, customOptions);

	await app.startAllMicroservices();
	await app.listen(PORT);
	logger.verbose(`${APP_NAME} listening on port: ${PORT}`);
}
bootstrap();
