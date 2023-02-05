import {
	UseGuards,
	Req,
	Query,
	Param,
	Body,
	Controller,
	Get,
	Post,
	Put,
	Patch,
	SetMetadata,
} from '@nestjs/common';
import {
	ApiTags,
	ApiBearerAuth,
	ApiResponse,
	ApiOperation,
	ApiSecurity,
	ApiOkResponse,
	ApiParam,
} from '@nestjs/swagger';
import { MessagePattern } from '@nestjs/microservices';
import { ObjectId } from 'bson';
import {
	ParseObjectIdPipe,
	PaginatedResponse,
	Role,
	Roles,
	ClientAuthGuard,
	PaginatedRequest,
} from '@app/common';
import { User } from '@app/common/auth';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller()
@ApiSecurity('bearer')
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
@UseGuards(ClientAuthGuard)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}
	@ApiOperation({ summary: 'Get users' })
	@PaginatedResponse(User)
	@PaginatedRequest(User)
	@Get()
	async find(@Req() req) {
		return await this.usersService.find({});
	}

	@ApiOkResponse({
		description: 'The found record',
		type: User,
	})
	@ApiParam({
		name: 'id',
		type: 'string',
		description: 'Id of the user',
	})
	@ApiOperation({ summary: 'Get a user by id', operationId: 'test' })
	@Get('/:id')
	async getById(@Param('id', ParseObjectIdPipe) id: ObjectId): Promise<User> {
		return await this.usersService.findOne({ _id: id });
	}
	@ApiOperation({
		summary: 'Create a new user',
		operationId: 'test',
	})
	@Post()
	async create(@Body() request: User) {
		return this.usersService.create(request);
	}
	@ApiOperation({
		summary: 'Partially Update a user by id',
		operationId: 'test',
	})
	@Patch('/:id')
	async partialUpdate(@Body() data: Partial<User>) {
		// return this.usersService.create(data);
	}

	@ApiOperation({ summary: 'Fully Update a user by id', operationId: 'test' })
	@Put('/:id')
	async fullUpdate(@Req() req, @Body() data: Omit<User, 'id'>) {
		// return this.usersService.create(data);
	}

	@MessagePattern({ role: 'user', cmd: 'get' })
	getUser(data: any): Promise<User> {
		return this.usersService.findOne(data);
	}
}
