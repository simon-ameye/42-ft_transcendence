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

// clean dependencies + unused dtos

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // do all PUT and GET requests
  @Get()
  displayEmail(@Body() dto: UserDto) {
    // return this.userService.displayEmail();
  }
  //@UseGuards('jwt')
  @Post('uploadImage')
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
    @Body() dto: UserDto,
  ) {
    let response = await this.userService.upload(dto, file.path);
    return 'file is uploaded successfully';
  }

  // display the image of the user specified
  @Get()
  displayImage(@Res() res) {
    //let response = await this.userService.display(dto, file.path);
    // https://docs.nestjs.com/techniques/streaming-files
    //res.sendFile('index-53a2.jpg',{ root: './uploads' })
  }

}
