import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Filter, 
  Download, 
  Send, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  MoreVertical,
  Plus,
  ChevronRight
} from 'lucide-react';
import { Client } from '../types';

const AdvisorPortal: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    fetch('/api/advisor/clients')
      .then(res => res.json())
      .then(data => {
        setClients(data);
        setSelectedClient(data[0]);
      });
  }, []);

  if (!selectedClient) return <div className="p-8">Cargando portal...</div>;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">Portal del Asesor</h1>
          <p className="text-on-surface-variant">Gestionando {clients.length} portafolios de alto patrimonio</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2.5 bg-white border border-surface-container-highest text-primary text-sm font-bold rounded-xl hover:bg-surface-container-low transition-all">
            Exportar Portafolio
          </button>
          <button className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-container transition-all shadow-lg shadow-primary/10">
            Recomendaciones Masivas
          </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Clients List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-primary uppercase tracking-widest">Clientes Asignados</h3>
            <button className="p-2 hover:bg-surface-container-low rounded-lg transition-colors">
              <Filter size={18} className="text-on-surface-variant" />
            </button>
          </div>
          
          <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-300px)] pr-2 custom-scrollbar">
            {clients.map((client) => (
              <button
                key={client.id}
                onClick={() => setSelectedClient(client)}
                className={`w-full text-left p-5 rounded-[24px] border transition-all duration-200 ${
                  selectedClient.id === client.id 
                    ? 'bg-white border-secondary ambient-shadow' 
                    : 'bg-white/50 border-surface-container-highest hover:bg-white hover:border-surface-container-highest'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3">
                    <img src={`https://i.pravatar.cc/150?u=${client.id}`} alt={client.name} className="w-10 h-10 rounded-full border border-surface-container-highest" />
                    <div>
                      <p className="text-sm font-bold text-primary">{client.name}</p>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Enfocado en {client.focus}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">${(client.assets / 1000000).toFixed(1)}M</p>
                    <p className={`text-[10px] font-bold ${client.change >= 0 ? 'text-secondary' : 'text-error'}`}>
                      {client.change >= 0 ? '+' : ''}{client.change}%
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-on-surface-variant">Cumplimiento de Presupuesto:</span>
                    <span className={client.budgetAdherence > 100 ? 'text-error' : 'text-secondary'}>{client.status}</span>
                  </div>
                  <div className="h-1 bg-surface-container-low rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${client.budgetAdherence > 100 ? 'bg-error' : 'bg-secondary'}`}
                      style={{ width: `${Math.min(client.budgetAdherence, 100)}%` }}
                    />
                  </div>
                  {client.budgetAdherence > 100 && (
                    <p className="text-[10px] font-bold text-error">Fuera de presupuesto: $2,400 en exceso</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Client Detail View */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[32px] p-8 ambient-shadow border border-surface-container-highest">
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-widest rounded-md">Análisis Profundo</span>
                <h2 className="font-display text-3xl font-bold text-primary mt-2">{selectedClient.name}</h2>
                <p className="text-sm text-on-surface-variant">Revisando hábitos de gasto para el Q3 2023</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-surface-container-low rounded-xl transition-colors border border-surface-container-highest">
                  <Calendar size={20} className="text-on-surface-variant" />
                </button>
                <button className="p-2 hover:bg-surface-container-low rounded-xl transition-colors border border-surface-container-highest">
                  <MoreVertical size={20} className="text-on-surface-variant" />
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Cumplimiento de Presupuesto</p>
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#f2f4f6" strokeWidth="8" />
                    <circle 
                      cx="50" cy="50" r="45" fill="none" stroke="#006c47" strokeWidth="8" 
                      strokeDasharray="283" strokeDashoffset={283 - (283 * selectedClient.budgetAdherence) / 100}
                      strokeLinecap="round" className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-4xl font-display font-bold text-primary">{selectedClient.budgetAdherence}%</p>
                  </div>
                </div>
                <p className="text-xs text-on-surface-variant">El gasto está $4,200 bajo el límite este mes.</p>
              </div>

              <div className="space-y-6">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Mapa de Categorías</p>
                {[
                  { label: 'Bienes Raíces e Hipotecas', value: 42, color: '#001736' },
                  { label: 'Estilo de Vida y Entretenimiento', value: 28, color: '#006c47' },
                  { label: 'Reinversión de Negocios', value: 18, color: '#6ffbbe' },
                  { label: 'Misceláneos', value: 12, color: '#e0e3e5' }
                ].map((cat, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-primary">{cat.label}</span>
                      <span className="text-primary">{cat.value}%</span>
                    </div>
                    <div className="h-2 bg-surface-container-low rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${cat.value}%`, backgroundColor: cat.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-[32px] p-8 ambient-shadow border border-surface-container-highest flex flex-col">
              <div className="w-10 h-10 bg-surface-container-low text-primary rounded-xl flex items-center justify-center mb-6">
                <Send size={20} />
              </div>
              <h3 className="font-display text-xl font-bold text-primary mb-2">Enviar Recomendación</h3>
              <p className="text-sm text-on-surface-variant mb-8 flex-1">
                Redacta y envía una estrategia financiera personalizada directamente al panel de {selectedClient.name.split(' ')[0]}.
              </p>
              <button className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-container transition-all">
                Crear Nuevo Plan
              </button>
            </div>

            <div className="bg-surface-container-low rounded-[32px] p-8 border border-surface-container-highest">
              <h3 className="font-display text-xl font-bold text-primary mb-6">Análisis del Asesor</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-secondary/10 text-secondary rounded-lg flex items-center justify-center shrink-0">
                    <TrendingUp size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-primary">Alerta de Reequilibrio por IA</p>
                    <p className="text-xs text-on-surface-variant leading-relaxed">La asignación tecnológica está un 4% por encima del umbral. Se recomienda venta.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
                    <AlertCircle size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-primary">Op. de Recolección de Pérdidas Fiscales</p>
                    <p className="text-xs text-on-surface-variant leading-relaxed">Detectados $12k en potencial recolección de pérdidas fiscales para Elena.</p>
                  </div>
                </div>
                <button className="text-xs font-bold text-secondary flex items-center gap-2 hover:gap-3 transition-all pt-2">
                  Ver todos los análisis
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvisorPortal;
