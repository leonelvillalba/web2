import { Controller, Get } from '@nestjs/common';
import { AdvisorService } from './advisor.service';

@Controller('advisor')
export class AdvisorController {
  constructor(private advisorService: AdvisorService) {}

  @Get('clients')
  getClients() {
    return this.advisorService.getClients();
  }
}
