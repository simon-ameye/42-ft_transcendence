import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ChannelMode, User, Channel, Message } from ".prisma/client";
import { ChannelInterface } from "./chat.interfaces"

@Injectable()
export class ChatService {
  constructor(
    private eventEmitter: EventEmitter2,
    private prisma: PrismaService,
  ) {}

  async createChannel(userId : number, name : string, mode : ChannelMode, password : string)
  {
    var newowner = this.prisma.user.findUnique({ where: { id: userId } });
    if (!await newowner)
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

    if (!await channel)
      return ('Channel not found');

    var user = this.prisma.user.findUnique({ where: { id: userId } });
    if (!await user)
      return ('User not found');

    if ((await channel).mode == ChannelMode.DIRECT)
      return ('You cant join a DIRECT channel');

    if ((await channel).mode == ChannelMode.PRIVATE)
      return ('You cant join a PRIVATE channel');

    if ((await channel).mode == ChannelMode.PROTECTED && password != (await channel).password)
      return ('Channel is protected but you provided a wong password');

    const channelUpdate = await this.prisma.channel.update({
      where: { id: channelId, },
      data: { userIds : { push: userId, }, }, })

      return ('Channel joined');
    }

  async sendMessage(userId : number, channelId : number, text : string)
  {
    var channel = this.prisma.channel.findUnique({ where: { id: channelId } });
    if (!channel)
      return ('Channel not found');

    var user = this.prisma.user.findUnique({ where: { id: userId } });
    if (!await user)
      return ('User not found');

    if (!(userId in (await channel).userIds)) //BUGGING
      return ('User not in channel');

    var newMessage = await this.prisma.message.create({
      data: {
        text: text,
        author: (await user).displayName,
      }
    });

    const updateChannel = await this.prisma.channel.update({
      where: { id: channelId, },
      data: { messageIds : { push: (await newMessage).id, }, }, })

    this.eventEmitter.emit('flushAllChannels');
    return ('Message sent');
  }

  async setConnection(userId : number, socketId : string)
  {
    const user = await this.prisma.user.update({
      where: { id: userId, },
      data: { socketId : socketId, }, })
    return ('User socketId is now set');
  }

  async getChannelInterfaces(): Promise<ChannelInterface[]>
  {
    let channelInterfaces : ChannelInterface[] = [];

    let channels = await this.prisma.channel.findMany();
    for (let channel of channels)
    {
      let userIds = channel.userIds;
      for (let userId of userIds)
      {
        let channelInterface : ChannelInterface = {
          id: 0,
          name: '',
          mode: '',
          messages: [],
          authors: [],
          userSocketId: '',
        };
        channelInterface.id = channel.id;
        channelInterface.name = channel.name;
        channelInterface.mode = channel.mode; //not sure
        var user = this.prisma.user.findUnique({ where: { id: userId } });
        channelInterface.userSocketId = (await user).socketId;

        let messageIds = channel.messageIds;
        for (let messageId of messageIds)
        {
          var message = this.prisma.message.findUnique({ where: { id: messageId } });
          //if (!await message)
            //return (channelInterfaces);
          channelInterface.messages.push((await message).text);
          channelInterface.authors.push((await message).author);
        }
        channelInterfaces.push(channelInterface);
      }
    }
    return (channelInterfaces);

  }
}
