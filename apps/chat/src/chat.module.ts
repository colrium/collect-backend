import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
	imports: [EventEmitterModule.forRoot()],
	controllers: [ChatController],
	providers: [ChatService]
})
export class ChatModule {}
