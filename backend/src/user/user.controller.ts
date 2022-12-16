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
	Query,
	Req
} from '@nestjs/common';

import { Express, Request } from 'express';
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
	modifySocketId(@Body() body: {socketId: string}, @GetUser() user: UserDto) {
		return this.userService.modifySocketId(user, body.socketId);
	}

}
