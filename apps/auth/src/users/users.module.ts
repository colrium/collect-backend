import { Module } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { DynamicConfigModule, DynamicConfigService } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as Joi from 'joi';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		DynamicConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				AUTH_SERVICE_PORT: Joi.number().required(),
				AUTH_SERVICE_HOST: Joi.string().required(),
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
							AUTH_SERVICE_PORT: Joi.number().required(),
							AUTH_SERVICE_HOST: Joi.string().required(),
						}),
						folder: '.',
					}),
				],
				useFactory: async (configService: DynamicConfigService) => ({
					transport: Transport.TCP,
					options: {
						host: configService.get('AUTH_SERVICE_HOST'),
						port: configService.get('AUTH_SERVICE_PORT'),
					},
				}),
				inject: [DynamicConfigService],
			},
		]),
	],
	controllers: [UsersController],
	providers: [UsersService, UsersRepository],
	exports: [UsersService],
})
export class UsersModule {}
