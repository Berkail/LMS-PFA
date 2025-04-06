import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SessionService } from './core/session/session.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const sessionService = app.get(SessionService);
  const sessionMiddleware = sessionService.getSessionMiddleware();

  // Check if session middleware is initialized before applying it
  if (sessionMiddleware) {
    app.use(sessionMiddleware);
  } else {
    console.error('❌ Session middleware is not initialized!');
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
