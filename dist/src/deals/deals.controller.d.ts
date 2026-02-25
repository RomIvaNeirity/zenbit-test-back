import { DealsService } from './deals.service';
export declare class DealsController {
    private dealsService;
    constructor(dealsService: DealsService);
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
