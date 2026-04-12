import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ExpensesService } from './expenses.service';

@Controller('expenses')
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  @Get()
  findAll(@Query('userId') userId: string) {
    return this.expensesService.findAllByUser(+userId);
  }

  @Get('stats')
  getStats(@Query('userId') userId: string) {
    return this.expensesService.getStatsByUser(+userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expensesService.findOne(+id);
  }

  @Post()
  create(@Body() body: { merchant: string; amount: number; date: string; category: string; type?: string; description?: string; userId: number }) {
    return this.expensesService.create(body);
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
