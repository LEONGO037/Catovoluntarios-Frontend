import React from 'react';
import { PieChart, Sparkles } from 'lucide-react';
import type { BalanceDemografico, ProyectoReceptor } from '../../types/proyectos.types';

export interface DemographicBalanceProps {
  balance: BalanceDemografico;
  project: ProyectoReceptor;
}

export const DemographicBalance: React.FC<DemographicBalanceProps> = ({
  balance,
  project,
}) => {
  return (
    <div className="bg-white rounded-xl border border-cato-border p-4 shadow-card space-y-4">
      {/* Top row: Cupos y Promedio de Edad */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-cato-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cato-steel">
              {project.macrodistrito_zona}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
              Cupos: {balance.totalAsignados} / {balance.cupoMaximo}
            </span>
          </div>
          <h3 className="text-base font-bold text-cato-navy mt-0.5">
            {project.nombre_proyecto}
          </h3>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="text-right">
            <span className="text-cato-muted text-[11px] font-medium block">
              Promedio de Edad:
            </span>
            <span className="text-sm font-bold text-cato-navy">
              {balance.promedioEdad > 0 ? `${balance.promedioEdad} años` : 'S/D'}
            </span>
          </div>
          <div className="text-right">
            <span className="text-cato-muted text-[11px] font-medium block">
              Ocupación:
            </span>
            <span className="text-sm font-bold text-cato-navy">
              {balance.porcentajeOcupacion}%
            </span>
          </div>
        </div>
      </div>

      {/* Barra de Balance Nuevos vs Antiguos */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-blue-700">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
            <span>Nuevos: {balance.nuevos} ({balance.porcentajeNuevos}%)</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-700">
            <span>Antiguos: {balance.antiguos} ({balance.porcentajeAntiguos}%)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
          </div>
        </div>

        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
          {balance.totalAsignados === 0 ? (
            <div className="w-full h-full bg-slate-200" />
          ) : (
            <>
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${balance.porcentajeNuevos}%` }}
                title={`Nuevos: ${balance.porcentajeNuevos}%`}
              />
              <div
                className="h-full bg-amber-500 transition-all duration-300"
                style={{ width: `${balance.porcentajeAntiguos}%` }}
                title={`Antiguos: ${balance.porcentajeAntiguos}%`}
              />
            </>
          )}
        </div>
      </div>

      {/* Distribución por Carreras (Chips) */}
      <div>
        <div className="flex items-center justify-between text-[11px] font-semibold text-cato-slate mb-1.5">
          <span className="flex items-center gap-1">
            <PieChart className="w-3.5 h-3.5 text-cato-steel" />
            Diversidad Académica ({balance.distribucionCarreras.length} carreras representadas):
          </span>
          {balance.distribucionCarreras.length >= 3 && (
            <span className="text-emerald-700 text-[10px] font-bold flex items-center gap-0.5">
              <Sparkles className="w-3 h-3" /> Equipo Multidisciplinario
            </span>
          )}
        </div>

        {balance.distribucionCarreras.length === 0 ? (
          <p className="text-xs text-cato-muted italic">
            Sin voluntarios asignados aún en este centro.
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {balance.distribucionCarreras.map((item) => (
              <span
                key={item.carrera}
                className="text-[11px] px-2.5 py-1 rounded-md bg-cato-surface-header border border-cato-border text-cato-text font-medium flex items-center gap-1.5"
              >
                <span className="font-semibold text-cato-navy">{item.carrera}:</span>
                <span className="px-1.5 py-0.2 rounded bg-cato-navy text-white text-[10px] font-bold">
                  {item.cantidad}
                </span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
