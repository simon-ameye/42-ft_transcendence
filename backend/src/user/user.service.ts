import { Injectable } from '@nestjs/common';
import { userInfo } from 'os';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async getUsers(dto: UserDto) {
    // exclude the current user
    const users = await this.prisma.user.findMany({
    });
    for (let user of users) {
      delete user['hash']
    }
    return users;
  }

  async addFriend(dto: UserDto, receiverId: number) {
    console.log("receiverId :", receiverId);
    console.log("creatorId :", dto.id);
    const relationShip = await this.prisma.friendRequest.create({
      data: {
        receiverId: receiverId,
        creatorId: dto.id,
        fstatus: "pending",
      }
    })
  }

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
        socketId: socketId,
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

  async getNameById(id: number): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: {
        id
      }
    });
    return (user.displayName);
  }

  async getNameBySId(socketId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: {
        socketId
      }
    });
    return (user.displayName);
  }

  async getSIdByName(displayName: string): Promise<string> {
    const user = await this.prisma.user.findFirst({
      where: {
        displayName
      },
      select: {
        socketId: true,
      }
    });
    return (user.socketId);
  }
}
