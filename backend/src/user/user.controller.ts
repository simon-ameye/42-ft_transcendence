import { Controller, Post } from '@nestjs/common';
import { UploadedFile, Body, ParseFilePipe, FileTypeValidator} from '@nestjs/common';
import { Express } from 'express';
import { SampleDto } from "./dto";

@Controller('user')
export class UserController {
 
  @Post('uploadImage')
  uploadFileAndPassValidation(
    @Body() body: SampleDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'jpeg' }),
          // ... Set of file validator instances here
        ]
      })
    )
    file: Express.Multer.File,
  ) {
    return {
      body,
      file: file.buffer.toString(),
    };
  }

}
