import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { User } from './users/schemas/user.schema';
import { Role } from "@app/common"

export interface TokenPayload {
	sub: string
	name: string
	admin: boolean
	iat?: number
	exp?: number
}

@Injectable()
export class AuthService {
	constructor(
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService
	) {}

	async login(user: User, response: Response) {
		const expires = new Date()
		expires.setSeconds(
			expires.getSeconds() + this.configService.get("JWT_EXPIRATION")
		)

		const tokenPayload: TokenPayload = {
			sub: user._id.toHexString(),
			name: user.fullName,
			admin: Array.isArray(user.roles) && user.roles.includes(Role.ADMIN),
			iat: Date.now(),
			exp: expires.getTime(),
		}

		const token = this.jwtService.sign(tokenPayload)
		response.header("Authorization", `Bearer ${token}`)
	}

	logout(response: Response) {
		response.cookie("Authentication", "", {
			httpOnly: true,
			expires: new Date(),
		})
	}
}
