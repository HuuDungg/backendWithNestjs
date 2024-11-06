import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local.strategy';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './passport/jwt.strategy';
@Module({
  imports: [
    UsersModule,
    PassportModule,
    UsersModule,
  ],
  providers: [AuthService, LocalStrategy, JwtService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule { }
