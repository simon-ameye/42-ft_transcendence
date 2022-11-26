import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnModuleInit, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import jwt, { JwtPayload } from 'jsonwebtoken';

@WebSocketGateway(4343, {cors: '*'})
export class AuthGateway implements OnModuleInit {
	constructor(
		private authService: AuthService,
		private configService: ConfigService) {}

	@WebSocketServer() server: Server;

	onModuleInit() {
		this.server.on('connection', async (socket) => {
			console.log({"socket.id": socket.id});
			console.log("connected");
		});
	}

	@SubscribeMessage('auth done')
	addSocketId(client, token: string): void {
		console.log(token);
		const decoded: string | JwtPayload = jwt.verify(token, this.configService.get<string>('JWT_SECRET'));
		console.log(decoded);
	}
}
