import { PrismaService } from '../prisma/prisma.service';
import { Deal } from '@prisma/client';
export declare class DealsService {
    private prisma;
    constructor(prisma: PrismaService);
    getOpenDeals(): Promise<Deal[]>;
}
