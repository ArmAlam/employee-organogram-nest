import { join } from 'path';
import * as express from 'express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

import { config } from 'dotenv';
config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.use('/static', express.static(join(__dirname, '..', 'public')));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
