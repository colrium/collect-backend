import { Module, Logger } from '@nestjs/common';
import * as Joi from 'joi';
import { MongooseModule } from "@nestjs/mongoose"
import { toJSON as toJSONPlugin } from "./tojson.plugin"
import { DynamicConfigModule, DynamicConfigService } from '../dynamic';
@Module({
	imports: [
		DynamicConfigModule.register({
			validationSchema: Joi.object({
				MONGODB_URI: Joi.string().required(),
			}),
			folder: '.',
		}),
		MongooseModule.forRootAsync({
			imports: [
				DynamicConfigModule.register({
					validationSchema: Joi.object({
						MONGODB_URI: Joi.string().required(),
					}),
					folder: '.',
				}),
			],
			useFactory: (configService: DynamicConfigService) => {
				const logger = new Logger('DatabaseModule');
				const uri = configService.get('MONGODB_URI');
				// logger.verbose(`Connecting to database with URI: ${uri}...`);
				return {
					uri: uri,
					connectionFactory: (connection) => {
						connection.plugin(toJSONPlugin);
						return connection;
					},
				};
			},

			inject: [DynamicConfigService],
		}),
	],
})
export class DatabaseModule {}
