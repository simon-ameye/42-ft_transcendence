import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { LegacyCharacterEncoding } from "crypto";

export class FriendDto {
  id: number;
  RequesterId: number;
  AddresseeId: number;
  status: string;
}
