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
  UseGuards
} from '@nestjs/common';

import { Express } from 'express';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Res } from '@nestjs/common';
import { UserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/get-user.decorator';

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

  @UseGuards(AuthGuard('jwt'))
  @Put('modifyName')
  modifyName(@GetUser() user: UserDto, @Body() body: {displayName: string}) {
    return this.userService.modifyName(user, body.displayName);
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
