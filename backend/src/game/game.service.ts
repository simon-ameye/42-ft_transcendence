import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { OppenentsInterface, PlayerInterface } from './interfaces';

@Injectable()
export class GameService {
	constructor(
			private prismaService: PrismaService,
			private userService: UserService
	) {}

	async getQueue(): Promise<string[]> {
		const queue = await this.prismaService.matching.findMany();
		const len = queue.length;
		let users: string[] = new Array(len);
		for (let i = 0; i < len; ++i)
			users[i] = await this.userService.getNameById(queue[i].userId);
		return (users);
	}

	async getList(): Promise<string[]> {
		const games = await this.prismaService.game.findMany();
		const len = games.length;
		let versus: string[] = new Array(len);
		for (let i = 0; i < len; ++i) {
			let players = await this.prismaService.user.findMany({
				where: {
					gameId: games[i].id
				}
			});
			versus[i] = this.getStrGame(players);
		}
		return (versus);
	}

	async addClientToMatchingQueue(socketId: string): Promise<void> {
		const matchingUser = this.prismaService.user.update({
			where: {
				socketId,
			},
			data: {
				matching: {
					create: {}
				}
			}
		});
	}

	async startGame(oppenents: OppenentsInterface): Promise<string> {
		const	players = await this.prismaService.user.findMany({
			where: {
				OR: [{ socketId: oppenents.one }, { socketId: oppenents.two }],
			}
		});
		const deleteUsers = await this.prismaService.matching.deleteMany({
			where: {
				OR: [{ user: players[0] }, { user: players[1] }],
			},
		});
		const game = await this.prismaService.game.create({
			data: {
				players: [
					{user: players[0]},
					{user: players[1]}
				]
			}
		});
		const gameRoom = "game".concat(String(game.id));
		return (gameRoom);
	}

	async	updateScore(socketId: string, n: number): Promise<string> {
		const	player = await this.prismaService.player.update({
			where: {
				socketId,
			},
			data: {
				score: {
					increment: n
				},
			},
		});
		const gameRoom = "game".concat(String(player.gameId));
		return (gameRoom);
	}

	findOne(id: string) {
		const game = this.prismaService.game.findUnique({
			where: {
				id: Number(id)
			}
		});
		return ({game});
	}

	getStrGame(players: PlayerInterface[]): string {
		let strGame = players[0].socketId.concat(" vs ");
		strGame = strGame.concat(players[1].socketId);
		return (strGame);
	}

	async getPlayers(playerIds: string[]): Promise<PlayerInterface[]> {
		const players = await this.prismaService.player.findMany({
			where: {
				OR: [{socketId: playerIds[0] }, { socketId: playerIds[1] }],
			}
		});
		return (players);
	}
}
