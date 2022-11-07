import { Controller,
  MaxFileSizeValidator, 
  Post, 
  Get, 
  Put,
  UploadedFile,
  Body,
  ParseFilePipe, 
  FileTypeValidator, 
  UseInterceptors
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

  // upload profile image
  // it will be a put method to modify existing path to the profile image
  // Intercept the file  : TO DO store it and name it
  @Post('uploadImage')
  @UseInterceptors(
    FileInterceptor('image', {
      dest: './uploads',
    }
  ))
  // should store the path to the image in the database
  async uploadFileAndPassValidation(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100000 }),
          new FileTypeValidator({ fileType: 'png|jpeg|svg' }),
        ]
      })
    )
    @Body() dto: UserDto,
    file?: Express.Multer.File
  ) {
    let response = await this.userService.upload(dto);
    return 'file is uploaded successfully';
  }

  // display the image of the user specified
  /*@Get()
  display(@Res() res) {
    // send the file according to the user ( need user id )
    res.sendFile('index-53a2.jpg',{ root: './uploads' })
  }*/
}
