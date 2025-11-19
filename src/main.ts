import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
<<<<<<< HEAD
  await app.listen(3000);
=======
  await app.listen(process.env.PORT ?? 3000);
>>>>>>> aa408d0d9169d9854428216203c4280d51feb9cf
}
bootstrap();
