import { Injectable } from "@nestjs/common";
import { ChannelMode } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { ChannelInterface } from "./channel.interfaces"
import { MessageInterface } from "./message.interface";
import { UserInterface } from "./user.interface";

@Injectable()
export class ChannelService {
  constructor(
    private prisma: PrismaService,
  ) { }

  async getChannelInterface(channelId: number, userId: number): Promise<ChannelInterface> {
    let channelInterface: ChannelInterface = {
      id: 0,
      name: '',
      mode: '',
      messages: [],
      //authors: [],
      //dates: [],
      userSocketId: '',
      isProtected: false,
      users: [],
    };

    var channel = this.prisma.channel.findUnique({ where: { id: channelId } });
    var user = this.prisma.user.findUnique({ where: { id: userId } });

    channelInterface.userSocketId = (await user).socketId;
    channelInterface.id = (await channel).id;
    channelInterface.mode = (await channel).mode;
    channelInterface.isProtected = (await channel).password != '';
    if ((await channel).mode == ChannelMode.DIRECT) {
      try {
        channelInterface.name =
          (await this.prisma.user.findUnique({ where: { id: (await channel).userIds[0] } })).displayName
          + " & " +
          (await this.prisma.user.findUnique({ where: { id: (await channel).userIds[1] } })).displayName;
      }
      catch {
        channelInterface.name = "error while generating name";
      }
    }
    else
      channelInterface.name = (await channel).name;

    let messageIds = (await channel).messageIds;
    for (let messageId of messageIds) {
      var message = this.prisma.message.findUnique({ where: { id: messageId } });
      if (!(await user).blockedUserIds.includes((await message).authorId)) {
        var author = this.prisma.user.findUnique({ where: { id: (await message).authorId } });
        if (!await author)
          return (channelInterface);
        let messageInterface: MessageInterface =
        {
          message: "",
          author: "",
          date: "",
        };
        messageInterface.message = ((await message).text);
        messageInterface.author = ((await author).displayName);
        messageInterface.date = ((await message).date.toLocaleString('fr-FH', { timeZone: "CET" }));
        //channelInterface.messages .push((await message) .text);
        //channelInterface.authors  .push((await author)  .displayName);
        //channelInterface.dates    .push((await message) .date.toLocaleString());
        channelInterface.messages.push(messageInterface);
      }
    }
    for (let chanUserId of (await channel).userIds) {
      var chanUser = this.prisma.user.findUnique({ where: { id: chanUserId } })
      let UserInterface: UserInterface = { id: chanUserId, name: (await chanUser).displayName }
      channelInterface.users.push(UserInterface);
    }
    return (channelInterface);
  }

  async getChannelInterfaces(): Promise<ChannelInterface[]> {
    let channelInterfaces: ChannelInterface[] = [];
    let channels = await this.prisma.channel.findMany();
    for (let channel of channels) {
      let userIds = channel.userIds;
      for (let userId of userIds)
        channelInterfaces.push(await this.getChannelInterface(channel.id, userId));
    }
    return (channelInterfaces);
  }
}
