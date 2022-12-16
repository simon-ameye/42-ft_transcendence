import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controllers';
import { ChatService } from './chat.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ChannelService } from './interfaces/channel.service';
import { JwtStrategy } from 'src/auth/strategy';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService, ChannelService, JwtStrategy],
})
export class ChatModule { }
