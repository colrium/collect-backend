import {
	AuthModule as AuthLibModule,
	AuthService,
	DatabaseModule,
	DynamicConfigModule,
	DynamicConfigService
} from '@app/common';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as Joi from 'joi';
import { Gateway } from './gateway';
import { GatewayController } from './gateway.controller';

@Module({
	imports: [
		EventEmitterModule.forRoot(),
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
				name: 'MQTT_SERVICE',
				imports: [
					DynamicConfigModule.forRoot({
						folder: '.'
					})
				],
				useFactory: async (configService: DynamicConfigService) => ({
					transport: Transport.MQTT,
					options: {
						url: 'mqtt://localhost:1883'
					}
				}),
				inject: [DynamicConfigService]
			},
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
		DatabaseModule
	],
	exports: [AuthLibModule, AuthService],
	controllers: [GatewayController],
	providers: [Gateway, AuthService]
})
export class GatewayModule {}
