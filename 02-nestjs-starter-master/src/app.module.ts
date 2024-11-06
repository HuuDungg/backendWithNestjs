import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
@Module({
  imports:
    [
      MongooseModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          uri: configService.get<string>('DATABASE'),
          connectionFactory: (connection) => {
            connection.plugin(softDeletePlugin);
            return connection;
          }

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
  providers: [AppService, AuthService, JwtService,
  ],
})
export class AppModule { }
