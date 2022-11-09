import { OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io';

@WebSocketGateway() // listening on same port than HTTP
export class MyGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('Connected');
    });
  }
  @SubscribeMessage('newFriendRequest')
  onNewFriendRequest(@MessageBody() body: any) {
    console.log(body);
    // the server will emit who is sending the request
    this.server.emit('onFriendRequest', {
      msg: 'you have a friend request',
    })
  }
}
