import { Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma/prisma.service";
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private prismaService;
    constructor(configService: ConfigService, prismaService: PrismaService);
    validate(payload: any): Promise<{
        payload: any;
    }>;
}
export {};
