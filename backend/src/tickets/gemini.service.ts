import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private readonly ocrApiKey: string;
  private readonly geminiApiKey: string;

  constructor(private configService: ConfigService) {
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

    // ─── Paso 1: OCR con OCR.space ───
    this.logger.log('Enviando imagen a OCR.space...');

    const formData = new URLSearchParams();
    formData.append('base64Image', base64WithPrefix);
    formData.append('language', 'spa');
    formData.append('isOverlayRequired', 'false');
    formData.append('detectOrientation', 'true');
    formData.append('scale', 'true');
    formData.append('OCREngine', '2');

    const ocrResponse = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      headers: { 'apikey': this.ocrApiKey },
      body: formData,
    });

    const ocrResult = await ocrResponse.json();

    if (!ocrResult.ParsedResults || ocrResult.ParsedResults.length === 0) {
      throw new Error('No se pudo leer el texto del ticket. Intentá con una foto más clara.');
    }

    const ocrText = ocrResult.ParsedResults[0].ParsedText;
    this.logger.log(`OCR texto completo:\n${ocrText}`);

    if (!ocrText || ocrText.trim().length < 5) {
      throw new Error('No se detectó texto en la imagen.');
    }

    // ─── Paso 2: Intentar Gemini ───
    if (this.geminiApiKey) {
      try {
        const result = await this.analyzeWithGemini(ocrText);
        if (result) return result;
      } catch (e) {
        this.logger.warn(`Gemini no disponible, usando parsing local: ${e.message?.substring(0, 80)}`);
      }
    }

    // ─── Paso 3: Parsing local mejorado ───
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
- amount: monto total (solo número, sin símbolo de moneda)
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

  // ─────────────────────────────────────────────────────────
  // PARSING LOCAL MEJORADO
  // ─────────────────────────────────────────────────────────
  private parseTicketText(text: string): {
    merchant: string;
    amount: number;
    date: string;
    category: string;
    items: string[];
    confidence: number;
  } {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const fullText = text.toLowerCase();

    const merchant = this.extractMerchant(lines, fullText);
    const amount = this.extractAmount(lines, fullText);
    const date = this.extractDate(lines, fullText);
    const category = this.detectCategory(fullText, merchant);
    const items = this.extractItems(lines);

    // Confianza basada en cuántos campos se extrajeron bien
    let confidence = 0.5;
    if (merchant !== 'Comercio') confidence += 0.15;
    if (amount > 0) confidence += 0.2;
    if (date !== new Date().toISOString().split('T')[0]) confidence += 0.1;
    confidence = Math.min(confidence, 0.95);

    this.logger.log(`Parsed: merchant=${merchant}, amount=${amount}, date=${date}, category=${category}, items=${items.length}`);

    return { merchant, amount, date, category, items, confidence };
  }

  /**
   * Extraer nombre del comercio
   * Estrategia: buscar marcas conocidas primero, luego la primera línea significativa
   */
  private extractMerchant(lines: string[], fullText: string): string {
    // Base de marcas conocidas (prioritarias)
    const knownBrands: Record<string, string> = {
      'zara': 'ZARA',
      'carrefour': 'Carrefour',
      'coto': 'Coto',
      'dia': 'Día',
      'jumbo': 'Jumbo',
      'disco': 'Disco',
      'vea': 'Vea',
      'walmart': 'Walmart',
      'changomas': 'Changomás',
      'mcdonalds': "McDonald's", 'mcdonald': "McDonald's",
      'burger king': 'Burger King',
      'starbucks': 'Starbucks',
      'subway': 'Subway',
      'ypf': 'YPF',
      'shell': 'Shell',
      'axion': 'Axion',
      'nike': 'Nike',
      'adidas': 'Adidas',
      'farmacity': 'Farmacity',
      'musimundo': 'Musimundo',
      'garbarino': 'Garbarino',
      'fravega': 'Frávega',
      'mercado pago': 'Mercado Pago', 'mercadopago': 'Mercado Pago',
      'mercado libre': 'Mercado Libre',
      'rappi': 'Rappi',
      'pedidosya': 'PedidosYa',
      'uber': 'Uber',
      'cabify': 'Cabify',
      'netflix': 'Netflix',
      'spotify': 'Spotify',
      'apple': 'Apple',
      'google': 'Google',
      'amazon': 'Amazon',
      'easy': 'Easy',
      'sodimac': 'Sodimac',
      'falabella': 'Falabella',
      'personal': 'Personal',
      'claro': 'Claro',
      'movistar': 'Movistar',
      'edenor': 'Edenor',
      'edesur': 'Edesur',
      'metrogas': 'Metrogas',
      'open 25': 'Open 25',
    };

    // Buscar marcas en todo el texto (une líneas consecutivas para capturar "mercado\npago")
    const joinedText = lines.slice(0, 10).join(' ').toLowerCase();
    for (const [key, brand] of Object.entries(knownBrands)) {
      if (joinedText.includes(key) || fullText.includes(key)) {
        return brand;
      }
    }

    // Fallback: primera línea con texto significativo (no numérica, no metadata)
    const skipWords = /fecha|hora|ticket|factura|comprobante|transferencia|cuit|cuil|tel|caja|empleado|sucursal|local|nro|n°|boleta|recibo|iva|total|subtotal/i;
    for (const line of lines.slice(0, 6)) {
      const clean = line.replace(/[^a-záéíóúñüA-ZÁÉÍÓÚÑÜ\s&.'-]/g, '').trim();
      if (clean.length >= 3 && !skipWords.test(clean) && !/^\d+$/.test(line)) {
        return clean.split(/\s+/).slice(0, 5).join(' ');
      }
    }

    return 'Comercio';
  }

  /**
   * Extraer monto total
   * Estrategia: buscar línea con "TOTAL" → si no, buscar $ con formato argentino
   */
  private extractAmount(lines: string[], fullText: string): number {
    // ─── Prioridad 1: Líneas con "total" (exacto, no subtotal) ───
    const totalAmounts: number[] = [];
    for (const line of lines) {
      const lower = line.toLowerCase();
      // Debe decir "total" pero NO "subtotal"
      if (/\btotal\b/i.test(lower) && !/subtotal/i.test(lower)) {
        const nums = this.extractNumbers(line);
        totalAmounts.push(...nums);
      }
    }
    if (totalAmounts.length > 0) {
      // El total suele ser el último o el más grande en la línea TOTAL
      return totalAmounts[totalAmounts.length - 1];
    }

    // ─── Prioridad 2: Líneas con "a pagar", "importe", "monto" ───
    for (const line of lines) {
      if (/a pagar|importe final|monto total|amount/i.test(line)) {
        const nums = this.extractNumbers(line);
        if (nums.length > 0) return Math.max(...nums);
      }
    }

    // ─── Prioridad 3: Formato $ XXX.XXX (pesos argentinos) ───
    // Buscar el patrón $ seguido de número
    const pesoMatches: number[] = [];
    for (const line of lines) {
      // $ 187.000 | $2.340 | $ 1.200,50
      const matches = line.match(/\$\s*([\d.]+(?:,\d{1,2})?)/g);
      if (matches) {
        for (const m of matches) {
          const val = this.parseArgentineNumber(m.replace('$', '').trim());
          if (val > 0) pesoMatches.push(val);
        }
      }
    }
    if (pesoMatches.length > 0) {
      return Math.max(...pesoMatches);
    }

    // ─── Prioridad 4: Formato europeo (con € o coma decimal) ───
    for (const line of lines) {
      if (/total/i.test(line) || /€/.test(line)) {
        const euroMatch = line.match(/([\d.]+,\d{2})\s*€?/);
        if (euroMatch) {
          return parseFloat(euroMatch[1].replace('.', '').replace(',', '.'));
        }
      }
    }

    // ─── Prioridad 5: Todos los números, el más grande (último recurso) ───
    const allNums: number[] = [];
    for (const line of lines) {
      // Ignorar líneas que son claramente códigos postales, teléfonos, CUIT, etc
      if (/tel|cuit|cuil|cvu|cbu|dni|código|codigo|empleado|caja|sucursal|nro/i.test(line)) continue;
      // Ignorar números que parecen códigos (más de 6 dígitos sin separador)
      const nums = this.extractNumbers(line);
      for (const n of nums) {
        if (n >= 1 && n < 50000000) allNums.push(n);
      }
    }

    // Filtrar: no considerar números que parecen códigos postales (4-5 dígitos sin contexto monetario)
    const monetaryNums = allNums.filter(n => {
      // Si el número está en una línea con $ o total, mantenerlo
      // Si es un número suelto de 4-5 dígitos sin decimal, podría ser código postal
      return n > 100 || (n > 0 && n <= 100);
    });

    if (monetaryNums.length > 0) return Math.max(...monetaryNums);
    return 0;
  }

  /**
   * Parsear número en formato argentino: 187.000 → 187000, 1.200,50 → 1200.50
   */
  private parseArgentineNumber(str: string): number {
    const clean = str.replace(/\s/g, '');
    // Si tiene coma seguida de 2 dígitos → es decimal (1.200,50)
    if (/,\d{2}$/.test(clean)) {
      return parseFloat(clean.replace(/\./g, '').replace(',', '.'));
    }
    // Si tiene puntos → son separadores de miles (187.000)
    if (/\.\d{3}/.test(clean)) {
      return parseFloat(clean.replace(/\./g, ''));
    }
    return parseFloat(clean) || 0;
  }

  /**
   * Extraer todos los números de una línea
   */
  private extractNumbers(line: string): number[] {
    const results: number[] = [];
    // Patrón para números con formato: 187.000 | 1.200,50 | 25,00 | 2340
    const matches = line.match(/[\d]+(?:[.,]\d{2,3})*(?:,\d{1,2})?/g);
    if (matches) {
      for (const m of matches) {
        const val = this.parseArgentineNumber(m);
        if (val > 0) results.push(val);
      }
    }
    return results;
  }

  /**
   * Extraer fecha
   * Soporta: DD/MM/YYYY, DD-MM-YYYY, "08 de mayo de 2026", DD/MM/YY
   */
  private extractDate(lines: string[], fullText: string): string {
    const today = new Date().toISOString().split('T')[0];

    // ─── Formato texto: "08 de mayo de 2026" o "Viernes, 08 de mayo de 2026" ───
    const meses: Record<string, string> = {
      'enero': '01', 'febrero': '02', 'marzo': '03', 'abril': '04',
      'mayo': '05', 'junio': '06', 'julio': '07', 'agosto': '08',
      'septiembre': '09', 'octubre': '10', 'noviembre': '11', 'diciembre': '12',
      'ene': '01', 'feb': '02', 'mar': '03', 'abr': '04',
      'may': '05', 'jun': '06', 'jul': '07', 'ago': '08',
      'sep': '09', 'oct': '10', 'nov': '11', 'dic': '12',
    };

    const textDateRegex = /(\d{1,2})\s+de\s+(\w+)\s+(?:de\s+)?(\d{4})/i;
    const textMatch = fullText.match(textDateRegex);
    if (textMatch) {
      const day = textMatch[1].padStart(2, '0');
      const monthName = textMatch[2].toLowerCase();
      const year = textMatch[3];
      const month = meses[monthName];
      if (month) return `${year}-${month}-${day}`;
    }

    // ─── Formato numérico: DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY ───
    for (const line of lines) {
      // Buscar específicamente en líneas con "Fecha:"
      const dateFormats = [
        /(\d{2})[\/\-.](\d{2})[\/\-.](\d{4})/,  // DD/MM/YYYY
        /(\d{4})[\/\-.](\d{2})[\/\-.](\d{2})/,  // YYYY/MM/DD
        /(\d{2})[\/\-.](\d{2})[\/\-.](\d{2})/,  // DD/MM/YY
      ];

      for (const pattern of dateFormats) {
        const match = line.match(pattern);
        if (match) {
          if (match[1].length === 4) {
            // YYYY-MM-DD
            return `${match[1]}-${match[2]}-${match[3]}`;
          } else if (match[3].length === 4) {
            // DD/MM/YYYY → YYYY-MM-DD
            return `${match[3]}-${match[2]}-${match[1]}`;
          } else {
            // DD/MM/YY → 20YY-MM-DD
            const year = parseInt(match[3]) < 50 ? `20${match[3]}` : `19${match[3]}`;
            return `${year}-${match[2]}-${match[1]}`;
          }
        }
      }
    }

    return today;
  }

  /**
   * Detectar categoría por keywords en el texto y nombre del comercio
   */
  private detectCategory(fullText: string, merchant: string): string {
    const combined = `${fullText} ${merchant}`.toLowerCase();

    const categories: [string, string[]][] = [
      ['Supermercado', ['carrefour', 'coto', 'dia %', 'jumbo', 'disco', 'vea', 'walmart', 'changomas', 'super', 'almacen', 'almacén', 'autoservicio', 'maxiconsumo', 'makro']],
      ['Restaurantes', ['restaurant', 'cafe', 'cafetería', 'bar ', 'pizza', 'burger', 'comida', 'mcdonald', 'starbucks', 'subway', 'sushi', 'parrilla', 'heladería', 'helader']],
      ['Transporte', ['ypf', 'shell', 'axion', 'nafta', 'combustible', 'uber', 'cabify', 'sube', 'peaje', 'estación de servicio', 'gasoil', 'gnc']],
      ['Salud', ['farmacia', 'farmacity', 'hospital', 'clinica', 'clínica', 'medic', 'salud', 'laboratorio', 'óptica', 'optica', 'odont', 'dent']],
      ['Compras', ['zara', 'nike', 'adidas', 'h&m', 'tienda', 'shopping', 'ropa', 'electro', 'musimundo', 'garbarino', 'fravega', 'frávega', 'falabella', 'easy', 'sodimac', 'pantalón', 'pantalon', 'remera', 'camisa', 'zapatilla']],
      ['Servicios', ['edenor', 'edesur', 'metrogas', 'telecom', 'personal', 'claro', 'movistar', 'internet', ' luz ', ' gas ', ' agua ', 'aysa', 'telefon']],
      ['Suscripciones', ['netflix', 'spotify', 'disney', 'hbo', 'amazon prime', 'youtube premium', 'apple music', 'mercado libre nivel', 'gamepass']],
      ['Vivienda', ['alquiler', 'expensas', 'inmobiliaria', 'propiedad', 'consorcio']],
    ];

    for (const [cat, keywords] of categories) {
      if (keywords.some(kw => combined.includes(kw))) {
        return cat;
      }
    }

    // Detectar transferencias
    if (/transferencia|comprobante de transferencia|cvu|cbu/i.test(combined)) {
      return 'Otros';
    }

    return 'Otros';
  }

  /**
   * Extraer items/productos del ticket
   */
  private extractItems(lines: string[]): string[] {
    const items: string[] = [];
    const skipWords = /total|subtotal|iva|descuento|fecha|hora|ticket|cuit|cuil|cvu|cbu|dni|tel|caja|empleado|comprobante|factura|cambio|efectivo|tarjeta|credito|crédito|débito|debito|gracias|sucursal|dirección|direccion|forma de pago|motivo|transferencia|boleta/i;

    for (const line of lines) {
      if (items.length >= 5) break;

      // Línea con texto que parece un producto: tiene letras y puede tener número al final
      const hasLetters = /[a-záéíóúñ]{3,}/i.test(line);
      const isNotMeta = !skipWords.test(line);
      const goodLength = line.length > 4 && line.length < 80;

      if (hasLetters && isNotMeta && goodLength) {
        // Quitar números al final (precios) y limpiar
        let clean = line.replace(/[\$€]?\s*[\d.,]+\s*$/g, '').trim();
        clean = clean.replace(/^\d+\s*[xX×]\s*/, ''); // quitar "2 x "
        clean = clean.replace(/^\(\d+\)\s*/, ''); // quitar "(1)"
        if (clean.length > 2 && clean.length < 50) {
          items.push(clean.substring(0, 40));
        }
      }
    }

    return items;
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
        this.logger.warn(`Gemini análisis falló: ${e.message?.substring(0, 80)}`);
      }
    }

    return {
      summary: 'Análisis basado en tus gastos recientes.',
      patterns: ['Gastos distribuidos en múltiples categorías'],
      recommendations: ['Revisá tus gastos más frecuentes para identificar ahorros'],
      profile: 'Equilibrado',
    };
  }
}
