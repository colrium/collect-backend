import {
	Controller,
	Body,
	Param,
	Get,
	Post,
	Res,
	UseGuards,
	Logger,
} from '@nestjs/common';
import { MessagePattern } from "@nestjs/microservices"
import {
	ApiTags,
	ApiProperty,
	ApiHeader,
	ApiBearerAuth,
	ApiResponse,
	ApiOperation,
	ApiSecurity,
	ApiOkResponse,
	ApiParam,
} from "@nestjs/swagger"
import { Response } from "express"
import { UsersService } from "./users/users.service"
import { ContextUser } from "./context-user.decorator"
import {
	AuthService,
	LocalAuthGuard,
	JwtAuthGuard,
	User,
} from '@app/common/auth';

export class LoginPrerequisiteRes {
	@ApiProperty({ example: "active", description: "Status of the user" })
	status: string

	@ApiProperty({ example: "John Doe", description: "Full name of the user" })
	fullName?: string

	@ApiProperty({
		example: "http://example.com/file/626562",
		description: "Url of the User's Avatar",
	})
	avatar?: string
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService
	) {}

	@ApiResponse({
		status: 201,
		description: 'Login successful',
		type: User,
		headers: {
			Authorization: {
				description: 'JWT Token',
				example: 'Bearer <token>',
				// type: "string",
			},
		},
	})
	@ApiResponse({
		status: 401,
		description: 'Login unsuccessful',
	})
	@ApiOperation({
		summary: 'Login user',
	})
	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(
		@ContextUser() user: User,
		@Res({ passthrough: true }) response: Response
	) {
		await this.authService.login(user, response);
		response.send(user);
	}

	/* @ApiOperation({
		summary: "Get login prerequisites",
	})
	@ApiOkResponse({
		description: "The login email prerequisites",
		type: LoginPrerequisiteRes,
	})
	@ApiParam({
		name: "email",
		type: "string",
		description: "The login intension email",
	})
	@Get("login/:email")
	async loginPrerequisite(
		@Param() email: string,
		@Res({ passthrough: true }) response: Response
	) {
		// await this.authService.login(user, response)
		// response.send(user)
	} */
	// @ApiOperation({
	// 	summary: 'register',
	// })
	// @ApiOkResponse({
	// 	description: 'The new user registration',
	// 	type: User,
	// })
	// @Post('register')
	// async register(
	// 	@Body() user: User,
	// 	@Res({ passthrough: true }) response: Response
	// ) {
	// 	await this.authService.register(user, response);
	// 	response.send(user);
	// }
	@MessagePattern('validate_user')
	async validateUser(@ContextUser() user: User) {
		return user;
	}

	@MessagePattern({ role: 'auth', cmd: 'check' })
	async loggedIn(data) {

		console.log('loggedIn data', data);
		try {
			const res = this.authService.getJwtUser(data.jwt);

			return res;
		} catch (e) {
			Logger.log(e);
			return false;
		}
	}
}
