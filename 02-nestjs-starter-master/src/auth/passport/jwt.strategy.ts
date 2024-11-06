import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/users/user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private config: ConfigService,) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get<string>('JWT_SECRET_KEY'),
        });
        console.log('JwtStrategy initialized: ', config.get<string>('JWT_SECRET_KEY'));
    }

    async validate(payload: IUser) {
        const { _id, name, email, role } = payload;
        return {
            _id,
            name,
            email,
            role
        };
    }

}