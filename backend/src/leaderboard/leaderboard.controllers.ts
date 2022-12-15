import { Body, Controller, Delete, Get, Post, UseGuards, Req, Query } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ChannelMode } from "@prisma/client";
import { GetUser } from "src/auth/decorators/get-user.decorator";
import { UserDto } from "src/auth/dto";
import { LeaderboardService } from "./leaderboard.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadedFile } from "@nestjs/common";
import { UseInterceptors } from "@nestjs/common";
import { LeaderBoardInterface } from "./interfaces/leaderboard.interface";

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService) { }

  @UseGuards(AuthGuard('jwt'))
  @Get('getLeaderBoard')
  async getLeaderBoard(@GetUser() user: UserDto) {
    let { leaderboardInterfaces } = await this.leaderboardService.getLeaderBoard(user.id);
    return { leaderboardInterfaces };
  }
}
