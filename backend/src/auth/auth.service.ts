import { ConsoleLogger, ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import { Prisma } from ".prisma/client";
import * as argon from 'argon2'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  // login fucntion with 42API
  async loginAPI() {

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
