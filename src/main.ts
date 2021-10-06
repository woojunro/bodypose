import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    credentials: true,
    origin: true,
  });
  app.use(cookieParser());
  const PORT = Number(process.env.PORT) || 8080;
  await app.listen(PORT);
  console.log(`SERVER IS LISTENING AT PORT ${PORT}`);
}
bootstrap();
