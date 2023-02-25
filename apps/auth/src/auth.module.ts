import {
	AuthModule as AuthLibModule,
	AuthService,
	DatabaseModule,
	DynamicConfigModule,
	DynamicConfigService
} from '@app/common';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as Joi from 'joi';
import { RmqModule } from '../../broker/src/mqtt';
import { AuthController } from './auth.controller';

@Module({
	imports: [
		RmqModule,
		DatabaseModule,
		DynamicConfigModule.forRoot({
			folder: '.'
		}),
		ClientsModule.registerAsync([
			{
				name: 'USER_CLIENT',
				imports: [
					DynamicConfigModule.forRoot({
						validationSchema: Joi.object({
							SERVICE_USER_PORT: Joi.number().required(),
							SERVICE_USER_HOST: Joi.string().required()
						}),
						folder: '.'
					})
				],
				useFactory: async (configService: DynamicConfigService) => ({
					transport: Transport.TCP,
					options: {
						host: configService.get('SERVICE_USER_HOST'),
						port: configService.get('SERVICE_USER_PORT')
					}
				}),
				inject: [DynamicConfigService]
			}
		]),
		AuthLibModule
	],
	controllers: [AuthController],
	providers: [AuthService, JwtService]
})
export class AuthModule {}
