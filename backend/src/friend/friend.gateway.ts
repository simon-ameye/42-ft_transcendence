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
import { GetUser } from "src/auth/decorator/get-user.decorator";

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
    this.logger.log(`friend request of ${client.id} to ${receiverId}`);
    this.friendService.sendFriendRequest(client.id, receiverId); // do the logic when testing can be done
    this.server.to(receiverId).emit('friend request', client.id); // sending id of the user who send the request
  }

  @SubscribeMessage('acceptRequest')
  handleAcceptRequest( client: Socket, receiverId: string ) {
    this.logger.log(`accepted request`);
    // have to create this service this.friendService.acceptRequset();
    //this.server.emit.toString()
  }
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
  async handleDisconnect(client : Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}