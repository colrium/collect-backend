import { Body, Req, Request, Controller, HttpCode, Post, UseGuards, Get, UseInterceptors } from "@nestjs/common"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"
import AuthService from "./auth.service"
import { RegisterDto, LoginDto } from "./dto"
import { RequestWithUser } from "./interface"
import { LocalAuthGuard, JwtAuthGuard } from "./guard"
import { User } from "../users"

@ApiTags("Auth")
@Controller("auth")
export default class AuthController {
	constructor(private readonly authService: AuthService) {}

	/* @Post("register")
	async register(@Body() registrationData: RegisterDto) {
		return this.authService.register(registrationData)
	} */

	@HttpCode(200)
	@UseGuards(LocalAuthGuard)
	@Post("login")
	async login(@Request() req, @Body() loginDto: LoginDto) {
		const { user } = req
		const cookie = this.authService.getCookieWithJwtToken(user.id.toString())
		const accessToken = this.authService.getJwtTokenWithScope(user.id.toString())
		req.res?.setHeader("Set-Cookie", cookie)

		return accessToken
	}

	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@Post("logout")
	@HttpCode(200)
	async logOut(@Req() request: RequestWithUser) {
		request.res?.setHeader("Set-Cookie", this.authService.getCookieForLogOut())
	}

	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@Get()
	authenticate(@Req() request: RequestWithUser) {
		return request.user
	}
}
