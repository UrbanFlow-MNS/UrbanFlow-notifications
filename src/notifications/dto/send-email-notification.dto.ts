import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendEmailNotificationDto {
  @IsEmail()
  @IsNotEmpty()
  recipientEmail: string;

  @IsNotEmpty()
  notificationId: number;
}
