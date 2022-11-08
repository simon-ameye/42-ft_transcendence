import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GameService {
	constructor(private prismaService: PrismaService) {}

	async addToQueue(id: number) {
		const updateUser = await this.prismaService.user.update({
			where: {
				id
			},
			data: {
				matching: {
					create: {}
				}
			}
		});
	}

	async showQueue() {
		const queue = await this.prismaService.matching.findMany();
		return ({queue});
	}
}
