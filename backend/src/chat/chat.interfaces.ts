import { PrismaService } from "src/prisma/prisma.service";
import { prisma } from '@prisma/client';

export interface	ChannelInterface {
	id: number,
	name: string,
  mode: string,
  messages: string[],
  authors: string[],
  userSocketId :string,
}