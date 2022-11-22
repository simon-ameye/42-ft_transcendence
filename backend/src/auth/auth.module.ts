import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controllers";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import { OAuthStrategy, JwtStrategy } from "./strategy/";
import { HttpModule } from "@nestjs/axios";
import { JwtModule } from "@nestjs/jwt";
import { AuthGateway } from "./auth.gateway";
import { EventEmitterModule } from "@nestjs/event-emitter";

@Module({
  imports : [
		PassportModule,
		HttpModule,
		JwtModule,
		EventEmitterModule.forRoot()
	],
  controllers: [AuthController],
  providers: [AuthService, OAuthStrategy, JwtStrategy, AuthGateway],
})
export class AuthModule {}
