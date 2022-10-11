import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { StaticModule } from './static.module';

async function bootstrap() {
	const app = await NestFactory.create(StaticModule);
	const configService = app.get(ConfigService);
	await app.listen(configService.get('PORT'));
	console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
