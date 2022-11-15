import { OnModuleInit } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io';
import { UserDto } from "src/user/dto";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { FriendService } from "./friend.service";
import { Logger } from '@nestjs/common';
import { Socket } from "socket.io";

@WebSocketGateway() // only for notifications and status or modification of the database in it ?
export class FriendGateway implements OnModuleInit, OnGatewayDisconnect, OnGatewayConnection {
  constructor( private friendService: FriendService ) {}

  // friend service
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('FriendGateway');

  onModuleInit() {
    this.server.on('connection', (socket) => {
      // on initialization
      console.log(socket.id);
      console.log('Connected');
    });
  }

  /*@SubscribeMessage('invitation')
		invitSocket(client, receiverId: string): void {
			this.server.to(receiverId).emit('send invitation', client.id);
	}*/

  @SubscribeMessage('friendRequest') // have to emit this to the client friend
  handleFriendRequest( client: Socket, receiverId: string ) {
    /// create relationshipin database
    console.log('client id', client.id);
    console.log('receiver id', receiverId);
    // .to(receiverId).
    this.server.emit('onFriendRequest', client.id);
  }

  /*@SubscribeMessage('declineInvit')
  onDeclineRequest(@MessageBody() body: UserDto) {
    // when decline event is sent
    console.log("dont wanna be your friend man");
    this.server.emit('onFriendRequest', {
      msg: 'you have a friend request',
    })
    // have to emit something
  }*/

  /*@SubscribeMessage('acceptInvit')
  onAcceptRequest(@MessageBody() body: UserDto) {
    // when accept event is sent
    console.log("lets be friend");
    // have to emit something
  }*/

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
  async handleDisconnect(client : Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
