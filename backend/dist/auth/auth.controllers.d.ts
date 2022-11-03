import { Request } from "express";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { HttpService } from "@nestjs/axios";
export declare class AuthController {
    private authService;
    private httpService;
    constructor(authService: AuthService, httpService: HttpService);
    signup(dto: AuthDto): Promise<string>;
    signin(dto: AuthDto): Promise<import(".prisma/client").User>;
    loginAPI(request: Request): void;
    handleRedirect(query: {
        code: string;
        state: string;
    }, user: {
        client_id: string;
        client_secret: string;
    }): Promise<any>;
    handleReredirect(): {
        msg: string;
    };
}
