import { ConfigService } from "@nestjs/config";
declare const OAuthStrategy_base: new (...args: any[]) => import("passport-oauth2");
export declare class OAuthStrategy extends OAuthStrategy_base {
    private configService;
    constructor(configService: ConfigService);
    validate(token: string, refreshToken: string): Promise<{
        token: string;
        refreshToken: string;
    }>;
}
export {};
