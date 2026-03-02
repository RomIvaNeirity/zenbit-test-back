import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { ResetPasswordConfirmDto } from './dto/reset-password-confirm.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto, res: Response): Promise<{
        user: {
            id: number;
            email: string;
        };
        accessToken: string;
    }>;
    login(body: LoginDto): Promise<{
        id: number;
        email: string;
        token: string;
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
}
