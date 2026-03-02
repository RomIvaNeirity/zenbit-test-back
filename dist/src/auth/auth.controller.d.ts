import { JwtService } from '@nestjs/jwt';
import type { Response } from 'express';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { ResetPasswordConfirmDto } from './dto/reset-password-confirm.dto';
export declare class AuthController {
    private authService;
    private readonly jwtService;
    constructor(authService: AuthService, jwtService: JwtService);
    register(dto: RegisterDto, res: Response): Promise<{
        user: {
            id: number;
            email: string;
        };
        accessToken: string;
    }>;
    login(body: LoginDto, res: Response): Promise<{
        id: number;
        email: string;
        accessToken: string;
    }>;
    logout(res: Response): {
        success: boolean;
    };
    requestPasswordReset(dto: ResetPasswordRequestDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordConfirmDto): Promise<{
        message: string;
    }>;
    getMe(req: Request): {
        user: null;
    } | {
        user: {
            id: number;
            email: string;
        };
    };
}
