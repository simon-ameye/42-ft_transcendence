import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from 'src/auth/dto';
import { User } from '@prisma/client';
import { exit } from 'process';

@Injectable()
export class FriendService {
  constructor(private prisma: PrismaService) { }

  async addFriend(senderId: number, receiverId: number) {
    // maybe needs modif
    let exist = await this.prisma.friends.findFirst({
      where: {
        user_id: senderId,
        friend_id: receiverId
      }
    });

    if (exist != null)
      return null

    exist = await this.prisma.friends.findFirst({
      where: {
        friend_id: senderId,
        user_id: receiverId
      }
    });

    if (exist != null)
      return null

    const friend = await this.prisma.friends.create({
      data: {
        status: "pending",
        user_id: senderId,
        friend_id: receiverId,
      },
      include: {
        user: true,
      }
    });

    return friend;
  }

  async acceptFriendRequest(relationId: number) {
    /// may be useless
    const exist = await this.prisma.friends.findFirst({
      where: {
        id: relationId,
      }
    });

    if (exist == undefined)
      return null

    const updateFriend = await this.prisma.friends.update({
      where: {
        id: relationId,
      },
      data: {
        status: "accepted"
      }
    });

    //// include the user friend to output it after
    return updateFriend;
  }

  async denyFriendRequest(relationId: number) {
    const exist = await this.prisma.friends.findFirst({
      where: {
        id: relationId,
      }
    });

    if (exist == undefined) {
      console.log("does not exist");
      return null
    }
    const updateFriend = await this.prisma.friends.delete({
      where: {
        id: relationId,
      },
    });

    return updateFriend;
  }
  /// accept friend -> if relation pending then accept
  /// deny friend -> if relation pending then deny
}
