import React from 'react';
import { History, ArrowRight } from 'lucide-react';
import type { TrasladoRegistro } from '../../types/proyectos.types';
import { formatDate } from '../../../../utils/formatters';

export interface TransferHistoryTableProps {
  traslados: TrasladoRegistro[];
}

export const TransferHistoryTable: React.FC<TransferHistoryTableProps> = ({
  traslados,
}) => {
  return (
    <div className="bg-white rounded-xl border border-cato-border shadow-card overflow-hidden">
      <div className="p-4 border-b border-cato-border bg-cato-surface-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-cato-navy" />
          <h3 className="text-sm font-bold text-cato-navy">
            Historial Auditable de Traslados del Semestre (Gestión 2/2026)
          </h3>
        </div>
        <span className="text-xs text-cato-muted font-medium">
          Total de traslados: {traslados.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-cato-surface-header border-b border-cato-border text-cato-slate font-bold uppercase tracking-wider text-[11px]">
              <th className="px-4 py-3">Fecha Efectiva</th>
              <th className="px-4 py-3">Voluntario</th>
              <th className="px-4 py-3">Proyecto Origen</th>
              <th className="px-4 py-3">Proyecto Destino</th>
              <th className="px-4 py-3">Motivo Estandarizado</th>
              <th className="px-4 py-3 text-center">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cato-border">
            {traslados.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-cato-muted text-xs">
                  No se registran traslados efectuados en el periodo actual.
                </td>
              </tr>
            ) : (
              traslados.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-cato-canvas/60 transition-colors duration-100"
                >
                  <td className="px-4 py-3 font-semibold text-cato-navy whitespace-nowrap">
                    {formatDate(item.fecha_efectiva)}
                  </td>
                  <td className="px-4 py-3 font-medium text-cato-text">
                    <div>{item.voluntario_nombre}</div>
                    <div className="text-[10px] text-cato-muted">{item.voluntario_carrera}</div>
                  </td>
                  <td className="px-4 py-3 text-cato-slate">
                    {item.proyecto_origen_nombre}
                  </td>
                  <td className="px-4 py-3 text-cato-navy font-semibold flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 text-cato-gold-dark shrink-0" />
                    <span>{item.proyecto_destino_nombre}</span>
                  </td>
                  <td className="px-4 py-3 text-cato-muted">
                    <span className="px-2 py-0.5 rounded bg-cato-canvas border border-cato-border text-cato-text font-medium text-[11px]">
                      {item.motivo_traslado}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      Completado
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
