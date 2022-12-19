import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { UserModule } from '../user/user.module';
import { GameGateway } from './game.gateway';
import { UserService } from '../user/user.service';

@Module({
  imports: [UserModule],
  controllers: [GameController],
  providers: [GameService, GameGateway, UserService]
})
export class GameModule { }
