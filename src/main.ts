import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBIT_MQ || 'amqp://localhost:5672'],
      queue: 'NOTIFICATIONS_QUEUE',
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.listen(process.env.PORT ?? 4007);
  await app.startAllMicroservices();
}
void bootstrap();
