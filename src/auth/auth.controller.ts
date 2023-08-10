import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RefreshDto } from './dto/refresh.dto';
import { Role } from '../common/enums/role.enum';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private access_exp;

  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    this.access_exp = configService.get('jwt.access.exp');
  }
  @Post('/register')
  async register(
    @Body(ValidationPipe) dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = await this.authService.register(dto, Role.User);
    this.authService.saveInCookie(response, token);
    return token;
  }

  @Post('/registerAdmin')
  async registerAdmin(
    @Body(ValidationPipe) dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const env = this.configService.get('env');
    if (env !== 'dev' && env !== 'development') throw new ForbiddenException();
    const token = await this.authService.register(dto, Role.Admin);
    this.authService.saveInCookie(response, token);
    return token;
  }

  @Post('/login')
  async login(
    @Body(ValidationPipe) dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const tokens = await this.authService.login(dto);
    this.authService.saveInCookie(response, tokens);
    return tokens;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/logout')
  logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    this.authService.removeFromCookie(response);
    return this.authService.logout(request);
  }

  @Post('/refresh')
  refresh(
    @Body(ValidationPipe) { refresh_key }: RefreshDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.refresh(refresh_key);
  }
}
