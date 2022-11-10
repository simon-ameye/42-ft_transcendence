import { Controller, Put, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorator';
import { UserDto } from '../auth/dto';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
	constructor(private gameService: GameService) {}

//	@UseGuards(AuthGuard('jwt'))
//	@Put('queue')
//	addToQueue(@GetUser() user: UserDto) {
//		return (this.gameService.addToQueue(user.id));
//	}
//
//	@Get('queue')
//	showQueue() {
//		return (this.gameService.showQueue());
//	}
}
