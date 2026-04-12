import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, MapPin, Calendar, Camera, Save, ArrowLeft, Shield, CreditCard } from 'lucide-react';

interface ProfileProps {
  onNavigate: (view: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ onNavigate }) => {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    nombre: 'Alex',
    apellido: 'Sterling',
    email: 'alex.sterling@email.com',
    telefono: '+54 11 5555-1234',
    fechaNacimiento: '1995-03-15',
    direccion: 'Av. Corrientes 1234, CABA',
    ciudad: 'Buenos Aires',
    pais: 'Argentina',
    bio: 'Emprendedor y apasionado por las finanzas personales. Usando Sanctuary AI para optimizar mis ahorros.',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setEditing(true);
    setSaved(false);
  };

  const handleSave = () => {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="p-2 hover:bg-surface-container-low rounded-xl transition-colors"
        >
          <ArrowLeft size={20} className="text-on-surface-variant" />
        </button>
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">Mi Perfil</h1>
          <p className="text-on-surface-variant">Gestioná tu información personal y preferencias</p>
        </div>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[32px] p-8 ambient-shadow border border-surface-container-highest"
      >
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Avatar */}
          <div className="relative group">
            <img 
              src="https://picsum.photos/seed/alex/200/200"
              alt="Foto de perfil"
              className="w-28 h-28 rounded-[24px] object-cover border-2 border-surface-container-highest"
              referrerPolicy="no-referrer"
            />
            <button className="absolute inset-0 bg-primary/60 rounded-[24px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
              <Camera size={24} className="text-white" />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="font-display text-2xl font-bold text-primary">{formData.nombre} {formData.apellido}</h2>
              <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wider rounded-md flex items-center gap-1">
                <span>★</span> Plan Plus
              </span>
            </div>
            <p className="text-on-surface-variant text-sm mb-4">{formData.email}</p>
            <p className="text-sm text-on-surface-variant leading-relaxed max-w-lg">{formData.bio}</p>
          </div>
        </div>
      </motion.div>

      {/* Personal Data Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-[32px] p-8 ambient-shadow border border-surface-container-highest"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-secondary rounded-full" />
          <h3 className="font-display text-xl font-bold text-primary">Datos Personales</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">Nombre</label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input 
                type="text" 
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                className="w-full bg-surface-container-low border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-medium text-primary outline-none focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          {/* Apellido */}
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">Apellido</label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input 
                type="text" 
                value={formData.apellido}
                onChange={(e) => handleChange('apellido', e.target.value)}
                className="w-full bg-surface-container-low border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-medium text-primary outline-none focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">Correo Electrónico</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full bg-surface-container-low border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-medium text-primary outline-none focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">Teléfono</label>
            <div className="relative">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input 
                type="tel" 
                value={formData.telefono}
                onChange={(e) => handleChange('telefono', e.target.value)}
                className="w-full bg-surface-container-low border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-medium text-primary outline-none focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          {/* Fecha de Nacimiento */}
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">Fecha de Nacimiento</label>
            <div className="relative">
              <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input 
                type="date" 
                value={formData.fechaNacimiento}
                onChange={(e) => handleChange('fechaNacimiento', e.target.value)}
                className="w-full bg-surface-container-low border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-medium text-primary outline-none focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          {/* País */}
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">País</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input 
                type="text" 
                value={formData.pais}
                onChange={(e) => handleChange('pais', e.target.value)}
                className="w-full bg-surface-container-low border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-medium text-primary outline-none focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          {/* Dirección - full width */}
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">Dirección</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input 
                type="text" 
                value={formData.direccion}
                onChange={(e) => handleChange('direccion', e.target.value)}
                className="w-full bg-surface-container-low border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-medium text-primary outline-none focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          {/* Bio - full width */}
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">Biografía</label>
            <textarea 
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              rows={3}
              className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-6 text-sm font-medium text-primary outline-none focus:ring-2 focus:ring-primary/10 transition-all resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-surface-container-highest">
          {saved && (
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-secondary text-sm font-bold mr-auto"
            >
              <Shield size={16} />
              Cambios guardados correctamente
            </motion.div>
          )}
          <button 
            onClick={() => { setFormData(prev => ({ ...prev })); setEditing(false); }}
            className="px-8 py-3 bg-white border border-surface-container-highest text-on-surface-variant rounded-xl font-bold text-sm hover:bg-surface-container-low transition-all"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            disabled={!editing}
            className="px-8 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-container transition-all shadow-lg shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save size={16} />
            Guardar Cambios
          </button>
        </div>
      </motion.div>

      {/* Security Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-[32px] p-8 ambient-shadow border border-surface-container-highest"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-primary rounded-full" />
          <h3 className="font-display text-xl font-bold text-primary">Seguridad de la Cuenta</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-5 bg-surface-container-low/50 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-primary">Cambiar Contraseña</p>
                <p className="text-xs text-on-surface-variant">Última actualización: hace 3 meses</p>
              </div>
            </div>
            <button className="px-6 py-2.5 bg-white border border-surface-container-highest text-primary text-sm font-bold rounded-xl hover:bg-primary hover:text-white transition-all">
              Cambiar
            </button>
          </div>

          <div className="flex items-center justify-between p-5 bg-surface-container-low/50 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center">
                <CreditCard size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-primary">Método de Pago</p>
                <p className="text-xs text-on-surface-variant">Visa terminada en ****4242</p>
              </div>
            </div>
            <button className="px-6 py-2.5 bg-white border border-surface-container-highest text-primary text-sm font-bold rounded-xl hover:bg-primary hover:text-white transition-all">
              Gestionar
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
