import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import * as Joi from 'joi';
import {
	DynamicConfigModule,
	DynamicConfigService,
} from '@app/common';

@Module({
	imports: [
		// ConfigModule.forRoot({
		// 	isGlobal: true,
		// 	envFilePath: './apps/static/.env',
		// 	validationSchema: Joi.object({
		// 		PORT: Joi.number().required(),
		// 	}),
		// }),
		DynamicConfigModule.forRoot({
			folder: '.',
		}),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', '..', '..', 'assets'),
		}),
	],
})
export class StaticModule {}
