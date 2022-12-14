import { Injectable } from "@nestjs/common";
import { ChannelMode } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class LeaderboardService {
  constructor(
    private prisma: PrismaService,
  ) { }


}
