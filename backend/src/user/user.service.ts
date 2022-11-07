import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // services for user
  async upload(dto: UserDto) {
    console.log("dto id", dto.id);
    if (!dto.id) {
      // error handling
      console.log(dto.id);
    }
    console.log('store path of the image for the current user');
    /*const user = await this.prisma.user.findFirst({
      where: {
        id: dto.id,
      },
    });*/
  }
}
