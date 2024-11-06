import { Injectable } from '@nestjs/common';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
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
    async login(user: { name: string, _id: string }) {
        const payload = { username: user.name, sub: user._id, role: "HuuDung" };
        return {
            access_token: this.jwtService.sign(payload, {
                secret: String(ms(this.config.get<string>('JWT_SECRET_KEY'))),
                expiresIn: this.config.get<string | number>('JWT_EXPIRATION_TIME')
            })
        };
    }
}
