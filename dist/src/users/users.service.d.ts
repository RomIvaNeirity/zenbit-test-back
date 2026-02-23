import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getAll(): Promise<{
        id: number;
        email: string;
        passwordHash: string;
        resetPasswordToken: string | null;
        resetTokenExpires: Date | null;
        createdAt: Date;
    }[]>;
}
