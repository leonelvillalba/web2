import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Calendar, 
  DollarSign, 
  Tag,
  Sparkles,
  ChevronRight
} from 'lucide-react';

const Expenses: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 3000);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header>
        <h1 className="font-display text-3xl font-bold text-primary">Registro de Gastos</h1>
        <p className="text-on-surface-variant">Extracción potenciada por IA para una gestión patrimonial fluida.</p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Upload Area */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[32px] p-12 ambient-shadow border border-surface-container-highest border-dashed border-2 flex flex-col items-center justify-center text-center group hover:border-secondary/50 transition-all cursor-pointer">
            <div className="w-20 h-20 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Upload size={32} />
            </div>
            <h3 className="font-display text-2xl font-bold text-primary mb-2">Subir Ticket</h3>
            <p className="text-on-surface-variant mb-8 max-w-xs">Arrastra y suelta tu archivo aquí, o haz clic para buscar. Soporta PDF, JPG y PNG.</p>
            <button 
              onClick={handleScan}
              className="px-10 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-container transition-all shadow-lg shadow-primary/10"
            >
              Seleccionar Archivo
            </button>
          </div>

          <AnimatePresence>
            {(isScanning || scanComplete) && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[32px] p-8 ambient-shadow border border-surface-container-highest overflow-hidden"
              >
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-secondary/20 text-secondary rounded flex items-center justify-center">
                      <CheckCircle2 size={14} />
                    </div>
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Vista Previa de Inteligencia IA</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-secondary/10 text-secondary rounded-full">
                    <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Análisis Activo</span>
                  </div>
                </div>

                <div className="relative aspect-[3/4] max-w-sm mx-auto bg-surface-container-low rounded-2xl overflow-hidden border border-surface-container-highest">
                  <img 
                    src="https://picsum.photos/seed/receipt/600/800" 
                    alt="Vista previa del recibo" 
                    className={`w-full h-full object-cover transition-all duration-1000 ${isScanning ? 'blur-sm' : 'blur-0'}`}
                    referrerPolicy="no-referrer"
                  />
                  
                  {isScanning && (
                    <div className="absolute inset-0 bg-primary/20 flex flex-col items-center justify-center text-white">
                      <Loader2 size={48} className="animate-spin mb-4" />
                      <p className="font-bold uppercase tracking-widest text-sm">Procesando Ticket...</p>
                      <p className="text-xs opacity-80 mt-1">Extrayendo conceptos e impuestos</p>
                    </div>
                  )}

                  {!isScanning && scanComplete && (
                    <div className="absolute inset-0">
                      {/* Mock OCR highlights */}
                      <div className="absolute top-[10%] left-[20%] w-[60%] h-[5%] bg-secondary/30 border border-secondary rounded animate-pulse" />
                      <div className="absolute top-[40%] left-[10%] w-[80%] h-[10%] bg-secondary/20 border border-secondary/50 rounded" />
                      <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[5%] bg-secondary/40 border border-secondary rounded" />
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Details Panel */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-[32px] p-8 ambient-shadow border border-surface-container-highest">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-secondary rounded-full" />
              <h3 className="font-display text-xl font-bold text-primary">Detalles de Transacción</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">Nombre del Comercio</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={scanComplete ? "Starbucks Coffee" : ""} 
                    readOnly
                    className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-6 text-sm font-medium text-primary outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">Monto Total</label>
                  <input 
                    type="text" 
                    value={scanComplete ? "$ 14.50" : ""} 
                    readOnly
                    className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-6 text-sm font-medium text-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">Fecha</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={scanComplete ? "24/11/2023" : ""} 
                      readOnly
                      className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-6 text-sm font-medium text-primary outline-none"
                    />
                    <Calendar size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">Categoría de Gasto</label>
                <div className="relative">
                  <select className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-6 text-sm font-medium text-primary outline-none appearance-none">
                    <option>{scanComplete ? "Comida de Negocios" : "Seleccionar..."}</option>
                    <option>Transporte</option>
                    <option>Suscripciones</option>
                  </select>
                  <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant rotate-90" />
                </div>
              </div>

              {scanComplete && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-secondary/5 border border-secondary/20 rounded-2xl p-6"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={14} className="text-secondary" />
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Resumen de IA</span>
                  </div>
                  <p className="text-xs text-secondary/80 leading-relaxed italic">
                    <span className="font-bold">Perspectiva:</span> Este gasto coincide con su patrón típico de café de los viernes. Categorizado como "Comida de Negocios" basado en el historial previo del comercio.
                  </p>
                </motion.div>
              )}

              <div className="pt-4 space-y-3">
                <button 
                  disabled={!scanComplete}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-container transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/10"
                >
                  Confirmar y Registrar Gasto
                </button>
                <button 
                  onClick={() => { setScanComplete(false); setIsScanning(false); }}
                  className="w-full py-4 bg-white border border-surface-container-highest text-on-surface-variant rounded-2xl font-bold hover:bg-surface-container-low transition-all"
                >
                  Descartar Escaneo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
