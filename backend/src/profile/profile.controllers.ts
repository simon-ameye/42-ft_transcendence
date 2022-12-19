import { Body, Controller, Delete, Get, Post, UseGuards, Req, Query } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ChannelMode } from "@prisma/client";
import { GetUser } from "src/auth/decorators/get-user.decorator";
import { UserDto } from "src/auth/dto";
import { ProfileService } from "./profile.service";
import { ProfileInterface } from "./interfaces/profile.interface";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadedFile } from "@nestjs/common";
import { UseInterceptors } from "@nestjs/common";

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) { }

  @UseGuards(AuthGuard('jwt'))
  @Get('getProfile')
  async getProfile(@GetUser() user: UserDto) {
    return (this.profileService.getProfile(Number(user.id)));
  }

  //@UseGuards(AuthGuard('jwt'))
  //@Post('uploadPicture')
  //uploadPicture(@Body() body: { UserId: number, },
  //  @GetUser() user: UserDto) {
  //  return (this.profileService.uploadPicture(user.id, ));
  //}

  //@UseGuards(AuthGuard('jwt'))
  //@Post('uploadPicture')
  //@UseInterceptors(FileInterceptor('file'))
  //uploadFile(@UploadedFile() file: Express.Multer.File) {
  //  console.log(file);
  //}
}
