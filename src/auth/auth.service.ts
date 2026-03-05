import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { randomBytes } from 'crypto';
import { ResetPasswordConfirmDto } from './dto/reset-password-confirm.dto';
import { MailService } from '../mail/mail.service';
import { Response } from 'express';

interface JwtPayload {
  sub: number; // або string, залежить від твоєї БД
  email?: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const { email, password } = dto;
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash: hash,
      },
    });

    const payload = { sub: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(email: string, password: string, res?: Response) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // якщо передали res → ставимо cookie
    if (res) {
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: false, // в dev false
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000,
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }

    return {
      id: user.id,
      email: user.email,
      accessToken,
      refreshToken,
    };
  }

  logout() {
    return { message: 'Logged out successfully' };
  }

  async requestPasswordReset(dto: ResetPasswordRequestDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const token = randomBytes(32).toString('hex');
    await this.prisma.user.update({
      where: { email: dto.email },
      data: {
        resetPasswordToken: token,
        resetTokenExpires: new Date(Date.now() + 1000 * 60 * 15),
      },
    });
    await this.mailService.sendResetPassword(dto.email, token);
    return { message: 'Password reset token generated' };
  }
  async resetPassword(dto: ResetPasswordConfirmDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        resetPasswordToken: dto.token,
        resetTokenExpires: { gt: new Date() },
      },
    });
    if (!user) throw new BadRequestException('Invalid token');

    const hash = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hash, resetPasswordToken: null },
    });

    return { message: 'Password updated successfully' };
  }

  async refresh(refreshToken: string, res: Response) {
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const newAccessToken = this.jwtService.sign(
      { sub: user.id },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '15m',
      },
    );

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    return { message: 'Token refreshed' };
  }
}
