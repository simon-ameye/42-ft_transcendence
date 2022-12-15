import { Injectable } from "@nestjs/common";
import { ChannelMode } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { LeaderBoardInterface } from "./interfaces/leaderboard.interface";


@Injectable()
export class LeaderboardService {
  constructor(
    private prisma: PrismaService,
  ) { }

  async getLeaderBoard(userId: number) //: Promise<LeaderBoardInterface[]>
  {

    let leaderboardInterfaces: LeaderBoardInterface[] = []

    var user = await this.prisma.user.findUnique({ where: { id: userId }, })
    if (!user)
      return { leaderboardInterfaces };

    let users = await this.prisma.user.findMany()
    for (let user of users) {
      leaderboardInterfaces.push({ id: user.id, name: user.displayName, victories: user.victories });
    }
    return { leaderboardInterfaces };
  }

}
