import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { IUser } from 'src/users/user.interface';
import { Response } from 'express';
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private config: ConfigService
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {

        const user = await this.usersService.findByName(username) as User;

        if (this.usersService.isValidPassword(pass, user.password)) {
            return user;
        }
        return null;
    }
    async login(user: IUser, response: Response) {
        const payload = {
            sub: "token login",
            iss: "from server",
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };
        //generate refresh token
        const refresh = await this.refreshToken({ ...payload, sub: "refresh token" })
        //update refresh token to database
        await this.usersService.updateRefreshtoken(user._id, refresh);
        //parser refresh token as cookie
        response.cookie('refresh_token', refresh, {
            httpOnly: true,
            maxAge: ms(this.config.get<string>('REFRESH_JWT_EXPIRATION_TIME')) * 1000
        });

        return {
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            access_token: this.jwtService.sign(payload, {
                secret: this.config.get<string>('JWT_SECRET_KEY'),
                expiresIn: ms(this.config.get<string>('JWT_EXPIRATION_TIME')) / 1000
            }),
            refresh: refresh
        };
    }

    async refreshToken(payload: any) {
        const refresh_token = await this.jwtService.sign(payload, {
            secret: this.config.get<string>('REFRESH_JWT_SECRET_KEY'),
            expiresIn: ms(this.config.get<string>('REFRESH_JWT_EXPIRATION_TIME'))
        })
        return refresh_token;
    }

    async processNewToken(refresh_token: string) {
        try {
            await this.jwtService.verify(refresh_token, {
                secret: this.config.get<string>('REFRESH_JWT_SECRET_KEY'),
            })
            const result = await this.usersService.findByRefresh(refresh_token) as any
            console.log("check result: ", result.refreshToken);

            if (result.refreshToken === refresh_token) {
                return result;
            }
        } catch (error) {
            throw new BadRequestException("Refresh token is invalid")
        }
    }
}
