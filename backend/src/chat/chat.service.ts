import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma, User } from ".prisma/client";
import internal from "stream";

@Injectable()
export class ChatService {
	constructor(private prisma: PrismaService) {}

  async createChannel(name : string, mode : number, password : string, creator : User)
  {}
}