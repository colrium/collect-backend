import { UseGuards, Param, Body, Controller, Get, Post } from "@nestjs/common"
import {
	ApiTags,
	ApiBearerAuth,
	ApiResponse,
	ApiOperation,
	ApiSecurity,
	ApiOkResponse,
	ApiParam,
} from "@nestjs/swagger"
import { ObjectId } from "bson"
import { ParseObjectIdPipe } from "@app/common"
import { JwtAuthGuard } from "../guards/jwt-auth.guard"
import { CreateUserRequest } from "./dto/create-user.request"
import { UsersService } from "./users.service"
import { User } from "./schemas/user.schema"

@ApiTags("Users")
@Controller("users")
@ApiSecurity("bearer")
@UseGuards(JwtAuthGuard)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}
	@ApiOperation({ summary: "Get users" })
	@ApiResponse({
		status: 200,
		description: "The found records",
		type: [User],
	})
	@Get()
	async find() {
		return await this.usersService.find({})
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
		return await this.usersService.findOne({ _id: id })
	}

	@Post()
	async create(@Body() request: CreateUserRequest) {
		return this.usersService.create(request)
	}
}
