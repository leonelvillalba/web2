import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown, User, Settings, HelpCircle, LogOut, FileText, BarChart3, X, Clock, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  onNavigate: (view: string) => void;
  user?: any;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'reports'>('analysis');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showReportsPanel, setShowReportsPanel] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const reportsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (reportsRef.current && !reportsRef.current.contains(e.target as Node)) {
        setShowReportsPanel(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, type: 'alert', title: 'Gasto inusual detectado', desc: 'Se registró un cargo de $340 en una categoría nueva.', time: 'Hace 5 min', unread: true },
    { id: 2, type: 'success', title: 'Meta alcanzada: 75%', desc: 'Tu meta "European Summer" alcanzó el 75% del objetivo.', time: 'Hace 2 horas', unread: true },
    { id: 3, type: 'info', title: 'Reporte mensual disponible', desc: 'Tu resumen de mayo ya está listo para descargar.', time: 'Hace 1 día', unread: false },
    { id: 4, type: 'trend', title: 'Tendencia positiva', desc: 'Tus gastos en restaurantes bajaron un 18% este mes.', time: 'Hace 2 días', unread: false },
  ];

  const reports = [
    { id: 1, name: 'Resumen Mensual — Mayo 2024', date: '1 Jun 2024', type: 'Automático' },
    { id: 2, name: 'Análisis de Categorías Q1', date: '15 Abr 2024', type: 'Generado' },
    { id: 3, name: 'Proyección de Ahorro Anual', date: '10 Mar 2024', type: 'IA' },
    { id: 4, name: 'Comparativa Trimestral', date: '1 Mar 2024', type: 'Automático' },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle size={16} className="text-amber-500" />;
      case 'success': return <CheckCircle2 size={16} className="text-secondary" />;
      case 'info': return <FileText size={16} className="text-primary" />;
      case 'trend': return <TrendingUp size={16} className="text-secondary" />;
      default: return <Bell size={16} />;
    }
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-surface-container-highest flex items-center justify-between px-8 sticky top-0 z-20">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Buscar análisis, facturas o perspectivas..." 
            className="w-full bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/10 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Tabs: Análisis / Informes */}
        <nav className="flex items-center gap-6 text-sm font-medium text-on-surface-variant relative">
          <button 
            onClick={() => { setActiveTab('analysis'); setShowReportsPanel(false); }}
            className={`pb-1 transition-colors ${activeTab === 'analysis' ? 'text-primary border-b-2 border-primary' : 'hover:text-primary'}`}
          >
            Análisis
          </button>
          <div ref={reportsRef} className="relative">
            <button 
              onClick={() => { 
                setActiveTab('reports'); 
                setShowReportsPanel(!showReportsPanel);
              }}
              className={`pb-1 transition-colors ${activeTab === 'reports' ? 'text-primary border-b-2 border-primary' : 'hover:text-primary'}`}
            >
              Informes
            </button>

            {/* Reports Dropdown */}
            <AnimatePresence>
              {showReportsPanel && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-10 w-96 bg-white rounded-[24px] ambient-shadow border border-surface-container-highest overflow-hidden z-50"
                >
                  <div className="p-6 pb-4 border-b border-surface-container-highest">
                    <div className="flex justify-between items-center">
                      <h3 className="font-display text-lg font-bold text-primary">Informes</h3>
                      <button 
                        onClick={() => setShowReportsPanel(false)}
                        className="p-1 hover:bg-surface-container-low rounded-full transition-colors"
                      >
                        <X size={16} className="text-on-surface-variant" />
                      </button>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1">Tus reportes generados automáticamente</p>
                  </div>

                  <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    {reports.map((report) => (
                      <button 
                        key={report.id}
                        className="w-full text-left px-6 py-4 hover:bg-surface-container-low/50 transition-colors flex items-start gap-4 group border-b border-surface-container-highest/50 last:border-none"
                      >
                        <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center shrink-0 group-hover:bg-secondary/10 group-hover:text-secondary transition-colors">
                          <FileText size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-primary truncate group-hover:text-secondary transition-colors">{report.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-on-surface-variant">{report.date}</span>
                            <span className="text-[10px] px-2 py-0.5 bg-surface-container-low rounded-full font-bold text-on-surface-variant uppercase tracking-widest">{report.type}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="p-4 border-t border-surface-container-highest bg-surface-container-low/30">
                    <button className="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-container transition-all">
                      Generar Nuevo Informe
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        <div className="flex items-center gap-4 pl-6 border-l border-surface-container-highest">
          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button 
              onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); setShowReportsPanel(false); }}
              className="relative p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-error rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-[8px] font-bold text-white">{unreadCount}</span>
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-12 w-96 bg-white rounded-[24px] ambient-shadow border border-surface-container-highest overflow-hidden z-50"
                >
                  <div className="p-6 pb-4 border-b border-surface-container-highest">
                    <div className="flex justify-between items-center">
                      <h3 className="font-display text-lg font-bold text-primary">Notificaciones</h3>
                      <button 
                        onClick={() => setShowNotifications(false)}
                        className="p-1 hover:bg-surface-container-low rounded-full transition-colors"
                      >
                        <X size={16} className="text-on-surface-variant" />
                      </button>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1">{unreadCount} sin leer</p>
                  </div>

                  <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    {notifications.map((notif) => (
                      <div 
                        key={notif.id}
                        className={`px-6 py-4 flex items-start gap-4 border-b border-surface-container-highest/50 last:border-none transition-colors hover:bg-surface-container-low/50 cursor-pointer ${notif.unread ? 'bg-secondary/[0.03]' : ''}`}
                      >
                        <div className="w-10 h-10 bg-surface-container-low rounded-xl flex items-center justify-center shrink-0">
                          {getNotifIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-primary">{notif.title}</p>
                            {notif.unread && <div className="w-2 h-2 bg-secondary rounded-full shrink-0" />}
                          </div>
                          <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">{notif.desc}</p>
                          <div className="flex items-center gap-1 mt-2 text-on-surface-variant">
                            <Clock size={10} />
                            <span className="text-[10px] font-medium">{notif.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border-t border-surface-container-highest bg-surface-container-low/30">
                    <button className="w-full text-center text-xs font-bold text-secondary hover:underline">
                      Marcar todas como leídas
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* User Menu */}
          <div ref={userRef} className="relative">
            <button 
              onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); setShowReportsPanel(false); }}
              className="flex items-center gap-3 hover:bg-surface-container-low p-1 pr-2 rounded-full transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-sm border border-surface-container-highest">
                {user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || ''}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-primary leading-none">{user?.firstName || 'Usuario'} {user?.lastName || ''}</p>
                <p className="text-[10px] text-on-surface-variant">{user?.plan === 'plus' ? '👑 Miembro Premium' : '📋 Plan Básico'}</p>
              </div>
              <ChevronDown size={14} className={`text-on-surface-variant transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* User Dropdown */}
            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-12 w-72 bg-white rounded-[24px] ambient-shadow border border-surface-container-highest overflow-hidden z-50"
                >
                  {/* Profile Header */}
                  <div className="p-6 pb-4 border-b border-surface-container-highest">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-lg border-2 border-surface-container-highest">
                        {user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || ''}
                      </div>
                      <div>
                        <p className="font-bold text-primary">{user?.firstName || 'Usuario'} {user?.lastName || ''}</p>
                        <p className="text-xs text-on-surface-variant">{user?.email || ''}</p>
                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mt-1 ${user?.plan === 'plus' ? 'bg-secondary/10 text-secondary' : 'bg-surface-container-low text-on-surface-variant'}`}>
                          <span>{user?.plan === 'plus' ? '★' : '○'}</span> Plan {user?.plan === 'plus' ? 'Plus' : 'Básico'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    {[
                      { icon: User, label: 'Mi Perfil', desc: 'Datos personales y preferencias', route: 'profile' },
                      { icon: BarChart3, label: 'Mi Actividad', desc: 'Historial de uso y estadísticas', route: 'activity' },
                      { icon: Settings, label: 'Ajustes', desc: 'Configuración de la cuenta', route: 'settings' },
                      { icon: HelpCircle, label: 'Centro de Ayuda', desc: 'Soporte y documentación', route: 'help' },
                    ].map((item, i) => (
                      <button 
                        key={i}
                        onClick={() => { setShowUserMenu(false); onNavigate(item.route); }}
                        className="w-full text-left px-6 py-3 hover:bg-surface-container-low/50 transition-colors flex items-center gap-4 group"
                      >
                        <div className="w-9 h-9 bg-surface-container-low rounded-xl flex items-center justify-center group-hover:bg-primary/5 group-hover:text-primary transition-colors text-on-surface-variant">
                          <item.icon size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-primary">{item.label}</p>
                          <p className="text-[10px] text-on-surface-variant">{item.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Logout */}
                  <div className="p-4 pt-2 border-t border-surface-container-highest">
                    <button 
                      onClick={() => { setShowUserMenu(false); onLogout?.(); }}
                      className="w-full flex items-center justify-center gap-2 py-3 text-error hover:bg-error/5 rounded-xl transition-colors font-bold text-sm"
                    >
                      <LogOut size={16} />
                      Cerrar Sesión
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
