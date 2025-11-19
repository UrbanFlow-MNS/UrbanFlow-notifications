import {
  NotificationType,
  NotificationChannel,
  NotificationStatus,
  NotificationPriority,
} from './notificationEnums';

export interface NotificationModel {
  id: number;
  recipientUserId: number;
  title: string;
  content: string;
  type: NotificationType;
  channel: NotificationChannel;
  status: NotificationStatus;
  priority: NotificationPriority;
  sourceMicroservice: string;
  sourceEntityId: number;
  sentAt: Date;
}
