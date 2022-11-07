import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    displayEmail(dto: UserDto): Promise<void>;
    upload(dto: UserDto, path: string): Promise<string>;
}
