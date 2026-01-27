import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { SendEmailNotificationDto } from './dto/send-email-notification.dto';

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
    };  }
}
