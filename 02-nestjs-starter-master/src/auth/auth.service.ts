import { Injectable } from '@nestjs/common';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { IUser } from 'src/users/user.interface';
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
    async login(user: IUser) {
        const payload = {
            sub: "token login",
            iss: "from server",
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };
        const refresh = await this.refreshToken(payload)
        return {
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
            expiresIn: ms(this.config.get<string>('REFRESH_JWT_EXPIRATION_TIME')) / 1000
        })
        return refresh_token;
    }
}
