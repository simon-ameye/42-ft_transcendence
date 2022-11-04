import { Request } from "express";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signup(dto: AuthDto): Promise<string>;
    signin(dto: AuthDto): Promise<import(".prisma/client").User>;
    loginAPI(request: Request): void;
    handleRedirect(query: {
        code: string;
        state: string;
    }, user: {
        token: string;
        refreshToken: string;
    }): Promise<import("./dto").Auth42Dto>;
    generate2FA(): Promise<void>;
}
