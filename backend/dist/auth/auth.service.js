"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require(".prisma/client");
const argon = require("argon2");
const operators_1 = require("rxjs/operators");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
let AuthService = class AuthService {
    constructor(prismaService, httpService, jwtService, configService) {
        this.prismaService = prismaService;
        this.httpService = httpService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async logUser42(token) {
        const authStr = 'Bearer '.concat(token);
        try {
            const res = await (0, rxjs_1.firstValueFrom)(this.httpService.get('https://api.intra.42.fr/v2/me', {
                headers: { Authorization: authStr }
            }).pipe((0, operators_1.map)(response => response.data)));
            var user = await this.prismaService.user.findUnique({
                where: {
                    email: res.email,
                },
            });
            if (!user) {
                user = await this.prismaService.user.create({
                    data: {
                        email: String(res.email),
                        firstName: String(res.first_name),
                        lastName: String(res.last_name),
                        imageUrl: String(res.image_url)
                    }
                });
            }
            return (this.signToken(user));
        }
        catch (e) {
            return (e.message);
        }
    }
    async signup(dto) {
        const hash = await argon.hash(dto.password);
        try {
            const user = await this.prismaService.user.create({
                data: {
                    email: dto.email,
                    hash,
                },
            });
            delete user.hash;
            return (this.signToken(user));
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (e.code == "P2002") {
                    throw new common_1.ForbiddenException('Credentials taken');
                }
                throw e;
            }
        }
    }
    async signin(dto) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: dto.email,
            },
        });
        if (!user) {
            throw new common_1.ForbiddenException('Credentials incorrect');
        }
        const pwMatch = await argon.verify(user.hash, dto.password);
        if (!pwMatch) {
            throw new common_1.ForbiddenException('Credentials incorrect');
        }
        ;
        delete user.hash;
        return (this.signToken(user));
    }
    async signup2FA(email) {
        const secret = speakeasy.generateSecret();
        try {
            const user = await this.prismaService.user.create({
                data: {
                    email,
                    googleSecret: String(secret.base32)
                },
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.ForbiddenException('Credentials taken');
                }
            }
            throw (error);
        }
        return (qrcode.toDataURL(secret.otpauth_url));
    }
    async verify2FA(payload) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: payload.email,
            },
        });
        if (!user)
            throw new common_1.ForbiddenException('Credentials invalid');
        const verify = speakeasy.totp.verify({
            secret: user.googleSecret,
            encoding: 'base32',
            token: payload.code
        });
        if (verify)
            return (this.signToken(user));
        throw new common_1.ForbiddenException('Credentials invalid');
    }
    async signToken(user) {
        const data = {
            id: user.id,
            email: user.email
        };
        const token = await this.jwtService.signAsync(data, {
            secret: this.configService.get('JWT_SECRET')
        });
        return ({ access_token: token });
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        axios_1.HttpService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map