
import { ForbiddenException, Injectable } from "@nestjs/common";
import { OnModuleInit } from '@nestjs/common';
import { MessageBody, ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io';
import { ChatService } from './chat.service';
import { OnEvent } from '@nestjs/event-emitter';
import { ChannelService } from "./interfaces/channel.service";

//@Injectable()
@WebSocketGateway()
export class ChatGateway implements OnModuleInit {
  constructor(private chatService: ChatService,
              private channelService : ChannelService) {}

	@WebSocketServer()
	server: Server;

	onModuleInit() {
		this.server.on('connection', (socket) => {
			//send all the messages for the user
			console.log('A new client runs connection with socket ', socket.id);
		})
	}

	@SubscribeMessage('setConnection')
	onSetConnection(
    @ConnectedSocket() socket: any,
    @MessageBody() userId: number){
      console.log('A new client runs setConnection with socket ', socket.id, ' and id ', userId);
      return (this.chatService.setConnection(Number(userId), socket.id));
	}

  @OnEvent('flushAllChannels')
  async flushAllChannels() {
    let channelInterfaces = await this.channelService.getChannelInterfaces();

    for (let channelInterface of channelInterfaces)
    {
      this.server.to(channelInterface.userSocketId).emit('channelInterface', {
        id: channelInterface.id,
        name: channelInterface.name,
        mode: channelInterface.mode,
        messages: channelInterface.messages,
        authors: channelInterface.authors,
        isProtected: channelInterface.isProtected,
      })
    }
  }
}
