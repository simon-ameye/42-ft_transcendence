import { Body, Controller, Delete, Get, Post, UseGuards, Query, Res, Req } from "@nestjs/common";
import { Response, Request } from 'express';
import { AuthService } from "./auth.service";
import { AuthDto, UserDto, SigninDto } from "./dto";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "./decorators";

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
  signin(
			@Body() dto: SigninDto,
			@Res({ passthrough: true} ) response: Response
		) {
		console.log("SIGNIN")
    return this.authService.signin(dto, response);
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

	@Post('google2FA/signup')
	async signup2FA(
			@Body() body: {email: string, displayName: string},
			@Res({ passthrough: true} ) response: Response
		): Promise<string> {
		return (this.authService.signup2FA(body, response));
	}

	@Post('google2FA/signin')
	verify2FA(
			@Body() body: {email: string, code: string},
			@Res({ passthrough: true }) response: Response
		) {
		return (this.authService.verify2FA(body, response));
	}

	@UseGuards(AuthGuard('jwt'))
	@Delete('logout')
	async logout(
			@GetUser() user: UserDto,
			@Res({ passthrough: true }) response: Response
	): Promise<void> {
		return (this.authService.logout(user, response));
	}
}
