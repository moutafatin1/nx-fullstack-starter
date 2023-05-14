/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { readFileSync } from 'fs';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    httpsOptions: {
      key: readFileSync(
        '/home/moutafatin/.local/share/mkcert/localhost+2-key.pem'
      ),
      cert: readFileSync(
        '/home/moutafatin/.local/share/mkcert/localhost+2.pem'
      ),
    },
  });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser(process.env.COOKIE_SECRET));

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: https://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
