import { PrismaService } from "../../prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
declare const OAuthStrategy_base: new (...args: any[]) => import("passport-oauth2");
export declare class OAuthStrategy extends OAuthStrategy_base {
    private prismaService;
    private configService;
    constructor(prismaService: PrismaService, configService: ConfigService);
    validate(content: any): void;
}
export {};
