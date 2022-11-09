import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module';
import { GatewayModule } from './gateway/gateway.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GatewayModule,
    PrismaModule
  ],
})

export class AppModule {}
