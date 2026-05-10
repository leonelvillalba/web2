import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private readonly ocrApiKey: string;
  private readonly geminiApiKey: string;

  constructor(private configService: ConfigService) {
    // OCR.space — free tier, no billing required
    this.ocrApiKey = this.configService.get<string>('OCR_API_KEY') || 'K89674888388957';
    this.geminiApiKey = this.configService.get<string>('GEMINI_API_KEY') || '';
  }

  /**
   * Analiza una imagen de ticket/factura usando OCR.space + parsing inteligente
   */
  async analyzeTicket(imageBuffer: Buffer, mimeType: string): Promise<{
    merchant: string;
    amount: number;
    date: string;
    category: string;
    items: string[];
    confidence: number;
  }> {
    const base64Image = imageBuffer.toString('base64');
    const base64WithPrefix = `data:${mimeType};base64,${base64Image}`;

    // ─── Paso 1: OCR con OCR.space (gratis) ───
    this.logger.log('Enviando imagen a OCR.space...');

    const formData = new URLSearchParams();
    formData.append('base64Image', base64WithPrefix);
    formData.append('language', 'spa');
    formData.append('isOverlayRequired', 'false');
    formData.append('detectOrientation', 'true');
    formData.append('scale', 'true');
    formData.append('OCREngine', '2'); // Engine 2 es mejor para tickets

    const ocrResponse = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      headers: {
        'apikey': this.ocrApiKey,
      },
      body: formData,
    });

    const ocrResult = await ocrResponse.json();

    if (!ocrResult.ParsedResults || ocrResult.ParsedResults.length === 0) {
      this.logger.error('OCR.space no devolvió resultados');
      throw new Error('No se pudo leer el texto del ticket. Intentá con una foto más clara.');
    }

    const ocrText = ocrResult.ParsedResults[0].ParsedText;
    this.logger.log(`OCR texto extraído: ${ocrText.substring(0, 200)}...`);

    if (!ocrText || ocrText.trim().length < 5) {
      throw new Error('No se detectó texto en la imagen. Asegurate de que sea una foto clara de un ticket.');
    }

    // ─── Paso 2: Intentar Gemini para análisis inteligente ───
    if (this.geminiApiKey) {
      try {
        const result = await this.analyzeWithGemini(ocrText);
        if (result) return result;
      } catch (e) {
        this.logger.warn(`Gemini falló, usando parsing local: ${e.message}`);
      }
    }

    // ─── Paso 3: Fallback — parsing local inteligente ───
    return this.parseTicketText(ocrText);
  }

  /**
   * Intenta analizar el texto extraído con Gemini
   */
  private async analyzeWithGemini(ocrText: string) {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(this.geminiApiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `Analizá este texto extraído de un ticket de compra:

"""
${ocrText}
"""

Extraé:
- merchant: nombre del comercio
- amount: monto total (solo número)
- date: fecha en YYYY-MM-DD
- category: UNA de: Supermercado, Transporte, Restaurantes, Salud, Vivienda, Servicios, Suscripciones, Compras, Otros
- items: array con máx 5 productos
- confidence: confianza de 0 a 1

Respondé SOLO con JSON válido:
{"merchant":"...","amount":0,"date":"YYYY-MM-DD","category":"...","items":["..."],"confidence":0.0}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      merchant: parsed.merchant || 'Comercio desconocido',
      amount: parseFloat(parsed.amount) || 0,
      date: parsed.date || new Date().toISOString().split('T')[0],
      category: parsed.category || 'Otros',
      items: Array.isArray(parsed.items) ? parsed.items : [],
      confidence: parseFloat(parsed.confidence) || 0.8,
    };
  }

  /**
   * Parsing local inteligente del texto OCR (fallback sin Gemini)
   */
  private parseTicketText(text: string): {
    merchant: string;
    amount: number;
    date: string;
    category: string;
    items: string[];
    confidence: number;
  } {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    // ─── Merchant: primera línea con texto significativo ───
    let merchant = 'Comercio';
    for (const line of lines.slice(0, 5)) {
      const clean = line.replace(/[^a-záéíóúñA-ZÁÉÍÓÚÑ\s]/g, '').trim();
      if (clean.length >= 3 && !/^\d+$/.test(clean) && !/fecha|hora|ticket|factura|comprobante/i.test(clean)) {
        merchant = clean.split(/\s+/).slice(0, 4).join(' ');
        break;
      }
    }

    // ─── Amount: buscar "TOTAL" o el número más grande ───
    let amount = 0;
    const allAmounts: number[] = [];

    for (const line of lines) {
      // Buscar líneas con TOTAL, IMPORTE, SUMA
      if (/total|importe|suma|a pagar|amount/i.test(line)) {
        const nums = line.match(/[\d.,]+/g);
        if (nums) {
          for (const n of nums) {
            const val = parseFloat(n.replace(/\./g, '').replace(',', '.'));
            if (val > 0) allAmounts.push(val);
          }
        }
      }

      // Capturar todos los montos con formato $X.XXX,XX o X.XXX
      const moneyMatches = line.match(/\$?\s*([\d.]+[,.]?\d{0,2})/g);
      if (moneyMatches) {
        for (const m of moneyMatches) {
          const val = parseFloat(m.replace(/[$\s]/g, '').replace(/\./g, '').replace(',', '.'));
          if (val > 0 && val < 10000000) allAmounts.push(val);
        }
      }
    }

    // El total suele ser el número más grande, o el que está en la línea "TOTAL"
    if (allAmounts.length > 0) {
      amount = Math.max(...allAmounts);
    }

    // ─── Date: buscar patrones de fecha ───
    let date = new Date().toISOString().split('T')[0];
    const datePatterns = [
      /(\d{2})[\/\-.](\d{2})[\/\-.](\d{4})/,  // DD/MM/YYYY
      /(\d{4})[\/\-.](\d{2})[\/\-.](\d{2})/,  // YYYY/MM/DD
      /(\d{2})[\/\-.](\d{2})[\/\-.](\d{2})/,  // DD/MM/YY
    ];

    for (const line of lines) {
      for (const pattern of datePatterns) {
        const match = line.match(pattern);
        if (match) {
          try {
            if (match[1].length === 4) {
              date = `${match[1]}-${match[2]}-${match[3]}`;
            } else if (match[3].length === 4) {
              date = `${match[3]}-${match[2]}-${match[1]}`;
            } else {
              const year = parseInt(match[3]) + 2000;
              date = `${year}-${match[2]}-${match[1]}`;
            }
            break;
          } catch {}
        }
      }
      if (date !== new Date().toISOString().split('T')[0]) break;
    }

    // ─── Category: detectar por keywords ───
    const fullText = text.toLowerCase();
    const categoryMap: Record<string, string[]> = {
      'Supermercado': ['carrefour', 'coto', 'dia', 'jumbo', 'disco', 'vea', 'walmart', 'changomas', 'super', 'mercado', 'almacen'],
      'Restaurantes': ['restaurant', 'cafe', 'bar', 'pizza', 'burger', 'comida', 'mcdonald', 'starbucks', 'subway', 'rappi'],
      'Transporte': ['ypf', 'shell', 'axion', 'nafta', 'estacion', 'combustible', 'uber', 'cabify', 'sube', 'peaje'],
      'Salud': ['farmacia', 'hospital', 'clinica', 'medic', 'salud', 'laboratorio', 'optica'],
      'Compras': ['zara', 'nike', 'adidas', 'tienda', 'shopping', 'ropa', 'electro', 'musimundo', 'garbarino', 'fravega'],
      'Servicios': ['edenor', 'edesur', 'metrogas', 'telecom', 'personal', 'claro', 'movistar', 'internet', 'luz', 'gas', 'agua'],
      'Suscripciones': ['netflix', 'spotify', 'disney', 'hbo', 'amazon', 'youtube', 'mercadolibre'],
      'Vivienda': ['alquiler', 'expensas', 'inmobiliaria', 'propiedad'],
    };

    let category = 'Otros';
    for (const [cat, keywords] of Object.entries(categoryMap)) {
      if (keywords.some(kw => fullText.includes(kw))) {
        category = cat;
        break;
      }
    }

    // ─── Items: líneas que parecen productos ───
    const items: string[] = [];
    for (const line of lines) {
      if (items.length >= 5) break;
      // Líneas con texto y un número al final (producto + precio)
      if (/[a-záéíóú]{3,}.*\d/i.test(line) &&
          !/total|subtotal|iva|descuento|fecha|hora|ticket|cuit|dni|tel/i.test(line) &&
          line.length > 5 && line.length < 80) {
        const clean = line.replace(/[\d$.,]+$/g, '').trim();
        if (clean.length > 2) items.push(clean.substring(0, 40));
      }
    }

    const confidence = amount > 0 ? 0.75 : 0.4;

    this.logger.log(`Parsed: merchant=${merchant}, amount=${amount}, date=${date}, category=${category}`);

    return { merchant, amount, date, category, items, confidence };
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
    if (this.geminiApiKey) {
      try {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(this.geminiApiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const expensesSummary = expenses.map(e =>
          `${e.date} | ${e.merchant} | ${e.category} | $${e.amount}`
        ).join('\n');

        const prompt = `Sos un asesor financiero experto. Analizá los siguientes gastos:

${expensesSummary}

Respondé SOLO con JSON:
{"summary":"resumen breve","patterns":["patron1","patron2"],"recommendations":["rec1","rec2"],"profile":"Ahorrador|Equilibrado|Impulsivo|En riesgo"}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
      } catch (e) {
        this.logger.warn(`Gemini análisis falló: ${e.message}`);
      }
    }

    // Fallback local
    return {
      summary: 'Análisis basado en tus gastos recientes.',
      patterns: ['Gastos distribuidos en múltiples categorías'],
      recommendations: ['Revisá tus gastos más frecuentes para identificar ahorros'],
      profile: 'Equilibrado',
    };
  }
}
