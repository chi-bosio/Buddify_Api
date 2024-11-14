import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGblobal } from './middleware/logger.middleware';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.use(loggerGblobal);
  app.enableCors()

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`Server listening on http://localhost:${port}`);
}

bootstrap();