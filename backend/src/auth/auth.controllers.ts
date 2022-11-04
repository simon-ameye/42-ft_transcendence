import { Body, Controller, Delete, Get, Post, UseGuards, Req, Query } from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "./decorator/get-user.decorator";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { ConfigService } from "@nestjs/config";

@Controller('auth')
export class AuthController {
  constructor(
			private authService: AuthService,
			private httpService: HttpService,
			private configService: ConfigService) {}

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
	@Get('loginAPI')
	loginAPI(@Req() request: Request) {
		console.log({request});
	}

	// Redirection after successful connection with 42API
	@UseGuards(AuthGuard('42API'))
	@Get('42api/redirect')
	async handleRedirect(
			@Query() query: {code: string, state: string},
			@GetUser() user: {token: string, refreshToken: string}): Promise<any> {
		const	authStr = 'Bearer '.concat(user.token);
		console.log("REDIRECT");
		console.log(user);
		const data = await firstValueFrom(this.httpService.get(
			'https://api.intra.42.fr/v2/me',
			{
				headers: { Authorization: authStr }
			}));
			console.log({data});
	}

	@Get('42api/reredirect')
	handleReredirect() {
		return ({msg: "OK"});
	}
}
