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
    const exist = await this.prisma.friends.findFirst({
      where: {
        status: "pending",
        user_id: senderId,
        friend_id: receiverId
      }
    });
    if (exist != null) {
      return null
    }

    const friend = await this.prisma.friends.create({
      data: {
        status: "pending",
        user_id: senderId,
        friend_id: receiverId,
      }
    });

    return friend;
  }

  async acceptFriendRequest(senderId: number, receiverId: number) {
    const exist = await this.prisma.friends.findFirst({
      where: {
        status: "pending",
        user_id: senderId,
        friend_id: receiverId
      }
    });
    if (exist != null) {
      console.log("alreadt exists");
      return null
    }
    const friend = await this.prisma.friends.create({
      data: {
        status: "pending",
        user_id: senderId,
        friend_id: receiverId,
      }
    });

    return friend;
  }

  async denyFriendRequest(senderId: number, receiverId: number) {

  }
  /// accept friend -> if relation pending then accept
  /// deny friend -> if relation pending then deny
}
