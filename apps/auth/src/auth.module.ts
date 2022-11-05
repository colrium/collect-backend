import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { JwtModule } from "@nestjs/jwt"
import { RmqModule, DatabaseModule } from "@app/common"
import * as Joi from "joi"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { JwtStrategy } from "./strategies/jwt.strategy"
import { LocalStrategy } from "./strategies/local.strategy"
import { UsersModule } from "./users/users.module"

@Module({
	imports: [
		DatabaseModule,
		UsersModule,
		RmqModule,
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				NODE_ENV: Joi.string().required(),
				PORT: Joi.number().required(),
				JWT_SECRET: Joi.string().required(),
				JWT_EXPIRATION: Joi.string().required(),
				MONGODB_URI: Joi.string().required(),
				RABBIT_MQ_URI: Joi.string().required(),
				RABBIT_MQ_AUTH_QUEUE: Joi.string().required(),
			}),
		}),
		JwtModule.registerAsync({
			useFactory: (configService: ConfigService) => ({
				secret: configService.get<string>("JWT_SECRET"),
				signOptions: {
					expiresIn: configService.get<string>("JWT_EXPIRATION"),
				},
			}),
			inject: [ConfigService],
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
