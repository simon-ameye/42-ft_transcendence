import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GameService } from './game.service';
import { MatchingQueueInterface, PlayerInterface } from './interfaces';

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
			this.server.emit('matchingQueue', client.id);
			this.gameService.addClientToMatchingQueue(client.id);
		}

	@SubscribeMessage('invitation')
		invitSocket(client, receiverId: string): void {
			this.server.to(receiverId).emit('send invitation', client.id);
		}
	
	@SubscribeMessage('invitation accepted')
		async acceptInvit(client, senderId: string): Promise<void> {
			const gameRoom = await this.gameService.startGame(
					{"one": client.id, "two": senderId});
			client.join(gameRoom);
			this.server.to(senderId).emit('invitation accepted sender',
					{"gameRoom": gameRoom, "oppenentId": client.id});
			this.server.emit('deleteOppenents',
					{"one": client.id, "two": senderId});
		}
	
	@SubscribeMessage('invitation accepted sender')
		async acceptInvitSender(client, data: {gameRoom: string, oppenentId: string}): Promise<void> {
			client.join(data.gameRoom);
			const playerIds = [client.id, data.oppenentId];
			const players = await this.gameService.getPlayers(playerIds);
			this.server.to(data.gameRoom).emit('game started', players);
			this.server.emit('update game list', players);
		}

	@SubscribeMessage('add point')
		async addPoint(client, player: PlayerInterface): Promise<void> {
			const gameRoom = await this.gameService.updateScore(player.socketId, +1);
			player.score += 1;
			this.server.to(gameRoom).emit('update score', player);
		}

	@SubscribeMessage('watch game')
		async watchGame(client, playerIds: string[]): Promise<void> {
			const players = await this.gameService.getPlayers(playerIds);
			const gameRoom = "game".concat(String(players[0].gameId));
			client.join(gameRoom);
			this.server.to(client.id).emit('game started', players);
		}
}
