import { Injectable } from "@nestjs/common";
import { ChannelMode } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { LeaderBoardInterface } from "./interfaces/user.interface";


@Injectable()
export class LeaderboardService {
  constructor(
    private prisma: PrismaService,
  ) { }

  async getLeaderBoard(userId: number) {

    var user = await this.prisma.user.findUnique({ where: { id: userId }, })
    if (!user)
      return {  };

    return {  };
  }

}
