import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { PayloadDto } from '../dto/payload.dto';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: CacheStore) {
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
    const token = JwtStrategy.extractTokenFromHeader(req);
    const access_key = await this.cacheManager.get<string>(
      payload.name + '_access',
    );
    if (!token || !access_key || access_key !== token) return false;

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
