import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controllers";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import { OAuthStrategy } from "./strategy/oauth.strategy";
// in order to send make HTTP request
import { HttpModule } from "@nestjs/axios";

@Module({
  imports : [PassportModule, HttpModule],
  controllers: [AuthController],
  providers: [AuthService, OAuthStrategy],
})
export class AuthModule {}
