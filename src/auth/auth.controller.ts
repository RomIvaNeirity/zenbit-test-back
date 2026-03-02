import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { ResetPasswordConfirmDto } from './dto/reset-password-confirm.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.register(dto);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      user,
      accessToken,
    };
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Post('logout')
  logout() {
    return this.authService.logout();
  }

  @Post('reset-password')
  requestPasswordReset(@Body() dto: ResetPasswordRequestDto) {
    return this.authService.requestPasswordReset(dto);
  }

  @Post('reset-password/confirm')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() dto: ResetPasswordConfirmDto) {
    return this.authService.resetPassword(dto);
  }
}
