import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsEmail()
  email: string;
  @MinLength(6, {
    message: 'Please enter at least 6 characters',
  })
  @IsString()
  password: string;
}
