import { Module, Logger } from '@nestjs/common';
import { JwtModule } from "@nestjs/jwt"
import {
	RmqModule,
	DatabaseModule,
	DynamicMongoModelModule,
	DynamicConfigModule,
	DynamicConfigService
} from '@app/common';
import { message } from "@app/common"
import * as Joi from "joi"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { JwtStrategy } from "./strategies/jwt.strategy"
import { LocalStrategy } from "./strategies/local.strategy"
import { UsersModule } from "./users/users.module"

@Module({
	imports: [
		// DynamicMongoModelModule.forRoot(message),
		DynamicConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				JWT_SECRET: Joi.string().required(),
				JWT_EXPIRATION: Joi.string().required(),
				MONGODB_URI: Joi.string().required(),
			}),
			folder: './apps/auth',
		}),
		UsersModule,
		RmqModule,
		DatabaseModule,
		JwtModule.registerAsync({
			imports: [
				DynamicConfigModule.forRoot({
					isGlobal: true,
					validationSchema: Joi.object({
						JWT_SECRET: Joi.string().required(),
						JWT_EXPIRATION: Joi.string().required(),
						MONGODB_URI: Joi.string().required(),
					}),
					folder: '.',
				}),
			],
			useFactory: (configService: DynamicConfigService) => {
				const logger = new Logger('DynamicConfigService JwtModule');
				const jwtSecret = configService.get('JWT_SECRET');
				const jwtExpiration = configService.get('JWT_EXPIRATION', 3600);
				logger.verbose(`jwtSecret ${jwtSecret}`);
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
	controllers: [AuthController],
	providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
