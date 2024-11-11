import { Controller, Post, UseGuards, Get, Res, Req } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Public, ResponseMessage } from './decorator/customize';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { IUser } from './users/user.interface';
import { User } from './decorator/user.decorator';
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
    return this.authService.login(req.user, response);
  }
  @ResponseMessage("Get profile")
  @Get('/profile')
  async profile(@User() user: IUser) {
    return user;
  }

  @Public()
  @ResponseMessage("Get info with refresh token")
  @Get('/refresh')
  async refresh(@Req() response: Response) {
    const refresh = response.clearCookie["refresh_token"]
    const result = await this.authService.processNewToken(refresh);
    return {
      result
    }
  }

  @Public()
  @ResponseMessage("Logout successfully")
  @Get('/logout')
  async logout(@Req() request: Request) {
    request.cookies["refresh_token"]
    return "ok";
  }
}
