import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ChannelMode, User, Channel, Message } from ".prisma/client";
import { Prisma } from ".prisma/client";
import { ChannelInterface } from "./chat.interfaces"

import internal from "stream";

@Injectable()
export class ChatService {
	constructor(private prisma: PrismaService) {}

  async createChannel(userId : number, name : string, mode : ChannelMode, password : string)
  {
    var newowner = this.prisma.user.findUnique({ where: { id: userId } });
    if (!newowner)
      return ('User not found');

    var newChannel = await this.prisma.channel.create({
      data: {
        name: name,
        mode: mode,
        password: password,
        ownerId: (await newowner).id,
        userIds: (await newowner).id,
        adminIds: (await newowner).id,
      }
    });
    return ('New channel created');
  }

  async joinChannel(userId : number, channelId : number, password : string)
  {
    var channel = this.prisma.channel.findUnique({ where: { id: channelId } });
    if (!channel)
      return ('Channel not found');

    var user = this.prisma.user.findUnique({ where: { id: userId } });
    if (!user)
      return ('User not found');

    if ((await channel).mode == ChannelMode.DIRECT)
      return ('You cant join a DIRECT channel');

    if ((await channel).mode == ChannelMode.PRIVATE)
      return ('You cant join a PRIVATE channel');

    if ((await channel).mode == ChannelMode.PROTECTED && password != (await channel).password)
      return ('Channel is protected but you provided a wong password');

    (await channel).userIds.push(userId);
    return ('Channel joined');
  }

  async sendMessage(userId : number, channelId : number, text : string)
  {
    var channel = this.prisma.channel.findUnique({ where: { id: channelId } });
    if (!channel)
      return ('Channel not found');

    var user = this.prisma.user.findUnique({ where: { id: userId } });
    if (!user)
      return ('User not found');

    if (!(userId in (await channel).userIds))
      return ('User not in channel');

    var newMessage = await this.prisma.message.create({
      data: {
        text: text,
        author: (await user).displayName,
      }
    });

    (await channel).messageIds.push((await newMessage).id);

    //push all messages
    //for (var userId of (await channel).userIds)
    //{
    //  var user = this.prisma.user.findUnique({ where: { id: userId } });
    //  if (!user)
    //    return ('Critical message sending : channel user not found');
//
    //}
    return ('Message sent');
  }

  //return (this.chatService.setConnection(Number(userId), client.id));
  async setConnection(userId : number, socketId : string)
  {
    var user = this.prisma.user.findUnique({ where: { id: userId } });
    if (!user)
      return ('User not found');

    (await user).socketId = socketId;
    return ('User socketId is now set');
  }

  async getChannelInterfaces()
  {
    let channelInterfaces : ChannelInterface[];
    let channelInterface : ChannelInterface;

    let channels = await this.prisma.channel.findMany();
    channels.forEach(async (channel) => {

      let userIds = channel.userIds;
      userIds.forEach(async (userId) => {
        channelInterface.id = channel.id;
        channelInterface.name = channel.name;
        channelInterface.mode = channel.mode; //not sure
        var user = this.prisma.user.findUnique({ where: { id: userId } });
        channelInterface.userSocketId = (await user).socketId;

        let messageIds = channel.messageIds;
        messageIds.forEach(async (messageId) => {
          var message = this.prisma.message.findUnique({ where: { id: messageId } });
          channelInterface.messages.push((await message).text);
          channelInterface.authors.push((await message).author);
        })
        channelInterfaces.push(channelInterface);
      })
    })

    return (channelInterfaces);
  }
}
