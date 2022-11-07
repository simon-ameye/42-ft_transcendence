/// <reference types="multer" />
import { UserService } from './user.service';
import { UserDto } from './dto';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    uploadFileAndPassValidation(dto: UserDto, file?: Express.Multer.File): Promise<string>;
}
