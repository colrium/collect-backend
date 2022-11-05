import {
	UseGuards,
	Param,
	Body,
	Controller,
	Get,
	Post,
	UseInterceptors,
} from "@nestjs/common"
import {
	ApiTags,
	ApiBearerAuth,
	ApiResponse,
	ApiOperation,
	ApiSecurity,
	ApiOkResponse,
	ApiParam,
	ApiQuery,
} from "@nestjs/swagger"
import { ObjectId } from "bson"
import {
	ApiPagination,
	ApiPaginationResponse,
	IPagination,
	LinkHeaderInterceptor,
	Pagination,
	ParseObjectIdPipe,
} from "@app/common"
import { JwtAuthGuard } from "../guards/jwt-auth.guard"
import { CreateUserRequest } from "./dto/create-user.request"
import { UsersService } from "./users.service"
import { User } from "./schemas/user.schema"

@ApiTags("Users")
@Controller("users")
// @ApiSecurity("bearer")
// @UseGuards(JwtAuthGuard)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@ApiPagination({ model: User })
	@ApiPaginationResponse({
		model: User,
		status: 200,
		description: "The list of users",
		resource: "users",
	})
	@UseInterceptors(new LinkHeaderInterceptor({ resource: "users" }))
	@Get()
	async findAll(@Pagination() pagination: IPagination) {
		console.log("users pagination", pagination)
		return await this.usersService.findAll({})
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
	@ApiQuery({
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
