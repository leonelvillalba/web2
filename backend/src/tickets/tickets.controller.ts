import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GeminiService } from './gemini.service';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly geminiService: GeminiService) {}

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
  async uploadTicket(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se recibió ninguna imagen');
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
  async chat(@Body() body: { message: string; history?: { role: string; text: string }[] }) {
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
