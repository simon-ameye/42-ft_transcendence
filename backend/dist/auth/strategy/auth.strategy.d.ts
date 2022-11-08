import { AuthService } from "../auth.service";
declare const OAuthStrategy_base: new (...args: any[]) => import("passport-oauth2");
export declare class OAuthStrategy extends OAuthStrategy_base {
    private authService;
    constructor(authService: AuthService);
}
export {};
