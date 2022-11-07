import { IsEmail, IsEmpty } from 'class-validator';

export class GetUserDto {

	@IsEmail()
	email: string

	@IsEmpty()
	id: string
}
