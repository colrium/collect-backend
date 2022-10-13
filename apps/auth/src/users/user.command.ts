import { Command, Positional, Option } from "nestjs-command"
import { Injectable } from "@nestjs/common"
import { UsersService } from "./users.service"
import { Role } from "@app/common"

@Injectable()
export class UserCommand {
	constructor(private readonly usersService: UsersService) {}

	@Command({
		command: "create:user <email>",
		describe: "Create a User",
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
			default: [Role.GUEST],
			required: false,
		})
		roles: Role[],

		@Option({
			name: "staff-id",
			describe: "Staff Id",
			type: "string",
			default: null,
			required: false,
		})
		staffId: string

		@Option({
			name: "status",
			describe: "Status",
			type: "string",
			default: "active",
			required: false,
		})
		status: string

		@Option({
			name: "country",
			describe: "Country",
			type: "string",
			default: "KE",
			required: false,
		})
		country: string

		@Option({
			name: "city",
			describe: "city",
			type: "string",
			default: "Nairobi",
			required: false,
		})
		city: string

		@Option({
			name: "admin-level-1",
			describe: "Administration Level 1",
			type: "string",
			default: "Nairobi City",
			required: false,
		})
		adminLevel1: string


		@Option({
			name: "admin-level-2",
			describe: "Administration Level 2",
			type: "string",
			default: "Starehe",
			required: false,
		})
		adminLevel2: string

		@Option({
			name: "admin-level-3",
			describe: "Administration Level 3",
			type: "string",
			default: "Starehe",
			required: false,
		})
		adminLevel3: string

		@Option({
			name: "admin-level-4",
			describe: "Administration Level 4",
			type: "string",
			default: "CBD",
			required: false,
		})
		adminLevel4: string


	) {
		return await this.usersService.create({
			email,
			firstName,
			lastName,
			password,
			roles,
			staffId,
			status,
			country,
			city,
			adminLevel1,
			adminLevel2,
			adminLevel3,
			adminLevel4,
		})
	}
}
