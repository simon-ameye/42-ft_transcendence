import { Injectable } from '@nestjs/common';
import { User, Status } from '@prisma/client';
import { table } from 'console';
import { userInfo } from 'os';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto';
import { PlayerInterface } from '../game/interfaces';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async getUsers(dto: UserDto) {
    const users = await this.prisma.user.findMany({
    });
    for (let user of users) {
      delete user['hash']
    }
    users.forEach((user, index) => {
      if (user.id == dto.id) users.splice(index, 1)
    })
    return users;
  }

  async getUserBySid(socketId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        socketId: socketId
      }
    })
    return user
  }

  async getUserById(id: number) {
    const user = await this.prisma.user.findFirst({
      where: {
        id
      }
    })
    return user
  }

  async pendingFriend(dto: UserDto) {
    const friends = await this.prisma.friends.findMany({
      where: {
        status: "pending",
        friend_id: dto.id,
      },
      include: {
        user: true,
      }
    })
    return friends
  }

  async friendsList(id: number) {
    const friends = await this.prisma.friends.findMany({
      where: {
        OR: [
          {
            user_id: id,
          },
          {
            friend_id: id,
          }
        ],
        status: "accepted",
      },
      select: {
        user: true,
        friend: true,
      }
    })

    let users: Array<User> = []

    friends.forEach(friend => {
      if (friend.user.id != id) {
        delete (friend.user['hash'])
        delete (friend.user['socketId'])
        users.push(friend.user)
      }
      else {
        delete (friend.friend['hash'])
        delete (friend.user['socketId'])
        users.push(friend.friend)
      }
    });

    return users;
  }

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

    await this.prisma.user.updateMany({
      where: {
        id: user.id,
        status: Status.OFFLINE,
      },
      data: {
        status: Status.ONLINE, //if status if offline only (not PLAYING)
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

  async getNameBySId(socketId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
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

	async getPlayersByNames(names: string[]): Promise<PlayerInterface[]> {
		const players = await this.prisma.user.findMany({
			where: {
				OR: [ {displayName: names[0] }, { displayName: names[1] }]
			},
			select: {
				id: true,
				displayName: true,
				score: true,
				gameId: true
			}
		});
		return (players);
	}

	async get2fa(displayName: string): Promise<string> {
		const user = await this.prisma.user.findUnique({
			where: {
				displayName
			},
			select: {
				googleSecret: true,
			}
		});
		if (user.googleSecret)
			return ("yes");
		return ("no");
	}
}
