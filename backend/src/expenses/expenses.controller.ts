import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../entities/user.entity';
import { ExpensesService } from './expenses.service';

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  @Get()
  findAll(@GetUser() user: User) {
    return this.expensesService.findAllByUser(user.id);
  }

  @Get('stats')
  getStats(@GetUser() user: User) {
    return this.expensesService.getStatsByUser(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expensesService.findOne(+id);
  }

  @Post()
  create(@Body() body: { merchant: string; amount: number; date: string; category: string; type?: string; description?: string }, @GetUser() user: User) {
    return this.expensesService.create({ ...body, userId: user.id });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.expensesService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.expensesService.remove(+id);
  }
}
