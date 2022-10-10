import { Strategy } from "passport-local"
import { PassportStrategy } from "@nestjs/passport"
import { Injectable } from "@nestjs/common"
import AuthService from "../auth.service"
import { User } from "../../users"

@Injectable()
export default class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private authenticationService: AuthService) {
		super({
			usernameField: "username",
		})
	}
	async validate(email: string, password: string): Promise<User> {
		return this.authenticationService.getAuthenticatedUser(email, password)
	}
}
