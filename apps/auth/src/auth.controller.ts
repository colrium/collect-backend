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
import {
	AuthService,
	LocalAuthGuard,
	JwtAuthGuard,
	User,
	ContextUser,
} from '@app/common/auth';
import {
	ForgotPasswordDTO,
	ForgotPasswordResponse,
	ResetPasswordDTO,
	ResetPasswordResponse,
	LoginDTO,
} from './types';


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
@Controller()
export class AuthController {
	private logger = new Logger(AuthController.name);
	constructor(private readonly authService: AuthService) {}

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
		@Body() body: LoginDTO,
		@ContextUser() user: User,
		@Res({ passthrough: true }) response: Response
	) {
		await this.authService.login(user, response);
		response.send(user);
	}

	@ApiOperation({
		summary: 'Get login prerequisites',
	})
	@ApiOkResponse({
		description: 'The login email prerequisites',
		type: LoginPrerequisiteRes,
	})
	@ApiParam({
		name: 'email',
		type: 'string',
		description: 'The login intension email',
	})
	@Get('login/:email')
	async loginPrerequisite(
		@Param() email: string,
		@Res({ passthrough: true }) response: Response
	) {
		// await this.authService.login(user, response)
		// response.send(user)
	}
	@ApiOperation({
		summary: 'register',
	})
	@ApiOkResponse({
		description: 'The new user registration',
		type: User,
	})
	@Post('register')
	async register(
		@Body() user: User,
		@Res({ passthrough: true }) response: Response
	) {
		// await this.authService.register(user, response);
		response.send(user);
	}

	@ApiOkResponse({
		status: 200,
		description: 'Account recovery',
		type: ForgotPasswordResponse,
	})
	@ApiOperation({
		summary: 'Account recovery',
	})
	@Post('forgot-password')
	async forgotPassword(
		@Body() body: ForgotPasswordDTO,
		@Res({ passthrough: true }) response: Response
	) {
		// await this.authService.register(body, response);
		response.send({
			message: 'Account recovery mail sent',
		});
	}

	@ApiOkResponse({
		status: 200,
		description: 'Reset Password OK',
		type: ResetPasswordResponse,
	})
	@ApiOperation({
		summary: 'Reset Password',
	})
	@Post('reset-password')
	async resetPassword(
		@Body() body: ResetPasswordDTO,
		@Res({ passthrough: true }) response: Response
	) {
		// await this.authService.register(body, response);
		response.send({
			message: 'Password reset',
		});
	}

	@MessagePattern('validate_user')
	async validateUser(@ContextUser() user: User) {
		return user;
	}

	@MessagePattern({ role: 'jwt-auth', cmd: 'user' })
	async getJwtUser(data) {
		try {
			const jwtValid = this.authService.validateJwt(data.jwt);
			if (jwtValid) {
				return await this.authService.getJwtUser(data.jwt);
			} else {
				return false;
			}
		} catch (err) {
			this.logger.error(`jwtValid ${JSON.stringify(err)}`);
			return false;
		}
	}

}
