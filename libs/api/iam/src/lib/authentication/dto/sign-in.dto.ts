import { ISignInDto } from '@snipstash/types';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto implements ISignInDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
