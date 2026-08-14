import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

describe('NotificationsController', () => {
  let controller: NotificationsController;
  let service: Record<string, jest.Mock>;

  beforeEach(async () => {
    service = {
      create: jest.fn().mockResolvedValue({ id: 1 }),
      findAll: jest.fn().mockResolvedValue([]),
      findByUser: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue({ id: 1, title: 'Nouvel incident' }),
      update: jest.fn().mockResolvedValue({ id: 1 }),
      remove: jest.fn().mockResolvedValue(undefined),
      sendEmailNotification: jest.fn().mockResolvedValue(undefined),
      handleEmailMessage: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [{ provide: NotificationsService, useValue: service }],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('creates a notification', async () => {
    const dto = { title: 'Nouvel incident' };

    await controller.create(dto as never);

    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('reads notifications', async () => {
    await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();

    await controller.findOne(1);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('converts the user id of the route', async () => {
    await controller.findByUser('7');

    expect(service.findByUser).toHaveBeenCalledWith(7);
  });

  it('updates and deletes a notification', async () => {
    await controller.update(1, { title: 'autre' });
    expect(service.update).toHaveBeenCalledWith(1, { title: 'autre' });

    await controller.remove(1);
    expect(service.remove).toHaveBeenCalledWith(1);
  });

  describe('sendEmail', () => {
    it('sends the mail of an existing notification', async () => {
      const result = await controller.sendEmail({
        notificationId: 1,
        recipientEmail: 'tech@urbanflow.local',
      });

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(service.sendEmailNotification).toHaveBeenCalledWith(
        'tech@urbanflow.local',
        {
          id: 1,
          title: 'Nouvel incident',
        },
      );
      expect(result).toEqual({
        message: 'Email sent successfully',
        recipientEmail: 'tech@urbanflow.local',
      });
    });

    it('does not send anything when the notification is unknown', async () => {
      service.findOne.mockRejectedValue(new Error('not found'));

      await expect(
        controller.sendEmail({
          notificationId: 99,
          recipientEmail: 'x@y.z',
        }),
      ).rejects.toThrow();
      expect(service.sendEmailNotification).not.toHaveBeenCalled();
    });
  });

  it('handles the email events sent by the other services', async () => {
    const payload = {
      email: 'tech@urbanflow.local',
      object: 'objet',
      body: 'contenu',
    };

    await controller.handleSendEmail(payload);

    expect(service.handleEmailMessage).toHaveBeenCalledWith(payload);
  });
});
