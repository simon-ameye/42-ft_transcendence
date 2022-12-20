import { ForbiddenException, Injectable, Res, HttpException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto, UserDto, SigninDto } from "./dto";
import { Prisma } from ".prisma/client";
import * as argon from 'argon2'
import { map } from "rxjs/operators";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as speakeasy from "speakeasy";
import * as qrcode from "qrcode";
import { Response } from 'express';
import { Status } from ".prisma/client";

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService,
			private httpService: HttpService,
			private jwtService: JwtService,
			private configService: ConfigService) {}

  async getIntraUser(
			token: string,
			@Res({ passthrough: true }) response: Response
		): Promise<string> {
		const	authStr = 'Bearer '.concat(token);
		try {
			const res = await firstValueFrom(this.httpService.get(
				'https://api.intra.42.fr/v2/me', {
					headers: {
						Authorization: authStr
					}
				}).pipe(map(response => response.data)));
			var user = await this.prismaService.user.findUnique({
				where: {
					email: res.email,
				},
			});
			if (user && user.log == true) {
				console.log('USER ALREADY LOG IN');
				throw new HttpException({
					status: 460,
					error: 'User already log in'
				}, 460);
			}
			else if (!user) {
				user = await this.prismaService.user.create({
					data: {
						email: String(res.email),
						displayName: String(res.login),
						imageUrl: String(res.image_url)
					}
				});
			//	const fs = require('fs');
			//	const fetch = require('node-fetch');

			//	const url = user.imageUrl;
  		//	const response = await fetch(url);
 			//	const buffer = await response.buffer();
			//	const image_url = `./uploads/` + user.id;
  		//	fs.writeFile(image_url, buffer, () =>
			//		console.log('finished downloading!'));
			//		const updateUser = await this.prismaService.user.update({
			//			where: {
			//				id: user.id,
			//			},
			//			data: {
			//				imageUrl: image_url,
			//			},
			//		})
				}
			const jwtToken = await this.signJwtToken(user);
			response.status(202).cookie('jwtToken', jwtToken, { path: '/', httpOnly: true });
			response.status(202).cookie('displayName', user.displayName, { path: '/' });
			const displayName = user.displayName;
			user = await this.prismaService.user.update({
				where: {
					id: user.id
				},
				data: {
					log: true
				}
			});
			return (displayName);
		} catch(e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code == "P2002") {
          throw new ForbiddenException(
            'Credentials taken',
          );
        }
			}
      throw e;
		}
  }

  async signup(
			dto: AuthDto,
			@Res({ passthrough: true }) response: Response
		): Promise<string> {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prismaService.user.create({
        data: {
          email: dto.email,
          hash,
					displayName: dto.displayName
        },
      });
      delete user.hash;
			const jwtToken = await this.signJwtToken(user);
			response.status(202).cookie('jwtToken', jwtToken, { path: '/', httpOnly: true });
			response.status(202).cookie('displayName', user.displayName, { path: '/' });
			return (user.displayName);
    } catch(e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code == "P2002") {
          throw new ForbiddenException(
            'Credentials taken',
          );
        }
        throw e;
      }
    }
  }

  async signin(
			dto: SigninDto,
			@Res({ passthrough: true }) response: Response
		): Promise<{access_token: string}> {
		let user;
    try {
    	user = await this.prismaService.user.findUnique({
    	  where: {
    	    email: dto.email,
    	  },
    	});
    } catch(e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code == "P2002") {
          throw new ForbiddenException(
            'Credentials taken',
          );
        }
      }
      throw e;
		}
    const pwMatch = await argon.verify(
      user.hash,
      dto.password
    );
    if (!pwMatch) {
      throw new ForbiddenException(
        'Credentials incorrect',
      )
    };
    delete user.hash;
		const jwtToken = await this.signJwtToken(user);
		response.status(202).cookie('jwtToken', jwtToken, { path: '/', httpOnly: true });
		response.status(202).cookie('displayName', user.displayName, { path: '/' });
		const displayName = user.displayName;
		user = await this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				log: true
			}
		});
		return (displayName);
  }

	async	signup2FA(
			data: {email: string, displayName: string},
			@Res({ passthrough: true }) response: Response
		): Promise<string> {
		const secret = speakeasy.generateSecret();
		const qrcodeURL = await qrcode.toDataURL(secret.otpauth_url);
		try {
			var user = await this.prismaService.user.create({
				data: {
					email: data.email,
					googleSecret: String(secret.base32),
					displayName: data.displayName,
					qrcode: qrcodeURL
				},
			});
			const jwtToken = await this.signJwtToken(user);
			response.status(202).cookie('jwtToken', jwtToken, { path: '/', httpOnly: true });
			response.status(202).cookie('qrcode', "yes", { path: '/' });
			response.status(202).cookie('displayName', user.displayName, { path: '/' });
			return (qrcodeURL);
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					throw new ForbiddenException('Credentials taken');
				}
			}
			throw (error);
		}
	}

	async verify2FA(payload: {email: string, code: string}) {
		const user = await this.prismaService.user.findUnique({
			where: {
				email: payload.email,
			},
		});
		if (!user)
				throw new ForbiddenException('Credentials invalid');
		const verify = speakeasy.totp.verify({
			secret: user.googleSecret,
			encoding: 'base32',
			token: payload.code
		});
		if (!verify)
			throw new ForbiddenException('Credentials invalid');
		return (this.signToken(user))
	}

	async signToken(user: UserDto): Promise<{access_token: string}> {
		const data = {
			id: user.id,
			email: user.email
		};
		const token = await this.jwtService.signAsync(data, {
				secret: this.configService.get('JWT_SECRET')
			}
		);
		return ({access_token: token});
	}

	async signJwtToken(user: UserDto): Promise<string> {
		const data = {
			id: user.id,
			email: user.email
		};
		const token = await this.jwtService.signAsync(data, {
				secret: this.configService.get('JWT_SECRET')
			}
		);
		return (token);
	}

	async logout(user: UserDto, @Res({ passthrough: true }) response: Response): Promise<void> {
		const updatedUser = await this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				log: false,
        status: Status.OFFLINE
			}
		});
		response.status(202).cookie('jwtToken', 'none', { path: '/', httpOnly: true, expires: new Date(Date.now())});
		response.status(202).cookie('displayName', 'none', { path: '/', expires: new Date(Date.now())});
	}
}
