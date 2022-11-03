import { ConsoleLogger, Controller, Post } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { Express, response } from 'express';

@Controller('user')
export class UserController {

  @Post('uploadImage')
  @UseInterceptors(
    FileInterceptor('file'),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return response;
  }
}
