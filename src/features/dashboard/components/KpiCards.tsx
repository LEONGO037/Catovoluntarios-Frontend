import React from 'react';
import { Users, UserCheck, ShieldCheck, Clock, TrendingUp } from 'lucide-react';
import type { DashboardMetricsResponse } from '../../../services/dashboard.service';

interface KpiCardsProps {
  metrics: DashboardMetricsResponse | null;
  isLoading?: boolean;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ metrics, isLoading }) => {
  const kpis = metrics?.kpis;

  const cards = [
    {
      title: 'Total Postulantes',
      value: kpis?.totalPostulantes?.value ?? 0,
      sub: kpis?.totalPostulantes?.tendencia ?? 'Sin registros',
      desc: 'Aspirantes en admisión web',
      icon: Users,
      color: 'bg-blue-600',
      iconBg: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    {
      title: 'Voluntarios en Campo',
      value: kpis?.voluntariosActivos?.value ?? 0,
      sub: kpis?.voluntariosActivos?.tendencia ?? 'Sin habilitados',
      desc: 'Asignados con inducción aprobada',
      icon: UserCheck,
      color: 'bg-emerald-600',
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      title: 'Pólizas Validadas',
      value: kpis?.polizasValidadas?.value ?? 0,
      sub: kpis?.polizasValidadas?.tendencia ?? 'Pendientes',
      desc: 'Seguro obligatorio vigente',
      icon: ShieldCheck,
      color: 'bg-purple-600',
      iconBg: 'bg-purple-50 text-purple-600 border-purple-200',
    },
    {
      title: 'Horas del Mes',
      value: `${(kpis?.horasTotalesMes?.value ?? 0).toLocaleString()} h`,
      sub: kpis?.horasTotalesMes?.tendencia ?? '0 hrs',
      desc: 'Horas presenciales registradas',
      icon: Clock,
      color: 'bg-amber-500',
      iconBg: 'bg-amber-50 text-amber-600 border-amber-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl border border-cato-border p-5 shadow-card hover:shadow-md transition-shadow duration-150 flex flex-col justify-between text-left"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cato-slate uppercase tracking-wider">
              {card.title}
            </span>
            <div
              className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${card.iconBg}`}
            >
              <card.icon className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-3xl font-black text-cato-navy tracking-tight">
              {isLoading ? '...' : card.value}
            </h3>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs">
              <span className="text-cato-slate font-semibold flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5 text-cato-navy" />
                {card.sub}
              </span>
            </div>
            <p className="text-[11px] text-cato-muted mt-1">{card.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
