import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controllers';
import { ChatService } from './chat.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ChannelService } from './interfaces/channel.service';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [ChatController],
	providers: [ChatGateway, ChatService, ChannelService],
})
export class ChatModule {}
