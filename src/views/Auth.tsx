import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface AuthProps {
  onNavigate: (view: string) => void;
  onLogin?: (user: any) => void;
}

export const SignUp: React.FC<AuthProps> = ({ onNavigate, onLogin }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!firstName || !lastName || !email || !password) {
      setError('Completá todos los campos');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else if (data.user) {
        localStorage.setItem('sanctuary_user', JSON.stringify(data.user));
        onLogin?.(data.user);
        onNavigate('dashboard');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-surface-container-low border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-primary/10 transition-all text-sm";

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white rounded-[40px] p-12 ambient-shadow border border-surface-container-highest"
      >
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl font-extrabold text-primary mb-3 tracking-tight">Únete al Santuario</h1>
          <p className="text-on-surface-variant">Comienza tu viaje hacia una gestión financiera inteligente y segura.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/5 border border-error/20 rounded-2xl flex items-center gap-3 text-error text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">Nombre</label>
              <input type="text" placeholder="Tu nombre" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">Apellido</label>
              <input type="text" placeholder="Tu apellido" value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">Correo Electrónico</label>
            <input type="email" placeholder="correo@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">Contraseña</label>
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">Confirmar Contraseña</label>
              <input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} />
            </div>
          </div>

          <div className="flex items-start gap-3 py-2">
            <input type="checkbox" className="mt-1 w-4 h-4 rounded border-surface-container-highest text-primary focus:ring-primary" />
            <p className="text-[10px] text-on-surface-variant leading-relaxed">
              Acepto los <span className="text-primary font-bold cursor-pointer hover:underline">Términos de Servicio</span> y la <span className="text-primary font-bold cursor-pointer hover:underline">Política de Privacidad</span> de Sanctuary AI.
            </p>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary-container transition-all shadow-xl shadow-primary/20 mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <><Loader2 size={18} className="animate-spin" /> Creando cuenta...</> : 'Crear Cuenta'}
          </button>

          {/* Separador */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-surface-container-highest"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold text-on-surface-variant bg-white px-4">O continúa con</div>
          </div>

          {/* Google & Apple */}
          <div className="grid grid-cols-2 gap-4">
            <button type="button" className="flex items-center justify-center gap-3 py-3.5 px-6 border border-surface-container-highest rounded-2xl hover:bg-surface-container-low transition-all text-sm font-medium text-primary">
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button type="button" className="flex items-center justify-center gap-3 py-3.5 px-6 border border-surface-container-highest rounded-2xl hover:bg-surface-container-low transition-all text-sm font-medium text-primary">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Apple
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-on-surface-variant">
              ¿Ya tienes una cuenta? <button onClick={() => onNavigate('login')} className="text-primary font-bold hover:underline">Inicia Sesión</button>
            </p>
          </div>
        </form>
      </motion.div>

      <div className="mt-8 flex items-center gap-6 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-50">
        <div className="flex items-center gap-2"><Lock size={12} /> Cifrado de nivel bancario de 256 bits</div>
      </div>
    </div>
  );
};

export const Login: React.FC<AuthProps> = ({ onNavigate, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Completá email y contraseña');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else if (data.user) {
        localStorage.setItem('sanctuary_user', JSON.stringify(data.user));
        onLogin?.(data.user);
        onNavigate('dashboard');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (quickEmail: string) => {
    setEmail(quickEmail);
    setPassword('123456');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: quickEmail, password: '123456' }),
      });
      const data = await res.json();
      if (data.user) {
        localStorage.setItem('sanctuary_user', JSON.stringify(data.user));
        onLogin?.(data.user);
        onNavigate('dashboard');
      } else {
        setError(data.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-surface-container-low border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-primary/10 transition-all text-sm";

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[40px] p-12 ambient-shadow border border-surface-container-highest"
      >
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock size={24} />
          </div>
          <h1 className="font-display text-4xl font-extrabold text-primary mb-3 tracking-tight">Accede a tu cuenta</h1>
          <p className="text-on-surface-variant">Continúa tu viaje hacia la libertad financiera.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/5 border border-error/20 rounded-2xl flex items-center gap-3 text-error text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">Correo Electrónico</label>
            <input type="email" placeholder="nombre@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          </div>

          <div>
            <div className="flex justify-between mb-2 ml-1">
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Contraseña</label>
              <button type="button" className="text-[10px] font-bold text-secondary hover:underline">¿Olvidaste tu contraseña?</button>
            </div>
            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
          </div>

          <button
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary-container transition-all shadow-xl shadow-primary/20 mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <><Loader2 size={18} className="animate-spin" /> Ingresando...</> : 'Entrar al Santuario'}
          </button>

          {/* Separador */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-surface-container-highest"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold text-on-surface-variant bg-white px-4">O continúa con</div>
          </div>

          {/* Google & Apple */}
          <div className="grid grid-cols-2 gap-4">
            <button type="button" className="flex items-center justify-center gap-3 py-3.5 px-6 border border-surface-container-highest rounded-2xl hover:bg-surface-container-low transition-all text-sm font-medium text-primary">
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button type="button" className="flex items-center justify-center gap-3 py-3.5 px-6 border border-surface-container-highest rounded-2xl hover:bg-surface-container-low transition-all text-sm font-medium text-primary">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Apple
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-on-surface-variant">
              ¿No tienes una cuenta? <button onClick={() => onNavigate('signup')} className="text-primary font-bold hover:underline">Regístrate</button>
            </p>
          </div>
        </form>

        {/* Acceso rápido para demo */}
        <div className="mt-8 pt-6 border-t border-surface-container-highest">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-3 text-center">Acceso rápido (Demo)</p>
          <div className="space-y-2">
            <button onClick={() => quickLogin('leonel@sanctuary.ai')} className="w-full py-2.5 px-4 bg-secondary/5 hover:bg-secondary/10 rounded-xl text-xs font-medium text-primary transition-all flex items-center justify-between">
              <span>👑 Leonel — <span className="text-secondary font-bold">Premium</span></span>
              <span className="text-on-surface-variant">leonel@sanctuary.ai</span>
            </button>
            <button onClick={() => quickLogin('maria@sanctuary.ai')} className="w-full py-2.5 px-4 bg-surface-container-low hover:bg-surface-container-highest rounded-xl text-xs font-medium text-primary transition-all flex items-center justify-between">
              <span>👤 María — <span className="text-on-surface-variant font-bold">Básico</span></span>
              <span className="text-on-surface-variant">maria@sanctuary.ai</span>
            </button>
            <button onClick={() => quickLogin('asesor@sanctuary.ai')} className="w-full py-2.5 px-4 bg-primary/5 hover:bg-primary/10 rounded-xl text-xs font-medium text-primary transition-all flex items-center justify-between">
              <span>📊 Alex — <span className="text-primary font-bold">Asesor</span></span>
              <span className="text-on-surface-variant">asesor@sanctuary.ai</span>
            </button>
          </div>
        </div>
      </motion.div>

      <div className="mt-8 flex items-center gap-8 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-50">
        <div className="flex items-center gap-2"><Shield size={12} /> Cifrado de 256 bits</div>
        <div className="flex items-center gap-2"><CheckCircle2 size={12} /> Cumplimiento SOC2</div>
      </div>
    </div>
  );
};
