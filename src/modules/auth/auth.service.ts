import { HttpException, HttpStatus, Injectable } from "@nestjs/common"

import * as bcrypt from "bcrypt"
import { JwtService } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config"
import { RegisterDto } from "./dto"
import { TokenPayload } from "./interface"
import { MongoError } from "../../common/types"
import { User, UserService, UserRole } from "../users"

@Injectable()
export default class AuthService {
	constructor(private readonly userService: UserService, private readonly jwtService: JwtService, private readonly configService: ConfigService) {}

	/* public async register(registrationData: RegisterDto) {
		try {
			return await this.userService.create(registrationData)
		} catch (error: any) {
			if (error?.code === MongoError.DuplicateKey) {
				throw new HttpException("User with that email already exists", HttpStatus.BAD_REQUEST)
			}
			throw new HttpException("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR)
		}
	} */

	public getJwtTokenWithScope(userId: string) {
		const payload: TokenPayload = { userId }
		const token = this.jwtService.sign(payload)
		return { scope: "bearer", token: token, expiresIn: this.configService.get("JWT_EXPIRATION_TIME"), refreshToken: "" }
	}

	public getCookieWithJwtToken(userId: string) {
		const payload: TokenPayload = { userId }
		const token = this.jwtService.sign(payload)

		return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get("JWT_EXPIRATION_TIME")}`
	}

	public getCookieForLogOut() {
		return `Authentication=; HttpOnly; Path=/; Max-Age=0`
	}

	public async getAuthenticatedUser(email: string, plainTextPassword: string) {
		try {
			const user = await this.userService.getByEmail(email)
			const valid = await this.verifyUserPassword(user, plainTextPassword)
			return user
		} catch (error) {
			throw new HttpException("Wrong credentials provided", HttpStatus.BAD_REQUEST)
		}
	}

	private async verifyUserPassword(user: User, password: string) {
		const isPasswordMatching = await User.verifyUserPassword(user, password)
		if (!isPasswordMatching) {
			throw new HttpException("Wrong credentials provided", HttpStatus.BAD_REQUEST)
		}
	}
}
