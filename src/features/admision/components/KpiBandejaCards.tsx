import React from 'react';
import type { PostulacionKpis } from '../types/postulacion.types';
import { Users, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

interface KpiBandejaCardsProps {
  kpis: PostulacionKpis;
  filtroActivo?: string;
  onSelectFiltro?: (estado: string) => void;
}

export const KpiBandejaCards: React.FC<KpiBandejaCardsProps> = ({
  kpis,
  filtroActivo,
  onSelectFiltro,
}) => {
  const cards = [
    {
      titulo: 'Total Postulantes',
      valor: kpis.total,
      icono: <Users className="w-5 h-5 text-cato-navy" />,
      colorBg: 'bg-blue-50/70',
      colorBorder: 'border-blue-200',
      colorText: 'text-cato-navy',
      estadoFiltro: '',
    },
    {
      titulo: 'Aptos para Entrevista',
      valor: kpis.aptos,
      icono: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      colorBg: 'bg-emerald-50/70',
      colorBorder: 'border-emerald-200',
      colorText: 'text-emerald-800',
      estadoFiltro: 'APTO_ENTREVISTA',
    },
    {
      titulo: 'Observados por Carga',
      valor: kpis.observadosSobrecarga,
      icono: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      colorBg: 'bg-amber-50/70',
      colorBorder: 'border-amber-200',
      colorText: 'text-amber-800',
      estadoFiltro: 'OBSERVADO_SOBRECARGA',
    },
    {
      titulo: 'Descartados / En Espera',
      valor: kpis.descartados + kpis.pendientes,
      icono: <Clock className="w-5 h-5 text-slate-500" />,
      colorBg: 'bg-slate-50',
      colorBorder: 'border-slate-200',
      colorText: 'text-slate-700',
      estadoFiltro: 'PENDIENTE',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((c) => {
        const esSeleccionado = filtroActivo === c.estadoFiltro;
        return (
          <div
            key={c.titulo}
            onClick={() => onSelectFiltro && onSelectFiltro(c.estadoFiltro)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${c.colorBg} ${c.colorBorder} ${
              esSeleccionado ? 'ring-2 ring-cato-navy shadow-md scale-[1.01]' : 'hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                {c.titulo}
              </span>
              <div className="p-1.5 rounded-lg bg-white/80 shadow-xs">
                {c.icono}
              </div>
            </div>
            <div className={`text-2xl font-black mt-2 tracking-tight ${c.colorText}`}>
              {c.valor}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Gestión Semestre 2/2026
            </div>
          </div>
        );
      })}
    </div>
  );
};
