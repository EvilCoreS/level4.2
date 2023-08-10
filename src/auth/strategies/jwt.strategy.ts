import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { PayloadDto } from '../dto/payload.dto';
import { JwtService } from '@nestjs/jwt';
import dataSource from '../../../database/db.datasource';
import { User } from '../../user/entity/user.entity';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        JwtStrategy.extractJWT,
      ]),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: process.env['JWT_ACCESS_KEY'],
    });
  }

  async validate(req: Request, payload: PayloadDto) {
    const user = await dataSource.manager.findOne(User, {
      where: { id: payload.sub },
    });
    const token = JwtStrategy.extractTokenFromHeader(req);
    if (!token) return false;
    if (user.access_key !== token) return false;

    req['user'] = payload;
    return payload;
  }

  private static extractJWT(req: Request): string | null {
    if (!!req.cookies && 'access_token' in req.cookies) {
      return req.cookies.access_token;
    }
    return null;
  }

  private static extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
