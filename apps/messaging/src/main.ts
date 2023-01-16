import { NestFactory } from '@nestjs/core';
import { MessagingModule } from './messaging.module';

async function bootstrap() {
  const app = await NestFactory.create(MessagingModule);
  await app.listen(3000);
}
bootstrap();
