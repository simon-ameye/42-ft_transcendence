import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// middleware: it links apps, data and users
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe( {
    whitelist: true,
  }));
  app.use(session({
	secret: 'use random string',
	resave: false,
	saveUninitialized: false}),);
  console.log("testing 42API");
  
  await app.listen(3000);
}
bootstrap();
