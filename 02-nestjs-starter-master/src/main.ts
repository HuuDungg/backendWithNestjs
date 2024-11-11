import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { TransformInterceptor } from './core/transform.interceptor';
import cookieParser from 'cookie-parser';

require('dotenv').config()
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //validate data with pipe
  app.useGlobalPipes(new ValidationPipe());
  //setup global authentication
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  //config transform response by interceptor
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  //config versioning
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1', '2'] //v1, v2
  });
  //config cors
  app.enableCors(
    {
      "origin": "*",
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "preflightContinue": false,
    }
  );
  //config to use cookie parser
  app.use(cookieParser());

  await app.listen(process.env.PORT);
}
bootstrap();
