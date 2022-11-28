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

@WebSocketGateway({ cors: true }) // only for notifications and status or modification of the database in it ?
export class FriendGateway implements OnModuleInit, OnGatewayDisconnect, OnGatewayConnection {
  constructor( private friendService: FriendService ) {}

  // friend service
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('FriendGateway');

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  onModuleInit() {
    this.server.on('connection', (socket) => {
      // on initialization
      console.log(socket.id);
      console.log('Connected');
    });
  }

  @SubscribeMessage('sendFriendRequest')
  handleFriendRequest( client: Socket, Friendrequest: jwtToken) {
    // we need the socket id to send the friendrequest
    this.logger.log('Client message', Friendrequest);
    // create a service to update database
    this.server.emit("receiveFriendRequest", Friendrequest); //emit the friend request to the good id
  }

  @SubscribeMessage('acceptRequest')
  handleAcceptRequest( client: Socket, receiverId: string ) {
    this.logger.log(`accepted request`);
    // have to create this service this.friendService.acceptRequset();
    //this.server.emit.toString()
  }
  async handleDisconnect(client : Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
