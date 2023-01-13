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
	): Promise<string> {
    return this.authService.signup(dto, response);
  }

  @Post('signin')
  signin(
			@Body() dto: SigninDto,
			@Res({ passthrough: true} ) response: Response
		): Promise<string> {
    return this.authService.signin(dto, response);
  }

	@UseGuards(AuthGuard('42API'))
	@Get('42api/login')
	login42() {}

	@Get('intra/getMe')
	getIntraUser (
			@Query() query: {token: string},
			@Res({ passthrough: true} ) response: Response
		): Promise<string> {
		return (this.authService.getIntraUser(query.token, response));
	}

	@UseGuards(AuthGuard('jwt'))
	@Post('google2FA/activate')
	activateDfa(
			@GetUser() dto: UserDto,
			@Res({ passthrough: true} ) response: Response
		) {
		return (this.authService.activateDfa(dto, response));
	}

	@UseGuards(AuthGuard('jwt'))
	@Post('google2FA/desactivate')
	desactivateDfa(
			@GetUser() dto: UserDto,
			@Res({ passthrough: true} ) response: Response
		) {
		return (this.authService.desactivateDfa(dto, response));
	}

	@Post('google2FA/verify')
	verify2FA(
			@Body() body: {code: string, displayName: string},
			@Res({ passthrough: true }) response: Response
		): Promise<void> {
		return (this.authService.verify2FA(body.displayName, body.code, response));
	}

	@UseGuards(AuthGuard('jwt'))
	@Delete('logout')
	logout(
			@GetUser() user: UserDto,
			@Res({ passthrough: true }) response: Response
	) {
		return (this.authService.logout(user, response));
	}

	@Delete('corruption')
	handleCorruption(@Req() req: Request) {
		console.log({"displayName": req.cookies.displayName});
	}

	@UseGuards(AuthGuard('jwt'))
	@Post('signup/info')
	setSignupInfo(
			@GetUser() dto: UserDto,
			@Res({ passthrough: true }) response: Response,
			@Body() body: {displayName: string, profilePicture: string}
		) {
		return (this.authService.setSignupInfo(dto, response, body));
	}
}
