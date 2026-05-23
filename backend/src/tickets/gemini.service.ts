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

    const meses: Record<string, string> = {
      'enero': '01', 'febrero': '02', 'marzo': '03', 'abril': '04',
      'mayo': '05', 'junio': '06', 'julio': '07', 'agosto': '08',
      'septiembre': '09', 'octubre': '10', 'noviembre': '11', 'diciembre': '12',
      'ene': '01', 'feb': '02', 'mar': '03', 'abr': '04',
      'may': '05', 'jun': '06', 'jul': '07', 'ago': '08',
      'sep': '09', 'oct': '10', 'nov': '11', 'dic': '12',
    };

    // ─── Buscar fecha en texto línea por línea (más preciso) ───
    const textDateRegex = /(\d{1,2})\s+de\s+(\w+)\s+(?:de\s+)?(\d{4})/i;
    for (const line of lines) {
      const textMatch = line.match(textDateRegex);
      if (textMatch) {
        const day = textMatch[1].padStart(2, '0');
        const monthName = textMatch[2].toLowerCase();
        const year = textMatch[3];
        const month = meses[monthName];
        if (month) return `${year}-${month}-${day}`;
      }
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

    // ─── Prioridad 1: Detectar transferencias ANTES que categorías ───
    if (/transferencia|comprobante de transferencia|cvu|cbu/i.test(combined)) {
      return 'Otros';
    }

    // ─── Prioridad 2: Categorías por keywords ───
    const categories: [string, string[]][] = [
      ['Supermercado', ['carrefour', 'coto', 'dia %', 'jumbo', 'disco', 'vea', 'walmart', 'changomas', 'supermercado', 'almacen', 'almacén', 'autoservicio', 'maxiconsumo', 'makro']],
      ['Restaurantes', ['restaurant', 'cafe', 'cafetería', 'bar ', 'pizza', 'burger', 'comida', 'mcdonald', 'starbucks', 'subway', 'sushi', 'parrilla', 'heladería', 'helader']],
      ['Transporte', ['ypf', 'shell', 'axion', 'nafta', 'combustible', 'uber', 'cabify', 'sube', 'peaje', 'estación de servicio', 'gasoil', 'gnc']],
      ['Salud', ['farmacia', 'farmacity', 'hospital', 'clinica', 'clínica', 'medicina', 'salud', 'laboratorio', 'óptica', 'optica', 'odontol', 'dentist']],
      ['Compras', ['zara', 'nike', 'adidas', 'h&m', 'tienda', 'shopping', 'ropa', 'electro', 'musimundo', 'garbarino', 'fravega', 'frávega', 'falabella', 'easy', 'sodimac', 'pantalón', 'pantalon', 'remera', 'camisa', 'zapatilla']],
      ['Servicios', ['edenor', 'edesur', 'metrogas', 'telecom', 'personal flow', 'claro', 'movistar', 'internet', ' luz ', ' gas ', ' agua ', 'aysa', 'telefon']],
      ['Suscripciones', ['netflix', 'spotify', 'disney', 'hbo', 'amazon prime', 'youtube premium', 'apple music', 'mercado libre nivel', 'gamepass']],
      ['Vivienda', ['alquiler', 'expensas', 'inmobiliaria', 'propiedad', 'consorcio']],
    ];

    for (const [cat, keywords] of categories) {
      if (keywords.some(kw => combined.includes(kw))) {
        return cat;
      }
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
    recommendations: { title: string; text: string }[];
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

Respondé SOLO con JSON válido usando esta estructura exacta:
{"summary":"resumen breve de la salud financiera","patterns":["patron 1","patron 2"],"recommendations":[{"title":"Título corto","text":"Consejo detallado"}],"profile":"Ahorrador|Equilibrado|Impulsivo|En riesgo"}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
      } catch (e) {
        this.logger.warn(`Gemini análisis falló: ${e.message?.substring(0, 80)}`);
      }
    }

    // Fallback inteligente (calcula top category localmente si no hay IA)
    const cats = {};
    expenses.filter(e => e.type === 'expense').forEach(e => { cats[e.category] = (cats[e.category]||0) + Number(e.amount); });
    const topCat = Object.entries(cats).sort(([,a],[,b]) => Number(b) - Number(a))[0] || ['Gastos', 0];

    return {
      summary: 'Tu salud financiera está estable, pero hay oportunidades de mejora.',
      patterns: ['Gastos distribuidos en múltiples categorías'],
      recommendations: [
        { title: 'Optimizar Suscripciones', text: 'Revisá tus suscripciones mensuales. Podés ahorrar cancelando las que no usás.' },
        { title: `${topCat[0]} es tu mayor gasto`, text: `Gastaste $${topCat[1]} en esta categoría. Considerá buscar alternativas más económicas.` },
        { title: 'Fondo de Emergencia', text: 'Intentá ahorrar el equivalente a 3-6 meses de gastos para imprevistos.' },
        { title: 'Registrá todos los gastos', text: 'Cuantos más gastos registres, mejores serán las recomendaciones.' }
      ],
      profile: 'Equilibrado',
    };
  }

  /**
   * Chat con IA — responde preguntas del usuario
   * Intenta Gemini primero, fallback a respuestas locales inteligentes
   */
  async chat(message: string, history: { role: string; text: string }[]): Promise<string> {
    // ─── Intentar con Gemini ───
    if (this.geminiApiKey) {
      try {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(this.geminiApiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const systemPrompt = `Sos "Sanctuary IA", el asistente virtual de la plataforma de gestión de gastos personales "Sanctuary AI".

Tu personalidad:
- Respondés en español argentino (vos, sos, tenés, etc.)
- Sos amigable, conciso y profesional
- Usás emojis moderadamente para ser más expresivo
- Tus respuestas son CORTAS (2-4 oraciones máximo)

Sobre la plataforma Sanctuary AI:
- Permite registrar gastos manualmente o escaneando tickets con IA (OCR)
- Tiene dashboard con estadísticas, gráficos y balance
- Ofrece análisis de gastos con IA y recomendaciones financieras
- Tiene modo oscuro/claro configurable desde el perfil
- Roles: Usuario (registra gastos) y Asesor (analiza clientes)
- Plan Básico (gratis) y Plan Plus ($4.99/mes con más features)
- La sección "Perspectivas IA" analiza patrones de consumo

También podés dar consejos financieros generales:
- Regla 50/30/20 (necesidades/deseos/ahorro)
- Importancia de un fondo de emergencia
- Tips para reducir gastos innecesarios
- Cómo priorizar deudas

Si te preguntan algo que no sabés, sugerí contactar al asesor humano desde el Centro de Soporte.`;

        // Construir historial para Gemini
        const contents = [];
        
        // Agregar historial previo
        for (const msg of history.slice(-6)) { // últimos 6 mensajes para contexto
          contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }],
          });
        }

        // Agregar mensaje actual
        contents.push({
          role: 'user',
          parts: [{ text: message }],
        });

        const result = await model.generateContent({
          contents,
          systemInstruction: systemPrompt,
        } as any);

        const reply = result.response.text();
        if (reply && reply.trim().length > 0) {
          this.logger.log(`Gemini chat reply: ${reply.substring(0, 100)}`);
          return reply.trim();
        }
      } catch (e) {
        this.logger.warn(`Gemini chat falló, usando fallback: ${e.message?.substring(0, 80)}`);
      }
    }

    // ─── Fallback local inteligente ───
    return this.getLocalChatResponse(message);
  }

  /**
   * Respuestas locales inteligentes para el chat
   */
  private getLocalChatResponse(message: string): string {
    const m = message.toLowerCase();

    // Saludos
    if (/^(hola|buenas|hey|buen[ao]s?\s*(días|tardes|noches)?|qué\s*tal|hi|hello)/i.test(m)) {
      return '¡Hola! 👋 Soy el asistente IA de Sanctuary. ¿En qué puedo ayudarte hoy? Podés preguntarme sobre la plataforma, tus gastos o tips financieros.';
    }

    // Despedidas
    if (/^(gracias|chau|adiós|adios|bye|nos vemos|hasta luego)/i.test(m)) {
      return '¡De nada! 😊 Si necesitás algo más, no dudes en escribirme. ¡Que tengas un excelente día!';
    }

    // Escanear tickets
    if (/ticket|escane|ocr|foto|imagen|comprobante|factura|recibo/i.test(m)) {
      return '📷 Para escanear un ticket, andá a **Gastos** → botón **"Escanear Ticket"**. Podés subir una foto o arrastrarla al área de carga. La IA extrae automáticamente el comercio, monto, fecha y categoría. ¡Funciona con tickets argentinos y europeos!';
    }

    // Agregar gastos
    if (/agreg|registr|nuev[oa]\s*gasto|cargar\s*gasto|carg[oa]/i.test(m)) {
      return '💰 Para agregar un gasto manualmente, andá a **Gastos** y hacé clic en **"+ Nuevo Gasto"**. Elegí el tipo (Gasto o Ingreso), completá el monto, fecha, categoría y descripción. ¡Listo!';
    }

    // Planes
    if (/plan|plus|básico|basico|precio|premium|pag[ao]|costo|suscripci/i.test(m)) {
      return '📋 Tenemos 2 planes:\n• **Básico** (gratis): hasta 3 escaneos/día, estadísticas básicas\n• **Plus** ($4.99/mes): escaneos ilimitados, asistente IA premium, exportación PDF y análisis avanzado\n\nPodés cambiar tu plan desde **Mi Perfil**.';
    }

    // Modo oscuro / apariencia
    if (/oscuro|dark|claro|light|tema|color|apariencia|modo/i.test(m)) {
      return '🌙 Para cambiar el tema, andá a **Mi Perfil → Apariencia**. Podés elegir entre modo oscuro y claro. ¡El modo oscuro es ideal para cuidar tus ojos de noche!';
    }

    // Presupuesto
    if (/presupuesto|budget|meta|límite|limite|objetivo/i.test(m)) {
      return '🎯 Podés configurar tu presupuesto mensual en **Mi Perfil**. Una vez seteado, el dashboard te muestra cuánto llevás gastado vs. tu presupuesto con una barra de progreso visual.';
    }

    // Dashboard / estadísticas
    if (/dashboard|panel|estadístic|estad[ií]stic|resum|balance|grafic/i.test(m)) {
      return '📊 El **Dashboard** es tu centro de control: muestra el balance total, gastos por categoría con gráficos, tendencias mensuales y tu índice de salud financiera. Se actualiza en tiempo real cada vez que cargás un gasto.';
    }

    // Salud financiera
    if (/salud\s*financ|índice|indice|puntaje|score|puntuaci/i.test(m)) {
      return '📈 El **Índice de Salud Financiera** es un número del 0 al 99 que refleja qué tan bien están tus finanzas. Se calcula comparando tus ingresos vs gastos y la diversificación de categorías. ¡Arriba de 70 es excelente!';
    }

    // Perspectivas IA / insights
    if (/perspectiva|insight|análisis|analisis|recomendaci|consej|patr[oó]n/i.test(m)) {
      return '🧠 La sección **Perspectivas IA** analiza tus gastos con inteligencia artificial y te da:\n• Patrones de consumo detectados\n• Recomendaciones personalizadas para ahorrar\n• Tu perfil de gasto (Ahorrador, Equilibrado, etc.)';
    }

    // Asesor humano
    if (/asesor|human[oa]|persona|hablar\s*con\s*alguien|contactar/i.test(m)) {
      return '👤 Si preferís hablar con un asesor humano, podés hacerlo desde la pestaña **"Asesor Humano"** acá mismo en el Centro de Soporte. Horario: Lun-Vie 9:00-18:00, Sáb 10:00-14:00.';
    }

    // Tips de ahorro
    if (/ahorr|gastar\s*menos|reducir|tip|consejo\s*financ|dinero/i.test(m)) {
      return '💡 Algunos tips para ahorrar:\n• Aplicá la **regla 50/30/20**: 50% necesidades, 30% deseos, 20% ahorro\n• Revisá tus suscripciones mensuales — ¿las usás todas?\n• Armá un **fondo de emergencia** de 3-6 meses de gastos\n• Evitá compras impulsivas: esperá 24hs antes de comprar algo no planificado';
    }

    // Deudas
    if (/deuda|deb[oe]|tarjeta|crédito|credito|financ|cuota|préstamo|prestamo/i.test(m)) {
      return '💳 Para manejar deudas te recomiendo:\n• Priorizá las de **mayor interés** primero (método avalancha)\n• O pagá las más chicas primero para ganar impulso (método bola de nieve)\n• Evitá pagar solo el mínimo de la tarjeta\n• Registrá todas tus cuotas en Sanctuary para tener visibilidad total';
    }

    // Categorías
    if (/categor[ií]a|tipo\s*de\s*gasto|clasificar/i.test(m)) {
      return '🏷️ Las categorías disponibles son: **Supermercado, Transporte, Restaurantes, Salud, Vivienda, Servicios, Suscripciones, Compras** y **Otros**. Al escanear un ticket, la IA asigna la categoría automáticamente.';
    }

    // Seguridad / datos
    if (/segur|priv|dato|contraseña|password|clave/i.test(m)) {
      return '🔒 Tu seguridad es prioridad. Las contraseñas se almacenan encriptadas con bcrypt, las sesiones usan JWT tokens y nunca compartimos tus datos financieros. Podés cambiar tu contraseña desde **Mi Perfil**.';
    }

    // Exportar / descargar
    if (/export|descar|pdf|excel|csv|imprimi/i.test(m)) {
      return '📥 La exportación de datos está disponible en el **Plan Plus**. Podés descargar tus gastos en formato PDF o CSV desde la sección de Gastos. ¡Ideal para llevar registros o compartir con tu contador!';
    }

    // Qué es Sanctuary
    if (/qu[eé]\s*(es|hace)|para\s*qu[eé]|funcionalidad|feature|c[oó]mo\s*funciona/i.test(m)) {
      return '🏛️ **Sanctuary AI** es tu plataforma inteligente de gestión de gastos. Podés:\n• Registrar gastos manualmente o escaneando tickets con IA\n• Ver estadísticas y gráficos en el dashboard\n• Recibir análisis y recomendaciones con IA\n• Contactar asesores financieros humanos';
    }

    // Fallback inteligente
    const fallbacks = [
      '🤔 Interesante pregunta. No tengo una respuesta específica para eso, pero podés consultar con un **asesor humano** desde la pestaña "Asesor Humano" para ayuda personalizada.',
      '💬 No estoy seguro de poder ayudarte con eso específicamente. ¿Querés que te explique algo sobre la plataforma, tips de ahorro o cómo usar alguna función?',
      '🧐 Esa consulta va un poco más allá de mis capacidades. Te sugiero contactar al equipo de soporte en la pestaña **"Asesor Humano"** o escribir a soporte@sanctuary.ai.',
    ];

    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
}

