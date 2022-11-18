import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe( {
    whitelist: true,
  }));
  // please MODIFY this secret
  
  app.use(
    session({
	    secret: 'use random string',
	    resave: false,
	    saveUninitialized: false,
      //secure: true,
    }),
  );

  await app.listen(3001);
}
bootstrap();
