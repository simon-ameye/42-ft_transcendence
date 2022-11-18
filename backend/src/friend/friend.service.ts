import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendService {
  constructor (private prisma: PrismaService) {}

  async sendFriendRequest( client, receiverId: string ) {
    /*const relationship = await this.prisma.relationShip.create({
      data: {
        RequesterId: client.id,
        AddresseeId: receiverId,
        status: "Pending",
      }
    })*/
  }
}

