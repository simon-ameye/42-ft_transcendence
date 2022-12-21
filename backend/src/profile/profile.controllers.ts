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
import { UserService } from "src/user/user.service";

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService, private userService: UserService, ) { }

  @UseGuards(AuthGuard('jwt'))
  @Get('myProfile')
  async getProfile(@GetUser() user: UserDto) {
    return (this.profileService.getProfile(Number(user.id)));
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('findbyId/:id')
  async getProfileById(@Query() queryParams) {
    let test = this.profileService.getProfile(Number(queryParams.id))
    return test;
  }

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
          new MaxFileSizeValidator({ maxSize: 200000000 }),
          new FileTypeValidator({ fileType: 'png|jpeg' }),
        ]
      })
    )
    file: Express.Multer.File,
    @GetUser() user: UserDto,
  ) {
    let response = await this.profileService.upload(user.id, file.path);
    return response;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('getImage')
  displayImage(@GetUser() user: UserDto, @Res() res) {
    res.sendFile(user.imageUrl, { root: './' })
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('getImageById/:id')
  async getImagebyId(@Query() queryParams, @Res() res) {
    let user = await this.userService.getUserById(Number(queryParams.id));
    console.log("USER ID", user.id);
    console.log("USER PATH", user.imageUrl);
    if (user)
      await res.sendFile(user.imageUrl, { root: './' })
  }
}
