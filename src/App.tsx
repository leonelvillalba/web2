import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Landing from './views/Landing';
import { Login, SignUp } from './views/Auth';
import Dashboard from './views/Dashboard';
import Expenses from './views/Expenses';
import AIInsights from './views/AIInsights';
import AdvisorPortal from './views/AdvisorPortal';
import Profile from './views/Profile';
import Activity from './views/Activity';
import Settings from './views/Settings';
import HelpCenter from './views/HelpCenter';
import { SettingsProvider } from './contexts/SettingsContext';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Recuperar sesión de localStorage al cargar
  useEffect(() => {
    const savedUser = localStorage.getItem('sanctuary_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setIsAuth(true);
        setCurrentView('dashboard');
      } catch {}
    }
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    setIsAuth(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuth(false);
    localStorage.removeItem('sanctuary_user');
    setCurrentView('landing');
  };

  const navigate = (view: string) => {
    if (view === 'logout') {
      handleLogout();
      return;
    }
    setCurrentView(view);
    if (['dashboard', 'expenses', 'insights', 'advisor', 'profile', 'activity', 'settings', 'help'].includes(view)) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
    window.scrollTo(0, 0);
  };

  const renderView = () => {
    switch (currentView) {
      case 'landing': return <Landing onNavigate={navigate} />;
      case 'login': return <Login onNavigate={navigate} onLogin={handleLogin} />;
      case 'signup': return <SignUp onNavigate={navigate} onLogin={handleLogin} />;
      case 'dashboard': return <Dashboard user={user} />;
      case 'expenses': return <Expenses user={user} />;
      case 'insights': return <AIInsights user={user} />;
      case 'advisor': return <AdvisorPortal />;
      case 'profile': return <Profile onNavigate={navigate} user={user} />;
      case 'activity': return <Activity onNavigate={navigate} user={user} />;
      case 'settings': return <Settings onNavigate={navigate} />;
      case 'help': return <HelpCenter onNavigate={navigate} />;
      default: return <Landing onNavigate={navigate} />;
    }
  };

  return (
    <SettingsProvider>
    <div className="min-h-screen bg-surface selection:bg-secondary/20 selection:text-secondary">
      {isAuth ? (
        <div className="flex">
          <Sidebar currentView={currentView} onNavigate={navigate} />
          <div className="flex-1 flex flex-col min-h-screen">
            <Navbar onNavigate={navigate} user={user} onLogout={handleLogout} />
            <main className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentView}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {renderView()}
                </motion.div>
              </AnimatePresence>
            </main>
            <footer className="p-8 text-center border-t border-surface-container-highest">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                © 2026 Sanctuary AI. Finanzas Inteligentes Seguras. {user?.plan === 'plus' ? '👑 Premium' : '📋 Básico'}
              </p>
            </footer>
          </div>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
    </SettingsProvider>
  );
};

export default App;
