import { Injectable } from '@nestjs/common';
import { userInfo } from 'os';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // create a function for searching a user by his token

  async displayEmail(dto: UserDto) {
        
  }
  async upload(dto: UserDto, path: string) {
    console.log("dto id", dto.token);
    if (!dto.token) {
      // error handling
      console.log("no user token");
    }
    console.log('store path of the image for the current user');
    /*const user = await this.prisma.user.findFirst({
      where: {
        token: dto.token,
      },
    });
    if (!user) {
      throw new ForbiddenException(
        'Credentials incorrect',
      );
    }*/
    // /user.pathUrl = path;
    return 'path image update'
  }
}
