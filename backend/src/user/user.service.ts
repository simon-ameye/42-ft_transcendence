import { Injectable } from '@nestjs/common';
import { userInfo } from 'os';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  
  async modifyName(dto: UserDto, modif: string) {
    if (!dto) {
      console.log("not expecred error");
    }
    const updateUser = await this.prisma.user.update({
      where: {
        id: dto.id,
      },
      data: {
        displayName: modif,
      },
    })
  }

	async modifySocketId(user: UserDto, socketId: string) {
    if (!user) {
      console.log("not expecred error");
    }
    const updateUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        socketId,
      },
    })
  }

  // create a function for searching a user by his token
  async upload(dto: UserDto, path: string) {
    if (!dto) {
      console.log("not expected error");
    }
    const updateUser = await this.prisma.user.update({
      where: {
        id: dto.id,
      },
      data: {
        imageUrl: path,
      },
    })
  }
}
