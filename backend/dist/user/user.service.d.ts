import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    upload(dto: UserDto): Promise<void>;
}
