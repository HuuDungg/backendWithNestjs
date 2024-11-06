import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
require('dotenv').config()
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //validate data with pipe
  app.useGlobalPipes(new ValidationPipe());

  //setup global authentication
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  //config cors
  app.enableCors(
    {
      "origin": "*",
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "preflightContinue": false,
    }
  );

  await app.listen(process.env.PORT);
}
bootstrap();
