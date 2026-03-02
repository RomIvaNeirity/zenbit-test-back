import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Res,
  Get,
  Req,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Response } from 'express';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { ResetPasswordConfirmDto } from './dto/reset-password-confirm.dto';

interface RequestWithHeaders extends Request {
  headers: Record<string, string | undefined>;
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

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
  login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(body.email, body.password, res);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken', {
      path: '/',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return { success: true };
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

  @Get('me')
  getMe(@Req() req: Request) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        return { user: null };
      }

      const payload = this.jwtService.verify<{
        sub: number;
        email: string;
      }>(refreshToken);

      return {
        user: {
          id: payload.sub,
          email: payload.email,
        },
      };
    } catch {
      return { user: null };
    }
  }
}
