import { Controller,
  MaxFileSizeValidator, 
  Post, 
  Get, 
  Put,
  UploadedFile,
  Body,
  ParseFilePipe, 
  FileTypeValidator, 
  UseInterceptors,
  UseGuards,
	Query
} from '@nestjs/common';

import { Express } from 'express';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Res } from '@nestjs/common';
import { UserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators';

// clean dependencies + unused dtos

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('getEmail')
  getEmail(@GetUser() user: UserDto) {
		console.log("HEYo");
    return user.email;
  }

  // DisplayName
  @UseGuards(AuthGuard('jwt'))
  @Get('getName')
  getName(@GetUser() user: UserDto) {
    return user.displayName;
  }

  // DisplaySocketId
  @UseGuards(AuthGuard('jwt'))
  @Get('socketId')
  getSocketId(@GetUser() user: UserDto) {
    return user.socketId;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('modifyName')
  modifyName(@GetUser() user: UserDto,
		@Body() body: {displayName: string}) {
    return this.userService.modifyName(user, body.displayName);
  }

	@UseGuards(AuthGuard('jwt'))
	@Put('modifySocketId')
//	modifySocketId(@Query() query: {socketId: string}, @GetUser() user: UserDto) {
		modifySocketId(
		@Body)() {
		console.log({"new socketID": query.socketId});
		return this.userService.modifySocketId(user, query.socketId);
	}

  //// IMAGE UPLOAD
  @UseGuards(AuthGuard('jwt'))
  @Put('uploadImage')
  @UseInterceptors(
    FileInterceptor('image', {
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
    let response = await this.userService.upload(user, file.path);
    return response;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('getImage')
  displayImage(@GetUser() user: UserDto, @Res() res) {
    res.sendFile(user.imageUrl, { root: './' })
  }
}
