import { Module, Logger } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
	AuthModule as AuthLibModule,
	AuthService,
	RmqModule,
	DatabaseModule,
	DynamicConfigModule,
	DynamicConfigService,
	LocalStrategy,
	JwtStrategy
} from '@app/common';
import { JwtService } from '@nestjs/jwt';
import * as Joi from 'joi';
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
