import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ChannelMode } from ".prisma/client";

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

    if (name == '')
      return ('Channel name must not be blank');

    if (!(mode in ChannelMode))
      return ('Unknown channel mode');

    var channelsWithSameName = this.prisma.channel.findMany({ where: { name: name } });
    if ((await channelsWithSameName).length != 0)
      return ('Channel name already in use');

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

    if ((await channel).userIds.includes(userId))
      return ('You are already registered to this channel');

    if ((await channel).mode != ChannelMode.PUBLIC)
      return ('You can ONLY join a PUBLIC channel. PUBLIC channels may be protected by a pasword');

    if (password != (await channel).password)
      return ('Wong password');

    const channelUpdate = await this.prisma.channel.update({
      where: { id: channelId, },
      data: { userIds : { push: userId, }, }, })

    this.eventEmitter.emit('flushAllChannels');
    return ('Channel joined');
  }

  async leaveChannel(userId : number, channelId : number)
  {
    var channel = this.prisma.channel.findUnique({ where: { id: channelId } });
    if (!await channel)
      return ('Channel not found');

    var user = this.prisma.user.findUnique({ where: { id: userId } });
    if (!await user)
      return ('User not found');

    if (!(await channel).userIds.includes(userId))
      return ('You are not registered to this channel');

    const channelUpdate = await this.prisma.channel.update({
      where: { id: channelId, },
      data: {
        userIds   : {set: (await channel).userIds .filter((id) => id !== userId)},
        adminIds  : {set: (await channel).adminIds.filter((id) => id !== userId)},
        ownerId   : {set: (await channel).ownerId == userId ? 0 : (await channel).ownerId},
      },
    })

    this.eventEmitter.emit('flushAllChannels');
    return ('Channel left');
  }


  async sendMessage(userId : number, channelId : number, text : string)
  {
    var channel = this.prisma.channel.findUnique({ where: { id: channelId } });
    if (!await channel)
      return ('Channel not found');

    var user = this.prisma.user.findUnique({ where: { id: userId } });
    if (!await user)
      return ('User not found');

    if (!(await channel).userIds.includes(userId)) //BUGGING
      return ('User not in channel');

    var newMessage = await this.prisma.message.create({
      data: {
        text: text,
        authorId: userId,
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
    var userLookup = this.prisma.user.findUnique({ where: { id: userId } });
    if (!await userLookup)
      return ('User not found');

    const user = await this.prisma.user.update({
      where: { id: userId, },
      data: { socketId : socketId, }, })
    this.eventEmitter.emit('flushAllChannels');
    return ('User socketId is now set');
  }

  async blockUser(userId: number, blockedUserId: number)
  {
    var user = this.prisma.user.findUnique({ where: { id: userId } });
    if (!await user)
      return ('User not found');

    var blockedUser = this.prisma.user.findUnique({ where: { id: blockedUserId } });
    if (!await blockedUser)
      return ('User to block not found');

    if ((await user).blockedUserIds.includes(blockedUserId))
      return ('You already blocked this user');

    if (userId == blockedUserId)
      return ('You can not block yourself');

    const updateUser = await this.prisma.user.update({
      where: { id: userId, },
      data: { blockedUserIds : { push: blockedUserId, }, }, })

    this.eventEmitter.emit('flushAllChannels');
    return ('User is now blocked');
  }

  async setChannelPassword(userId: number, channelId: number , newPassword: string)
  {
    var user = this.prisma.user.findUnique({ where: { id: userId } });
    if (!await user)
      return ('User not found');

    var channel = this.prisma.channel.findUnique({ where: { id: channelId } });
    if (!channel)
      return ('Channel not found');

    if ((await channel).ownerId != userId)
      return ('You are not the owner of this channel.');

    const channelUpdate = await this.prisma.channel.update({
      where: { id: channelId, },
      data: { password : newPassword, }, })

    this.eventEmitter.emit('flushAllChannels');
    return ('Password modified');
  }

  async getChannelTable()
  {
    var ids         : number[]  = [];
    var names       : string[]  = [];
    var isPrivates  : boolean[] = [];

    let channels = await this.prisma.channel.findMany({ where: { mode: ChannelMode.PUBLIC },})
    for (let channel of channels)
    {
      ids         .push(channel.id);
      names       .push(channel.name);
      isPrivates  .push(channel.password != '');
    }
    return {ids, names, isPrivates};
  }
}
