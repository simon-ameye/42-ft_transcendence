import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { LegacyCharacterEncoding } from "crypto";

export class UserDto {
  token: string; // the token to indentify the user
  email: string;
  displayName: string;
  imageUrl: string;
  id: number;
}