import { IsEmail, IsInt } from "class-validator";

export class	UserDto {

	@IsInt()
	id: number;

	@IsEmail()
	email: string;
}
