import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DealsService {
  constructor(private prisma: PrismaService) {}
  async getOpenDeals() {
    const deals = await this.prisma.deal.findMany();
    return deals;
  }
}
