import { ExtractJwt, Strategy } from "passport-jwt"
import { PassportStrategy } from "@nestjs/passport"
import { Injectable, UnauthorizedException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { Request } from "express"
import { TokenPayload } from "../interface"
import { UserService } from "../../users"

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly configService: ConfigService, private readonly userService: UserService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				ExtractJwt.fromAuthHeaderAsBearerToken(),
				(request: Request) => {
					return request?.cookies?.Authentication
				},
			]),
			secretOrKey: configService.get("JWT_SECRET"),
		})
	}

	async validate(payload: TokenPayload) {
		try {
			return await this.userService.getById(payload.userId)
		} catch (error) {
			throw new UnauthorizedException()
		}
	}
}
