import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
export declare class AuthService {
    private prisma;
    constructor(prisma: PrismaService);
    loginAPI(): Promise<void>;
    signup(dto: AuthDto): Promise<string>;
    signin(dto: AuthDto): Promise<import(".prisma/client").User>;
}
