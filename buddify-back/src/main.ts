import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGblobal } from './middleware/logger.middleware';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(loggerGblobal)
  await app.listen(process.env.PORT ?? 3000);
  console.log('server listening on http://localhost:3000')
}
bootstrap();
