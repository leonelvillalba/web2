import { Controller, Get, UseGuards, ForbiddenException, Param, Put } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../entities/user.entity';
import { AdvisorService } from './advisor.service';

@Controller('advisor')
@UseGuards(JwtAuthGuard)
export class AdvisorController {
  constructor(private advisorService: AdvisorService) {}

  @Get('clients')
  getClients(@GetUser() user: User) {
    if (user.role !== 'advisor') {
      throw new ForbiddenException('No tienes permisos de asesor');
    }
    return this.advisorService.getClients();
  }

  @UseGuards(JwtAuthGuard)
  @Put('clients/:id/ban')
  toggleBan(@GetUser() user: User, @Param('id') id: string) {
    if (user.role !== 'advisor') {
      throw new ForbiddenException('No tienes permisos de asesor');
    }
    return this.advisorService.toggleBan(Number(id));
  }
}
