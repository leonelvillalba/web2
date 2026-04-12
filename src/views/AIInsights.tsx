import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  TrendingUp,
  ArrowRight,
  MessageSquare,
  Zap,
  ShieldCheck,
  RefreshCcw,
  Search
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { InsightData } from '../types';

const AIInsights: React.FC = () => {
  const [data, setData] = useState<InsightData | null>(null);

  useEffect(() => {
    fetch('/api/insights')
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="p-8">Analizando ecosistema...</div>;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header>
        <h1 className="font-display text-4xl font-bold text-primary">
          Santuario <span className="text-secondary">Inteligente</span>
        </h1>
        <p className="text-on-surface-variant max-w-2xl mt-2">
          Análisis impulsado por IA de su ecosistema patrimonial. Hemos detectado 3 nuevas rutas de optimización para su cartera esta semana.
        </p>
      </header>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[24px] ambient-shadow border border-surface-container-highest">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Potencial de Ahorro</p>
          <p className="text-2xl font-display font-bold text-secondary">+${data.potentialSavings.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-[24px] ambient-shadow border border-surface-container-highest">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Salud Financiera</p>
          <p className="text-2xl font-display font-bold text-primary">{data.financialHealth}%</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Spending Velocity Chart */}
        <div className="lg:col-span-2 bg-white rounded-[32px] p-8 ambient-shadow border border-surface-container-highest">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-display text-xl font-bold text-primary">Velocidad de Gasto</h3>
              <p className="text-xs text-on-surface-variant">Análisis y proyección de tendencia anual</p>
            </div>
            <div className="flex bg-surface-container-low p-1 rounded-full">
              <button className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-white text-primary rounded-full shadow-sm">6 Meses</button>
              <button className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">1 Año</button>
            </div>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.spendingVelocity}>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 600, fill: '#43474f' }}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="actual" radius={[4, 4, 0, 0]}>
                  {data.spendingVelocity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 4 ? '#001736' : '#e0e3e5'} />
                  ))}
                </Bar>
                <Bar dataKey="forecast" fill="#6ffbbe" radius={[4, 4, 0, 0]} strokeDasharray="5 5" fillOpacity={0.3} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between items-center mt-6 pt-6 border-t border-surface-container-highest">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-secondary/10 text-secondary rounded-lg flex items-center justify-center">
                <TrendingUp size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-primary">Pico de Consumo Detectado</p>
                <p className="text-[10px] text-on-surface-variant">Expertos revisando sus cambios de patrón</p>
              </div>
            </div>
            <button className="text-xs font-bold text-secondary hover:underline">Ver Desglose</button>
          </div>
        </div>

        {/* AI Assistant Panel */}
        <div className="bg-primary rounded-[32px] p-8 text-white relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sparkles size={120} />
          </div>

          <div className="relative z-10 flex-1">
            <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center mb-6">
              <Sparkles size={20} className="text-white" />
            </div>
            <h3 className="font-display text-xl font-bold mb-4">IA del Santuario Financiero</h3>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-6">
              <p className="text-sm leading-relaxed italic opacity-90">
                "{data.aiMessage}"
              </p>
            </div>

            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-medium transition-colors flex items-center justify-between group">
                ¿Cómo puedo ahorrar $500 más?
                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
              </button>
              <button className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-medium transition-colors flex items-center justify-between group">
                Revisar mis facturas recurrentes
                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
              </button>
            </div>
          </div>

          <div className="relative z-10 mt-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Pregunte cualquier cosa..."
                className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-6 pr-12 text-sm outline-none focus:bg-white/20 transition-all"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-secondary text-white rounded-xl flex items-center justify-center hover:scale-105 transition-transform">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <section>
        <h3 className="font-display text-2xl font-bold text-primary mb-6">Recomendaciones de IA</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Zap, title: "Optimizar Suscripciones", desc: "Hemos detectado 2 servicios que no ha utilizado en 60 días.", action: "Revisar" },
            { icon: RefreshCcw, title: "Reasignación de Alto Rendimiento", desc: "Mueva $5,000 a su cuenta de ahorro para ganar un 4.5% extra.", action: "Ejecutar" },
            { icon: ShieldCheck, title: "Revisión de Seguros", desc: "Su póliza actual de auto está un 15% por encima del mercado.", action: "Comparar" }
          ].map((rec, i) => (
            <div key={i} className="bg-white p-8 rounded-[32px] ambient-shadow border border-surface-container-highest group hover:border-secondary/30 transition-all">
              <div className="w-12 h-12 bg-surface-container-low text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-secondary/10 group-hover:text-secondary transition-colors">
                <rec.icon size={24} />
              </div>
              <h4 className="font-display text-lg font-bold text-primary mb-2">{rec.title}</h4>
              <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">{rec.desc}</p>
              <button className="text-sm font-bold text-secondary flex items-center gap-2 group-hover:gap-3 transition-all">
                {rec.action}
                <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AIInsights;
