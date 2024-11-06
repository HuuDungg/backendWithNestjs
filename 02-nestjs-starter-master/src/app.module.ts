import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
@Module({
  imports:
    [
      MongooseModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          uri: configService.get<string>('DATABASE'),
        }),
        inject: [ConfigService],
      }),

      ConfigModule.forRoot({
        isGlobal: true
      }),

      UsersModule,
      AuthModule,
    ],

  controllers: [AppController],
  providers: [AppService, LocalAuthGuard, AuthService, JwtService],
})
export class AppModule { }
