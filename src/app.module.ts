import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notifications/entities/notification.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationsModule } from './notifications/notifications.module';
import { AppController } from './app.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrometheusController } from './prometheus/prometheus.controller';
import { PrometheusService } from './prometheus/prometheus.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Notification],
      synchronize: true, // TODO: set to false in production
      logging: false,
    }),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>('SMTP_HOST'),
          port: config.get<number>('SMTP_PORT'),
          secure: config.get('SMTP_SECURE') === 'true',
          auth: {
            user: config.get<string>('SMTP_USER'),
            pass: config.get<string>('SMTP_PASSWORD'),
          },
        },
        defaults: {
          from: `"${config.get<string>('SMTP_FROM_NAME')}" <${config.get<string>('SMTP_FROM_EMAIL')}>`,
        },
      }),
      inject: [ConfigService],
    }),

    NotificationsModule,

    ClientsModule.register([
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBIT_MQ ?? ''],
          queue: 'NOTIFICATION_QUEUE',
          queueOptions: { durable: false },
        },
      },
    ]),
  ],

  controllers: [AppController, PrometheusController],
  providers: [
    PrometheusService,
    {
      provide: 'IPrometheusService',
      useClass: PrometheusService,
    },
  ],
})
export class AppModule {}
