import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { CompaniesModule } from './companies/companies.module';
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
      CompaniesModule,
    ],

  controllers: [AppController],
  providers: [AppService, AuthService, JwtService,
  ],
})
export class AppModule { }
