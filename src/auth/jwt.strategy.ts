import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.authorization;
        },
        (request: Request) => {
          const BEARER_AUTH_SCHEME = 'bearer';
          let token = null;
          if (request?.headers['authorization']) {
            const authString = request.headers['authorization'];
            const authStringSplit = authString.split(' ');
            if (authStringSplit[0].toLowerCase() === BEARER_AUTH_SCHEME)
              token = authStringSplit[1];
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    try {
      const user = await this.usersService.getUserById(payload.id);
      return user.isLocked ? null : user;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
