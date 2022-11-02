import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import { Prisma } from ".prisma/client";
import * as argon from 'argon2'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  // signup fucntion with 42API
  async signupAPI() {

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
  signin() {
    return 'I am sign in';
  }
}