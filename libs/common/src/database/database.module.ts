import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { DynamicConfigModule, DynamicConfigService } from '../dynamic';
import { toJSON as toJSONPlugin } from './tojson.plugin';
@Module({
	imports: [
		DynamicConfigModule.register({
			validationSchema: Joi.object({
				MONGODB_URI: Joi.string().required()
			}),
			folder: '.'
		}),
		MongooseModule.forRootAsync({
			imports: [
				DynamicConfigModule.register({
					validationSchema: Joi.object({
						MONGODB_URI: Joi.string().required()
					}),
					folder: '.'
				})
			],
			useFactory: (configService: DynamicConfigService) => {
				const uri = configService.get('MONGODB_URI');
				return {
					uri: uri,
					connectionFactory: (connection) => {
						connection.plugin(toJSONPlugin);
						return connection;
					}
				};
			},

			inject: [DynamicConfigService]
		})
	]
})
export class DatabaseModule {}
