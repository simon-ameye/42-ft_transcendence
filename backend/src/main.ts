import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
	app.use(cookieParser());
	app.enableCors({
		origin: 'http://localhost:3000',
		methods: ['POST', 'PUT', 'DELETE', 'GET'],
		credentials: true
	});
  app.useGlobalPipes(new ValidationPipe( {
    whitelist: true,
  }));
	app.use(session({
		secret: 'use random string',
		resave: false,
		saveUninitialized: false}),);
  console.log("testing 42API");
  
  await app.listen(3001);
}
bootstrap();
