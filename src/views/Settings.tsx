import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Palette, 
  Globe, 
  Bell, 
  Eye, 
  Lock, 
  Download, 
  Trash2, 
  Moon, 
  Sun, 
  Monitor,
  Check,
  DollarSign,
  Languages,
  Smartphone,
  Mail,
  MessageSquare,
  Shield
} from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface SettingsProps {
  onNavigate: (view: string) => void;
}

type ThemeMode = 'light' | 'dark' | 'system';

const Settings: React.FC<SettingsProps> = ({ onNavigate }) => {
  const { 
    themeMode, setThemeMode, 
    accentColor, setAccentColor, 
    language, setLanguage, 
    currency, setCurrency,
    isDark 
  } = useSettings();

  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifGastos, setNotifGastos] = useState(true);
  const [notifMetas, setNotifMetas] = useState(true);
  const [notifReportes, setNotifReportes] = useState(false);
  const [privacyProfile, setPrivacyProfile] = useState(true);
  const [privacyStats, setPrivacyStats] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const accentColors = [
    { name: 'Esmeralda', value: '#006c47' },
    { name: 'Océano', value: '#0066cc' },
    { name: 'Púrpura', value: '#7c3aed' },
    { name: 'Carmín', value: '#dc2626' },
    { name: 'Ámbar', value: '#d97706' },
    { name: 'Rosa', value: '#db2777' },
  ];

  const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${enabled ? 'bg-secondary' : 'bg-surface-container-highest'}`}
    >
      <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
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
            <h1 className="font-display text-3xl font-bold text-primary">Ajustes</h1>
            <p className="text-on-surface-variant">Personalizá tu experiencia en Sanctuary AI</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          className="px-6 py-2.5 bg-secondary text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-secondary/10 flex items-center gap-2"
        >
          {saved ? <><Check size={16} /> ¡Guardado!</> : 'Guardar Cambios'}
        </button>
      </div>

      {/* Apariencia */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[32px] p-8 ambient-shadow border border-surface-container-highest"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-secondary rounded-full" />
          <div className="flex items-center gap-2">
            <Palette size={20} className="text-secondary" />
            <h3 className="font-display text-xl font-bold text-primary">Apariencia</h3>
          </div>
        </div>

        {/* Theme Mode */}
        <div className="mb-8">
          <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">Modo del Tema</label>
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: 'light' as ThemeMode, icon: Sun, label: 'Claro', desc: 'Fondo luminoso' },
              { id: 'dark' as ThemeMode, icon: Moon, label: 'Oscuro', desc: 'Fondo oscuro' },
              { id: 'system' as ThemeMode, icon: Monitor, label: 'Sistema', desc: 'Automático' },
            ].map((theme) => (
              <button
                key={theme.id}
                onClick={() => setThemeMode(theme.id)}
                className={`p-5 rounded-2xl border-2 transition-all text-left ${
                  themeMode === theme.id 
                    ? 'border-secondary bg-secondary/[0.03]' 
                    : 'border-surface-container-highest hover:border-secondary/20'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                  themeMode === theme.id ? 'bg-secondary/10 text-secondary' : 'bg-surface-container-low text-on-surface-variant'
                }`}>
                  <theme.icon size={20} />
                </div>
                <p className="text-sm font-bold text-primary">{theme.label}</p>
                <p className="text-[10px] text-on-surface-variant">{theme.desc}</p>
                {themeMode === theme.id && (
                  <div className="mt-2 w-5 h-5 bg-secondary rounded-full flex items-center justify-center">
                    <Check size={12} className="text-white" strokeWidth={3} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Accent Color */}
        <div>
          <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">Color de Acento</label>
          <div className="flex flex-wrap gap-3">
            {accentColors.map((color) => (
              <button
                key={color.value}
                onClick={() => setAccentColor(color.value)}
                className={`flex items-center gap-3 px-5 py-3 rounded-2xl border-2 transition-all ${
                  accentColor === color.value 
                    ? 'border-secondary bg-surface-container-low' 
                    : 'border-surface-container-highest hover:border-secondary/20'
                }`}
              >
                <div className="w-6 h-6 rounded-full border-2 border-white shadow-sm flex items-center justify-center" style={{ backgroundColor: color.value }}>
                  {accentColor === color.value && <Check size={12} className="text-white" strokeWidth={3} />}
                </div>
                <span className="text-sm font-medium text-primary">{color.name}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Idioma y Región */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-[32px] p-8 ambient-shadow border border-surface-container-highest"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-secondary rounded-full" />
          <div className="flex items-center gap-2">
            <Globe size={20} className="text-secondary" />
            <h3 className="font-display text-xl font-bold text-primary">Idioma y Región</h3>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">Idioma</label>
            <div className="relative">
              <Languages size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-surface-container-low border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-medium text-primary outline-none appearance-none cursor-pointer"
              >
                <option value="es">Español (Argentina)</option>
                <option value="en">English</option>
                <option value="pt">Português</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">Moneda</label>
            <div className="relative">
              <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-surface-container-low border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-medium text-primary outline-none appearance-none cursor-pointer"
              >
                <option value="ARS">ARS — Peso Argentino ($)</option>
                <option value="USD">USD — Dólar Estadounidense (US$)</option>
                <option value="EUR">EUR — Euro (€)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Live preview */}
        <div className="mt-6 p-4 bg-surface-container-low/50 rounded-2xl">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Vista Previa</p>
          <p className="text-sm text-primary">
            {language === 'es' && '→ Los montos se mostrarán en formato argentino'}
            {language === 'en' && '→ Amounts will be displayed in US format'}
            {language === 'pt' && '→ Os valores serão exibidos no formato brasileiro'}
            {' · '}
            <span className="font-bold text-secondary">
              {currency === 'ARS' && '$3.142,00'}
              {currency === 'USD' && 'US$3,142.00'}
              {currency === 'EUR' && '€3.142,00'}
            </span>
          </p>
        </div>
      </motion.div>

      {/* Notificaciones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white rounded-[32px] p-8 ambient-shadow border border-surface-container-highest"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-secondary rounded-full" />
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-secondary" />
            <h3 className="font-display text-xl font-bold text-primary">Notificaciones</h3>
          </div>
        </div>

        <div className="space-y-1">
          {[
            { icon: Mail, label: 'Notificaciones por Email', desc: 'Recibir resúmenes y alertas por correo', enabled: notifEmail, onChange: setNotifEmail },
            { icon: Smartphone, label: 'Notificaciones Push', desc: 'Alertas en tiempo real en tu dispositivo', enabled: notifPush, onChange: setNotifPush },
            { icon: DollarSign, label: 'Alertas de Gastos', desc: 'Aviso cuando superes el presupuesto', enabled: notifGastos, onChange: setNotifGastos },
            { icon: Check, label: 'Progreso de Metas', desc: 'Actualización cuando alcances hitos', enabled: notifMetas, onChange: setNotifMetas },
            { icon: MessageSquare, label: 'Reportes Semanales', desc: 'Resumen semanal de tus finanzas', enabled: notifReportes, onChange: setNotifReportes },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-surface-container-low/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-surface-container-low text-on-surface-variant rounded-xl flex items-center justify-center">
                  <item.icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">{item.label}</p>
                  <p className="text-xs text-on-surface-variant">{item.desc}</p>
                </div>
              </div>
              <Toggle enabled={item.enabled} onChange={item.onChange} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Privacidad */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-[32px] p-8 ambient-shadow border border-surface-container-highest"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-secondary rounded-full" />
          <div className="flex items-center gap-2">
            <Eye size={20} className="text-secondary" />
            <h3 className="font-display text-xl font-bold text-primary">Privacidad</h3>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-surface-container-low/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-surface-container-low text-on-surface-variant rounded-xl flex items-center justify-center">
                <Shield size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-primary">Perfil Visible para Asesores</p>
                <p className="text-xs text-on-surface-variant">Permitir que tu asesor vea tu actividad</p>
              </div>
            </div>
            <Toggle enabled={privacyProfile} onChange={setPrivacyProfile} />
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-surface-container-low/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-surface-container-low text-on-surface-variant rounded-xl flex items-center justify-center">
                <Eye size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-primary">Estadísticas Anónimas</p>
                <p className="text-xs text-on-surface-variant">Compartir datos de uso para mejorar el servicio</p>
              </div>
            </div>
            <Toggle enabled={privacyStats} onChange={setPrivacyStats} />
          </div>
        </div>
      </motion.div>

      {/* Data & Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white rounded-[32px] p-8 ambient-shadow border border-surface-container-highest"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-error rounded-full" />
          <h3 className="font-display text-xl font-bold text-primary">Datos y Cuenta</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-5 bg-surface-container-low/50 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-secondary/5 text-secondary rounded-xl flex items-center justify-center">
                <Download size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-primary">Exportar Mis Datos</p>
                <p className="text-xs text-on-surface-variant">Descargar toda tu información en formato CSV</p>
              </div>
            </div>
            <button className="px-6 py-2.5 bg-white border border-surface-container-highest text-primary text-sm font-bold rounded-xl hover:bg-secondary hover:text-white hover:border-secondary transition-all">
              Exportar
            </button>
          </div>

          <div className="flex items-center justify-between p-5 bg-error/[0.03] rounded-2xl border border-error/10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-error/10 text-error rounded-xl flex items-center justify-center">
                <Trash2 size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-error">Eliminar Cuenta</p>
                <p className="text-xs text-on-surface-variant">Esta acción es irreversible</p>
              </div>
            </div>
            <button className="px-6 py-2.5 bg-white border border-error/30 text-error text-sm font-bold rounded-xl hover:bg-error hover:text-white transition-all">
              Eliminar
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
