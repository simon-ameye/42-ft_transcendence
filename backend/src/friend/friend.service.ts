import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendService {
  constructor(private prisma: PrismaService) { }

  async sendFriendRequest(receiverId: number, clientId: string) {
    var sender = await this.prisma.user.findUnique({
      where: {
        socketId: clientId,
      }
    })
    console.log("printing socket id", clientId)
    const relationShip = await this.prisma.friendRequest.create({
      data: {
        receiverId: receiverId,
        creatorId: sender.id,
        fstatus: "pending",
      }
    })
  }
}

