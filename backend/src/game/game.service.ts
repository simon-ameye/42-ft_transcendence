import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OppenentsInterface } from './interfaces';

@Injectable()
export class GameService implements OnModuleInit {
	constructor(private prismaService: PrismaService) {}

	matchingUsers: number = 0;

	async onModuleInit() {
		const count = await this.prismaService.matching.count({});
			this.matchingUsers = count;
	}

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
			ids[i] = queue[i].title;
		return (ids);
	}

	async addClientToMatchingQueue(id: string): Promise<void> {
		++this.matchingUsers;
		const matching = await this.prismaService.matching.create({
			data: {
				title: id
			}
		});
	}

	async startGame(oppenents: OppenentsInterface): Promise<void> {
		const deleteUsers = await this.prismaService.matching.deleteMany({
			where: {
				OR: [{title: oppenents.one }, { title: oppenents.two }],
			},
		});
	}
}
