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

	const PROJECT_NAME = configService.get('PROJECT_NAME', 'CBE');
	const PROJECT_DESCIPTION = configService.get('PROJECT_DESCIPTION');

	const APP_FAVICON = configService.get('FAVICON');
	const APP_NAME = configService.get(
		'AUTH_APP_NAME',
		`${PROJECT_NAME || ''} | Auth`
	);
	const APP_DESCRIPTION = configService.get(
		'AUTH_APP_DESCRIPTION',
		`${PROJECT_DESCIPTION || ''} Authentication and Authorization Service`
	);
	const APP_VERSION = configService.get('VERSION', '0.0.1');

	const APP_SERTVICE_HOST = configService.get('SERVICE_AUTH_HOST');
	const APP_SERTVICE_PORT = configService.get('SERVICE_AUTH_PORT');

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
