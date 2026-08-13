import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { SendEmailNotificationDto } from './dto/send-email-notification.dto';
import { SendEmailBody } from './dto/send-email.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.notificationsService.findByUser(+userId);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationsService.update(id, updateNotificationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number) {
    return this.notificationsService.remove(id);
  }

  @Post('send-email')
  async sendEmail(@Body() sendEmailDto: SendEmailNotificationDto) {
    const notification = await this.notificationsService.findOne(
      sendEmailDto.notificationId,
    );
    await this.notificationsService.sendEmailNotification(
      sendEmailDto.recipientEmail,
      notification,
    );
    return {
      message: 'Email sent successfully',
      recipientEmail: sendEmailDto.recipientEmail,
    };
  }

  @EventPattern('notifications.sendEmail')
  handleSendEmail(@Payload() payload: SendEmailBody) {
    return this.notificationsService.handleEmailMessage(payload);
  }
}
