import { DynamicModule, Module } from '@nestjs/common';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RmqService } from './rmq.service';
import { DynamicConfigModule, DynamicConfigService } from '../dynamic';
interface RmqModuleOptions {
  name: string;
}

@Module({
	imports: [
		DynamicConfigModule.register({
			isGlobal: true,
			validationSchema: Joi.object({
				RABBIT_MQ_URI: Joi.string().required(),
			}),
			folder: '.',
		}),
	],
	providers: [RmqService],
	exports: [RmqService],
})
export class RmqModule {
	static register({ name }: RmqModuleOptions): DynamicModule {
		return {
			module: RmqModule,
			imports: [
				ClientsModule.registerAsync([
					{
						// imports: [
						// 	DynamicConfigModule.register({
						// 		isGlobal: true,
						// 		validationSchema: Joi.object({
						// 			RABBIT_MQ_URI: Joi.string().required(),
						// 			[`RABBIT_MQ_${name}_QUEUE`]:
						// 				Joi.string().required(),
						// 		}),
						// 		folder: '.',
						// 	}),
						// ],
						name,
						useFactory: (configService: DynamicConfigService) => ({
							transport: Transport.RMQ,
							options: {
								urls: [configService.get('RABBIT_MQ_URI')],
								queue: configService.get(
									`RABBIT_MQ_${name}_QUEUE`
								),
							},
						}),
						inject: [DynamicConfigService],
					},
				]),
			],
			exports: [ClientsModule],
		};
	}
}
