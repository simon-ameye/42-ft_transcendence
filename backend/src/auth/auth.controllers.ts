import { Body, Controller, Delete, Get, Post, UseGuards, Req } from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { AuthGuard } from "@nestjs/passport"; 

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }
  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }
	// UseGuards determine if the request will be handled
	@UseGuards(AuthGuard('42API'))
	@Post('signupAPI')
	signupAPI(@Req() request: Request) {
		console.log({request});
	}
}
