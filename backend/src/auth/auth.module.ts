import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controllers";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import { OAuthStrategy } from "./strategy/oauth.strategy";

@Module({
	imports : [PassportModule],
  controllers: [AuthController],
  providers: [AuthService, OAuthStrategy],
})
export class AuthModule {}
