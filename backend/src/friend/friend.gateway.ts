import { OnModuleInit, Session, UseGuards } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io';
import { UserDto } from "src/user/dto";
import { Friends, User } from "@prisma/client";
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
  async handleFriendRequest(client: Socket, receiverId: number) {
    console.log(receiverId[1])
    const sender = await this.userService.getUserBySid(client.id);
    let friendShip = this.friendService.addFriend(sender.id, receiverId[0]);
    if (friendShip != null)
      this.server.to(receiverId[1]).emit("receive invitation", friendShip);
  }

  @SubscribeMessage('accept friend')
  async handleAccept(client: Socket, relation: Friends) {
    console.log("accept friend");
    let friendShip = this.friendService.acceptFriendRequest(relation.id);
    let friendUser = await this.userService.getUserById(relation.user_id);
    let user = await this.userService.getUserById(relation.friend_id);
    this.server.to([friendUser.socketId]).emit("accept friend", user);
    this.server.to([user.socketId]).emit("accept friend", friendUser);
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    /// put boolean on offline
  }
}
