import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Deal } from '@prisma/client';

@Injectable()
export class DealsService {
  constructor(private prisma: PrismaService) {}

  async getOpenDeals(): Promise<Deal[]> {
    return this.prisma.deal.findMany();
  }
}
