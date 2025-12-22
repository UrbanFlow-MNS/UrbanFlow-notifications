import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';
import { NotificationStatus } from '../models/notificationEnums';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationRepository.create(createNotificationDto);
    return await this.notificationRepository.save(notification);
  }

  async findAll(): Promise<Notification[]> {
    return await this.notificationRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: number): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { recipientUserId: userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findUnreadByUser(userId: number): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { 
        recipientUserId: userId,
        readAt: IsNull(),
      },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({ where: { id } });
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    return notification;
  }

  async update(id: number, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
    const notification = await this.findOne(id);
    Object.assign(notification, updateNotificationDto);
    return await this.notificationRepository.save(notification);
  }

  async markAsRead(id: number): Promise<Notification> {
    const notification = await this.findOne(id);
    notification.readAt = new Date();
    return await this.notificationRepository.save(notification);
  }

  async markAsSent(id: number): Promise<Notification> {
    const notification = await this.findOne(id);
    notification.status = NotificationStatus.SENT;
    notification.sentAt = new Date();
    return await this.notificationRepository.save(notification);
  }

  async markAsFailed(id: number): Promise<Notification> {
    const notification = await this.findOne(id);
    notification.status = NotificationStatus.FAILED;
    return await this.notificationRepository.save(notification);
  }

  async remove(id: number): Promise<void> {
    const notification = await this.findOne(id);
    await this.notificationRepository.remove(notification);
  }
}
