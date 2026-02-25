import { PrismaService } from '../prisma/prisma.service';
export declare class DealsService {
    private prisma;
    constructor(prisma: PrismaService);
    getOpenDeals(): Promise<{
        id: string;
        title: string;
        imageUrl: string;
        price: number;
        yield: import("@prisma/client/runtime/library").Decimal;
        tiket: number;
        daysLeft: number;
        soldPercent: number;
    }[]>;
}
