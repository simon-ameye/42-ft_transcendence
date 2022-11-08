import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto, UserDto } from "./dto";
import { Prisma } from ".prisma/client";
import * as argon from 'argon2'
import { map } from "rxjs/operators";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as speakeasy from "speakeasy";
import * as qrcode from "qrcode";

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService,
			private httpService: HttpService,
			private jwtService: JwtService,
			private configService: ConfigService) {}

  async logUser42(token: string): Promise<{access_token: string}> {
		const	authStr = 'Bearer '.concat(token);
		try {
			const res = await firstValueFrom(this.httpService.get(
				'https://api.intra.42.fr/v2/me',
				{
					headers: { Authorization: authStr }
				}).pipe(map(response => response.data)));
			var user = await this.prismaService.user.findUnique({
				where: {
					email: res.email,
				},
			});
			if (!user) {
				user = await this.prismaService.user.create({
					data: {
						email: String(res.email),
						firstName: String(res.first_name),
						lastName: String(res.last_name),
						imageUrl: String(res.image_url)
					}
				});
			}
		return (this.signToken(user));
		} catch(e) {
			return (e.message);
		}
  }

  async signup(dto: AuthDto): Promise<{access_token: string}> {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prismaService.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      delete user.hash;
			return (this.signToken(user));
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

  async signin(dto: AuthDto): Promise<{access_token: string}> {
    // find user
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException(
        'Credentials incorrect',
      );
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
		return (this.signToken(user));
  }

	async	signup2FA(email: string): Promise<string> {
		const secret = speakeasy.generateSecret();
		try {
			const user = await this.prismaService.user.create({
				data: {
					email,
					googleSecret: String(secret.base32)
				},
			});
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					throw new ForbiddenException('Credentials taken');
				}
			}
			throw (error);
		}
		return (qrcode.toDataURL(secret.otpauth_url));
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
		if (verify)
			return (this.signToken(user))
		throw new ForbiddenException('Credentials invalid');
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
}
