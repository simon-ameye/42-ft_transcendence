import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from 'src/auth/dto';

interface User {
  email: string
}

@Injectable()
export class FriendService {
  constructor(private prisma: PrismaService) { }

  async sendFriendRequest(sender: User, receiverId: number) {
    console.log("printing socket id", sender)
    // if relation is already pending do nothing
    // to code
    // if relation dosent exist create it and pending it
    const relationShip = await this.prisma.friendRequest.create({
      data: {
        creator: undefined,
        receiver: undefined,
        fstatus: "pending",
      }
    })
    return relationShip;
  }

  /// accept friend -> if relation pending then accept
  /// deny friend -> if relation pending then deny
}
