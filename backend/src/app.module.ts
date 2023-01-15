import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { FriendModule } from './friend/friend.module';
import { FriendService } from './friend/friend.service';
import { GameModule } from './game/game.module';
import { ChatModule } from './chat/chat.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
	ChatModule,
  ProfileModule,
	AuthModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    FriendModule,
    GameModule,
  ],
  //providers: [FriendService],
})

export class AppModule {}
