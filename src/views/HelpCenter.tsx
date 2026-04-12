import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  MessageSquare, 
  Sparkles, 
  ArrowRight, 
  Send, 
  User, 
  Bot, 
  Clock, 
  ChevronDown,
  HelpCircle,
  BookOpen,
  Mail,
  Phone
} from 'lucide-react';

interface HelpCenterProps {
  onNavigate: (view: string) => void;
}

const HelpCenter: React.FC<HelpCenterProps> = ({ onNavigate }) => {
  const [selectedOption, setSelectedOption] = useState<'none' | 'human' | 'ai'>('none');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [humanForm, setHumanForm] = useState({ asunto: '', mensaje: '', prioridad: 'normal' });
  const [humanSent, setHumanSent] = useState(false);

  const handleAISubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInputValue('');

    // Simulated AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        default: '¡Buena pregunta! Puedo ayudarte con eso. En Sanctuary AI, tenés múltiples opciones para gestionar tus finanzas. ¿Querés que te explique alguna función específica?',
      };

      let response = responses.default;
      const lower = userMessage.toLowerCase();
      
      if (lower.includes('escaneo') || lower.includes('ticket') || lower.includes('recibo')) {
        response = 'Para escanear un ticket, andá a la sección "Gastos" desde el menú lateral. Ahí podés subir una foto de tu recibo y nuestra IA extraerá automáticamente el monto, fecha y comercio. En el plan Básico tenés hasta 3 escaneos por día, y con el plan Plus son ilimitados.';
      } else if (lower.includes('plan') || lower.includes('precio') || lower.includes('plus') || lower.includes('básico')) {
        response = 'Tenemos dos planes: el **Básico** (gratis) que incluye registro manual, hasta 3 escaneos/día y estadísticas básicas. El **Plus** ($4.99/mes) te da escaneos ilimitados, asistente IA personalizado y exportación de informes en PDF. ¿Querés más detalles?';
      } else if (lower.includes('contraseña') || lower.includes('password')) {
        response = 'Para cambiar tu contraseña, andá a "Mi Perfil" desde el menú de usuario arriba a la derecha. En la sección "Seguridad de la Cuenta" vas a encontrar la opción "Cambiar Contraseña".';
      } else if (lower.includes('asesor') || lower.includes('advisor')) {
        response = 'El Portal del Asesor es una función premium para profesionales financieros. Desde ahí podés analizar los gastos de tus clientes, detectar hábitos de consumo y enviar recomendaciones personalizadas.';
      } else if (lower.includes('hola') || lower.includes('buenas')) {
        response = '¡Hola! 👋 Soy el asistente de Sanctuary AI. Estoy acá para ayudarte con cualquier consulta sobre la plataforma. ¿En qué te puedo ayudar?';
      }

      setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 1200);
  };

  const handleHumanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHumanSent(true);
  };

  const faqs = [
    { q: '¿Cómo escaneo un ticket?', a: 'Andá a "Gastos" en el menú lateral y hacé clic en "Subir Ticket". Podés arrastrar una imagen o seleccionarla desde tu dispositivo.' },
    { q: '¿Cómo cambio mi plan?', a: 'Ingresá a "Ajustes" y en la sección de suscripción encontrarás las opciones de cambio de plan.' },
    { q: '¿Mis datos están seguros?', a: 'Sí, usamos cifrado de nivel bancario de 256 bits y cumplimiento SOC2 para proteger tu información.' },
    { q: '¿Puedo exportar mis datos?', a: 'Sí, desde "Ajustes" > "Datos y Cuenta" podés exportar toda tu información en formato CSV.' },
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="p-2 hover:bg-surface-container-low rounded-xl transition-colors"
        >
          <ArrowLeft size={20} className="text-on-surface-variant" />
        </button>
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">Centro de Ayuda</h1>
          <p className="text-on-surface-variant">Elegí cómo querés recibir asistencia</p>
        </div>
      </div>

      {/* Option Cards */}
      {selectedOption === 'none' && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Human */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            onClick={() => setSelectedOption('human')}
            className="bg-white rounded-[32px] p-10 ambient-shadow border border-surface-container-highest text-left group hover:border-primary/30 transition-all"
          >
            <div className="w-16 h-16 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
              <MessageSquare size={32} />
            </div>
            <h2 className="font-display text-2xl font-bold text-primary mb-3">Hablar con una Persona</h2>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
              Conectate con nuestro equipo de soporte humano. Ideal para consultas específicas, problemas de cuenta o situaciones complejas.
            </p>
            <div className="flex items-center gap-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              <div className="flex items-center gap-1">
                <Clock size={12} />
                Respuesta en ~2 horas
              </div>
            </div>
            <div className="flex items-center gap-2 mt-6 text-primary font-bold text-sm group-hover:gap-3 transition-all">
              Contactar
              <ArrowRight size={18} />
            </div>
          </motion.button>

          {/* Chat with AI */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -4 }}
            onClick={() => {
              setSelectedOption('ai');
              setChatMessages([{ role: 'assistant', content: '¡Hola! 👋 Soy el asistente virtual de Sanctuary AI. Estoy acá para ayudarte con cualquier consulta sobre la plataforma. ¿En qué te puedo ayudar?' }]);
            }}
            className="bg-primary rounded-[32px] p-10 text-white text-left group relative overflow-hidden hover:shadow-2xl hover:shadow-primary/30 transition-all"
          >
            {/* Decorative */}
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Sparkles size={120} />
            </div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles size={32} className="text-white" />
              </div>
              <h2 className="font-display text-2xl font-bold mb-3">Chatear con IA</h2>
              <p className="text-white/80 text-sm leading-relaxed mb-6">
                Obtené respuestas instantáneas de nuestro asistente inteligente. Disponible 24/7 para resolver tus dudas al momento.
              </p>
              <div className="flex items-center gap-4 text-[10px] font-bold text-white/50 uppercase tracking-widest">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-tertiary-fixed rounded-full animate-pulse" />
                  Respuesta instantánea
                </div>
              </div>
              <div className="flex items-center gap-2 mt-6 text-white font-bold text-sm group-hover:gap-3 transition-all">
                Iniciar Chat
                <ArrowRight size={18} />
              </div>
            </div>
          </motion.button>
        </div>
      )}

      {/* Human Contact Form */}
      <AnimatePresence>
        {selectedOption === 'human' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <button 
              onClick={() => { setSelectedOption('none'); setHumanSent(false); }}
              className="flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft size={16} />
              Volver a opciones
            </button>

            {!humanSent ? (
              <div className="bg-white rounded-[32px] p-8 ambient-shadow border border-surface-container-highest">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-primary/5 text-primary rounded-2xl flex items-center justify-center">
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-primary">Contactar Soporte</h2>
                    <p className="text-sm text-on-surface-variant">Nuestro equipo te responderá lo antes posible</p>
                  </div>
                </div>

                <form onSubmit={handleHumanSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">Asunto</label>
                    <input 
                      type="text"
                      value={humanForm.asunto}
                      onChange={(e) => setHumanForm(prev => ({ ...prev, asunto: e.target.value }))}
                      placeholder="¿En qué podemos ayudarte?"
                      className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-6 text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">Prioridad</label>
                    <div className="flex gap-3">
                      {['baja', 'normal', 'alta'].map(p => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setHumanForm(prev => ({ ...prev, prioridad: p }))}
                          className={`px-5 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${
                            humanForm.prioridad === p 
                              ? 'bg-primary text-white shadow-lg shadow-primary/10' 
                              : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-highest'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">Mensaje</label>
                    <textarea 
                      value={humanForm.mensaje}
                      onChange={(e) => setHumanForm(prev => ({ ...prev, mensaje: e.target.value }))}
                      placeholder="Describí tu consulta con el mayor detalle posible..."
                      rows={5}
                      className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-6 text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-container transition-all shadow-lg shadow-primary/10 flex items-center justify-center gap-2"
                  >
                    <Send size={18} />
                    Enviar Mensaje
                  </button>
                </form>

                {/* Quick contact */}
                <div className="mt-8 pt-6 border-t border-surface-container-highest grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-surface-container-low/50 rounded-2xl">
                    <Mail size={18} className="text-on-surface-variant" />
                    <div>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Email</p>
                      <p className="text-sm font-medium text-primary">soporte@sanctuary-ai.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-surface-container-low/50 rounded-2xl">
                    <Phone size={18} className="text-on-surface-variant" />
                    <div>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Teléfono</p>
                      <p className="text-sm font-medium text-primary">+54 11 5555-0000</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[32px] p-12 ambient-shadow border border-surface-container-highest text-center"
              >
                <div className="w-20 h-20 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Send size={32} />
                </div>
                <h2 className="font-display text-3xl font-bold text-primary mb-3">¡Mensaje Enviado!</h2>
                <p className="text-on-surface-variant max-w-md mx-auto mb-8">
                  Nuestro equipo de soporte recibió tu consulta. Te responderemos a <strong>alex.sterling@email.com</strong> en un plazo de 2 horas hábiles.
                </p>
                <button 
                  onClick={() => onNavigate('dashboard')}
                  className="px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-container transition-all shadow-lg shadow-primary/10"
                >
                  Volver al Panel
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Chat */}
      <AnimatePresence>
        {selectedOption === 'ai' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <button 
              onClick={() => { setSelectedOption('none'); setChatMessages([]); }}
              className="flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft size={16} />
              Volver a opciones
            </button>

            <div className="bg-white rounded-[32px] ambient-shadow border border-surface-container-highest overflow-hidden">
              {/* Chat Header */}
              <div className="p-6 border-b border-surface-container-highest bg-primary text-white">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold">Asistente Sanctuary AI</h3>
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <div className="w-2 h-2 bg-tertiary-fixed rounded-full animate-pulse" />
                      En línea — Respuesta instantánea
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {chatMessages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
                        <Bot size={16} className="text-white" />
                      </div>
                    )}
                    <div className={`max-w-[75%] px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-primary text-white rounded-br-md' 
                        : 'bg-surface-container-low text-primary rounded-bl-md'
                    }`}>
                      {msg.content}
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center shrink-0">
                        <User size={16} className="text-secondary" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Quick Questions */}
              {chatMessages.length <= 1 && (
                <div className="px-6 pb-4 flex flex-wrap gap-2">
                  {['¿Cómo escaneo un ticket?', '¿Cuáles son los planes?', '¿Cómo cambio mi contraseña?'].map((q, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setInputValue(q);
                        setChatMessages(prev => [...prev, { role: 'user', content: q }]);
                        setTimeout(() => {
                          let response = '';
                          if (q.includes('escaneo')) response = 'Para escanear un ticket, andá a la sección "Gastos" desde el menú lateral. Ahí podés subir una foto de tu recibo y nuestra IA extraerá automáticamente el monto, fecha y comercio.';
                          else if (q.includes('planes')) response = 'Tenemos el plan Básico (gratis) con 3 escaneos/día y el Plus ($4.99/mes) con escaneos ilimitados, asistente IA y exportación PDF.';
                          else response = 'Para cambiar tu contraseña, andá a "Mi Perfil" y en la sección "Seguridad de la Cuenta" hacé clic en "Cambiar".';
                          setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
                        }, 1200);
                        setInputValue('');
                      }}
                      className="px-4 py-2 bg-surface-container-low text-primary text-xs font-medium rounded-full hover:bg-primary hover:text-white transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <form onSubmit={handleAISubmit} className="p-4 border-t border-surface-container-highest">
                <div className="relative">
                  <input 
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Escribí tu consulta..."
                    className="w-full bg-surface-container-low border-none rounded-2xl py-4 pl-6 pr-14 text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                  <button 
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary-container transition-all"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAQ Section - always visible when on 'none' */}
      {selectedOption === 'none' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[32px] p-8 ambient-shadow border border-surface-container-highest"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-secondary rounded-full" />
            <div className="flex items-center gap-2">
              <BookOpen size={20} className="text-secondary" />
              <h3 className="font-display text-xl font-bold text-primary">Preguntas Frecuentes</h3>
            </div>
          </div>

          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-surface-container-highest rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-surface-container-low/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle size={18} className="text-secondary shrink-0" />
                    <span className="text-sm font-bold text-primary">{faq.q}</span>
                  </div>
                  <ChevronDown size={18} className={`text-on-surface-variant transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pl-14">
                        <p className="text-sm text-on-surface-variant leading-relaxed">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HelpCenter;
