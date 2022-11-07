import { UserService } from './user.service';
import { Request } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): string;
    findAll(): string;
    findOne(id: string, req: Request): string;
    update(id: string, updateUserDto: UpdateUserDto): string;
    remove(id: string): string;
}
