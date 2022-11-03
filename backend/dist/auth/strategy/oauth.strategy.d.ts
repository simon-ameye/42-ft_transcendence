import { PrismaService } from "../../prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
declare const OAuthStrategy_base: new (...args: any[]) => import("passport-oauth2");
export declare class OAuthStrategy extends OAuthStrategy_base {
    private prismaService;
    private configService;
    constructor(prismaService: PrismaService, configService: ConfigService);
    validate(client_id: string, client_secret: string, profile: any): Promise<{
        client_id: string;
        client_secret: string;
        user: string;
    }>;
}
export {};
