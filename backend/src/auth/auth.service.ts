import { ConsoleLogger, ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto, Auth42Dto } from "./dto";
import { Prisma } from ".prisma/client";
import * as argon from 'argon2'
import { map } from "rxjs/operators";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService,
			private httpService: HttpService) {}

  async authUser(token: string): Promise<Auth42Dto> {
		const	authStr = 'Bearer '.concat(token);
		try {
			const res = await firstValueFrom(this.httpService.get(
				'https://api.intra.42.fr/v2/me',
				{
					headers: { Authorization: authStr }
				}).pipe( // pipe function with map response to convert circular struct
					map(response => response.data)));
			// convert res to a Auth42Dto
			return (res);
		} catch(e) {
			return (e.message);
		}
  }

  // signup function with email and password
  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      delete user.hash;
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
    console.log("signup done");
    return 'sign up';
  }

  async signin(dto: AuthDto) {
    // find user
    const user = await this.prisma.user.findFirst({
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
    return user;
  }
}
