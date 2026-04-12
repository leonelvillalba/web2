import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Play, 
  Globe, 
  Zap, 
  Shield, 
  Camera, 
  BarChart3, 
  Brain, 
  Users, 
  Sparkles, 
  Check, 
  X, 
  Star,
  ScanLine,
  TrendingUp,
  Target,
  Bell
} from 'lucide-react';

interface LandingProps {
  onNavigate: (view: string) => void;
}

const Landing: React.FC<LandingProps> = ({ onNavigate }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto relative z-10 sticky top-0 bg-white/80 backdrop-blur-xl border-b border-transparent">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45" />
          </div>
          <span className="font-display font-bold text-xl text-primary">Sanctuary AI</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-on-surface-variant">
          <button onClick={() => scrollToSection('producto')} className="hover:text-primary transition-colors">Producto</button>
          <button onClick={() => scrollToSection('inteligencia')} className="hover:text-primary transition-colors">Inteligencia</button>
          <button onClick={() => scrollToSection('precios')} className="hover:text-primary transition-colors">Precios</button>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('login')}
            className="px-4 py-2 text-sm font-medium text-primary hover:bg-surface-container-low rounded-full transition-colors"
          >
            Iniciar Sesión
          </button>
          <button 
            onClick={() => onNavigate('signup')}
            className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-full hover:bg-primary-container transition-all shadow-lg shadow-primary/20"
          >
            Comenzar
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 pt-20 pb-32 relative">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl -z-10" />

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-[10px] font-bold uppercase tracking-wider mb-6">
              <Shield size={12} />
              Inteligencia de Grado Institucional
            </div>
            
            <h1 className="font-display text-6xl md:text-7xl font-extrabold text-primary leading-[1.1] mb-6 tracking-tight">
              Tu Santuario <br />
              Financiero <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-tertiary-fixed">
                Inteligente.
              </span>
            </h1>
            
            <p className="text-lg text-on-surface-variant mb-10 max-w-lg leading-relaxed">
              Domina tu futuro económico con IA diseñada para la calma. 
              Análisis profundo, captura instantánea y asesoría personalizada 
              en una experiencia editorial minimalista.
            </p>

            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => onNavigate('signup')}
                className="px-8 py-4 bg-primary text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-primary-container transition-all shadow-xl shadow-primary/20 group"
              >
                Comenzar ahora
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-white border border-surface-container-highest text-primary rounded-2xl font-bold flex items-center gap-3 hover:bg-surface-container-low transition-all">
                <Play size={20} fill="currentColor" />
                Ver Demo
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white rounded-[40px] p-10 ambient-shadow border border-surface-container-highest relative z-10">
              <h2 className="font-display text-3xl font-bold text-primary mb-2">Accede a tu cuenta</h2>
              <p className="text-on-surface-variant mb-8">Continúa tu viaje hacia la libertad financiera.</p>

              <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onNavigate('dashboard'); }}>
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">Correo Electrónico</label>
                  <input 
                    type="email" 
                    placeholder="nombre@ejemplo.com"
                    className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2 ml-1">
                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Contraseña</label>
                    <button type="button" className="text-[10px] font-bold text-secondary hover:underline">¿Olvidaste tu contraseña?</button>
                  </div>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                  />
                </div>

                <button className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary-container transition-all shadow-lg shadow-primary/10 mt-4">
                  Entrar al Santuario
                </button>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-surface-container-highest"></div></div>
                  <div className="relative flex justify-center text-[10px] uppercase font-bold text-on-surface-variant bg-white px-4">O continúa con</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button type="button" className="flex items-center justify-center gap-3 py-3 border border-surface-container-highest rounded-2xl hover:bg-surface-container-low transition-all">
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                    <span className="text-sm font-medium">Google</span>
                  </button>
                  <button type="button" className="flex items-center justify-center gap-3 py-3 border border-surface-container-highest rounded-2xl hover:bg-surface-container-low transition-all">
                    <img src="https://www.apple.com/favicon.ico" alt="Apple" className="w-4 h-4" />
                    <span className="text-sm font-medium">Apple</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-tertiary-fixed rounded-full blur-2xl opacity-50" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary rounded-full blur-3xl opacity-20" />
          </motion.div>
        </div>
      </main>

      {/* ======================== */}
      {/* PRODUCTO Section */}
      {/* ======================== */}
      <section id="producto" className="bg-surface-container-low py-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider mb-4">
              <Zap size={12} />
              Funcionalidades
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-primary mb-4">Tecnología que respira</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto">Todo lo que necesitás para tomar el control de tus finanzas, en una sola plataforma.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Camera, title: "Escaneo de Tickets", desc: "Subí una foto de tu ticket y nuestra IA extrae automáticamente el monto, fecha y comercio. Sin cargar datos a mano." },
              { icon: BarChart3, title: "Estadísticas en Tiempo Real", desc: "Visualizá en qué gastás tu dinero con gráficos interactivos, categorías inteligentes y tendencias mensuales." },
              { icon: Brain, title: "Recomendaciones con IA", desc: "Recibí sugerencias personalizadas para mejorar tus finanzas basadas en tus patrones de consumo." },
              { icon: Target, title: "Metas de Ahorro", desc: "Definí objetivos como vacaciones, fondo de emergencia o un auto, y seguí tu progreso con claridad." },
              { icon: Bell, title: "Alertas Inteligentes", desc: "Te avisamos cuando te estás pasando del presupuesto o cuando detectamos un gasto inusual." },
              { icon: Globe, title: "Acceso desde Cualquier Lugar", desc: "Plataforma 100% web. Accedé desde tu computadora, tablet o celular sin instalar nada." }
            ].map((feature, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white p-8 rounded-[32px] ambient-shadow border border-surface-container-highest group hover:border-secondary/30 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-secondary/10 group-hover:text-secondary transition-colors duration-300">
                  <feature.icon size={24} />
                </div>
                <h3 className="font-display text-xl font-bold text-primary mb-3">{feature.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== */}
      {/* INTELIGENCIA Section */}
      {/* ======================== */}
      <section id="inteligencia" className="py-24 relative overflow-hidden scroll-mt-20">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-[10px] font-bold uppercase tracking-wider mb-4">
              <Sparkles size={12} />
              Inteligencia Artificial
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-primary mb-4">
              IA que entiende <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-tertiary-fixed">tus finanzas</span>
            </h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto text-lg">
              Una plataforma inteligente para controlar gastos, analizar hábitos financieros y ayudarte a ahorrar usando inteligencia artificial.
            </p>
          </div>

          {/* How it works - 3 columns */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="bg-white rounded-[32px] p-8 ambient-shadow border border-surface-container-highest h-full">
                <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center mb-6 font-display font-bold text-lg">1</div>
                <h3 className="font-display text-xl font-bold text-primary mb-3">Registrá tus gastos</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                  Cargá tus gastos de forma manual o simplemente subí una foto de tu ticket. 
                  Nuestra IA lee automáticamente el recibo con tecnología OCR y extrae el monto, la fecha y el comercio.
                </p>
                <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-2xl">
                  <ScanLine size={20} className="text-secondary shrink-0" />
                  <p className="text-xs text-on-surface-variant"><span className="font-bold text-primary">OCR Inteligente:</span> Reconocimiento óptico de caracteres con precisión de grado profesional.</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="relative"
            >
              <div className="bg-white rounded-[32px] p-8 ambient-shadow border border-surface-container-highest h-full">
                <div className="w-10 h-10 bg-secondary text-white rounded-xl flex items-center justify-center mb-6 font-display font-bold text-lg">2</div>
                <h3 className="font-display text-xl font-bold text-primary mb-3">Analizá tus patrones</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                  Visualizá en qué gastás tu dinero con gráficos interactivos y estadísticas claras. 
                  La IA detecta tus hábitos de consumo y te muestra tendencias que no habías notado.
                </p>
                <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-2xl">
                  <TrendingUp size={20} className="text-secondary shrink-0" />
                  <p className="text-xs text-on-surface-variant"><span className="font-bold text-primary">Análisis Predictivo:</span> Anticipá tus gastos futuros basado en tu historial.</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative"
            >
              <div className="bg-white rounded-[32px] p-8 ambient-shadow border border-surface-container-highest h-full">
                <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center mb-6 font-display font-bold text-lg">3</div>
                <h3 className="font-display text-xl font-bold text-primary mb-3">Recibí recomendaciones</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                  Obtené consejos personalizados para mejorar tus finanzas. 
                  Desde optimizar suscripciones hasta reasignar ahorros, la IA trabaja para vos.
                </p>
                <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-2xl">
                  <Users size={20} className="text-secondary shrink-0" />
                  <p className="text-xs text-on-surface-variant"><span className="font-bold text-primary">Asesor IA:</span> Un asesor financiero virtual analizando tu cartera 24/7.</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Feature highlight banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="hero-gradient rounded-[32px] p-10 md:p-14 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Sparkles size={200} />
            </div>
            <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h3 className="font-display text-3xl font-bold mb-4">Portal del Asesor Financiero</h3>
                <p className="text-white/80 leading-relaxed mb-6">
                  Un rol especial diseñado para profesionales: analizá los gastos de tus clientes, 
                  detectá hábitos de consumo, creá estrategias personalizadas y enviá recomendaciones 
                  directamente a sus paneles.
                </p>
                <button 
                  onClick={() => onNavigate('signup')} 
                  className="px-8 py-4 bg-white text-primary rounded-2xl font-bold flex items-center gap-3 hover:bg-white/90 transition-all group"
                >
                  Explorar como Asesor
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "94.2%", label: "Salud Financiera Promedio" },
                  { value: "$1,420", label: "Ahorro Potencial Detectado" },
                  { value: "3", label: "Rutas de Optimización / Semana" },
                  { value: "24/7", label: "Monitoreo Continuo con IA" }
                ].map((stat, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
                    <p className="font-display text-2xl font-bold">{stat.value}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ======================== */}
      {/* PRECIOS Section */}
      {/* ======================== */}
      <section id="precios" className="bg-surface-container-low py-24 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider mb-4">
              <Star size={12} />
              Planes
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-primary mb-4">Elegí tu plan</h2>
            <p className="text-on-surface-variant max-w-xl mx-auto">
              Comenzá gratis con el plan Básico o desbloqueá todo el potencial de la IA con el plan Plus.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plan Básico */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-[32px] p-10 ambient-shadow border border-surface-container-highest flex flex-col"
            >
              <div className="mb-8">
                <h3 className="font-display text-2xl font-bold text-primary mb-2">Básico</h3>
                <p className="text-on-surface-variant text-sm">Ideal para comenzar a organizar tus finanzas.</p>
              </div>

              <div className="mb-8">
                <div className="flex items-end gap-1">
                  <span className="font-display text-5xl font-extrabold text-primary">Gratis</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-2">Para siempre, sin tarjeta de crédito</p>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                {[
                  { included: true, text: "Registro manual de gastos" },
                  { included: true, text: "Hasta 3 escaneos de tickets por día" },
                  { included: true, text: "Estadísticas básicas de gastos" },
                  { included: true, text: "Hasta 3 metas de ahorro" },
                  { included: true, text: "Gráficos de distribución mensual" },
                  { included: false, text: "Escaneos ilimitados" },
                  { included: false, text: "Asistente IA personalizado" },
                  { included: false, text: "Exportación de informes en PDF" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {item.included ? (
                      <div className="w-5 h-5 bg-secondary/10 text-secondary rounded-full flex items-center justify-center shrink-0">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="w-5 h-5 bg-surface-container-highest/50 text-on-surface-variant/40 rounded-full flex items-center justify-center shrink-0">
                        <X size={12} strokeWidth={3} />
                      </div>
                    )}
                    <span className={`text-sm ${item.included ? 'text-primary' : 'text-on-surface-variant/50'}`}>{item.text}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => onNavigate('signup')}
                className="w-full py-4 bg-white border-2 border-primary text-primary rounded-2xl font-bold hover:bg-primary hover:text-white transition-all"
              >
                Comenzar Gratis
              </button>
            </motion.div>

            {/* Plan Plus */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-primary rounded-[32px] p-10 text-white flex flex-col relative overflow-hidden shadow-2xl shadow-primary/30"
            >
              {/* Badge */}
              <div className="absolute top-6 right-6 px-3 py-1 bg-tertiary-fixed text-primary rounded-full text-[10px] font-bold uppercase tracking-wider">
                Popular
              </div>

              {/* Decorative */}
              <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-white/5 rounded-full blur-2xl" />
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />

              <div className="relative z-10 flex flex-col flex-1">
                <div className="mb-8">
                  <h3 className="font-display text-2xl font-bold mb-2">Plus</h3>
                  <p className="text-white/70 text-sm">Todo el poder de la IA sin límites.</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-end gap-1">
                    <span className="font-display text-5xl font-extrabold">$4.99</span>
                    <span className="text-white/60 text-sm mb-2">/ mes</span>
                  </div>
                  <p className="text-xs text-white/50 mt-2">Cancelá cuando quieras</p>
                </div>

                <div className="space-y-4 mb-10 flex-1">
                  {[
                    "Registro manual de gastos",
                    "Escaneos de tickets ilimitados",
                    "Estadísticas avanzadas y tendencias",
                    "Metas de ahorro ilimitadas",
                    "Gráficos interactivos detallados",
                    "Asistente IA personalizado",
                    "Exportación de informes en PDF",
                    "Soporte prioritario",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-secondary rounded-full flex items-center justify-center shrink-0">
                        <Check size={12} strokeWidth={3} className="text-white" />
                      </div>
                      <span className="text-sm text-white/90">{item}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => onNavigate('signup')}
                  className="w-full py-4 bg-white text-primary rounded-2xl font-bold hover:bg-tertiary-fixed transition-all shadow-lg"
                >
                  Comenzar con Plus
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ======================== */}
      {/* CTA Final */}
      {/* ======================== */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-primary mb-6">
              Empezá a controlar <br />tus finanzas hoy
            </h2>
            <p className="text-on-surface-variant max-w-xl mx-auto mb-10 text-lg">
              Unite a miles de personas que ya usan Sanctuary AI para entender sus gastos, ahorrar más y vivir con tranquilidad financiera.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => onNavigate('signup')}
                className="px-10 py-4 bg-primary text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-primary-container transition-all shadow-xl shadow-primary/20 group"
              >
                Crear cuenta gratis
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => scrollToSection('precios')}
                className="px-10 py-4 bg-white border border-surface-container-highest text-primary rounded-2xl font-bold hover:bg-surface-container-low transition-all"
              >
                Ver planes
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-low border-t border-surface-container-highest py-12">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 border-2 border-white rounded-sm rotate-45" />
              </div>
              <span className="font-display font-bold text-primary">Sanctuary AI</span>
            </div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              © 2024 Sanctuary AI. Finanzas Editoriales Seguras.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
