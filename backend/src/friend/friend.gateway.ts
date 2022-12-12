import { OnModuleInit, Session, UseGuards } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io';
import { UserDto } from "src/user/dto";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { FriendService } from "./friend.service";
import { Logger } from '@nestjs/common';
import { Socket } from "socket.io";
import { AuthGuard } from "@nestjs/passport";
import { send } from "process";
import { UserService } from "src/user/user.service";

@WebSocketGateway(4343, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  }
})

export class FriendGateway implements OnModuleInit, OnGatewayDisconnect, OnGatewayConnection {
  constructor(private friendService: FriendService, private userService: UserService) { }

  // friend service
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('FriendGateway');

  handleConnection(client: Socket, ...args: any[]) {
    /// put boolean on online
    this.logger.log(`Client connected: ${client.id}`);
  }

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('Connected');
    });
  }

  @SubscribeMessage('add friend')
  async handleFriendRequest(client: Socket, receiverId: number, receiverSocketId: string) {
    const sender = await this.userService.getUserBySid(client.id);
    const receiver = await this.userService.getUserBySid(receiverSocketId); // find it by id not by socketID is safer
    let user = this.friendService.addFriend(sender.id, receiver.id);
    this.server.to(receiverSocketId).emit("receiveFriendRequest", user);
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    /// put boolean on offline
  }
}
