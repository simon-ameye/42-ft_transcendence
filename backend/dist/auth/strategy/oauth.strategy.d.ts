import { PrismaService } from "../../prisma/prisma.service";
declare const OAuthStrategy_base: new (...args: any[]) => import("passport-oauth2");
export declare class OAuthStrategy extends OAuthStrategy_base {
    private prismaService;
    constructor(prismaService: PrismaService);
    validate(content: any): void;
}
export {};
