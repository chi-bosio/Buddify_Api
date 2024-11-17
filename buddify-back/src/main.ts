import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGblobal } from './middleware/logger.middleware';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.use(loggerGblobal);
  app.enableCors()

  

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Buddify')
    .setDescription(
      `
      Esta plataforma multidispositivo está orientada a la socialización a través de actividades compartidas, dirigida a personas que buscan conocer gente nueva mediante eventos locales y seguros. 
      La app permite a los usuarios crear y unirse a actividades de interés común, ofreciendo una experiencia confiable mediante verificación de identidad.
      `,
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`Server listening on http://localhost:${port}`);
}

bootstrap();