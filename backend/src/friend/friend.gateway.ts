import { OnModuleInit } from "@nestjs/common";
import { MessageBody, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io';
import { UserDto } from "src/user/dto";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { FriendService } from "./friend.service";

@WebSocketGateway() // listening on same port than HTTP
export class MyGateway implements OnModuleInit, OnGatewayDisconnect {
  constructor( private friendService: FriendService ) {}

  // friend service
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      // on initialization
      console.log(socket.id);
      console.log('Connected');
    });
  }

  @SubscribeMessage('friendInvit')
  onNewFriendRequest(@MessageBody() body: UserDto) {
    // when we have and event friend request
    console.log("friend request");
    // have to emit something
  }

  @SubscribeMessage('declineInvit')
  onDeclineRequest(@MessageBody() body: UserDto) {
    // when decline event is sent
    console.log("dont wanna be your friend man");
    this.server.emit('onFriendRequest', {
      msg: 'you have a friend request',
    })
    // have to emit something
  }

  @SubscribeMessage('acceptInvit')
  onAcceptRequest(@MessageBody() body: UserDto) {
    // when accept event is sent
    console.log("lets be friend");
    // have to emit something
  }

  async handleDisconnect(@MessageBody() body: any) {
    this.server.emit('offline')
  }
}
