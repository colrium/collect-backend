import { Controller, NotFoundException, Get, Param, Post, Body, BadRequestException, Put, Delete, HttpCode, UseGuards } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation, ApiSecurity, ApiOkResponse, ApiParam } from "@nestjs/swagger"
import { MongoRepository } from "typeorm"
import { ObjectId } from "bson"
import { ParseObjectIdPipe } from "../../common/utils"
import User from "./user.entity"
import JwtAuthGuard from "../auth/guard/jwt.guard"
import UserService from "./user.service"

@ApiTags("Users")
@Controller("users")
@ApiSecurity("bearer")
@UseGuards(JwtAuthGuard)
export default class UserController {
	constructor(private readonly userService: UserService) {}

	@ApiOperation({ summary: "Get users" })
	@ApiResponse({
		status: 200,
		description: "The found records",
		type: [User],
	})
	@Get()
	async getAll(): Promise<User[]> {
		return await this.userService.getAll()
	}

	@ApiOkResponse({
		description: "The found record",
		type: User,
	})
	@ApiParam({
		name: "id",
		type: "string",
		description: "Id of the user",
	})
	@ApiOperation({ summary: "Get a user by id", operationId: "test" })
	@Get("/:id")
	async getById(@Param("id", ParseObjectIdPipe) id: ObjectId): Promise<User> {
		const user = await this.userService.getById(id)
		if (!user) {
			// Entity not found
			throw new NotFoundException()
		}
		return user
	}
}
