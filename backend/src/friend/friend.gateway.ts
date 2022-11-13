import { OnModuleInit } from "@nestjs/common";
import { MessageBody, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io';
import { UserDto } from "src/user/dto";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { FriendService } from "./friend.service";

@WebSocketGateway() // only for notifications and status or modification of the database in it ?
export class FriendGateway implements OnModuleInit, OnGatewayDisconnect {
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

  /*@SubscribeMessage('invitation')
		invitSocket(client, receiverId: string): void {
			this.server.to(receiverId).emit('send invitation', client.id);
	}*/

  @SubscribeMessage('friendInvit')
  onNewFriendRequest( client, receiverId: string ) {
    // when we have and event friend request
    /// create relationshipin database
    console.log('client id', client.id);
    console.log('receiver id', receiverId); // to who are we sending the friend request
    this.server.to(receiverId).emit('send friend invitation', client.id);
  }

  /// may be cleaner to do a controller for this

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

  async handleDisconnect(@MessageBody() body: any) {
    this.server.emit('offline')
  }
}
