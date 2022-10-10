import { Command } from "nestjs-command"
import { Injectable, Inject, Logger } from "@nestjs/common"
import UserService from "./user.service"
import { ConfigService } from "@nestjs/config"
import User from "./user.entity"
import UserRole from "./user.role.enum"

@Injectable()
export default class UserSeed {
	private readonly logger: Logger = new Logger(UserSeed.name)
	constructor(private userService: UserService, private configService: ConfigService) {}

	@Command({
		command: "seed:users",
		describe: "seed users",
		// autoExit: true,
	})
	async create() {
		// const users = await this.userService.createMany([
		// 	{
		// 		firstName: "John",
		// 		lastName: "Owner",
		// 		email: "owner@pariti.io",
		// 		password: `owner1234`,
		// 		roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
		// 	},
		// ])
		// console.log(users)
		const adminUsername = this.configService.get<string>("ADMIN_USERNAME")
		this.logger.debug("seed:users adminUsername: " + adminUsername)
	}
}
