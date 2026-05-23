import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GeminiService } from './gemini.service';

@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class TicketsController {
  constructor(
    private readonly geminiService: GeminiService,
    @InjectRepository(User) private usersRepo: Repository<User>,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('ticket', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
        if (allowed.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Solo se permiten imágenes JPG, PNG o WebP'), false);
        }
      },
    }),
  )
  async uploadTicket(@UploadedFile() file: Express.Multer.File, @GetUser() user: User) {
    if (!file) {
      throw new BadRequestException('No se recibió ninguna imagen');
    }

    if (user.plan === 'basic') {
      const today = new Date().toISOString().split('T')[0];
      const lastScanDateObj = user.lastScanDate ? new Date(user.lastScanDate) : null;
      const lastScan = lastScanDateObj ? lastScanDateObj.toISOString().split('T')[0] : '';

      if (lastScan === today) {
        if (user.scansToday >= 3) {
          throw new ForbiddenException('Límite de escaneos diarios alcanzado. Mejorá a Plus.');
        }
        user.scansToday += 1;
      } else {
        user.lastScanDate = new Date();
        user.scansToday = 1;
      }
      await this.usersRepo.save(user);
    }

    try {
      const result = await this.geminiService.analyzeTicket(
        file.buffer,
        file.mimetype,
      );
      return { success: true, data: result };
    } catch (error) {
      const msg = error.message || 'Error desconocido';
      if (msg.includes('429') || msg.includes('quota') || msg.includes('Quota')) {
        throw new BadRequestException(
          'Se superó la cuota de la IA. Intentá de nuevo en unos segundos.',
        );
      }
      throw new BadRequestException(msg);
    }
  }

  @Post('chat')
  async chat(@Body() body: { message: string; history?: { role: string; text: string }[] }, @GetUser() user: User) {
    if (user.plan !== 'plus') {
      throw new ForbiddenException('El asistente IA es exclusivo del plan Plus.');
    }

    if (!body.message || body.message.trim().length === 0) {
      throw new BadRequestException('El mensaje no puede estar vacío');
    }

    try {
      const response = await this.geminiService.chat(body.message.trim(), body.history || []);
      return { success: true, data: { reply: response } };
    } catch (error) {
      throw new BadRequestException(error.message || 'Error al procesar el mensaje');
    }
  }
}
