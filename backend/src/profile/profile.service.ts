import { Injectable } from "@nestjs/common";
import { ChannelMode } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { ProfileInterface } from "./interfaces/profile.interface";


@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaService,
  ) { }


  async getProfile(userId: number): Promise<ProfileInterface> {


    var user = this.prisma.user.findUnique({ where: { id: userId } });
    //if (!await user)
    //  return (profileInterface);

    let profileInterface: ProfileInterface = {
      id: (await user).id,
      createdAt: (await user).createdAt.toLocaleString('fr-FH', { timeZone: "CET" }),
      updatedAt: (await user).updatedAt.toLocaleString('fr-FH', { timeZone: "CET" }),
      email: (await user).email,
      hash: (await user).hash,
      displayName: (await user).displayName,
      imageUrl: (await user).imageUrl,
      googleSecret: (await user).googleSecret,
      socketId: (await user).socketId,
      blockedUserIds: (await user).blockedUserIds,
      friends: (await user).friends,
      matching: false,
      inGame: (await user).inGame,
      victories: (await user).victories,
      log: (await user).log
    }

    return (profileInterface);
  }
}
