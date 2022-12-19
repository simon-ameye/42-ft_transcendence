import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controllers";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import { OAuthStrategy, JwtStrategy } from "./strategy/";
import { HttpModule } from "@nestjs/axios";
import { JwtModule } from "@nestjs/jwt";
import { AuthGateway } from "./auth.gateway";

@Module({
  imports : [
		PassportModule,
		HttpModule,
		JwtModule,
	],
  controllers: [AuthController],
  providers: [AuthService, OAuthStrategy, JwtStrategy, AuthGateway],
})
export class AuthModule {}
