import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ChannelInterface } from "./channel.interfaces"

@Injectable()
export class ChannelService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async getChannelInterface(channelId : number, userId : number): Promise<ChannelInterface>
  {
    let channelInterface : ChannelInterface = {
      id: 0,
      name: '',
      mode: '',
      messages: [],
      authors: [],
      dates: [],
      userSocketId: '',
      isProtected: false,
    };

    var channel  = this.prisma.channel.findUnique({ where: { id: channelId } });
    var user     = this.prisma.user   .findUnique({ where: { id: userId    } });

    channelInterface.userSocketId = (await user).socketId;
    channelInterface.id           = (await channel).id;
    channelInterface.name         = (await channel).name;
    channelInterface.mode         = (await channel).mode;
    channelInterface.isProtected  = (await channel).password != '';

    let messageIds = (await channel).messageIds;
    for (let messageId of messageIds)
    {
      var message = this.prisma.message.findUnique({ where: { id: messageId } });
      if (!(await user).blockedUserIds.includes((await message).authorId))
      {
        var author = this.prisma.user.findUnique({ where: { id: (await message).authorId } });
        channelInterface.messages .push((await message) .text);
        channelInterface.authors  .push((await author)  .displayName);
        channelInterface.dates    .push((await message) .date.toLocaleString());
      }
    }
    return (channelInterface);
  }

  async getChannelInterfaces(): Promise<ChannelInterface[]>
  {
    let channelInterfaces : ChannelInterface[] = [];
    let channels = await this.prisma.channel.findMany();
    for (let channel of channels)
    {
      let userIds = channel.userIds;
      for (let userId of userIds)
        channelInterfaces.push(await this.getChannelInterface((await channel).id, userId));
    }
    return (channelInterfaces);
  }
}
