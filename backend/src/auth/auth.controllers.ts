import { Body, Controller, Delete, Get, Post, UseGuards, Query, Res, Req } from "@nestjs/common";
import { Response, Request } from 'express';
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "./decorators";
import { UserDto } from "./dto";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(
			@Body() dto: AuthDto,
			@Res({ passthrough: true} ) response: Response
	) {
    return this.authService.signup(dto, response);
  }
  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }

	@UseGuards(AuthGuard('42API'))
	@Get('42api/login')
	login42() {}

	@Get('intra/getMe')
	async getIntraUser (
			@Query() query: {token: string},
			@Res({ passthrough: true} ) response: Response
		): Promise<string> {
		return (this.authService.getIntraUser(query.token, response));
	}

	@Get('google2FA/signup')
	async signup2FA(@Body() body: {email: string, displayName: string}) {
		return (this.authService.signup2FA(body));
	}

	@Post('google2FA/login')
	verify2FA(@Body() body: {email: string, code: string}) {
		return (this.authService.verify2FA(body));
	}

	@UseGuards(AuthGuard('jwt'))
	@Delete('logout')
	async logout(@GetUser() user: UserDto) {
		return (this.authService.logout(user));
	}
}
