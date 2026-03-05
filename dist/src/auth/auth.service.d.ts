import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { ResetPasswordConfirmDto } from './dto/reset-password-confirm.dto';
import { MailService } from '../mail/mail.service';
import { Response } from 'express';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly mailService;
    constructor(prisma: PrismaService, jwtService: JwtService, mailService: MailService);
    register(dto: RegisterDto): Promise<{
        user: {
            id: number;
            email: string;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    login(email: string, password: string, res?: Response): Promise<{
        id: number;
        email: string;
        accessToken: string;
        refreshToken: string;
    }>;
    logout(): {
        message: string;
    };
    requestPasswordReset(dto: ResetPasswordRequestDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordConfirmDto): Promise<{
        message: string;
    }>;
    refresh(refreshToken: string, res: Response): Promise<{
        message: string;
    }>;
}
