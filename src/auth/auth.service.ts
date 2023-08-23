import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import ms from 'ms';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import {
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoRefreshToken,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import { VerifyDto } from './dto/verify.dto';
@Injectable()
export class AuthService {
  private access_exp: string;
  private refresh_exp: string;
  private userPool: CognitoUserPool;
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
  ) {
    this.access_exp = this.configService.get('jwt.access_exp');
    this.refresh_exp = this.configService.get('jwt.refresh_exp');
    this.userPool = new CognitoUserPool({
      UserPoolId: this.configService.get('aws_cognito.user_pool_id'),
      ClientId: this.configService.get('aws_cognito.client_id'),
    });
  }
  async register({ username, email, password }) {
    return new Promise((resolve, reject) => {
      return this.userPool.signUp(
        username,
        password,
        [new CognitoUserAttribute({ Name: 'email', Value: email })],
        null,
        async (err, result) => {
          if (!result) {
            reject(err);
          } else {
            resolve(result.user);
          }
        },
      );
    });
  }

  async login({ username, password }: LoginDto) {
    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });
    const userData = {
      Username: username,
      Pool: this.userPool,
    };

    const newUser = new CognitoUser(userData);

    const result = (await new Promise((resolve, reject) => {
      return newUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    })) as CognitoUserSession;

    await this.updateToken(username, this.getTokensFromResultToArr(result));

    return result;
  }

  async verifyEmail({ username, code }: VerifyDto) {
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: this.userPool,
    });

    return new Promise((resolve, reject) => {
      cognitoUser.confirmRegistration(code, true, function (err, result) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  async logout(request: Request) {
    const { user } = request;
    this.cacheManager.del(user['username'] + '_access');
    this.cacheManager.del(user['username'] + '_refresh');
    return { ok: true };
  }

  async refresh(token: string, username: string) {
    const user = new CognitoUser({
      Username: username,
      Pool: this.userPool,
    });

    const refresh_token = new CognitoRefreshToken({ RefreshToken: token });

    const result = (await new Promise((resolve, reject) => {
      user.refreshSession(refresh_token, (err, result) => {
        if (!!err) reject(err);
        else resolve(result);
      });
    })) as CognitoUserSession;

    await this.updateToken(username, this.getTokensFromResultToArr(result));

    return result;
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

  getTokensFromResultToArr(result: CognitoUserSession) {
    return [
      result.getAccessToken().getJwtToken(),
      result.getRefreshToken().getToken(),
    ];
  }

  getTokensFromResultToObj(result: CognitoUserSession) {
    return {
      access_key: result.getAccessToken().getJwtToken(),
      refresh_key: result.getRefreshToken().getToken(),
    };
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
}
