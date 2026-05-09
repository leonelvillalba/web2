import {
  Controller,
  Post,
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
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
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

    const result = await this.geminiService.analyzeTicket(
      file.buffer,
      file.mimetype,
    );

    return {
      success: true,
      data: result,
    };
  }
}
