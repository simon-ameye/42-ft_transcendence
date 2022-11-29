import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

<<<<<<< HEAD
  @IsString()
  @IsNotEmpty()
  displayName: string;
=======
	@IsString()
	@IsNotEmpty()
	displayName: string;
>>>>>>> main
}
