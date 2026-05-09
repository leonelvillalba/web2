import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { GeminiService } from './gemini.service';

@Module({
  controllers: [TicketsController],
  providers: [GeminiService],
  exports: [GeminiService],
})
export class TicketsModule {}
