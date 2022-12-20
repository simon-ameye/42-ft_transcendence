import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { LegacyCharacterEncoding } from "crypto";
import { Status } from "@prisma/client";

export class UserDto {
  token: string; // the token to indentify the user ( NOT SECURE )
  email: string;
  displayName: string;
  imageUrl: string;
  id: number;
	socketId: string;
  status: Status;
}
