import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', //process.env.DB_HOST || 'localhost',
      port: '5432',//parseInt(process.env.DB_PORT || '5432', 10),
      username: 'test',//process.env.DB_USERNAME || 'postgres',
      password: 'test',//process.env.DB_PASSWORD || 'postgres',
      database: 'urbanflow_notifications',//process.env.DB_NAME || 'urbanflow_notifications',
      entities: [Notification],
      synchronize:false,// process.env.NODE_ENV !== 'production',
      logging: false, //process.env.NODE_ENV !== 'production',
    }),
    TypeOrmModule.forFeature([Notification]),
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
