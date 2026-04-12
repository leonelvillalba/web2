import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  ChevronRight, 
  Apple, 
  Utensils, 
  Briefcase,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DashboardData } from '../types';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="p-8">Cargando santuario...</div>;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header>
        <h1 className="font-display text-3xl font-bold text-primary">Buenos días, {data.userName}.</h1>
        <p className="text-on-surface-variant">Tu santuario financiero está equilibrado. El crecimiento ha subido un 12% este mes.</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Budget Card */}
        <div className="lg:col-span-2 bg-white rounded-[32px] p-8 ambient-shadow border border-surface-container-highest">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-1">Gasto Mensual</h3>
              <p className="text-xs text-on-surface-variant">Comparado con tu presupuesto de ${data.budget.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-display font-bold text-primary">${data.monthlySpending.toLocaleString()}</p>
              <p className="text-xs font-bold text-secondary flex items-center justify-end gap-1">
                <TrendingDown size={12} />
                14% bajo presupuesto
              </p>
            </div>
          </div>

          <div className="relative h-24 bg-surface-container-low rounded-2xl overflow-hidden mb-8">
            <div 
              className="absolute inset-y-0 left-0 bg-primary transition-all duration-1000 ease-out"
              style={{ width: `${(data.monthlySpending / data.budget) * 100}%` }}
            >
              <div className="h-full flex items-center px-6">
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Utilizado</span>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center px-6">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Margen de Seguridad</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Alquiler y Serv.', amount: 1850 },
              { label: 'Comestibles', amount: 420 },
              { label: 'Ocio', amount: 872 }
            ].map((item, i) => (
              <div key={i} className="bg-surface-container-low/50 p-4 rounded-2xl">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">{item.label}</p>
                <p className="text-lg font-display font-bold text-primary">${item.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Distribution Card */}
        <div className="bg-white rounded-[32px] p-8 ambient-shadow border border-surface-container-highest flex flex-col">
          <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-6">Distribución de Gastos</h3>
          
          <div className="flex-1 min-h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.spendingDistribution}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.spendingDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Principal</p>
              <p className="text-lg font-display font-bold text-primary">Vivienda</p>
            </div>
          </div>

          <div className="space-y-3 mt-6">
            {data.spendingDistribution.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-medium text-on-surface-variant">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-primary">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Savings Goals */}
        <div className="bg-white rounded-[32px] p-8 ambient-shadow border border-surface-container-highest">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">Metas de Ahorro</h3>
            <button className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
              <Plus size={20} className="text-primary" />
            </button>
          </div>

          <div className="space-y-8">
            {data.savingsGoals.map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm font-bold text-primary">{goal.name}</p>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Objetivo: ${goal.target.toLocaleString()}</p>
                  </div>
                  <p className="text-xs font-bold text-primary">{Math.round((goal.current / goal.target) * 100)}%</p>
                </div>
                <div className="h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(goal.current / goal.target) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: goal.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-[32px] p-8 ambient-shadow border border-surface-container-highest">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">Actividad Reciente</h3>
            <button className="text-xs font-bold text-secondary hover:underline flex items-center gap-1">
              Ver Todo
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="space-y-6">
            {data.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    activity.type === 'income' ? 'bg-secondary/10 text-secondary' : 'bg-primary/5 text-primary'
                  }`}>
                    {activity.merchant === 'Apple Store' && <Apple size={18} />}
                    {activity.merchant === 'Salario Mensual' && <Briefcase size={18} />}
                    {activity.merchant === 'The Green Table' && <Utensils size={18} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">{activity.merchant}</p>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">{activity.date} • {activity.category}</p>
                  </div>
                </div>
                <p className={`text-sm font-bold ${activity.type === 'income' ? 'text-secondary' : 'text-primary'}`}>
                  {activity.type === 'income' ? '+' : '-'}${Math.abs(activity.amount).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
