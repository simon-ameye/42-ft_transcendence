import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GameService } from './game.service';
import { MatchingQueueInterface, PlayerInterface, CheckWinnerInterface } from './interfaces';
import { UserService } from '../user/user.service';
import { GameInterface } from './interfaces/game.interface';

@WebSocketGateway(4343, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  }
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
  constructor(
    private prismaService: PrismaService,
    private gameService: GameService,
    private userService: UserService
  ) { }

  @WebSocketServer() server: Server;

  users: number = 0;

  onModuleInit() {
    this.server.on('connection', async (socket) => {
      console.log({ "socket.id": socket.id });
      console.log('connected');
    });
  }

  async handleConnection() {
    this.users++;
    this.server.emit('users', this.users);
  }

  async handleDisconnect() {
    this.users--;
    this.server.emit('users', this.users);
  }

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
      this.startGameAuto({ SIdOne: client.id, SIdTwo: oppenentSId });
    }
  }

  @SubscribeMessage('invitation')
  async invitSocket(client, receiverName: string): Promise<void> {
    const receiverSId = await this.userService.getSIdByName(receiverName);
    const clientName = await this.userService.getNameBySId(client.id);
    this.server.to(receiverSId).emit('send invitation', clientName);
  }

  @SubscribeMessage('invitation accepted')
  async acceptInvit(client, senderDName: string): Promise<void> {
    const senderSId = await this.userService.getSIdByName(senderDName);
    const gameRoom = await this.gameService.startGame(
      { "one": client.id, "two": senderSId });
    client.join(gameRoom);
    this.server.to(senderSId).emit('invitation accepted sender',
      { "gameRoom": gameRoom, "oppenentSId": client.id });
    const clientDName = await this.userService.getNameBySId(client.id);
    this.server.emit('deleteOppenents',
      { "one": clientDName, "two": senderDName });
  }

  @SubscribeMessage('invitation accepted sender')
  async acceptInvitSender(client, data: { gameRoom: string, oppenentSId: string }): Promise<void> {
    client.join(data.gameRoom);
    const playerSIds = [client.id, data.oppenentSId];
    const players = await this.gameService.getPlayersBySIds(playerSIds);
    this.server.to(data.gameRoom).emit('game started', players);
    this.server.emit('update game list', players);
  }

  @SubscribeMessage('add point')
  async addPoint(client, player: PlayerInterface): Promise<void> {
    const gameRoom = await this.gameService.updateScoreBySId(client.id, +1);
    player.score += 1;
    this.server.to(gameRoom).emit('update score', player);
    const data: CheckWinnerInterface = await this.gameService.isWinner(gameRoom);
    if (data.gameId) {
      const versus = await this.gameService.getStrGameByGameId(data.gameId);
      this.gameService.deleteGame(data.gameId);
      this.gameService.addVictory(data.winnerId);
      this.server.to(gameRoom).emit('game finished', data.winnerId);
      this.server.emit('game over', versus);
    }
    else
      this.kickoff(gameRoom);
  }

  @SubscribeMessage('watch game')
  async watchGame(client, playerIds: string[]): Promise<void> {
    const players = await this.gameService.getPlayersBySIds(playerIds);
    const gameRoom = "game".concat(String(players[0].gameId));
    client.join(gameRoom);
    this.server.to(client.id).emit('game started', players);
  }

  @SubscribeMessage('is playing')
  async isPlaying(client): Promise<void> {
    const playing = await this.gameService.isPlayingBySId(client.id);
    this.server.to(client.id).emit('is playing', playing);
  }

  @SubscribeMessage('get players')
  async GetPlayers(client): Promise<void> {
    const players = await this.gameService.getPlayerByOneSId(client.id);
    const gameRoom = "game".concat(String(players[0].gameId));
    client.join(gameRoom);
    this.server.to(client.id).emit('game started', players);
  }

  @SubscribeMessage('arrow up')
  async ArrowUp(client, oppenentName: string): Promise<void> {
    //const	oppenentSId = await this.userService.getSIdByName(oppenentName);
    //this.server.to(oppenentSId).emit('arrow up');

    const user = await this.prismaService.user.findUnique({ where: { socketId: client.id } })

    let newpaddleY: number = (await user).paddleY - 0.05;
    if (newpaddleY > 1)
      newpaddleY = 1;

    const updateUser = await this.prismaService.user.update({
      where: { socketId: client.id, },
      data: { paddleY: newpaddleY, },
    })
    console.log((await user).paddleY);
  }

  @SubscribeMessage('arrow down')
  async ArrowDown(client, oppenentName: string): Promise<void> {
    //const oppenentSId = await this.userService.getSIdByName(oppenentName);
    //this.server.to(oppenentSId).emit('arrow down');

    const user = await this.prismaService.user.findUnique({ where: { socketId: client.id } })

    let newpaddleY: number = (await user).paddleY + 0.05;
    if (newpaddleY < 0)
      newpaddleY = 0;

    const updateUser = await this.prismaService.user.update({
      where: { socketId: client.id, },
      data: { paddleY: newpaddleY, },
    })
    console.log((await user).paddleY);
  }

  async startGameAuto(data: { SIdOne: string, SIdTwo: string }): Promise<void> {
    this.server.to(data.SIdOne).emit('game started auto');
    this.server.to(data.SIdTwo).emit('game started auto');
    const pOneDName = await this.userService.getNameBySId(data.SIdOne);
    const pTwoDName = await this.userService.getNameBySId(data.SIdTwo);
    const gameRoom = await this.gameService.startGame(
      { "one": data.SIdOne, "two": data.SIdTwo });
    this.server.emit('deleteOppenents',
      { "one": pOneDName, "two": pTwoDName });
    const players = await this.gameService.getPlayerByOneSId(data.SIdOne);
    this.server.emit('update game list', players);
    this.server.to(data.SIdOne).emit('game started', players);
    this.server.to(data.SIdTwo).emit('game started', players);
    this.server.to(data.SIdOne).emit('join room', gameRoom);
    this.server.to(data.SIdTwo).emit('join room', gameRoom);
    this.kickoff(gameRoom);

    let p1Id = (await this.prismaService.user.findUnique({ where: { socketId: data.SIdOne } })).id;
    let p2Id = (await this.prismaService.user.findUnique({ where: { socketId: data.SIdTwo } })).id;

    this.gameProcess(gameRoom, p1Id, p2Id);
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

  async gameProcess(gameRoom: string, p1Id: number, p2Id: number) {
    console.log('my game is starting 0');

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
    };

    let ball_dx: number = 0.015;
    let ball_dy: number = 0.01;

    //let paddle_height = 0.2;


    while (1) {


      //console.log('gane room : ', gameRoom);
      p1 = this.prismaService.user.findUnique({ where: { id: p1Id } });
      p2 = this.prismaService.user.findUnique({ where: { id: p2Id } });

      //FOR DEV
      let user1gameId = (await p1).gameId;
      let user1games = this.prismaService.game.findMany({ where: { id: user1gameId } });
      if (!(await user1games).length)
        return;
      //FOR DEV

      gi.p1Y = (await p1).paddleY;
      gi.p2Y = (await p2).paddleY;

      gi.ballX += ball_dx;
      gi.ballY += ball_dy;

      if (gi.ballY >= 1 || gi.ballY <= 0) {
        ball_dy = -ball_dy
        ball_dx *= 1.05;
      }

      if (gi.ballX <= 0.0) {
        if (Math.abs(gi.ballY - gi.p1Y) < gi.paddleHeight / 2) {
          ball_dx = - ball_dx;
        }
        else {
          console.log('player2 wins');
          gi.ballX = 0.5;
          gi.ballY = 0.5;
          ball_dx = 0.015;
          ball_dy = 0.01;
          //return;
        }
      }

      console.log('gi.ballX   ', gi.ballX);
      if (gi.ballX >= 1.0) {
        if (Math.abs(gi.ballY - gi.p2Y) < gi.paddleHeight / 2) {
          ball_dx = - ball_dx;
        }
        else {
          console.log('player1 wins');
          gi.ballX = 0.5;
          gi.ballY = 0.5;
          ball_dx = 0.015;
          ball_dy = 0.01;
          //return;
        }
      }
      await this.delay(50); //in ms
      this.server.to(gameRoom).emit('gameInterface', gi);
    }
  }
}
