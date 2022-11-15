import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OppenentsInterface } from './interfaces';

@Injectable()
export class GameService {
	constructor(private prismaService: PrismaService) {}

//	async addToQueue(id: number) {
//		const updateUser = await this.prismaService.user.update({
//			where: {
//				id
//			},
//			data: {
//				matching: {
//					create: {}
//				}
//			}
//		});
//	}

	async showQueue() {
		const queue = await this.prismaService.matching.findMany();
		const len = queue.length;
		let ids: string[] = new Array(len);
		for (let i = 0; i < len; ++i)
			ids[i] = queue[i].socketId;
		return (ids);
	}

	async addClientToMatchingQueue(id: string): Promise<void> {
		const matching = await this.prismaService.matching.create({
			data: {
				socketId: id
			}
		});
	}

	async startGame(oppenents: OppenentsInterface): Promise<string> {
		const deleteUsers = await this.prismaService.matching.deleteMany({
			where: {
				OR: [{socketId: oppenents.one }, { socketId: oppenents.two }],
			},
		});
		const game = await this.prismaService.game.create({
			data: {
				players: {
					create: [
						{socketId: oppenents.one},
						{socketId: oppenents.two}
					]
				}
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
}
