import { Controller, Put, UseGuards, Get, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators';
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
	@Get('queue')
	getQueue() {
		return (this.gameService.getQueue());
	}

	@Get('list')
	getList() {
		return (this.gameService.getList());
	}
	
	@Get(':id')
	findOne(@Param('id') id: string) {
		return (this.gameService.findOne(id));
	}
}
