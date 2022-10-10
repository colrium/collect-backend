import { Command, Positional, Option } from "nestjs-command"
import { Injectable } from "@nestjs/common"
import UserService from "./user.service"
import UserRole from "./user.role.enum"

@Injectable()
export default class UserCommand {
	constructor(private readonly userService: UserService) {}

	@Command({
		command: "create:user <email>",
		describe: "create a user",
	})
	async create(
		@Positional({
			name: "email",
			describe: "the email",
			type: "string",
		})
		email: string,

		@Option({
			name: "firstName",
			describe: "user firstName",
			type: "string",
			alias: "f",
			required: true,
		})
		firstName: string,

		@Option({
			name: "lastName",
			describe: "user first name",
			type: "string",
			alias: "l",
			required: true,
		})
		lastName: string,

		@Option({
			name: "password",
			describe: "user password",
			type: "string",
			alias: "p",
			required: true,
		})
		password: string,

		@Option({
			name: "roles",
			describe: 'user roles (ex: "admin,super_admin")',
			type: "array",
			alias: "r",
			default: [UserRole.GUEST],
			required: false,
		})
		roles: UserRole[],

		@Option({
			name: "provider",
			describe: "provider",
			type: "string",
			default: "local",
			required: false,
		})
		provider: string
	) {
		return await this.userService.create({
			email,
			firstName,
			lastName,
			password,
			roles,
			provider,
		})
	}
}
