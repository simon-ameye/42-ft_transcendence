import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from 'src/auth/dto';
import { User } from '@prisma/client';

type UserUncheckedUpdateManyInput = {
  id?: number
  createdAt?: Date | string
  updatedAt?: Date | string
  email?: string
  hash?: string | null
  displayName?: string
  imageUrl?: string | null
  googleSecret?: | string | null
  status?: string | null
  socketId?: string | null
  inGame?: boolean
  victories?: number
  log?: boolean
}

@Injectable()
export class FriendService {
  constructor(private prisma: PrismaService) { }

  async addFriend(senderId: number, receiverId: number) {
    // maybe needs modif
    const user = await this.prisma.user.update({
      where: {
        id: senderId,
      },
      data: {
        friends: {
          connect: {
            id: receiverId,
          },
        },
      },
      include: {
        friends: true,
      },
    });
    await this.prisma.user.update({
      where: {
        id: receiverId,
      },
      data: {
        friends: {
          connect: {
            id: senderId,
          },
        },
      },
      include: {
        friends: false,
        _count: false,
        friendsAddedMe: false,
      },
    });

    return user;
  }

  /// accept friend -> if relation pending then accept
  /// deny friend -> if relation pending then deny
}
