import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ChannelMode, User } from ".prisma/client";
import { ChannelsInterface } from "./interfaces/channels.interface";
import { FriendsInterface } from "./interfaces/friends.interface";
import * as argon from 'argon2'

@Injectable()
export class ChatService {
  constructor(
    private eventEmitter: EventEmitter2,
    private prisma: PrismaService,
  ) { }

  async createChannel(userId: number, name: string, mode: ChannelMode, password: string, otherUserId: number) {
    var newowner = this.prisma.user.findUnique({ where: { id: userId } });
    if (!await newowner)
      return ('User not found');

    if (!(mode in ChannelMode))
      return ('Unknown channel mode');

    if (mode == ChannelMode.DIRECT) {
      if (!otherUserId)
        return ('otherUserId must be specified for DIRECT');

      if (otherUserId == userId)
        return ('you cant create a channel between you and you');

      var otherUser = this.prisma.user.findUnique({ where: { id: otherUserId } });
      if (!await otherUser)
        return ('Mode is DIRECT but otherUser is not found');

      var directChannelsWithSameUsers = this.prisma.channel.findMany({
        where: {
          mode: ChannelMode.DIRECT,
          userIds: { hasEvery: [(await newowner).id, (await otherUser).id] }
        }
      });
      if ((await directChannelsWithSameUsers).length != 0)
        return ('Direct channel between the two users already exists');

      var newChannel = await this.prisma.channel.create({
        data: {
          name: 'DIRECT channel',
          mode: mode,
          userIds: [(await newowner).id, (await otherUser).id],
        }
      });
    }
    else {
      if (name == '')
        return ('Channel name must not be blank except for DIRECT');

      var channelsWithSameName = this.prisma.channel.findMany({ where: { name: name } });
      if ((await channelsWithSameName).length != 0)
        return ('Channel name already in use');

      const hash = await argon.hash(password);
      var newChannel = await this.prisma.channel.create({
        data: {
          name: name,
          mode: mode,
          password: hash,
          ownerId: (await newowner).id,
          userIds: (await newowner).id,
          adminIds: (await newowner).id,
        }
      });
    }
    this.eventEmitter.emit('flushAllChannels');
    return ('New channel created');
  }

  async joinChannel(userId: number, channelId: number, password: string) {
    var channel = this.prisma.channel.findUnique({ where: { id: channelId } });
    if (!await channel)
      return ('Channel not found');

    var user = this.prisma.user.findUnique({ where: { id: userId } });
    if (!await user)
      return ('User not found');

    if ((await channel).userIds.includes(userId))
      return ('You are already registered to this channel');

    if ((await channel).banedUserIds.includes(userId))
      return ('You are baned from this channel');

    if ((await channel).mode != ChannelMode.PUBLIC)
      return ('You can ONLY join a PUBLIC channel. PUBLIC channels may be protected by a pasword');

    const pwMatch = await argon.verify(
      (await channel).password,
      password);

    if (!pwMatch)
      return ('Wong password');

    const channelUpdate = await this.prisma.channel.update({
      where: { id: channelId, },
      data: { userIds: { push: userId, }, },
    })

    this.eventEmitter.emit('flushAllChannels');
    return ('Channel joined');
  }

  async leaveChannel(userId: number, channelId: number) {
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
        userIds: { set: (await channel).userIds.filter((id) => id !== userId) },
        adminIds: { set: (await channel).adminIds.filter((id) => id !== userId) },
        ownerId: { set: (await channel).ownerId == userId ? 0 : (await channel).ownerId },
      },
    })

    this.eventEmitter.emit('flushAllChannels');
    return ('Channel left');
  }

  async sendMessage(userId: number, channelId: number, text: string) {
    var channel = this.prisma.channel.findUnique({ where: { id: channelId } });
    if (!await channel)
      return ('Channel not found');

    var user = this.prisma.user.findUnique({ where: { id: userId } });
    if (!await user)
      return ('User not found');

    if (!(await channel).userIds.includes(userId)) //BUGGING
      return ('You are not in the channel');


    var actualDate = new Date();
    let muteUserIds = (await channel).muteUserIds;
    let muteRelease = (await channel).muteRelease;
    for (let i = 0; i < muteUserIds.length; i++) {
      if (muteUserIds[i] == userId && actualDate < muteRelease[i])
        return ('You are muted');
    }

    var newMessage = await this.prisma.message.create({
      data: {
        text: text,
        authorId: userId,
      }
    });

    const updateChannel = await this.prisma.channel.update({
      where: { id: channelId, },
      data: { messageIds: { push: (await newMessage).id, }, },
    })

    this.eventEmitter.emit('flushAllChannels');
    return ('');
  }

  async setConnection(userId: number, socketId: string) {
    var userLookup = this.prisma.user.findUnique({ where: { id: userId } });
    if (!await userLookup) {
      console.log('A user with unknown token is trying to setConnection. Aborting');
      return ('User not found');
    }

    const user = await this.prisma.user.update({
      where: { id: userId, },
      data: { socketId: socketId, },
    })
    this.eventEmitter.emit('flushAllChannels');
    return ('User socketId is now set');
  }

  async blockUser(userId: number, blockedUserId: number) {
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
      data: { blockedUserIds: { push: blockedUserId, } },
    })

    this.eventEmitter.emit('flushAllChannels');
    return ('User is now blocked');
  }

  async setChannelPassword(userId: number, channelId: number, newPassword: string) {
    var user = this.prisma.user.findUnique({ where: { id: userId } });
    if (!await user)
      return ('User not found');

    var channel = this.prisma.channel.findUnique({ where: { id: channelId } });
    if (!channel)
      return ('Channel not found');

    if ((await channel).ownerId != userId)
      return ('You are not the owner of this channel.');

    const hash = await argon.hash(newPassword);
    const channelUpdate = await this.prisma.channel.update({
      where: { id: channelId, },
      data: { password: hash, },
    })

    this.eventEmitter.emit('flushAllChannels');
    return ('Password modified');
  }

  async getPublicChannelTable() {
    //var ids         : number[]  = [];
    //var names       : string[]  = [];
    //var isPrivates  : boolean[] = [];
    //
    //let channels = await this.prisma.channel.findMany({ where: { mode: ChannelMode.PUBLIC },})
    //for (let channel of channels)
    //{
    //  ids         .push(channel.id);
    //  names       .push(channel.name);
    //  isPrivates  .push(channel.password != '');
    //}
    //return {ids, names, isPrivates};

    var channelsInterfaces: ChannelsInterface[] = [];
    let channels = await this.prisma.channel.findMany({ where: { mode: ChannelMode.PUBLIC }, })
    for (let channel of channels) {
      channelsInterfaces.push({ id: channel.id, name: channel.name, isProtected: channel.password != '' });
    }
    return { channelsInterfaces };
  }

  //  async getUserChannelTable(userId: number) {
  //    var ids: number[] = [];
  //    var names: string[] = [];
  //    var isPrivates: boolean[] = [];
  //
  //    let channels = await this.prisma.channel.findMany({ where: { userIds: { has: userId } }, })
  //    for (let channel of channels) {
  //      ids.push(channel.id);
  //      names.push(channel.name);
  //      isPrivates.push(channel.password != '');
  //    }
  //    return { ids, names, isPrivates };
  //  }

  async makeUserAdmin(userId: number, channelId: number, newAdminId: number) {
    var user = this.prisma.user.findUnique({ where: { id: userId } });
    if (!await user)
      return ('User not found');

    var channel = this.prisma.channel.findUnique({ where: { id: channelId } });
    if (!channel)
      return ('Channel not found');

    var newAdmin = this.prisma.user.findUnique({ where: { id: newAdminId } });
    if (!await newAdmin)
      return ('New Admin not found');

    if ((await channel).ownerId != userId)
      return ('You are not owner of this channel')

    if ((await channel).adminIds.includes(newAdminId))
      return ('This user is already admin of this channel')

    const channelUpdate = await this.prisma.channel.update({
      where: { id: channelId, },
      data: { adminIds: { push: newAdminId, }, },
    })

    return ('New admin set')
  }

  async banUser(userId: number, channelId: number, banedId: number) {
    var user = this.prisma.user.findUnique({ where: { id: userId } });
    if (!await user)
      return ('User not found');

    var channel = this.prisma.channel.findUnique({ where: { id: channelId } });
    if (!channel)
      return ('Channel not found');

    var banedUser = this.prisma.user.findUnique({ where: { id: banedId } });
    if (!await banedUser)
      return ('Baned user not found');

    if (!(await channel).adminIds.includes(userId))
      return ('You are not admin of this channel')

    if (!(await channel).userIds.includes(banedId))
      return ('This user is not on this channel')

    const channelUpdate = await this.prisma.channel.update({
      where: { id: channelId, },
      data: {
        userIds: { set: (await channel).userIds.filter((id) => id !== banedId) },
        adminIds: { set: (await channel).adminIds.filter((id) => id !== banedId) },
        ownerId: { set: (await channel).ownerId == banedId ? 0 : (await channel).ownerId },
        banedUserIds: { push: banedId },
      },
    })

    this.eventEmitter.emit('flushAllChannels');
    return ('User baned')
  }

  async muteUser(userId: number, channelId: number, muteId: number, minutes: number) {
    var user = this.prisma.user.findUnique({ where: { id: userId } });
    if (!await user)
      return ('User not found');

    var channel = this.prisma.channel.findUnique({ where: { id: channelId } });
    if (!channel)
      return ('Channel not found');

    var muteUser = this.prisma.user.findUnique({ where: { id: muteId } });
    if (!await muteUser)
      return ('Mute user not found');

    if (!(await channel).adminIds.includes(userId))
      return ('You are not admin of this channel')

    if (!(await channel).userIds.includes(muteId))
      return ('This user is not on this channel')

    var muteRelease = new Date();
    muteRelease.setMinutes(muteRelease.getMinutes() + minutes);

    const channelUpdate = await this.prisma.channel.update({
      where: { id: channelId, },
      data: {
        muteUserIds: { push: muteId },
        muteRelease: { push: muteRelease },
      },
    })

    this.eventEmitter.emit('flushAllChannels');
    return ('User muted')
  }

  async sendAllChannelInterfaces() {
    this.eventEmitter.emit('flushAllChannels');
    return ('Channels interfaces sent')
  }

  async getUserFriendTable(userId: number) { //MAYBE NEEDS PROTECTION !
    var friendsInterfaces: FriendsInterface[] = [];
    var friend: User;

    var user = await this.prisma.user.findUnique({ where: { id: userId }, })
    if (!user)
      return { friendsInterfaces };
    console.log("debug");
    console.log(userId);
    console.log("debug");
    for (let friendId of user.friends) {
      friend = await this.prisma.user.findUnique({ where: { id: friendId }, })
      if (!friend)
        return { friendsInterfaces };
      var friendInterface: FriendsInterface = { id: friendId, name: friend.displayName };
      friendsInterfaces.push(friendInterface);
    }
    return { friendsInterfaces };
  }
}
