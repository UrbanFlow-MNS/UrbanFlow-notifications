import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';
import { SendEmailBody } from './dto/send-email.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly mailerService: MailerService,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const notification = this.notificationRepository.create(
      createNotificationDto,
    );
    return await this.notificationRepository.save(notification);
  }

  async findAll() {
    return await this.notificationRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: number) {
    return await this.notificationRepository.find({
      where: { recipientUserId: userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    return notification;
  }

  async update(id: number, updateNotificationDto: UpdateNotificationDto) {
    const notification = await this.findOne(id);
    Object.assign(notification, updateNotificationDto);
    return await this.notificationRepository.save(notification);
  }

  async remove(id: number) {
    const notification = await this.findOne(id);
    await this.notificationRepository.remove(notification);
  }

  async sendEmailNotification(
    recipientEmail: string,
    notification: Notification,
  ) {
    try {
      await this.mailerService.sendMail({
        to: recipientEmail,
        subject: notification.title,
        html: `
          <div style="padding: 15px; font-family: Arial;">
            <h2>${notification.title}</h2>
            <p>${notification.content}</p>
            <hr>
            <small>Type: ${notification.type} - Priorité: ${notification.priority}</small>
          </div>
        `,
      });
    } catch (err) {
      console.log('Erreur envoi email:', err);
      throw new Error("Impossible d'envoyer l'email");
    }
  }

  async handleEmailMessage(payload: SendEmailBody) {
    console.log('Email:', payload.email);
    console.log('Objet:', payload.object);
    console.log('Body:', payload.body);
    console.log('Timestamp:', new Date().toISOString());

    return {
      success: true,
      message: 'Message reçu et loggé avec succès',
      timestamp: new Date().toISOString(),
    };
  }
}
