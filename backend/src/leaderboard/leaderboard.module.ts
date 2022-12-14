import { Module } from '@nestjs/common';
import { LeaderboardController } from './leaderboard.controllers';
import { LeaderboardService } from './leaderboard.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtStrategy } from 'src/auth/strategy';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [LeaderboardController],
  providers: [LeaderboardService, LeaderboardService, JwtStrategy],
})
export class LeaderboardModule { }
