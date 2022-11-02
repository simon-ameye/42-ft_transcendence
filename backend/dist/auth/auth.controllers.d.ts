import { Request } from "express";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signup(dto: AuthDto): Promise<string>;
    signin(): string;
    signupAPI(request: Request): void;
}
