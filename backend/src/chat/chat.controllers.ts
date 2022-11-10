import { Body, Controller, Delete, Get, Post, UseGuards, Req, Query } from "@nestjs/common";
import { ChatService } from "./chat.service";

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  /*
  @Post('createChannel')
  createChannel(@Body() body: {id : stringemail: string, code: string}) {
    //L’utilisateur doit pouvoir créer des channels (salons de discussion) pouvant être
    //soit publics, privés, ou protégés par mot de passe.
    //L’utilisateur qui crée un nouveau channel devient automatiquement son owner
    //(propriétaire). Ceci, jusqu’à ce qu’il le quitte.
    //return (this.chatService.createChannel());
  }
  */

  @Post('sendMessage')
  sendMessage() {
    //L’utilisateur doit pouvoir envoyer des direct messages à d’autres utilisateurs.
    //+channels
  }

  @Post('blockUser')
  blockUser() {
    //L’utilisateur doit pouvoir en bloquer d’autres. Ainsi, il ne verra plus les messages
    //envoyés par les comptes qu’il aura bloqués.
    return ("request threated")
  }

  @Post('setChannelPassword')
  setChannelPassword() {
    //Le propriétaire du channel peut définir un mot de passe requis pour accéder
    //au channel, le modifier, et le retirer.
    return ("request threated")
  }

  @Post('makeUserAdmin')
  makeUserAdmin() {
    //Le propriétaire du channel en est aussi un administrateur. Il peut donner le
    //rôle d’administrateur à d’autres utilisateurs.
    return ("request threated")
  }

  @Post('muteUser')
  muteUser() {
    //Les administrateurs du channel peuvent bannir ou mute d’autres utilisateurs
    //pendant une durée déterminée.
    return ("request threated")
  }

  @Post('inviteToGame')
  inviteToGame() {
    //Grâce à l’interface de chat, l’utilisateur doit pouvoir en inviter d’autres à faire
    //une partie de Pong.
    return ("request threated")
  }

  @Post('accessUserProfile')
  accessUserProfile() {
    //Grâce à l’interface de chat, l’utilisateur doit pouvoir accéder aux profils d’autres
    //joueurs.
    return ("request threated")
  }
}
