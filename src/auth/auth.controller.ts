import {
  Body,
  Controller,
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
import { RegisterDto } from './dto/register.dto';
import { VerifyDto } from './dto/verify.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {}
  @Post('/register')
  async register(
    @Body(ValidationPipe)
    dto: RegisterDto,
  ) {
    return await this.authService.register(dto);
  }

  @Post('/login')
  async login(
    @Body(ValidationPipe) dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(dto);
    this.authService.saveInCookie(
      response,
      this.authService.getTokensFromResultToObj(result),
    );
    return result;
  }

  @Post('/verify')
  async verify(@Body(ValidationPipe) dto: VerifyDto) {
    return this.authService.verifyEmail(dto);
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
  async refresh(
    @Body(ValidationPipe) { username, refresh_key }: RefreshDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.refresh(refresh_key, username);
    this.authService.saveInCookie(
      response,
      this.authService.getTokensFromResultToObj(result),
    );
    return result;
  }
}
