import { Controller, Put, UseGuards, Get, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators';
import { UserDto } from '../auth/dto';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) { }

  @Get('queue')
  getQueue() {
    return (this.gameService.getQueue());
  }

  @Get('list')
  getGameList() {
    return (this.gameService.getGameList());
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return (this.gameService.findOne(id));
  }
}
