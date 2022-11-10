
import { OnModuleInit } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway()
export class ChatGateway implements OnModuleInit {
	@WebSocketServer()
	server: Server;

	onModuleInit() {
		this.server.on('connection', (socket) => {
			//send all the messages for the user
			console.log(socket.id);
			console.log('Connected');
			this.server.emit('newUserWelcome', {
				welcomeMessage: 'Welcome to our CHAT new user with socket id :',
				newUserId: socket.id,
			})
		})
	}

	@SubscribeMessage('newChat')
	onNewChat(@MessageBody() body: any){
		this.server.emit('newChat', {
			msg: 'heeeyyy you have asked for new chat',
			content: body,
		})	}
}
