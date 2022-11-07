import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UserDto {
  token: string; // the token to indentify the user
}
