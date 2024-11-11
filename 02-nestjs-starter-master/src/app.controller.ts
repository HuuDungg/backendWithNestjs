import { Controller, Post, UseGuards, Get, Res, Req } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Public } from './decorator/customize';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
@Controller()
export class AppController {
  constructor(private authService: AuthService, private config: ConfigService) { }
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(
    @Req() req,
    @Res({ passthrough: true }) response: Response
  ) {
    response.cookie('refresh_token', req.user.refreshToken, {
      httpOnly: true,
      maxAge: ms(this.config.get<string>('REFRESH_JWT_EXPIRATION_TIME'))
    });
    return this.authService.login(req.user);
  }
  @Get('/profile')
  async profile(@Req() req) {
    return req.user;
  }
}
