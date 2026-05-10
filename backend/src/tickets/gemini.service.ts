import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private readonly model: any;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      this.logger.warn('GEMINI_API_KEY no configurada — OCR deshabilitado');
      return;
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
  }

  /**
   * Analiza una imagen de ticket/factura y extrae los datos relevantes
   */
  async analyzeTicket(imageBuffer: Buffer, mimeType: string): Promise<{
    merchant: string;
    amount: number;
    date: string;
    category: string;
    items: string[];
    confidence: number;
  }> {
    if (!this.model) {
      throw new Error('Servicio de IA no disponible. Configurá GEMINI_API_KEY.');
    }

    const base64Image = imageBuffer.toString('base64');

    const prompt = `Analizá esta imagen de un ticket, factura o comprobante de compra.

Extraé la siguiente información:
- **merchant**: nombre del comercio o empresa
- **amount**: monto total (solo el número, sin símbolos de moneda)
- **date**: fecha en formato YYYY-MM-DD
- **category**: clasificá en UNA de estas categorías: Supermercado, Transporte, Restaurantes, Salud, Vivienda, Servicios, Suscripciones, Compras, Otros
- **items**: listado breve de los productos/servicios (máximo 5 items)
- **confidence**: tu nivel de confianza en los datos extraídos, de 0 a 1

Si no podés leer algún campo, usá un valor razonable basado en el contexto.
Si la fecha no es legible, usá la fecha de hoy: ${new Date().toISOString().split('T')[0]}.

Respondé ÚNICAMENTE con un JSON válido, sin markdown ni explicaciones:
{"merchant": "...", "amount": 0, "date": "YYYY-MM-DD", "category": "...", "items": ["..."], "confidence": 0.0}`;

    try {
      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Image,
          },
        },
      ]);

      const response = result.response;
      const text = response.text();
      this.logger.log(`Gemini raw response: ${text}`);

      // Extraer JSON de la respuesta (puede venir con markdown ```json...```)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('La IA no pudo interpretar el ticket');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        merchant: parsed.merchant || 'Comercio desconocido',
        amount: parseFloat(parsed.amount) || 0,
        date: parsed.date || new Date().toISOString().split('T')[0],
        category: parsed.category || 'Otros',
        items: Array.isArray(parsed.items) ? parsed.items : [],
        confidence: parseFloat(parsed.confidence) || 0.5,
      };
    } catch (error) {
      this.logger.error(`Error al analizar ticket: ${error.message}`);
      if (error.message?.includes('JSON')) {
        throw new Error('No se pudo interpretar la respuesta de la IA');
      }
      throw new Error(`Error al procesar el ticket: ${error.message}`);
    }
  }

  /**
   * Analiza gastos y genera recomendaciones financieras
   */
  async analyzeExpenses(expenses: any[]): Promise<{
    summary: string;
    patterns: string[];
    recommendations: string[];
    profile: string;
  }> {
    if (!this.model) {
      throw new Error('Servicio de IA no disponible');
    }

    const expensesSummary = expenses.map(e =>
      `${e.date} | ${e.merchant} | ${e.category} | $${e.amount}`
    ).join('\n');

    const prompt = `Sos un asesor financiero experto. Analizá los siguientes gastos de un usuario:

${expensesSummary}

Generá un análisis completo con:
- **summary**: resumen breve de la situación financiera (2-3 oraciones)
- **patterns**: array con 3-5 patrones de consumo detectados
- **recommendations**: array con 3-5 recomendaciones concretas para ahorrar
- **profile**: clasificá al usuario como: "Ahorrador", "Equilibrado", "Impulsivo" o "En riesgo"

Respondé ÚNICAMENTE con un JSON válido:
{"summary": "...", "patterns": ["..."], "recommendations": ["..."], "profile": "..."}`;

    try {
      const result = await this.model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Respuesta inválida');
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      this.logger.error(`Error en análisis: ${error.message}`);
      throw new Error('Error al analizar los gastos con IA');
    }
  }
}
