import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controllers';
import { ChatService } from './chat.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [ChatController],
	providers: [ChatGateway, ChatService],
})
export class ChatModule {}
