import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from 'src/auth/dto';
import { User } from '@prisma/client';

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
      console.log("already exist")
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

  async acceptFriendRequest(relationId: number) {
    /// may be useless
    const exist = await this.prisma.friends.findFirst({
      where: {
        id: relationId,
      }
    });

    if (exist == null) {
      console.log("does not exist");
      return null
    }
    const updateFriend = await this.prisma.friends.update({
      where: {
        id: relationId,
      },
      data: {
        status: "accepted"
      },
    });

    return updateFriend;
  }

  async denyFriendRequest(relationId: number) {
    const exist = await this.prisma.friends.findFirst({
      where: {
        id: relationId,
      }
    });
    if (exist == null) {
      console.log("does not exist");
      return null
    }
    const updateFriend = await this.prisma.friends.update({
      where: {
        id: relationId,
      },
      data: {
        status: "declined"
      },
    });

    return updateFriend;
  }
  /// accept friend -> if relation pending then accept
  /// deny friend -> if relation pending then deny
}
