import { Module } from "@nestjs/common";
import { FriendGateway } from "./friend.gateway";
import { FriendService } from "./friend.service";

@Module({
  providers: [FriendGateway, FriendService],
})
export class FriendModule {

}
