import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { DatabaseModule } from '../database';
import { DynamicConfigModule, DynamicConfigService } from '../dynamic';
import { RmqModule } from '../rmq/rmq.module';
import { AuthService } from './auth.service';
import { User, UserPassword, UserPasswordSchema, UserSchema } from './models';
import { JwtStrategy, LocalStrategy } from './strategies';
import { UserPasswordRepository } from './user.password.repository';
import { UserRepository } from './user.repository';
@Module({
	imports: [
		DynamicConfigModule.forRoot({
			validationSchema: Joi.object({
				JWT_SECRET: Joi.string().required(),
				JWT_EXPIRATION: Joi.string().required(),
			}),
			folder: '.',
		}),
		DatabaseModule,
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: UserPassword.name, schema: UserPasswordSchema },
		]),
		RmqModule.register({ name: 'AUTH' }),
		JwtModule.registerAsync({
			imports: [
				DynamicConfigModule.forRoot({
					validationSchema: Joi.object({
						JWT_SECRET: Joi.string().required(),
						JWT_EXPIRATION: Joi.string().required(),
					}),
					folder: '.',
				}),
			],
			useFactory: (configService: DynamicConfigService) => {
				const jwtSecret = configService.get('JWT_SECRET');
				const jwtExpiration = configService.get('JWT_EXPIRATION', 3600);
				return {
					secret: jwtSecret,
					signOptions: {
						expiresIn: `${jwtExpiration}s`,
					},
				};
			},
			inject: [DynamicConfigService],
		}),
	],
	exports: [
		RmqModule,
		JwtService,
		UserRepository,
		UserPasswordRepository,
		AuthService,
	],
	providers: [
		AuthService,
		JwtService,
		LocalStrategy,
		JwtStrategy,
		UserRepository,
		UserPasswordRepository,
	],
})
export class AuthModule {}
