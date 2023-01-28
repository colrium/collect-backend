import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from '../database';
import { DynamicConfigModule, DynamicConfigService } from '../dynamic';
import * as cookieParser from 'cookie-parser';
import * as Joi from 'joi';
import { RmqModule } from '../rmq/rmq.module';
import { User, UserSchema } from './user.schema';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { JwtStrategy, LocalStrategy } from './strategies';
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
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
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
	exports: [RmqModule, JwtService, AuthRepository, AuthService],
	providers: [
		AuthService,
		JwtService,
		LocalStrategy,
		JwtStrategy,
		AuthRepository,
	],
})
export class AuthModule {}
/* export class AuthModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(cookieParser()).forRoutes('*');
	}
} */
