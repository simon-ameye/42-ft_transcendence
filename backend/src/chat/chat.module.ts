import { Module } from '@nestjs/common';
import { ChatGateway } from './chat';

@Module({
	providers: [ChatGateway],
})
export class ChatModule {}
