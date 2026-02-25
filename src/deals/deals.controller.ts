import { Controller, Get } from '@nestjs/common';
import { DealsService } from './deals.service';

@Controller('deals')
export class DealsController {
  constructor(private dealsService: DealsService) {}
  @Get()
  getOpenDeals() {
    return this.dealsService.getOpenDeals();
  }
}
