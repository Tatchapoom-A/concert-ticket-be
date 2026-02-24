import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    stopAtFirstError: true,
    exceptionFactory: (errors) => {
      const firstError = errors[0].constraints;
      const message = Object.values(firstError as any)[0];
      
      return new BadRequestException({
        statusCode: 400,
        message: message,
        error: 'Bad Request',
      });
    },
    whitelist: true,
    forbidNonWhitelisted: false,
    transform: true,
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
