import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities/notification.entity';
import {
  NotificationChannel,
  NotificationPriority,
  NotificationType,
} from '../models/notificationEnums';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let repository: Record<string, jest.Mock>;
  let mailer: Record<string, jest.Mock>;

  const dto = {
    recipientUserId: 7,
    title: 'Nouvel incident',
    content: 'un incident vient d etre cree',
    type: NotificationType.INCIDENT_CREATED,
    channel: NotificationChannel.EMAIL,
    sourceMicroservice: 'incidents',
    sourceEntityId: 1,
  };

  const notification = {
    id: 1,
    ...dto,
    priority: NotificationPriority.NORMAL,
  } as Notification;

  beforeEach(async () => {
    repository = {
      create: jest.fn((payload: unknown) => payload),
      save: jest.fn((entity: object) => Promise.resolve({ id: 1, ...entity })),
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(notification),
      remove: jest.fn().mockResolvedValue(undefined),
    };
    mailer = { sendMail: jest.fn().mockResolvedValue(undefined) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: getRepositoryToken(Notification), useValue: repository },
        { provide: MailerService, useValue: mailer },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('saves a new notification', async () => {
    await expect(service.create(dto as never)).resolves.toEqual({
      id: 1,
      ...dto,
    });

    expect(repository.create).toHaveBeenCalledWith(dto);
    expect(repository.save).toHaveBeenCalled();
  });

  it('returns the notifications from the most recent', async () => {
    await service.findAll();

    expect(repository.find).toHaveBeenCalledWith({
      order: { createdAt: 'DESC' },
    });
  });

  it('filters the notifications of a user', async () => {
    await service.findByUser(7);

    expect(repository.find).toHaveBeenCalledWith({
      where: { recipientUserId: 7 },
      order: { createdAt: 'DESC' },
    });
  });

  describe('findOne', () => {
    it('returns the notification', async () => {
      await expect(service.findOne(1)).resolves.toEqual(notification);
    });

    it('throws when the notification does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('merges the changes into the existing notification', async () => {
      await service.update(1, { title: 'Titre modifie' });

      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1, title: 'Titre modifie' }),
      );
    });

    it('throws when the notification does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.update(99, {})).rejects.toThrow(NotFoundException);
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deletes the notification', async () => {
      await service.remove(1);

      expect(repository.remove).toHaveBeenCalledWith(notification);
    });

    it('throws when the notification does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
      expect(repository.remove).not.toHaveBeenCalled();
    });
  });

  describe('sendEmailNotification', () => {
    it('sends the mail to the recipient', async () => {
      await service.sendEmailNotification('tech@urbanflow.local', notification);

      expect(mailer.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'tech@urbanflow.local',
          subject: notification.title,
        }),
      );
    });

    it('puts the content of the notification in the body', async () => {
      await service.sendEmailNotification('tech@urbanflow.local', notification);

      const [options] = mailer.sendMail.mock.calls[0] as [{ html: string }];
      expect(options.html).toContain(notification.content);
    });

    it('fails when the mailer is down', async () => {
      mailer.sendMail.mockRejectedValue(new Error('smtp down'));

      await expect(
        service.sendEmailNotification('tech@urbanflow.local', notification),
      ).rejects.toThrow("Impossible d'envoyer l'email");
    });
  });

  describe('handleEmailMessage', () => {
    const payload = {
      email: 'tech@urbanflow.local',
      object: '[Incident] panne',
      body: 'un incident vient d etre cree',
    };

    it('sends the mail received from the other services', async () => {
      await service.handleEmailMessage(payload);

      expect(mailer.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({ to: payload.email, subject: payload.object }),
      );
    });

    it('fails when the mailer is down', async () => {
      mailer.sendMail.mockRejectedValue(new Error('smtp down'));

      await expect(
        service.handleEmailMessage(payload as never),
      ).rejects.toThrow("Impossible d'envoyer l'email");
    });
  });
});
