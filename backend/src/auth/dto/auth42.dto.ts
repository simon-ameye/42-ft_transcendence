import { IsString, IsEmail, IsInt } from "class-validator";

export class	Auth42Dto {
	@IsInt()
	id: number;

	@IsEmail()
	email: string;

	@IsString()
	login: string;

	@IsString()
	first_name: string;

	@IsString()
	last_name: string;
}
