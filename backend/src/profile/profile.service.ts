import { Injectable } from "@nestjs/common";
import { ChannelMode } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { ProfileInterface } from "./interfaces/profile.interface";
import { User } from "@prisma/client";

@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaService,
  ) {}


  async getProfile(userId: number): Promise<ProfileInterface> {
    var user = this.prisma.user.findUnique({ 
      where: { 
        id: userId 
      },
      include: {
        matchHistory: true,
      },
    });

    let profileInterface: ProfileInterface = {
      id: (await user).id,
      displayName: (await user).displayName,
      matching: false,
      inGame: (await user).inGame,
      victories: (await user).victories,
      log: (await user).log,
      matchHistory: (await user).matchHistory,
    }
  
    return profileInterface;
  }

  async upload(id: number, path: string): Promise<string> {
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
