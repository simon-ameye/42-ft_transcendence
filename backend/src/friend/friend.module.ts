import { Module } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { FriendGateway } from "./friend.gateway";
import { FriendService } from "./friend.service";

@Module({
  providers: [FriendGateway, FriendService, UserService]
})

export class FriendModule {

}
