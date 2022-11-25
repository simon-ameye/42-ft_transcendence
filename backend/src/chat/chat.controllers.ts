import { Body, Controller, Delete, Get, Post, UseGuards, Req, Query } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ChannelMode } from "@prisma/client";
import { GetUser } from "src/auth/decorators/get-user.decorator";
import { UserDto } from "src/auth/dto";
import { ChatService } from "./chat.service";

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}


  //L’utilisateur doit pouvoir créer des channels (salons de discussion) pouvant être
  //soit publics, privés, ou protégés par mot de passe.
  //L’utilisateur qui crée un nouveau channel devient automatiquement son owner
  //(propriétaire). Ceci, jusqu’à ce qu’il le quitte.
  //Ex: create a PUBLIC channel without password:
  //  POST : {name: 'my channel', mode: 'PUBLIC', password: '', otherUserId: ''}
  //Ex: create a PUBLIC channel with password:
  //  POST : {name: 'my channel', mode: 'PUBLIC', password: 'my password', otherUserId: ''}
  //Ex: create a DIRECT channel:
  //  POST : {name: '', mode: 'DIRECT', password: '', otherUserId: '3'}
  @UseGuards(AuthGuard('jwt'))
  @Post('createChannel')
  createChannel(@Body() body: {name: string, mode: ChannelMode, password: string, otherUserId: number},
  @GetUser() user: UserDto) {
    console.log('new channel creation request : ', body.name, body.mode, body.password);
    return (this.chatService.createChannel(user.id, body.name, body.mode, body.password, Number(body.otherUserId)));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('joinChannel')
  joinChannel(@Body() body: {channelId: number, password: string},
  @GetUser() user: UserDto) {
    return (this.chatService.joinChannel(user.id, Number(body.channelId), body.password));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('leaveChannel')
  leaveChannel(@Body() body: {channelId: number},
  @GetUser() user: UserDto) {
    return (this.chatService.leaveChannel(user.id, Number(body.channelId)));
  }

  //L’utilisateur doit pouvoir envoyer des direct messages à d’autres utilisateurs.
  //+channels
  @UseGuards(AuthGuard('jwt'))
  @Post('sendMessage')
  sendMessage(@Body() body: {channelId: number, text: string},
  @GetUser() user: UserDto) {
    return (this.chatService.sendMessage(user.id, Number(body.channelId), body.text));
  }

  //L’utilisateur doit pouvoir en bloquer d’autres. Ainsi, il ne verra plus les messages
  //envoyés par les comptes qu’il aura bloqués.
  @UseGuards(AuthGuard('jwt'))
  @Post('blockUser')
  blockUser(@Body() body: {blockedUserId: number},
  @GetUser() user: UserDto) {
    return (this.chatService.blockUser(user.id, Number(body.blockedUserId)));
  }

  //Le propriétaire du channel peut définir un mot de passe requis pour accéder
  //au channel, le modifier, et le retirer.
  @UseGuards(AuthGuard('jwt'))
  @Post('setChannelPassword')
  setChannelPassword(@Body() body: {channelId: number, newPassword: string},
  @GetUser() user: UserDto) {
    return (this.chatService.setChannelPassword(user.id, Number(body.channelId), body.newPassword));
  }

  //Le propriétaire du channel en est aussi un administrateur. Il peut donner le
  //rôle d’administrateur à d’autres utilisateurs.
  @UseGuards(AuthGuard('jwt'))
  @Post('makeUserAdmin')
  makeUserAdmin(@Body() body: {channelId: number, newAdminId: number},
  @GetUser() user: UserDto) {
    return (this.chatService.makeUserAdmin(user.id, Number(body.channelId), Number(body.newAdminId)));
  }

  //Les administrateurs du channel peuvent bannir ou mute d’autres utilisateurs
  //pendant une durée déterminée.
  @UseGuards(AuthGuard('jwt'))
  @Post('banUser')
  banUser(@Body() body: {channelId: number, banedId: number},
  @GetUser() user: UserDto) {
    return (this.chatService.banUser(user.id, Number(body.channelId), Number(body.banedId)));
  }

  //Les administrateurs du channel peuvent bannir ou mute d’autres utilisateurs
  //pendant une durée déterminée.
  @UseGuards(AuthGuard('jwt'))
  @Post('muteUser')
  muteUser(@Body() body: {channelId: number, muteId: number, minutes: number},
  @GetUser() user: UserDto) {
    return (this.chatService.muteUser(user.id, Number(body.channelId), Number(body.muteId), Number(body.minutes)));
  }

  //Grâce à l’interface de chat, l’utilisateur doit pouvoir en inviter d’autres à faire
  //une partie de Pong.
  @UseGuards(AuthGuard('jwt'))
  @Post('inviteToGame')
  inviteToGame() {
    return ("request threated");
  }

  //Grâce à l’interface de chat, l’utilisateur doit pouvoir accéder aux profils d’autres
  //joueurs.
  @UseGuards(AuthGuard('jwt'))
  @Post('accessUserProfile')
  accessUserProfile() {
    return ("request threated")
  }

  @Get('getPublicChannelTable')
  async getPublicChannelTable() {
    let { ids, names, isPrivates } = await this.chatService.getPublicChannelTable();
    console.log(ids, names, isPrivates);
    return { ids: ids, names: names, isPrivates: isPrivates };
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('getUserChannelTable')
  async getUserChannelTable(@GetUser() user: UserDto){
    let { ids, names, isPrivates } = await this.chatService.getUserChannelTable(user.id);
    console.log(ids, names, isPrivates);
    return { ids: ids, names: names, isPrivates: isPrivates };
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('sendAllChannelInterfaces')
  async sendAllChannelInterfaces(@GetUser() user: UserDto){
    return (this.chatService.sendAllChannelInterfaces());
  }
}
