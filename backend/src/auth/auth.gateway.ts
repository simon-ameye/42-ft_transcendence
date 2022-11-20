import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
//import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';

@WebSocketGateway(4343, {cors: '*'})
export class AuthGateway implements OnModuleInit {
	constructor(private authService: AuthService) {}

	@WebSocketServer() server: Server;

	onModuleInit() {
		this.server.on('connection', async (socket) => {
			console.log({"socket.id": socket.id});
			console.log("connected");
		});
	}

	@SubscribeMessage('login with intra')
	loginIntra(client) {
		client.emit("connected");
	}
}
