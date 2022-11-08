import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { UserModule } from '../user/user.module';
import { ApiService } from '../api/api.service';

@Module({
	imports: [UserModule],
  controllers: [GameController],
  providers: [GameService, ApiService]
})
export class GameModule {}
