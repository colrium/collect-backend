import { ClientAuthGuard, ParseId, Role, Roles } from '@app/common';
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
import { OnEvent } from '@nestjs/event-emitter';
import { MessagePattern } from '@nestjs/microservices';
import {
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiSecurity,
	ApiTags
} from '@nestjs/swagger';
import { ConversationsService } from './conversations.service';
import { Conversation, ConversationSchema } from './models';

@ApiTags('Conversations')
@Controller('conversations')
@ApiSecurity('bearer')
@Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.USER, Role.STAFF)
@UseGuards(ClientAuthGuard)
export class ConversationsController {
	logger = new Logger(ConversationsController.name);
	constructor(private readonly service: ConversationsService) {}
	@ApiOperation({ summary: 'Get records' })
	@ApiMongoFilterQuery(ConversationSchema)
	@Get()
	async find(@Req() req) {
		return await this.service.find({});
	}

	@ApiOkResponse({
		description: `The found ${Conversation.name}`,
		type: Conversation
	})
	@ApiParam({
		name: 'id',
		type: 'string',
		description: `Id of the ${Conversation.name}`
	})
	@ApiOperation({
		summary: `Get a ${Conversation.name} by id`
	})
	@Get('/:id')
	async getById(@Param('id', ParseId) id: any): Promise<Conversation> {
		return await this.service.findOne({
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
		summary: `Create a new ${Conversation.name}`,
		operationId: 'test'
	})
	@Post()
	async create(@Body() request: Conversation) {
		return this.service.create(request);
	}
	@ApiOperation({
		summary: `Partially Update a ${Conversation.name} by id`
	})
	@Patch('/:id')
	async partialUpdate(@Body() data: Partial<Conversation>) {
		// return this.service.create(data);
	}

	@ApiOperation({ summary: `Fully Update a ${Conversation.name} by id` })
	@Put('/:id')
	async fullUpdate(@Req() req, @Body() data: Omit<Conversation, 'id'>) {
		// return this.service.create(data);
	}

	@MessagePattern({ role: 'chat', cmd: 'create-conversation' })
	@OnEvent('chat.create-conversation')
	getUser(data: Omit<Conversation, '_id'>): Promise<Conversation> {
		return this.service.create(data);
	}
}
