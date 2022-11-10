import { Module } from '@nestjs/common';
import { GameGateway } from './game';

@Module({
	providers: [GameGateway],
})
export class GameModule {}
