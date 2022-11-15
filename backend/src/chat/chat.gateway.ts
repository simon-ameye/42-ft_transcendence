
import { OnModuleInit } from '@nestjs/common';
import { MessageBody, ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io';
import { ChatService } from './chat.service';
import { PrismaService } from "src/prisma/prisma.service";
import { prisma } from '@prisma/client';


@WebSocketGateway()
export class ChatGateway implements OnModuleInit {
  constructor(private chatService: ChatService) {}

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
      console.log('A new client runs setConnection with socket ', socket.id);
      return (this.chatService.setConnection(Number(userId), socket.id));
		  //this.server.emit('setConnection', {
			//msg: 'heeeyyy you have asked setConnection',
			//content: body,
	}

  //async handleConnection() {

    //for (var userId of (await channel).userIds)
    //{
    //  var user = this.prisma.user.findUnique({ where: { id: userId } });
    //  if (!user)
    //    return ('Critical message sending : channel user not found');
//
    //}
  //}

}
