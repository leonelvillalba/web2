import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../entities/user.entity';
import { GoalsService } from './goals.service';

@Controller('goals')
@UseGuards(JwtAuthGuard)
export class GoalsController {
  constructor(private goalsService: GoalsService) {}

  @Get()
  findAll(@GetUser() user: User) {
    return this.goalsService.findAll(user.id);
  }

  @Post()
  create(@GetUser() user: User, @Body() body: { name: string; target: number; current?: number; color?: string }) {
    return this.goalsService.create(user.id, body);
  }

  @Put(':id')
  update(@GetUser() user: User, @Param('id') id: string, @Body() body: Partial<{ name: string; target: number; current: number; color: string }>) {
    return this.goalsService.update(+id, user.id, body);
  }

  @Delete(':id')
  remove(@GetUser() user: User, @Param('id') id: string) {
    return this.goalsService.remove(+id, user.id);
  }
}
