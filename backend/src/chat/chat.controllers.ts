import { Body, Controller, Delete, Get, Post, UseGuards, Req, Query } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ChannelMode } from "@prisma/client";
import { Channel } from "diagnostics_channel";
import { GetUser } from "src/auth/decorator/get-user.decorator";
import { UserDto } from "src/auth/dto";
import { ChatService } from "./chat.service";

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}


  //L’utilisateur doit pouvoir créer des channels (salons de discussion) pouvant être
  //soit publics, privés, ou protégés par mot de passe.
  //L’utilisateur qui crée un nouveau channel devient automatiquement son owner
  //(propriétaire). Ceci, jusqu’à ce qu’il le quitte.
  @Post('createChannel')
  createChannel(@Body() body: {userId: number, name: string, mode: ChannelMode, password: string}, ) {
    return (this.chatService.createChannel(Number(body.userId), body.name, body.mode, body.password));
  }

  @Post('joinChannel')
  joinChannel(@Body() body: {userId: number, channelId: number, password: string}, ) {
    return (this.chatService.joinChannel(Number(body.userId), Number(body.channelId), body.password));
  }

  @Post('leaveChannel')
  leaveChannel(@Body() body: {userId: number, channelId: number}, ) {
    return (this.chatService.leaveChannel(Number(body.userId), Number(body.channelId)));
  }

  //L’utilisateur doit pouvoir envoyer des direct messages à d’autres utilisateurs.
  //+channels
  @Post('sendMessage')
  sendMessage(@Body() body: {userId: number, channelId: number, text: string}, ) {
    return (this.chatService.sendMessage(Number(body.userId), Number(body.channelId), body.text));
  }

  //L’utilisateur doit pouvoir en bloquer d’autres. Ainsi, il ne verra plus les messages
  //envoyés par les comptes qu’il aura bloqués.
  @Post('blockUser')
  blockUser(@Body() body: {userId: number, blockedUserId: number}) {
    return (this.chatService.blockUser(Number(body.userId), Number(body.blockedUserId)));
  }

  //Le propriétaire du channel peut définir un mot de passe requis pour accéder
  //au channel, le modifier, et le retirer.
  @Post('setChannelPassword')
  setChannelPassword(@Body() body: {userId: number, channelId: number, newPassword: string}) {
    return (this.chatService.setChannelPassword(Number(body.userId), Number(body.channelId), body.newPassword));
  }

  //Le propriétaire du channel en est aussi un administrateur. Il peut donner le
  //rôle d’administrateur à d’autres utilisateurs.
  @Post('makeUserAdmin')
  makeUserAdmin(@Body() body: {userId: number, channelId: number, newAdminId: number}) {
    return (this.chatService.makeUserAdmin(Number(body.userId), Number(body.channelId), Number(body.newAdminId)));
  }

  //Les administrateurs du channel peuvent bannir ou mute d’autres utilisateurs
  //pendant une durée déterminée.
  @Post('muteUser')
  muteUser() {
    return ("request threated");
  }

  //Grâce à l’interface de chat, l’utilisateur doit pouvoir en inviter d’autres à faire
  //une partie de Pong.
  @Post('inviteToGame')
  inviteToGame() {
    return ("request threated");
  }

  //Grâce à l’interface de chat, l’utilisateur doit pouvoir accéder aux profils d’autres
  //joueurs.
  @Post('accessUserProfile')
  accessUserProfile() {
    return ("request threated")
  }

  @Get('getChannelTable')
  async getChannelTable() {
    let { ids, names, isPrivates } = await this.chatService.getChannelTable();
    console.log(ids, names, isPrivates);
    return { ids: ids, names: names, isPrivates: isPrivates };
  }
}
