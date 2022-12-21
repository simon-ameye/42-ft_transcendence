import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GameService } from './game.service';
import { MatchingQueueInterface, PlayerInterface, CheckWinnerInterface } from './interfaces';
import { UserService } from '../user/user.service';
import { GameInterface } from './interfaces/game.interface';
import { Status } from ".prisma/client";


@WebSocketGateway(4343, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  }
})
export class GameGateway {
  constructor(
    private prismaService: PrismaService,
    private gameService: GameService,
    private userService: UserService,
  ) { }

  @WebSocketServer() server: Server;

  @SubscribeMessage('hello')
  hello(client) {
    this.server.to(client.id).emit('heyo');
  }

  @SubscribeMessage('join matching queue')
  async addToQueue(client): Promise<void> {
    const displayName = await this.userService.getNameBySId(client.id);
    this.server.emit('join matching queue', displayName);
    const userId = await this.gameService.addClientToMatchingQueue(client.id);
    if (userId) {
      const oppenentSId = await this.userService.getSIdById(userId);
      this.startGame({ SIdOne: client.id, SIdTwo: oppenentSId });
    }
  }

  @SubscribeMessage('send invitation')
  async invitSocket(client, receiverName: string): Promise<void> {
		const userAvailable = await this.gameService.isUserAvailable(receiverName);
		if (userAvailable > 0) {
			this.server.to(client.id).emit('cannot invit', { why: userAvailable, name: receiverName });
		} else {
	    const clientName = await this.userService.getNameBySId(client.id);
			if (clientName != receiverName) {
		    const receiverSId = await this.userService.getSIdByName(receiverName);
		    this.server.to(receiverSId).emit('received invitation', clientName);
			}
		}
  }

  @SubscribeMessage('invitation accepted')
  async acceptInvit(client, senderName: string): Promise<void> {
		const userAvailable = await this.gameService.isUserAvailable(senderName);
		if (userAvailable > 0) {
			this.server.to(client.id).emit('cannot invit', { why: userAvailable, name: senderName });
		} else {
			const senderSId = await this.userService.getSIdByName(senderName);
	    this.startGame({SIdOne: client.id, SIdTwo: senderSId});
		}
  }

  @SubscribeMessage('watch game')
  async watchGame(client, playerNames: string[]): Promise<void> {
    const players = await this.userService.getPlayersByNames(playerNames);
    const gameRoom = "game".concat(String(players[0].gameId));
    const watching = await this.gameService.updateWatching(client.id, players[0].gameId);
		if (watching)
    	client.leave("game".concat(String(watching)));
		client.join(gameRoom);
  }

  @SubscribeMessage('arrow up')
  async ArrowUp(client): Promise<void> {
    const user = await this.prismaService.user.findUnique({ where: { socketId: client.id } })

    let newpaddleY: number = (await user).paddleY - 0.05;
    if (newpaddleY <= 0)
      newpaddleY = 0;

    const updateUser = await this.prismaService.user.update({
      where: { socketId: client.id, },
      data: { paddleY: newpaddleY, },
    })
  }

  @SubscribeMessage('arrow down')
  async ArrowDown(client): Promise<void> {
    const user = await this.prismaService.user.findUnique({ where: { socketId: client.id } })

    let newpaddleY: number = (await user).paddleY + 0.05;
    if (newpaddleY >= 1)
      newpaddleY = 1;

    const updateUser = await this.prismaService.user.update({
      where: { socketId: client.id, },
      data: { paddleY: newpaddleY, },
    })
  }

  @SubscribeMessage('powerUp')
  async powerUp(client): Promise<void> {
    const user = await this.prismaService.user.findUnique({ where: { socketId: client.id } })

    const updateGames = await this.prismaService.game.updateMany({
      where: { players: { has: user.id }, },
      data: { powerUp: true, },
    })
  }

  async startGame(data: { SIdOne: string, SIdTwo: string }): Promise<void> {
    this.server.to(data.SIdOne).emit('start game');
    this.server.to(data.SIdTwo).emit('start game');
    const pOneDName = await this.userService.getNameBySId(data.SIdOne);
    const pTwoDName = await this.userService.getNameBySId(data.SIdTwo);
    const gameRoom = await this.gameService.startGame(
      { "one": data.SIdOne, "two": data.SIdTwo });
    this.server.emit('deleteOppenents',
      { "one": pOneDName, "two": pTwoDName });
    const players = await this.gameService.getPlayerByOneSId(data.SIdOne);
    this.server.emit('update game list', players);
    //this.server.to(data.SIdOne).emit('game started', players);
    //this.server.to(data.SIdTwo).emit('game started', players);
    this.server.to(data.SIdOne).emit('join room', gameRoom);
    this.server.to(data.SIdTwo).emit('join room', gameRoom);
    this.kickoff(gameRoom);

    let p1Id = (await this.prismaService.user.findUnique({ where: { socketId: data.SIdOne } })).id;
    let p2Id = (await this.prismaService.user.findUnique({ where: { socketId: data.SIdTwo } })).id;
    let game = this.prismaService.game.findFirst({ where: { AND: [{ players: { has: p1Id } }, { players: { has: p2Id } }] } });
    if (!(await game))
    {
      return;
    }
    await this.prismaService.user.update({ where: { id: p1Id }, data: { status: Status.PLAYING } });
    await this.prismaService.user.update({ where: { id: p2Id }, data: { status: Status.PLAYING } });

    await this.gameProcess(gameRoom, p1Id, p2Id, (await game).id);

    await this.prismaService.user.update({ where: { id: p1Id }, data: { status: Status.ONLINE } });
    await this.prismaService.user.update({ where: { id: p2Id }, data: { status: Status.ONLINE } });
  }

  delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  async kickoff(gameRoom: string) {
    await this.delay(500);
    this.server.to(gameRoom).emit('kick-off');
  }

  @SubscribeMessage('join room')
  joinRoom(client, room: string): void {
    client.join(room);
  }

  async initGameInterface(p1Id: number, p2Id: number): Promise<GameInterface> {
    let p1 = this.prismaService.user.findUnique({ where: { id: p1Id } });
    let p2 = this.prismaService.user.findUnique({ where: { id: p2Id } });
    let gi: GameInterface = {
      ballX: 0.5,
      ballY: 0.5,
      p1Y: (await p1).paddleY,
      p2Y: (await p2).paddleY,
      paddleHeight: 0.2,
      p1Name: (await p1).displayName,
      p2Name: (await p2).displayName,
      viewerNames: [],
      p1score: 0,
      p2score: 0,
      winner: 0,
      paddleOffcet: 0.1,
      paddleThickness: 0.02,
      ballRadius: 0.02,
      powerUp: false,
    };
    return gi;
  }

  async getPaddlePositions(gi: GameInterface, p1Id: number, p2Id: number): Promise<GameInterface> {
    let p1 = this.prismaService.user.findUnique({ where: { id: p1Id } });
    let p2 = this.prismaService.user.findUnique({ where: { id: p2Id } });
    gi.p1Y = (await p1).paddleY;
    gi.p2Y = (await p2).paddleY;
    return (gi);
  }

  async finishGame(gameRoom: string, p1Id: number, p2Id: number, winner: number) {
    let p1 = this.prismaService.user.findUnique({ where: { id: p1Id } });
    let gameId = (await p1).gameId;

    const versus = await this.gameService.getStrGameByGameId(gameId);
    this.gameService.deleteGame(gameId);

    let winnerId = 0;
    if (winner == 1)
      winnerId = p1Id;
    if (winner == 2)
      winnerId = p2Id;

    this.gameService.addVictory(winnerId);
    this.server.to(gameRoom).emit('game finished', winnerId);
    this.server.emit('game over', versus);
  }

  async gameProcess(gameRoom: string, p1Id: number, p2Id: number, gameId: number) {
    let gi = await this.initGameInterface(p1Id, p2Id);

    let ball_dx: number = 0.015;
    let ball_dy: number = 0.01;
    let paddleMissed = 0;

    while (1) {

      gi = await this.getPaddlePositions(gi, p1Id, p2Id);

      gi.ballX += ball_dx;
      gi.ballY += ball_dy;

      if (gi.ballY + gi.ballRadius >= 1 || gi.ballY - gi.ballRadius <= 0) {
        ball_dy = -ball_dy
      }

      if (paddleMissed == 0) {
        if (gi.ballX + gi.ballRadius >= (1 - gi.paddleOffcet)) {
          if (Math.abs(gi.ballY - gi.p2Y) <= gi.paddleHeight / 2) {
            ball_dx = -ball_dx;
            if (gi.powerUp)
              ball_dx *= 1.5;
          }
          else
            paddleMissed = 1;
        }
        else if (gi.ballX - gi.ballRadius <= gi.paddleOffcet) {
          if (Math.abs(gi.ballY - gi.p1Y) <= gi.paddleHeight / 2) {
            ball_dx = -ball_dx;
            if (gi.powerUp)
              ball_dx *= 1.5;
          }
          else
            paddleMissed = 1;
        }
      }

      if (gi.ballX <= 0 || gi.ballX >= 1) {
        if (gi.ballX <= 0) {
          gi.p2score++;
        }
        if (gi.ballX >= 0) {
          gi.p1score++;
        }
        gi.ballX = 0.5;
        gi.ballY = 0.5;
        ball_dx = 0.015;
        ball_dy = 0.01;
        paddleMissed = 0;
        var game = this.prismaService.game.findUnique({ where: { id: gameId } });
        if (!await game) {
          console.log('Game process: it seems that the game has been deleted');
          this.finishGame(gameRoom, p1Id, p2Id, 1); //if the game is deleted, 1 is winner
          return;
        }
        gi.powerUp = (await game).powerUp;
      }

      this.server.to(gameRoom).emit('gameInterface', gi);
      await this.delay(30); //in ms

      if (gi.p1score >= 10)
        gi.winner = 1;

      if (gi.p2score >= 10)
        gi.winner = 2;

      if (gi.winner) {
        this.finishGame(gameRoom, p1Id, p2Id, gi.winner);
        return;
      }
    }
  }
}
