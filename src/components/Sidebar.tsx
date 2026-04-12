import React from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  TrendingUp, 
  Users, 
  Settings, 
  HelpCircle, 
  LogOut,
  PlusCircle
} from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Panel', icon: LayoutDashboard },
    { id: 'expenses', label: 'Gastos', icon: Wallet },
    { id: 'insights', label: 'Perspectivas IA', icon: TrendingUp },
    { id: 'advisor', label: 'Portal del Asesor', icon: Users },
  ];

  return (
    <aside className="w-64 bg-white border-r border-surface-container-highest flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45" />
          </div>
          <span className="font-display font-bold text-xl text-primary">Sanctuary AI</span>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                currentView === item.id 
                  ? 'bg-surface-container-low text-primary font-medium' 
                  : 'text-on-surface-variant hover:bg-surface-container-low/50 hover:text-primary'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-4">
        <button 
          onClick={() => onNavigate('expenses')}
          className="w-full flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary-container transition-colors shadow-lg shadow-primary/10"
        >
          <PlusCircle size={20} />
          <span className="font-medium">Escanear Recibo</span>
        </button>

        <div className="pt-4 border-t border-surface-container-highest space-y-1">
          <button 
            onClick={() => onNavigate('settings')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              currentView === 'settings' ? 'text-primary bg-surface-container-low font-medium' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <Settings size={18} />
            <span className="text-sm">Ajustes</span>
          </button>
          <button 
            onClick={() => onNavigate('help')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              currentView === 'help' ? 'text-primary bg-surface-container-low font-medium' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <HelpCircle size={18} />
            <span className="text-sm">Soporte</span>
          </button>
          <button 
            onClick={() => onNavigate('landing')}
            className="w-full flex items-center gap-3 px-4 py-2 text-error hover:bg-error/5 rounded-lg transition-colors mt-2"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
