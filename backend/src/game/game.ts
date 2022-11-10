
import { OnModuleInit } from '@nestjs/common';
import{
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets'
import { Server } from 'socket.io';


@WebSocketGateway()
export class GameGateway implements OnModuleInit {
	@WebSocketServer()
	server: Server;

	onModuleInit() {
		this.server.on('connection', (socket) => {
			//send all the messages for the user
			console.log(socket.id);
			console.log('Connected');
			this.server.emit('newUserWelcome', {
				welcomeMessage: 'Welcome to our GAME new user with socket id :',
				newUserId: socket.id,
			})
		})
	}

	@SubscribeMessage('newGame')
	onNewGame(@MessageBody() body: any){
		this.server.emit('newGame', {
			msg: 'NEW Game !!',
			content: body,
		})
	}

	@SubscribeMessage('oldGame')
	onOldGame(@MessageBody() body: any){
		this.server.emit('oldGame', {
			msg: 'OLD Game !!',
			content: body,
		})
	}
}


/*

channelName :
contenu:
dest: {users}

*/