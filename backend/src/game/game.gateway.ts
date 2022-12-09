import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GameService } from './game.service';
import { MatchingQueueInterface, PlayerInterface, CheckWinnerInterface } from './interfaces';
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
			const userId = await this.gameService.addClientToMatchingQueue(client.id);
			if (userId) {
				const oppenentSId = await this.userService.getSIdById(userId);
				this.startGameAuto({SIdOne: client.id, SIdTwo: oppenentSId});
			}
		}

	@SubscribeMessage('invitation')
		async invitSocket(client, receiverName: string): Promise<void> {
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
					{"gameRoom": gameRoom, "oppenentSId": client.id});
			const clientDName = await this.userService.getNameBySId(client.id);
			this.server.emit('deleteOppenents',
					{"one": clientDName, "two": senderDName});
		}
	
	@SubscribeMessage('invitation accepted sender')
		async acceptInvitSender(client, data: {gameRoom: string, oppenentSId: string}): Promise<void> {
			client.join(data.gameRoom);
			const playerSIds = [client.id, data.oppenentSId];
			const players = await this.gameService.getPlayersBySIds(playerSIds);
			this.server.to(data.gameRoom).emit('game started', players);
			this.server.emit('update game list', players);
		}

	@SubscribeMessage('add point')
		async addPoint(client, player: PlayerInterface): Promise<void> {
			const gameRoom = await this.gameService.updateScore(player.userId, +1);
			player.score += 1;
			this.server.to(gameRoom).emit('update score', player);
			const data: CheckWinnerInterface = await this.gameService.isWinner(gameRoom);
			if (data.gameId) {
				this.gameService.deleteGameAndPlayers(data.gameId);
				this.gameService.addVictory(data.winnerId);
				this.server.to(gameRoom).emit('game finished', data.winnerId);
			}
			else
				this.kickoff(gameRoom);
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
	
	@SubscribeMessage('arrow up')
		async ArrowUp(client, oppenentName: string): Promise<void> {
			const	oppenentSId = await this.userService.getSIdByName(oppenentName);
			this.server.to(oppenentSId).emit('arrow up');
		}
	
	@SubscribeMessage('arrow down')
		async ArrowDown(client, oppenentName: string): Promise<void> {
			const	oppenentSId = await this.userService.getSIdByName(oppenentName);
			this.server.to(oppenentSId).emit('arrow down');
		}
	
	async startGameAuto(data: {SIdOne: string, SIdTwo: string}): Promise<void> {
		this.server.to(data.SIdOne).emit('game started auto');
		this.server.to(data.SIdTwo).emit('game started auto');
		const pOneDName = await this.userService.getNameBySId(data.SIdOne);
		const pTwoDName = await this.userService.getNameBySId(data.SIdTwo);
		const gameRoom = await this.gameService.startGame(
				{ "one": data.SIdOne, "two": data.SIdTwo });
		this.server.emit('deleteOppenents',
				{ "one": pOneDName, "two": pTwoDName });
		const players = await this.gameService.getPlayerByOneSId(data.SIdOne);
		this.server.emit('update game list', players);
		this.server.to(data.SIdOne).emit('game started', players);
		this.server.to(data.SIdTwo).emit('game started', players);
		this.server.to(data.SIdOne).emit('join room', gameRoom);
		this.server.to(data.SIdTwo).emit('join room', gameRoom);
		this.kickoff(gameRoom);
	}

	delay(time) {
	  return new Promise(resolve => setTimeout(resolve, time));
	}
	
	async kickoff(gameRoom: string) {
	  await this.delay(500);
		this.server.to(gameRoom).emit('kick-off');
	}

	@SubscribeMessage('join room')
		joinRoom(client, room: string): void {
			client.join(room);
		}
}
