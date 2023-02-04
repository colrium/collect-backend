import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { StaticModule } from './static.module';
import { DynamicConfigService } from '@app/common';
async function bootstrap() {
	const app = await NestFactory.create(StaticModule);
	const configService = app.get(DynamicConfigService);
	await app.listen(configService.get('APP_STATICS_PORT', 8082));
	console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
