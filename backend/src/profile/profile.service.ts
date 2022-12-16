import { Injectable } from "@nestjs/common";
import { ChannelMode } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { ProfileInterface } from "./interfaces/profile.interface";
import { UserDto } from "src/user/dto";

@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaService,
  ) {}


  async getProfile(userId: number): Promise<ProfileInterface> {
    var user = this.prisma.user.findUnique({ where: { id: userId } });
    //if (!await user)
    //  return (profileInterface);

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

  async upload(dto: UserDto, path: string) {
    if (!dto) {
      console.log("not expected error");
    }
    const updateUser = await this.prisma.user.update({
      where: {
        id: dto.id,
      },
      data: {
        imageUrl: path,
      },
    })
  }


}
