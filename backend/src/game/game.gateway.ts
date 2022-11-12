import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GameService } from './game.service';
import { MatchingQueueInterface } from './interfaces';

@WebSocketGateway(4343, {cors: '*'})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
	constructor(
		private prismaService: PrismaService,
		private gameService: GameService) {}

	@WebSocketServer() server: Server;

	users: number = 0;

	onModuleInit() {
		this.server.on('connection', async (socket) => {
			socket.emit('message', 'Hey i\'m new');
			console.log({"socket.id": socket.id});
			console.log('connected');
		});
	}

	async handleConnection() {
		this.users++;
		this.server.emit('users', this.users);
	}

	async handleDisconnect() {
		this.users--;
		this.server.emit('users', this.users);
	}

	@SubscribeMessage('message')
		handleChat(client, msg): void {
			console.log({"client": client.id});
			this.server.emit('message', msg);
		}
	
	@SubscribeMessage('matchingQueue')
		addToQueue(client): void {
		//	client.join("matching queue");
		//	this.server.to("matching queue").emit('matchingQueue', client.id);
			this.server.emit('matchingQueue', client.id);
			this.gameService.addClientToMatchingQueue(client.id);
		}

	@SubscribeMessage('invitation')
		invitSocket(client, receiverId: string): void {
			this.server.to(receiverId).emit('send invitation', client.id);
		}
	
	@SubscribeMessage('invitation accepted')
		acceptInvit(client, senderId: string): void {
			this.gameService.startGame({"one": client.id, "two": senderId});
			this.server.emit('deleteOppenents',
			{"one": client.id, "two": senderId});
		}
}
