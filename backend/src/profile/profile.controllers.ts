import { Body, Controller, Delete, Get, Post, UseGuards, Req, Query } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ChannelMode } from "@prisma/client";
import { GetUser } from "src/auth/decorators/get-user.decorator";
import { UserDto } from "src/auth/dto";
import { ProfileService } from "./profile.service";
import { ProfileInterface } from "./interfaces/profile.interface";

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) { }

  @UseGuards(AuthGuard('jwt'))
  @Get('getProfile')
  async getProfile(@GetUser() user: UserDto) {
    return (this.profileService.getProfile(Number(user.id)));
  }
}
