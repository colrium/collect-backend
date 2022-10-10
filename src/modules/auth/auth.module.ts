import { Module } from "@nestjs/common"
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from "@nestjs/jwt"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { JwtStrategy, LocalStrategy } from "./strategy"
import { UserModule } from "../users"
import AuthService from "./auth.service"
import AuthController from "./auth.controller"

@Module({
	imports: [
		UserModule,
		PassportModule,
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get("JWT_SECRET"),
				signOptions: {
					expiresIn: `${configService.get("JWT_EXPIRATION_TIME")}s`,
				},
			}),
		}),
	],
	providers: [AuthService, LocalStrategy, JwtStrategy],
	controllers: [AuthController],
})
export default class AuthModule {}
