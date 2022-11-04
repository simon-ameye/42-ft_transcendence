import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import { HttpService } from "@nestjs/axios";
export declare class AuthService {
    private prisma;
    private httpService;
    constructor(prisma: PrismaService, httpService: HttpService);
    authUser(token: string): Promise<any>;
    signup(dto: AuthDto): Promise<string>;
    signin(dto: AuthDto): Promise<import(".prisma/client").User>;
}
