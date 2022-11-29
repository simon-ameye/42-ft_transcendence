import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GameService } from './game.service';
import { MatchingQueueInterface, PlayerInterface } from './interfaces';
import { UserService } from '../user/user.service';

@WebSocketGateway(4343, {
		cors: {
			origin: 'http://localhost:3000',
			credentials: true,
		}
	})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
	constructor(
		private prismaService: PrismaService,
		private gameService: GameService,
		private userService: UserService
	) {}

	@WebSocketServer() server: Server;

	users: number = 0;

	onModuleInit() {
		this.server.on('connection', async (socket) => {
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

	@SubscribeMessage('hello')
		hello(client) {
			this.server.to(client.id).emit('heyo');
		}
	
	@SubscribeMessage('join matching queue')
		async addToQueue(client): Promise<void> {
			const displayName = await this.userService.getNameBySId(client.id);
			this.server.emit('join matching queue', displayName);
			this.gameService.addClientToMatchingQueue(client.id);
		}

	@SubscribeMessage('invitation')
		async invitSocket(client, receiverName: string): Promise<void> {
			console.log({invitationto: receiverName});
			const receiverSId = await this.userService.getSIdByName(receiverName);
			const clientName = await this.userService.getNameBySId(client.id);
			this.server.to(receiverSId).emit('send invitation', clientName);
		}
	
	@SubscribeMessage('invitation accepted')
		async acceptInvit(client, senderDName: string): Promise<void> {

			const senderSId = await this.userService.getSIdByName(senderDName);

			const gameRoom = await this.gameService.startGame(
					{"one": client.id, "two": senderSId});

			client.join(gameRoom);
			this.server.to(senderSId).emit('invitation accepted sender',
					{"gameRoom": gameRoom, "oppenentId": client.id});

			const clientDName = await this.userService.getNameBySId(client.id);
			this.server.emit('deleteOppenents',
					{"one": clientDName, "two": senderDName});
		}
	
	@SubscribeMessage('invitation accepted sender')
		async acceptInvitSender(client, data: {gameRoom: string, oppenentId: string}): Promise<void> {
			client.join(data.gameRoom);
			console.log({'game room acceptInvitSender': data.gameRoom});
			const playerIds = [client.id, data.oppenentId];
			const players = await this.gameService.getPlayersBySIds(playerIds);
			this.server.to(data.gameRoom).emit('game started', players);
			this.server.emit('update game list', players);
		}

	@SubscribeMessage('add point')
		async addPoint(client, player: PlayerInterface): Promise<void> {
			const gameRoom = await this.gameService.updateScore(player.userId, +1);
			console.log({'game room addPoint': gameRoom});
			player.score += 1;
			this.server.to(gameRoom).emit('update score', player);
		}

	@SubscribeMessage('watch game')
		async watchGame(client, playerIds: string[]): Promise<void> {
			const players = await this.gameService.getPlayersBySIds(playerIds);
			const gameRoom = "game".concat(String(players[0].gameId));
			client.join(gameRoom);
			this.server.to(client.id).emit('game started', players);
		}

	@SubscribeMessage('is playing')
		async isPlaying(client): Promise<void> {
			const playing = await this.gameService.isPlayingBySId(client.id);
			this.server.to(client.id).emit('is playing', playing);
		}

	@SubscribeMessage('get players')
		async GetPlayers(client): Promise<void> {
			const players = await this.gameService.getPlayerByOneSId(client.id);
			const gameRoom = "game".concat(String(players[0].gameId));
			client.join(gameRoom);
			this.server.to(client.id).emit('game started', players);
		}
}
