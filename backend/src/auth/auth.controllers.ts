import { Body, Controller, Delete, Get, Post, UseGuards, Req, Query } from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "./decorator/get-user.decorator";

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
	@Get('42api/login')
	login42(@Req() request: Request) {
		console.log({request});
	}

	@UseGuards(AuthGuard('42API'))
	@Get('42api/redirect')
	async handleRedirect (
			@Query() query: {code: string, state: string},
			@GetUser() user: {token: string, refreshToken: string}) {
		// query contains code and state from oauth.strategy
		console.log(query);
		return (this.authService.logUser42(user.token));
	}

	@Get('google2FA/signup')
	async signup2FA(@Body() body: {email: string}) {
		return (this.authService.signup2FA(body.email));
	}

	@Post('google2FA/login')
	verify2FA(@Body() body: {email: string, code: string}) {
		return (this.authService.verify2FA(body));
	}
}
