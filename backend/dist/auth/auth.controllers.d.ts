import { Request } from "express";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signup(dto: AuthDto): Promise<{
        access_token: string;
    }>;
    signin(dto: AuthDto): Promise<{
        access_token: string;
    }>;
    login42(request: Request): void;
    handleRedirect(query: {
        code: string;
        state: string;
    }, user: {
        token: string;
        refreshToken: string;
    }): Promise<{
        access_token: string;
    }>;
    generate2FA(): Promise<void>;
    verifyToken(body: {
        code: string;
    }): void;
}
