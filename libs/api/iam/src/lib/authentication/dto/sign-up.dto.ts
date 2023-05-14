import { ISignUpDto } from '@snipstash/types';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignUpDto implements ISignUpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
