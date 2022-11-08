import { Strategy } from "passport-oauth2";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class OAuthStrategy extends PassportStrategy(Strategy, '42API') {
	constructor(
			private configService : ConfigService) {
		super({
			// service provider to authorize access
			authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
			// to get the 42 API token that will be exchange for access token
			tokenURL: 'https://api.intra.42.fr/oauth/token',
			clientID: configService.get('42API_ID'),
			clientSecret: configService.get('42API_SECRET'),
			// where user is sent after authorization
			callbackURL: 'http://localhost:3000/auth/42api/redirect',
			state: true,
			scope: ['public']
		});
	}
	// method called when authentification succeeded
	async validate(token: string, refreshToken: string) {
		console.log("VALIDATE");
		return ({token, refreshToken});
	}
}
