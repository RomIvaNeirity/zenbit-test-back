import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAll(): Promise<{
        id: number;
        email: string;
        passwordHash: string;
        resetPasswordToken: string | null;
        resetTokenExpires: Date | null;
        createdAt: Date;
    }[]>;
}
