/// <reference types="multer" />
import { UserService } from './user.service';
import { UserDto } from './dto';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    displayEmail(dto: UserDto): void;
    uploadSingle(file: Express.Multer.File, dto: UserDto): Promise<string>;
    displayImage(res: any): void;
}
