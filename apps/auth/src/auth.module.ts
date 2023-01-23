import { Module, Logger } from '@nestjs/common';
import { JwtModule } from "@nestjs/jwt"
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
	AuthModule as AuthLibModule,
	AuthService,
	RmqModule,
	DatabaseModule,
	DynamicConfigModule,
	DynamicConfigService,
	LocalStrategy,
	JwtStrategy,
} from '@app/common';
import { JwtService } from '@nestjs/jwt';
import * as Joi from "joi"
import { AuthController } from "./auth.controller"
import { UsersModule } from "./users/users.module"

@Module({
	imports: [
		DynamicConfigModule.forRoot({
			validationSchema: Joi.object({
				JWT_SECRET: Joi.string().required(),
				JWT_EXPIRATION: Joi.string().required(),
				MONGODB_URI: Joi.string().required(),
			}),
			folder: '.',
		}),
		ClientsModule.registerAsync([
			{
				name: 'USER_CLIENT',
				imports: [
					DynamicConfigModule.forRoot({
						validationSchema: Joi.object({
							USER_SERVICE_PORT: Joi.number().required(),
							USER_SERVICE_HOST: Joi.string().required(),
						}),
						folder: '.',
					}),
				],
				useFactory: async (configService: DynamicConfigService) => ({
					transport: Transport.TCP,
					options: {
						host: configService.get('USER_SERVICE_HOST'),
						port: configService.get('USER_SERVICE_PORT'),
					},
				}),
				inject: [DynamicConfigService],
			},
		]),
		AuthLibModule,
		UsersModule,
		RmqModule,
		DatabaseModule,
	],
	controllers: [AuthController],
	providers: [AuthService, JwtService],
})
export class AuthModule {}
