import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import dataSource from '../../database/db.datasource';
import { User } from '../user/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import ms from 'ms';
import { PayloadDto } from './dto/payload.dto';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';

@Injectable()
export class AuthService {
  private access_key: string;
  private access_exp: string;
  private refresh_key: string;
  private refresh_exp: string;

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
  ) {
    this.access_key = this.configService.get('jwt.access_key');
    this.access_exp = this.configService.get('jwt.access_exp');
    this.refresh_key = this.configService.get('jwt.refresh_key');
    this.refresh_exp = this.configService.get('jwt.refresh_exp');
  }
  async validateUser(username, pass) {
    const user = await this.userService.findByUsername(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async register({ username, password }: LoginDto, role: string) {
    const user = await this.userService.findByUsername(username);
    if (!!user) throw new BadRequestException('username is busy');

    const userInfo = { username, password, role };
    await this.userService.create(userInfo);
    return this.login({ username, password });
  }

  async login({ username, password }: LoginDto) {
    const user = await this.userService.findByUsername(username);
    if (!user) throw new BadRequestException('user not found');
    if (user.password !== password) throw new UnauthorizedException();

    const payload = { name: user.username, sub: user.id, role: user.role };
    const tokens = await this.getToken(payload);

    this.updateToken(username, tokens);

    return this.splitTokensToObj(tokens);
  }

  async logout(request: Request) {
    const token = this.extractTokenFromHeader(request);
    return this.cacheManager.del(token);
  }

  async refresh(token: string) {
    const { name, sub, role } = await this.decodeToken(token);
    const refresh_key = await this.cacheManager.get<string>(name + '_refresh');
    if (!refresh_key || token !== refresh_key)
      throw new UnauthorizedException();

    const tokens = await this.getToken({ name, sub, role });
    // this.userService.updateToken(user, tokens);
    this.updateToken(name, tokens);

    return this.splitTokensToObj(tokens);
  }

  async updateToken(name: string, [access_key, refresh_key]: string[]) {
    return Promise.all([
      this.cacheManager.set(name + '_access', access_key, {
        ttl: ms(this.access_exp),
      }),
      this.cacheManager.set(name + '_refresh', refresh_key, {
        ttl: ms(this.refresh_exp),
      }),
    ]);
  }

  // async deleteToken(access_key: string) {
  //   const refresh_key = await this.cacheManager.get<string>(access_key);
  //   return Promise.all([
  //     this.cacheManager.del(access_key),
  //     this.cacheManager.del(refresh_key),
  //   ]);
  // }

  splitTokensToObj(tokens: string[]) {
    return { access_key: tokens[0], refresh_key: tokens[1] };
  }

  async decodeToken(token: string) {
    return this.jwtService.decode(token) as PayloadDto;
  }

  async getToken(payload: Partial<PayloadDto>) {
    return Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.access_key,
        expiresIn: this.access_exp,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.refresh_key,
        expiresIn: this.refresh_exp,
      }),
    ]);
  }

  saveInCookie(
    response: Response,
    { access_key, refresh_key }: { [key: string]: string },
  ) {
    const accessOptions = {
      expires: new Date(new Date().getTime() + ms(this.access_exp)),
      sameSite: true,
      httpOnly: true,
    };

    const refreshOptions = {
      expires: new Date(new Date().getTime() + ms(this.refresh_exp)),
      sameSite: true,
      httpOnly: true,
    };

    response.cookie('access_key', access_key, accessOptions);
    response.cookie('refresh_key', refresh_key, refreshOptions);
  }

  removeFromCookie(response: Response) {
    const options = {
      expires: new Date(),
      sameSite: true,
      httpOnly: true,
    };

    response.cookie('access_key', {}, options);
    response.cookie('refresh_key', {}, options);
  }

  extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
