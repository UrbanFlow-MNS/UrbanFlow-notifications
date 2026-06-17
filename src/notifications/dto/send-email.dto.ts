import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendEmailBody {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  object: string;

  @IsString()
  @IsNotEmpty()
  body: string;
}
