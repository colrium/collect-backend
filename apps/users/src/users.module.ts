import { Module } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@app/common/auth';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as Joi from 'joi';
import {
	AuthModule as AuthLibModule,
	RmqModule,
	DatabaseModule,
	JwtStrategy,
	DynamicConfigModule,
	DynamicConfigService,
} from '@app/common';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		DynamicConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				SERVICE_USERS_PORT: Joi.number().required(),
				SERVICE_USERS_HOST: Joi.string().required(),
			}),
			folder: '.',
		}),
		ClientsModule.registerAsync([
			{
				name: 'AUTH_CLIENT',
				imports: [
					DynamicConfigModule.forRoot({
						isGlobal: true,
						validationSchema: Joi.object({
							SERVICE_AUTH_PORT: Joi.number().required(),
							SERVICE_AUTH_HOST: Joi.string().required(),
						}),
						folder: '.',
					}),
				],
				useFactory: async (configService: DynamicConfigService) => ({
					transport: Transport.TCP,
					options: {
						host: configService.get('SERVICE_AUTH_HOST'),
						port: configService.get('SERVICE_AUTH_PORT'),
					},
				}),
				inject: [DynamicConfigService],
			},
		]),
		DatabaseModule,
		RmqModule,
		AuthLibModule,
	],
	controllers: [UsersController],
	providers: [UsersService, UsersRepository],
	exports: [UsersService],
})
export class UsersModule {}
