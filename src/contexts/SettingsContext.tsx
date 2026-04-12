import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

interface SettingsContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
  currency: string;
  setCurrency: (curr: string) => void;
  isDark: boolean;
  formatCurrency: (amount: number) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const accentColorMap: Record<string, { secondary: string; tertiary: string }> = {
  '#006c47': { secondary: '#006c47', tertiary: '#6ffbbe' },
  '#0066cc': { secondary: '#0066cc', tertiary: '#99ccff' },
  '#7c3aed': { secondary: '#7c3aed', tertiary: '#c4b5fd' },
  '#dc2626': { secondary: '#dc2626', tertiary: '#fca5a5' },
  '#d97706': { secondary: '#d97706', tertiary: '#fcd34d' },
  '#db2777': { secondary: '#db2777', tertiary: '#f9a8d4' },
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    return (localStorage.getItem('sanctuary-theme') as ThemeMode) || 'light';
  });
  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem('sanctuary-accent') || '#006c47';
  });
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('sanctuary-language') || 'es';
  });
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('sanctuary-currency') || 'ARS';
  });

  // Determine if dark mode is active
  const getIsDark = () => {
    if (themeMode === 'dark') return true;
    if (themeMode === 'light') return false;
    // System preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  const [isDark, setIsDark] = useState(getIsDark);

  // Persist settings
  useEffect(() => { localStorage.setItem('sanctuary-theme', themeMode); }, [themeMode]);
  useEffect(() => { localStorage.setItem('sanctuary-accent', accentColor); }, [accentColor]);
  useEffect(() => { localStorage.setItem('sanctuary-language', language); }, [language]);
  useEffect(() => { localStorage.setItem('sanctuary-currency', currency); }, [currency]);

  // Apply theme
  useEffect(() => {
    const dark = getIsDark();
    setIsDark(dark);
    const root = document.documentElement;

    if (dark) {
      root.classList.add('dark');
      root.style.setProperty('--color-primary', '#e0e8f0');
      root.style.setProperty('--color-primary-container', '#1a3a5c');
      root.style.setProperty('--color-surface', '#0f1419');
      root.style.setProperty('--color-surface-container-low', '#1a1f25');
      root.style.setProperty('--color-surface-container-lowest', '#0a0e12');
      root.style.setProperty('--color-surface-container-highest', '#2a2f35');
      root.style.setProperty('--color-on-surface', '#e8eaed');
      root.style.setProperty('--color-on-surface-variant', '#9aa0a8');
      root.style.setProperty('--color-error', '#f28b82');
    } else {
      root.classList.remove('dark');
      root.style.setProperty('--color-primary', '#001736');
      root.style.setProperty('--color-primary-container', '#002b5b');
      root.style.setProperty('--color-surface', '#f7f9fb');
      root.style.setProperty('--color-surface-container-low', '#f2f4f6');
      root.style.setProperty('--color-surface-container-lowest', '#ffffff');
      root.style.setProperty('--color-surface-container-highest', '#e0e3e5');
      root.style.setProperty('--color-on-surface', '#191c1e');
      root.style.setProperty('--color-on-surface-variant', '#43474f');
      root.style.setProperty('--color-error', '#ba1a1a');
    }

    // Listen for system preference changes
    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => setIsDark(mediaQuery.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [themeMode]);

  // Apply accent color
  useEffect(() => {
    const colors = accentColorMap[accentColor];
    if (colors) {
      document.documentElement.style.setProperty('--color-secondary', colors.secondary);
      document.documentElement.style.setProperty('--color-tertiary-fixed', colors.tertiary);
    }
  }, [accentColor]);

  // Currency formatter
  const formatCurrency = (amount: number): string => {
    const localeMap: Record<string, string> = { es: 'es-AR', en: 'en-US', pt: 'pt-BR' };
    const locale = localeMap[language] || 'es-AR';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <SettingsContext.Provider value={{ 
      themeMode, setThemeMode, 
      accentColor, setAccentColor, 
      language, setLanguage, 
      currency, setCurrency, 
      isDark, formatCurrency 
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};
