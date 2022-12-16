import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { OppenentsInterface, PlayerInterface, CheckWinnerInterface } from './interfaces';

@Injectable()
export class GameService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService
  ) { }

  async getQueue(): Promise<string[]> {
    const queue = await this.prismaService.matching.findMany();
    const len = queue.length;
    let users: string[] = new Array(len);
    for (let i = 0; i < len; ++i)
      users[i] = await this.userService.getNameById(queue[i].userId);
    return (users);
  }

  async getGameList(): Promise<string[]> {
    const games = await this.prismaService.game.findMany();
    const len = games.length;
    let versus: string[] = new Array(len);
    for (let i = 0; i < len; ++i) {
      let users = await this.prismaService.user.findMany({
        where: {
          gameId: games[i].id,
        },
        select: {
          displayName: true,
          side: true
        }
      });
      var names: string[];
      if (users[0].side == 0) {
        names = [users[0].displayName, users[1].displayName];
      }
      else {
        names = [users[1].displayName, users[0].displayName];
      }
      versus[i] = this.getStrGame(names);
    }
    return (versus);
  }

  async addClientToMatchingQueue(socketId: string): Promise<number> {
    const matchingUser = await this.prismaService.user.update({
      where: {
        socketId,
      },
      data: {
        matching: {
          create: {}
        }
      }
    });
    const queue = await this.prismaService.matching.findMany();
    if (queue.length > 1) {
      return (queue[0].userId);
    }
    return (0);
  }

  async startGame(oppenents: OppenentsInterface): Promise<string> {
    const playerOne = await this.prismaService.user.update({
      where: {
        socketId: oppenents.one
      },
      data: {
        inGame: true,
        side: 0,
        score: 0
      }
    });
    const playerTwo = await this.prismaService.user.update({
      where: {
        socketId: oppenents.two
      },
      data: {
        inGame: true,
        side: 1,
        score: 0,
      }
    });
    const deleteUsers = await this.prismaService.matching.deleteMany({
      where: {
        OR: [{ userId: playerOne.id }, { userId: playerTwo.id }],
      },
    });
    var game = await this.prismaService.game.create({ data: {} });
    game = await this.prismaService.game.update({
      where: {
        id: game.id
      },
      data: {
        players: {
          push: [
            playerOne.id,
            playerTwo.id
          ]
        }
      }
    });
    const updatedUsers = await this.prismaService.user.updateMany({
      where: {
        OR: [{ id: playerOne.id }, { id: playerTwo.id }]
      },
      data: {
        gameId: game.id
      }
    });
    const gameRoom = "game".concat(String(game.id));
    return (gameRoom);
  }

  async updateScoreBySId(SId: string, n: number): Promise<string> {
    const player = await this.prismaService.user.update({
      where: {
        socketId: SId,
      },
      data: {
        score: {
          increment: n
        },
      },
    });
    const gameRoom = "game".concat(String(player.gameId));
    return (gameRoom);
  }

  findOne(id: string) {
    const game = this.prismaService.game.findUnique({
      where: {
        id: Number(id)
      }
    });
    return ({ game });
  }

  getStrGame(usernames: string[]): string {
    let strGame = usernames[0].concat(" vs ");
    strGame = strGame.concat(usernames[1]);
    return (strGame);
  }

  async getStrGameByGameId(gameId: number): Promise<string> {
    const users = await this.prismaService.user.findMany({
      where: {
        gameId
      },
      select: {
        displayName: true,
        side: true
      }
    });
    var strGame;
    if (users[0].side == 0) {
      strGame = users[0].displayName.concat(" vs ");
      strGame = strGame.concat(users[1].displayName);
    }
    else {
      strGame = users[1].displayName.concat(" vs ");
      strGame = strGame.concat(users[0].displayName);
    }
    return (strGame);
  }

  async getPlayersBySIds(socketIds: string[]): Promise<PlayerInterface[]> {
    const users = await this.prismaService.user.findMany({
      where: {
        OR: [{ socketId: socketIds[0] }, { socketId: socketIds[1] }],
      },
      select: {
        id: true,
        displayName: true,
        score: true,
        gameId: true
      }
    });
    return (users);
  }

  async isPlayingBySId(SId: string): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: {
        socketId: SId
      },
      select: {
        inGame: true
      }
    });
    return (user.inGame);
  }

  async getPlayerByOneSId(SId: string): Promise<PlayerInterface[]> {
    const user = await this.prismaService.user.findUnique({
      where: {
        socketId: SId
      }
    });
    const game = await this.prismaService.game.findUnique({
      where: {
        id: user.gameId
      },
      select: {
        id: true
      }
    });
    const players = await this.prismaService.user.findMany({
      where: {
        gameId: game.id
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

  async isWinner(gameRoom: string): Promise<CheckWinnerInterface> {
    const splitter = gameRoom.split("game");
    const gameId: number = Number(splitter[1]);
    const players = await this.prismaService.user.findMany({
      where: {
        gameId
      },
      select: {
        id: true,
        displayName: true,
        score: true,
        gameId: true,
      }
    });
    for (let i = 0; i < 2; ++i) {
      if (players[i].score > 6) {
        return ({ gameId: gameId, winnerId: players[i].id });
      }
    }
    return ({ gameId: 0, winnerId: 0 });
  }

  async deleteGame(gameId: number): Promise<void> {
    const deleteGame = await this.prismaService.game.deleteMany({
      where: {
        id: gameId
      }
    });
		const updatedPlayers = await this.prismaService.user.updateMany({
			where: {
				gameId
			},
			data: {
				inGame: false,
				score: 0,
			}
		});
  }

  async addVictory(id: number): Promise<void> {
    const updatedUser = await this.prismaService.user.update({
      where: {
        id
      },
      data: {
        victories: {
          increment: +1
        }
      }
    });
  }

	async updateWatching(SId: string, gameId: number): Promise<number> {
		let watcher = await this.prismaService.user.findUnique({
			where: {
				socketId: SId,
			},
			select: {
				watching: true,
			}
		});
		const watching = watcher.watching;
		watcher = await this.prismaService.user.update({
			where: {
				socketId: SId
			},
			data: {
				watching: gameId,
			}
		});
		return (watching);
	}
}
