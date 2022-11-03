import { Body, Controller, Delete, Get, Post, UseGuards, Req, Query } from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "./decorator/get-user.decorator";
import { HttpService } from "@nestjs/axios";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private httpService: HttpService) {}

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
	async handleRedirect(@Query() query: {code: string, state: string}, @GetUser() user: {client_id: string, client_secret: string}): Promise<any> {
		console.log("REDIRECT");
		console.log(user);
		console.log(query);
		const data = await this.httpService.post(
			'https://api.intra.42.fr/oauth/token',
			{
				grant_type: 'authorization_code',
				client_id: user.client_id,
				client_secret: user.client_secret,
				code: query.code,
				redirect_uri: 'http://localhost:3000/auth/42api/reredirect',
				state: query.state
			});
		return ({data});
	}

	@Get('42api/reredirect')
	handleReredirect() {
		return ({msg: "OK"});
	}
}
