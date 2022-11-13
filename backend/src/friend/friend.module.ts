import { Module } from "@nestjs/common";
import { MyGateway } from "./friend.gateway";

@Module({
  providers: [MyGateway],
})
export class GatewayModule {

}
