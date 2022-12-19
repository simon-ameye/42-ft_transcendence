import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(4343, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  }
})
export class AuthGateway {
  constructor() {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('hello')
  hello(client: Socket) {
    this.server.to(client.id).emit('heyo');
  }

	@SubscribeMessage('reload')
	reload(client: Socket) {
		this.server.to(client.id).emit('reload');
	}
}
