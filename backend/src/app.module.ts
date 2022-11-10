import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [
	ChatModule,
	GameModule,
	AuthModule,
    UserModule,
    ConfigModule.forRoot({ isGlobal: true, }),
    PrismaModule,
  ],
})

export class AppModule {}
