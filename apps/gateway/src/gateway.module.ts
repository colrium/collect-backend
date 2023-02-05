import {
	AuthModule as AuthLibModule,
	AuthService,
	DatabaseModule,
	DynamicConfigModule,
	DynamicConfigService,
	RmqModule
} from '@app/common';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as Joi from 'joi';
import { Gateway } from './gateway';

@Module({
	imports: [
		AuthLibModule,
		DynamicConfigModule.forRoot({
			validationSchema: Joi.object({
				SERVICE_GATEWAY_PORT: Joi.number().required(),
				SERVICE_GATEWAY_HOST: Joi.string().required()
			}),
			folder: '.'
		}),
		ClientsModule.registerAsync([
			{
				name: 'AUTH_CLIENT',
				imports: [
					DynamicConfigModule.forRoot({
						folder: '.'
					})
				],
				useFactory: async (configService: DynamicConfigService) => ({
					transport: Transport.TCP,
					options: {
						host: configService.get('SERVICE_AUTH_HOST'),
						port: configService.get('SERVICE_AUTH_PORT')
					}
				}),
				inject: [DynamicConfigService]
			}
		]),
		DatabaseModule,
		RmqModule
	],
	exports: [AuthLibModule, AuthService],
	providers: [Gateway, AuthService]
})
export class GatewayModule {}
