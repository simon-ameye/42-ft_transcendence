import { Request } from "express";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
export declare class AuthController {
    private authService;
    private httpService;
    private configService;
    constructor(authService: AuthService, httpService: HttpService, configService: ConfigService);
    signup(dto: AuthDto): Promise<string>;
    signin(dto: AuthDto): Promise<import(".prisma/client").User>;
    loginAPI(request: Request): void;
    handleRedirect(query: {
        code: string;
        state: string;
    }, user: {
        token: string;
        refreshToken: string;
    }): Promise<any>;
    handleReredirect(): {
        msg: string;
    };
}
