import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto, Auth42Dto } from "./dto";
import { HttpService } from "@nestjs/axios";
export declare class AuthService {
    private prisma;
    private httpService;
    constructor(prisma: PrismaService, httpService: HttpService);
    authUser(token: string): Promise<Auth42Dto>;
    signup(dto: AuthDto): Promise<string>;
    signin(dto: AuthDto): Promise<import(".prisma/client").User>;
}
