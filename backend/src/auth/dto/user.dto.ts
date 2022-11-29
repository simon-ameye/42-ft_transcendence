import { IsEmail, IsInt, IsBoolean } from "class-validator";

export class	UserDto {

	@IsInt()
	id: number;

	@IsEmail()
	email: string;

	@IsBoolean()
	inGame: boolean
}
