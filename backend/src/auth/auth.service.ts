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
import { AuthGateway } from './auth.gateway';
import { Status } from ".prisma/client";

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService,
			private httpService: HttpService,
			private jwtService: JwtService,
			private configService: ConfigService,
			private authGateway: AuthGateway
		) {}

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
						imageUrl: "uploads/default.png"
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
			response.status(202).cookie('displayName', user.displayName, { path: '/' });
			if (user.googleSecret) {
				return ("yes");
			}
			user = await this.prismaService.user.update({
				where: {
					id: user.id
				},
				data: {
					log: true
				}
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
		const jwtToken = await this.signJwtToken(user);
		response.status(202).cookie('jwtToken', jwtToken, { path: '/', httpOnly: true });
		response.status(202).cookie('login', "yes", { path: '/' });
		return ("no");
  }

  async signup(
			dto: AuthDto,
			@Res({ passthrough: true }) response: Response
		): Promise<void> {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prismaService.user.create({
        data: {
          email: dto.email,
          hash,
					displayName: dto.displayName,
					imageUrl: "uploads/default.png",
        },
      });
			const jwtToken = await this.signJwtToken(user);
			response.status(202).cookie('displayName', user.displayName, { path: '/' });
			response.status(202).cookie('jwtToken', jwtToken, { path: '/', httpOnly: true });
			response.status(202).cookie('login', "yes", { path: '/' });
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
		): Promise<string> {
    let user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });
		if (!user) {
			throw new HttpException({
				status: 461,
				error: 'Credentials invalided'
			}, 461);
		}
		if (user.log == true) {
			throw new HttpException({
				status: 460,
				error: 'User already log in'
			}, 460);
		}
		if (!user.hash) {
			throw new HttpException({
				status: 462,
				error: 'Use an other way to log in'
			}, 462);
		}
    const pwMatch = await argon.verify(
      user.hash,
      dto.password
    );
    if (!pwMatch) {
			throw new HttpException({
				status: 461,
				error: 'Credentials invalided'
			}, 461);
    };
		const jwtToken = await this.signJwtToken(user);
		response.status(202).cookie('displayName', user.displayName, { path: '/' });
		if (user.googleSecret) {
			return ("yes");
		}
		user = await this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				log: true
			}
		});
		response.status(202).cookie('jwtToken', jwtToken, { path: '/', httpOnly: true });
		response.status(202).cookie('login', "yes", { path: '/' });
		return ("no");
  }

	async	activate2FA(
			dto: UserDto,
			@Res({ passthrough: true }) response: Response
		): Promise<void> {
		const secret = speakeasy.generateSecret();
		const qrcodeURL = await qrcode.toDataURL(secret.otpauth_url);
		const user = await this.prismaService.user.update({
			where: {
				id: dto.id
			},
			data: {
				googleSecret: String(secret.base32),
			},
		});
		response.status(202).cookie('qrcode', qrcodeURL, { path: '/auth' });
	}

	async verify2FA(
			displayName: string,
			code: string,
			@Res({ passthrough: true }) response: Response
		): Promise<void> {
		const user = await this.prismaService.user.findUnique({
			where: {
				displayName
			},
		});
		if (!user) {
			throw new HttpException({
				status: 461,
				error: 'Credentials invalided'
			}, 461);
		}
		if (user && user.log == true) {
			throw new HttpException({
				status: 460,
				error: 'User already log in'
			}, 460);
		}
		if (!user.googleSecret) {
			throw new HttpException({
				status: 462,
				error: 'Use an other way to log in'
			}, 462);
		}
		const verify = speakeasy.totp.verify({
			secret: user.googleSecret,
			encoding: 'base32',
			token: code
		});
		if (!verify) {
			throw new HttpException({
				status: 461,
				error: 'Credentials invalided'
			}, 461);
		}
		const jwtToken = await this.signJwtToken(user);
		response.status(202).cookie('jwtToken', jwtToken, { path: '/', httpOnly: true });
		response.status(202).cookie('displayName', user.displayName, { path: '/' });
		response.status(202).cookie('login', "yes", { path: '/' });
		const updateUser = await this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				log: true
			}
		});
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

	async logout(
			dto: UserDto,
			@Res({ passthrough: true }) response: Response
		): Promise<void> {
		const user = await this.prismaService.user.findUnique({
			where: {
				id: dto.id,
			},
			select: {
				id: true,
				matching: true,
				watching: true,
				displayName: true
			}
		});
		if (user.matching) {
			const matching = await this.prismaService.matching.delete({
				where: {
					userId: user.id
				}
			});
			this.authGateway.removeUserFromMatching(user.displayName);
		}
		const updatedUser = await this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				log: false,
				inGame: false,
				watching: 0,
        status: Status.OFFLINE
			}
		});
		response.status(202).cookie('jwtToken', 'none', { path: '/', httpOnly: true, expires: new Date(Date.now())});
		response.status(202).cookie('displayName', 'none', { path: '/', expires: new Date(Date.now())});
		response.status(202).cookie('qrcode', 'none', { path: '/auth', expires: new Date(Date.now())});
		response.status(202).cookie('login', "yes", { path: '/', httpOnly: true, expires: new Date(Date.now())});
	}
}
