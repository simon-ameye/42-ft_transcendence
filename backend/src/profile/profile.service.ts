import { Injectable } from "@nestjs/common";
import { ChannelMode } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { ProfileInterface } from "./interfaces/profile.interface";
import { UserDto } from "src/user/dto";
import { User } from "@prisma/client";

@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaService,
  ) {}


  async getProfile(userId: number): Promise<ProfileInterface> {
    var user = this.prisma.user.findUnique({ where: { id: userId } });

    let profileInterface: ProfileInterface = {
      id: (await user).id,
      email: (await user).email,
      displayName: (await user).displayName,
      imageUrl: (await user).imageUrl,
      blockedUserIds: (await user).blockedUserIds,
      friends: (await user).friends,
      matching: false,
      inGame: (await user).inGame,
      victories: (await user).victories,
      log: (await user).log
    }

    return (profileInterface);
  }

  async upload(id: number, path: string): Promise<string> {
    console.log("upload", path)
    const updateUser = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        imageUrl: path,
      },
    })
    return updateUser.imageUrl
  }
}
