import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Clock, 
  LogIn, 
  ScanLine, 
  CreditCard, 
  Target, 
  Settings, 
  TrendingUp, 
  Download,
  Filter,
  Calendar,
  Monitor,
  Smartphone,
  ChevronRight
} from 'lucide-react';

interface ActivityProps {
  onNavigate: (view: string) => void;
}

const Activity: React.FC<ActivityProps> = ({ onNavigate }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'sessions' | 'actions'>('all');

  const activityLog = [
    { id: 1, type: 'scan', icon: ScanLine, title: 'Ticket escaneado', desc: 'Starbucks Coffee — $14.50', time: 'Hoy, 14:32', device: 'Chrome — Windows', category: 'actions' },
    { id: 2, type: 'login', icon: LogIn, title: 'Inicio de sesión', desc: 'Acceso exitoso desde Buenos Aires', time: 'Hoy, 09:15', device: 'Chrome — Windows', category: 'sessions' },
    { id: 3, type: 'goal', icon: Target, title: 'Meta actualizada', desc: '"European Summer" — Agregaste $500', time: 'Ayer, 18:45', device: 'Safari — iPhone', category: 'actions' },
    { id: 4, type: 'expense', icon: CreditCard, title: 'Gasto registrado', desc: 'Supermercado Día — $2,340', time: 'Ayer, 16:20', device: 'Chrome — Windows', category: 'actions' },
    { id: 5, type: 'settings', icon: Settings, title: 'Ajustes modificados', desc: 'Cambiaste el idioma a Español', time: 'Hace 2 días', device: 'Chrome — Windows', category: 'actions' },
    { id: 6, type: 'login', icon: LogIn, title: 'Inicio de sesión', desc: 'Acceso exitoso desde Buenos Aires', time: 'Hace 2 días', device: 'Safari — iPhone', category: 'sessions' },
    { id: 7, type: 'scan', icon: ScanLine, title: 'Ticket escaneado', desc: 'Farmacia del Pueblo — $890', time: 'Hace 3 días', device: 'Safari — iPhone', category: 'actions' },
    { id: 8, type: 'insight', icon: TrendingUp, title: 'Perspectiva consultada', desc: 'Revisaste "Velocidad de Gasto"', time: 'Hace 3 días', device: 'Chrome — Windows', category: 'actions' },
    { id: 9, type: 'login', icon: LogIn, title: 'Inicio de sesión', desc: 'Acceso exitoso desde Córdoba', time: 'Hace 5 días', device: 'Firefox — MacOS', category: 'sessions' },
    { id: 10, type: 'expense', icon: CreditCard, title: 'Gasto registrado', desc: 'Netflix — $4,299', time: 'Hace 6 días', device: 'Chrome — Windows', category: 'actions' },
  ];

  const filteredLog = activeFilter === 'all' 
    ? activityLog 
    : activityLog.filter(a => a.category === activeFilter);

  const getIconColor = (type: string) => {
    switch (type) {
      case 'login': return 'bg-primary/5 text-primary';
      case 'scan': return 'bg-secondary/10 text-secondary';
      case 'expense': return 'bg-amber-50 text-amber-600';
      case 'goal': return 'bg-secondary/10 text-secondary';
      case 'settings': return 'bg-surface-container-low text-on-surface-variant';
      case 'insight': return 'bg-primary/5 text-primary';
      default: return 'bg-surface-container-low text-on-surface-variant';
    }
  };

  const stats = [
    { label: 'Sesiones este mes', value: '23', icon: LogIn },
    { label: 'Tickets escaneados', value: '47', icon: ScanLine },
    { label: 'Gastos registrados', value: '89', icon: CreditCard },
    { label: 'Días activo', value: '28', icon: Calendar },
  ];

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="p-2 hover:bg-surface-container-low rounded-xl transition-colors"
          >
            <ArrowLeft size={20} className="text-on-surface-variant" />
          </button>
          <div>
            <h1 className="font-display text-3xl font-bold text-primary">Mi Actividad</h1>
            <p className="text-on-surface-variant">Historial completo de uso y estadísticas de tu cuenta</p>
          </div>
        </div>
        <button className="px-6 py-2.5 bg-white border border-surface-container-highest text-primary text-sm font-bold rounded-xl hover:bg-surface-container-low transition-all flex items-center gap-2">
          <Download size={16} />
          Exportar
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-[24px] p-6 ambient-shadow border border-surface-container-highest"
          >
            <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center mb-4">
              <stat.icon size={20} />
            </div>
            <p className="text-2xl font-display font-bold text-primary">{stat.value}</p>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Sessions Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white rounded-[32px] p-8 ambient-shadow border border-surface-container-highest"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-secondary rounded-full" />
          <h3 className="font-display text-xl font-bold text-primary">Dispositivos Activos</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {[
            { device: 'Chrome — Windows', location: 'Buenos Aires, Argentina', time: 'Sesión actual', icon: Monitor, active: true },
            { device: 'Safari — iPhone 15', location: 'Buenos Aires, Argentina', time: 'Última vez: ayer 18:45', icon: Smartphone, active: false },
          ].map((session, i) => (
            <div key={i} className={`flex items-center justify-between p-5 rounded-2xl border ${session.active ? 'bg-secondary/[0.03] border-secondary/20' : 'bg-surface-container-low/50 border-surface-container-highest'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${session.active ? 'bg-secondary/10 text-secondary' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                  <session.icon size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-primary">{session.device}</p>
                    {session.active && <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />}
                  </div>
                  <p className="text-xs text-on-surface-variant">{session.location}</p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">{session.time}</p>
                </div>
              </div>
              {!session.active && (
                <button className="text-xs font-bold text-error hover:underline">Cerrar</button>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Activity Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-[32px] p-8 ambient-shadow border border-surface-container-highest"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <h3 className="font-display text-xl font-bold text-primary">Historial de Actividad</h3>
          </div>

          {/* Filter Tabs */}
          <div className="flex bg-surface-container-low p-1 rounded-full">
            {[
              { id: 'all' as const, label: 'Todo' },
              { id: 'actions' as const, label: 'Acciones' },
              { id: 'sessions' as const, label: 'Sesiones' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all ${
                  activeFilter === tab.id 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          {filteredLog.map((activity, i) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-4 p-4 rounded-2xl hover:bg-surface-container-low/50 transition-colors cursor-pointer group"
            >
              {/* Icon */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getIconColor(activity.type)}`}>
                <activity.icon size={18} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-primary">{activity.title}</p>
                <p className="text-xs text-on-surface-variant truncate">{activity.desc}</p>
              </div>

              {/* Meta */}
              <div className="text-right shrink-0 hidden md:block">
                <p className="text-xs text-on-surface-variant">{activity.time}</p>
                <p className="text-[10px] text-on-surface-variant/60">{activity.device}</p>
              </div>

              <ChevronRight size={16} className="text-on-surface-variant/30 group-hover:text-primary transition-colors shrink-0" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Activity;
