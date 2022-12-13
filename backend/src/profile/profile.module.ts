import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controllers';
import { ProfileService } from './profile.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtStrategy } from 'src/auth/strategy';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [ProfileController],
  providers: [ProfileService, ProfileService, JwtStrategy],
})
export class ProfileModule { }
