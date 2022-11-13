import { Module } from "@nestjs/common";
import { FriendGateway } from "./friend.gateway";
import { FriendService } from "./friend.service";
import { FriendController } from './friend.controller';

@Module({
  // create a friend controller
  controllers: [FriendController],
  providers: [FriendGateway, FriendService]
})

export class FriendModule {

}
