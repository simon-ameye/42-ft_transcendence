import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
export declare class AuthService {
    private prisma;
    constructor(prisma: PrismaService);
    signupAPI(): Promise<void>;
    signup(dto: AuthDto): Promise<string>;
    signin(): string;
}
