import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SessionService } from './core/session/session.service';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // SWAGGER lib for API documentation
  const config = new DocumentBuilder()
    .setTitle('LMS API')
    .setDescription('API documentation for the Learning Management System')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    useGlobalPrefix: true,
  });

  // enable pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // session related middleware
  const sessionService = app.get(SessionService);
  const sessionMiddleware = sessionService.getSessionMiddleware();

  if (sessionMiddleware) {
    app.use(sessionMiddleware);
  } else {
    console.error('❌ Session middleware is not initialized!');
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
