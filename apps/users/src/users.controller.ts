import { ClientAuthGuard, ParseId, Role, Roles } from '@app/common';
import { User, UserSchema } from '@app/common/auth';
import { ApiMongoFilterQuery } from '@app/common/dynamic/mongo';
import {
	Body,
	Controller,
	Get,
	Logger,
	Param,
	Patch,
	Post,
	Put,
	Req,
	UseGuards
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiSecurity,
	ApiTags
} from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller()
@ApiSecurity('bearer')
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
@UseGuards(ClientAuthGuard)
export class UsersController {
	logger = new Logger(UsersController.name);
	constructor(private readonly usersService: UsersService) {
		// this.logger.verbose('UserSchema', UserSchema);
	}
	@ApiOperation({ summary: 'Get users' })
	@ApiMongoFilterQuery(UserSchema)
	@Get()
	async find(@Req() req) {
		return await this.usersService.find({});
	}

	@ApiOkResponse({
		description: 'The found record',
		type: User
	})
	@ApiParam({
		name: 'id',
		type: 'string',
		description: 'Id of the user'
	})
	@ApiOperation({ summary: 'Get a user by id', operationId: 'test' })
	@Get('/:id')
	async getById(@Param('id', ParseId) id: any): Promise<User> {
		return await this.usersService.findOne({
			$or: [
				{
					_id: id
				},
				{
					id: id
				}
			]
		});
	}
	@ApiOperation({
		summary: 'Create a new user',
		operationId: 'test'
	})
	@Post()
	async create(@Body() request: User) {
		return this.usersService.create(request);
	}
	@ApiOperation({
		summary: 'Partially Update a user by id',
		operationId: 'test'
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
