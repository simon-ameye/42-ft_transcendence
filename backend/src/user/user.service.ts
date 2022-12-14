import { Injectable } from '@nestjs/common';
import { userInfo } from 'os';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  
  async modifyName(dto: UserDto, modif: string) {
    if (!dto) {
      console.log("not expecred error");
    }
    const updateUser = await this.prisma.user.update({
      where: {
        id: dto.id,
      },
      data: {
        displayName: modif,
      },
    })
  }

	async modifySocketId(user: UserDto, socketId: string) {
    if (!user) {
      console.log("not expecred error");
    }
    const updateUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        socketId: socketId,
      },
    })
  }

  // create a function for searching a user by his token
  async upload(dto: UserDto, path: string) {
    if (!dto) {
      console.log("not expected error");
    }
    const updateUser = await this.prisma.user.update({
      where: {
        id: dto.id,
      },
      data: {
        imageUrl: path,
      },
    })
  }

	async getNameById(id: number): Promise<string> {
		const	user = await this.prisma.user.findUnique({
			where: {
				id
			}
		});
		return (user.displayName);
	}

	async getNameBySId(socketId: string): Promise<string> {
		const	user = await this.prisma.user.findUnique({
			where: {
				socketId
			}
		});
		return (user.displayName);
	}

	async	getSIdByName(displayName: string): Promise<string> {
		const user = await this.prisma.user.findUnique({
			where: {
				displayName
			},
			select: {
				socketId: true,
			}
		});
		return (user.socketId);
	}

	async getSIdById(id: number): Promise<string> {
		const user = await this.prisma.user.findUnique({
			where: {
				id
			},
			select: {
				socketId: true,
			}
		});
		return (user.socketId);
	}

	async getQrcode(dto: UserDto): Promise<string> {
		console.log("GETTING QRCODE");
		const user = await this.prisma.user.findUnique({
			where: {
				email: dto.email
			},
			select : {
				qrcode: true,
			}
		});
		return (user.qrcode);
	}
}
