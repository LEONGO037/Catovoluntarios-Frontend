import React from 'react';
import type { SemaforoOperativoResponse } from '../../../services/dashboard.service';
import { Activity, ArrowUpRight, Award, AlertTriangle, CheckCircle, Ban } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SemaforoWidgetProps {
  data: SemaforoOperativoResponse | null;
  isLoading?: boolean;
}

export const SemaforoWidget: React.FC<SemaforoWidgetProps> = ({ data, isLoading }) => {
  if (isLoading || !data) {
    return (
      <div className="bg-white rounded-2xl border border-cato-border p-6 shadow-card animate-pulse space-y-4">
        <div className="h-5 bg-gray-200 rounded w-1/3" />
        <div className="h-24 bg-gray-100 rounded w-full" />
      </div>
    );
  }

  const { mes, totalEvaluados, distribucion } = data;

  const items = [
    {
      key: 'morado',
      label: 'Morado — Destacado / Podio',
      desc: 'Candidatos al ranking de premiación y becas',
      count: distribucion.morado.count,
      pct: distribucion.morado.porcentaje,
      bg: 'bg-purple-50 border-purple-200 text-purple-900',
      badge: 'bg-purple-200 text-purple-900',
      barColor: '#8B5CF6',
      icon: Award,
    },
    {
      key: 'verde',
      label: 'Verde — Cumplimiento Normal',
      desc: 'Asistencia regular sin incidencias en campo',
      count: distribucion.verde.count,
      pct: distribucion.verde.porcentaje,
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      badge: 'bg-emerald-200 text-emerald-900',
      barColor: '#10B981',
      icon: CheckCircle,
    },
    {
      key: 'amarillo',
      label: 'Amarillo — Alerta / Atrasos',
      desc: 'Requiere seguimiento fraterno por su Catolíder',
      count: distribucion.amarillo.count,
      pct: distribucion.amarillo.porcentaje,
      bg: 'bg-amber-50 border-amber-200 text-amber-900',
      badge: 'bg-amber-200 text-amber-900',
      barColor: '#F59E0B',
      icon: AlertTriangle,
    },
    {
      key: 'rojo',
      label: 'Rojo — Riesgo / Abandono',
      desc: 'Inasistencias críticas para reasignación de cupo',
      count: distribucion.rojo.count,
      pct: distribucion.rojo.porcentaje,
      bg: 'bg-rose-50 border-rose-200 text-rose-900',
      badge: 'bg-rose-200 text-rose-900',
      barColor: '#EF4444',
      icon: Ban,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-cato-border p-6 shadow-card text-left space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-cato-navy flex items-center gap-2">
              <Activity className="w-5 h-5 text-cato-navy" />
              Semáforo Operativo del Mes ({mes})
            </h3>
          </div>
          <p className="text-xs text-cato-muted mt-0.5">
            Monitoreo cualitativo registrado por los Catolíderes en la matriz de desempeño P-19.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-cato-slate bg-cato-canvas px-3 py-1 rounded-lg border border-cato-border">
            Total evaluados: {totalEvaluados}
          </span>
          <Link
            to="/semaforos"
            className="inline-flex items-center gap-1 text-xs font-bold text-cato-navy hover:text-cato-navy-dark hover:underline p-1.5 rounded-lg bg-cato-canvas"
            title="Ir a Matriz de Semáforos (P-19)"
          >
            <span>Matriz P-19</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Barra de Distribución Global */}
      <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden flex shadow-inner border border-cato-border">
        {items.map((item) => (
          <div
            key={item.key}
            style={{
              width: `${item.pct}%`,
              backgroundColor: item.barColor,
            }}
            title={`${item.label}: ${item.count} (${item.pct}%)`}
            className="h-full transition-all duration-300"
          />
        ))}
      </div>

      {/* Tarjetas Desglosadas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
        {items.map((item) => (
          <div
            key={item.key}
            className={`p-4 rounded-xl border ${item.bg} flex flex-col justify-between space-y-3`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badge}`}>
                {item.pct}% del total
              </span>
              <item.icon className="w-4 h-4" />
            </div>

            <div>
              <p className="text-2xl font-black">{item.count} vol.</p>
              <h4 className="font-bold text-xs mt-0.5 leading-tight">{item.label}</h4>
              <p className="text-[11px] opacity-80 mt-1 leading-snug">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
