import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SampleDto {
  @IsEmail()
  @IsNotEmpty()
  FileTypeValidator: string;
}
