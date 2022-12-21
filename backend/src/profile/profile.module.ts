import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controllers';
import { ProfileService } from './profile.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtStrategy } from 'src/auth/strategy';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [ProfileController],
  providers: [ProfileService, UserService, JwtStrategy],
})
export class ProfileModule { }
