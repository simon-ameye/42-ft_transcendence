import { Strategy } from "passport-oauth2";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class OAuthStrategy extends PassportStrategy(Strategy, 'oauth') {
	constructor(private prismaService: PrismaService) {
		super({
			// service provider to authorize access
			authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
			// to get the 42 API token that will be exchange for access token
			tokenURL: 'https://api.intra.42.fr/oauth/token',
			clientID: '123',
			clientSecret: 'secret',
			// where user is sent after authorization
			callbackURL: 'http://localhost:3000/users/signup'
		});
	}
	async validate(email: string, password: string) {
		// change email to unique to use FindUnique
		const	user = await this.prismaService.user.findFirst({
			where : {
				email: email,
			}
		});
		return (user);
	}
}
