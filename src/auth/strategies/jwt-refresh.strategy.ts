import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { PayloadDto } from '../dto/payload.dto';
import dataSource from '../../../database/db.datasource';
import { User } from '../../user/entity/user.entity';

export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtRefreshStrategy.extractJWT,
      ]),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: process.env['JWT_REFRESH_KEY'],
    });
  }

  async validate(req: Request, payload: PayloadDto) {
    const user = await dataSource.manager.findOne(User, {
      where: { id: payload.sub },
    });
    const token = JwtRefreshStrategy.extractTokenFromHeader(req);
    if (!token) return false;
    if (user.access_key !== token) return false;
    return payload;
  }
  private static extractJWT(req: Request): string | null {
    if (req.cookies && 'refresh_token' in req.cookies) {
      return req.cookies.refresh_token;
    }
    return null;
  }

  private static extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
