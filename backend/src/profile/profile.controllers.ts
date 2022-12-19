import { Body, Controller, Res, Get, Post, UseGuards, Req, Query } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ChannelMode } from "@prisma/client";
import { GetUser } from "src/auth/decorators/get-user.decorator";
import { UserDto } from "src/user/dto";
import { ProfileService } from "./profile.service";
import { ProfileInterface } from "./interfaces/profile.interface";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadedFile } from "@nestjs/common";
import { UseInterceptors } from "@nestjs/common";
import { Param, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from "@nestjs/common";

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) { }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getProfile(@GetUser() user: UserDto) {
    return (this.profileService.getProfile(Number(user.id)));
  }

  /*@UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getProfileById( @GetUser() user: UserDto, @Param() params: number) {
    return this.profileService.getProfile(params);
  }*/

  //// IMAGE UPLOAD

  @UseGuards(AuthGuard('jwt'))
  @Post('uploadImage')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads',
    }
  ))
  async uploadSingle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100000 }),
          new FileTypeValidator({ fileType: 'png|jpeg|svg' }),
        ]
      })
    )
    file: Express.Multer.File,
    @GetUser() user: UserDto,
  ) {
    console.log("UPLOAD FILE")
    let response = await this.profileService.upload(user, file.path);
    return response;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('getImage')
  displayImage(@GetUser() user: UserDto, @Res() res) {
    res.sendFile(user.imageUrl, { root: './' })
  }
}
