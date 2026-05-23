import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { TicketsController } from './tickets.controller';
import { GeminiService } from './gemini.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [TicketsController],
  providers: [GeminiService],
  exports: [GeminiService],
})
export class TicketsModule {}
