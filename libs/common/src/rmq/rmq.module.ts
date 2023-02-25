import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as Joi from 'joi';
import { DynamicConfigModule, DynamicConfigService } from '../dynamic';
import { RmqService } from './rmq.service';
interface RmqModuleOptions {
	name: string;
}

@Module({
	imports: [
		DynamicConfigModule.register({
			isGlobal: true,
			validationSchema: Joi.object({
				RABBIT_MQ_URI: Joi.string().required()
			}),
			folder: '.'
		})
	],
	providers: [RmqService],
	exports: [RmqService]
})
export class RmqModule {
	static register(options: RmqModuleOptions): DynamicModule {
		return {
			module: RmqModule,
			imports: [
				ClientsModule.registerAsync([
					{
						imports: [
							DynamicConfigModule.register({
								isGlobal: true,
								folder: '.'
							})
						],
						useFactory: (configService: DynamicConfigService) => ({
							transport: Transport.RMQ,
							options: {
								urls: [configService.get('RABBIT_MQ_URI')]
							}
						}),
						inject: [DynamicConfigService],
						...options
					}
				])
			],
			exports: [ClientsModule]
		};
	}
}
