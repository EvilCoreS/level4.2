import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { PayloadDto } from '../dto/payload.dto';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
    private configService: ConfigService,
  ) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: configService.get('aws_cognito.authority'),
      }),

      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      algorithms: ['RS256'],
    });
  }

  async validate(req: Request, payload: PayloadDto) {
    if (!payload || !payload['username']) return false;
    const token = JwtStrategy.extractTokenFromHeader(req);

    const username = payload['username'];
    const access_token = await this.cacheManager.get(username + '_access');

    if (token !== access_token) return false;

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
