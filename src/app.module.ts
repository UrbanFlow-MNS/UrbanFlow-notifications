import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notifications/entities/notification.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationsModule } from './notifications/notifications.module';
import { AppController } from './app.controller';
import { MailerModule } from '@nestjs-modules/mailer';

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
          host: config.get('SMTP_HOST'),
          port: config.get('SMTP_PORT'),
          secure: config.get('SMTP_SECURE') === 'true',
          auth: {
            user: config.get('SMTP_USER'),
            pass: config.get('SMTP_PASSWORD'),
          },
        },
        defaults: {
          from: `"${config.get('SMTP_FROM_NAME')}" <${config.get('SMTP_FROM_EMAIL')}>`,
        },
      }),
      inject: [ConfigService],
    }),

    NotificationsModule,
  ],

  controllers: [AppController],
  providers: [],
})
export class AppModule {}
