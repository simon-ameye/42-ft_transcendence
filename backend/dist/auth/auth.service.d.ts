import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto, UserDto } from "./dto";
import { HttpService } from "@nestjs/axios";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
export declare class AuthService {
    private prismaService;
    private httpService;
    private jwtService;
    private configService;
    constructor(prismaService: PrismaService, httpService: HttpService, jwtService: JwtService, configService: ConfigService);
    logUser42(token: string): Promise<{
        access_token: string;
    }>;
    signup(dto: AuthDto): Promise<{
        access_token: string;
    }>;
    signin(dto: AuthDto): Promise<{
        access_token: string;
    }>;
    signup2FA(email: string): Promise<string>;
    verify2FA(payload: {
        email: string;
        code: string;
    }): Promise<{
        access_token: string;
    }>;
    signToken(user: UserDto): Promise<{
        access_token: string;
    }>;
}
