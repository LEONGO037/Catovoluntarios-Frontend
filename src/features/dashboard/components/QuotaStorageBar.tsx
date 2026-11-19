import React, { useState } from 'react';
import type { CuposProyectosResponse, ProyectoCupoItem } from '../../../services/dashboard.service';
import { ArrowUpRight, Bus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuotaStorageBarProps {
  data: CuposProyectosResponse | null;
  isLoading?: boolean;
}

export const QuotaStorageBar: React.FC<QuotaStorageBarProps> = ({ data, isLoading }) => {
  const [hoveredProject, setHoveredProject] = useState<ProyectoCupoItem | null>(null);

  if (isLoading || !data) {
    return (
      <div className="bg-white rounded-2xl border border-cato-border p-6 shadow-card animate-pulse space-y-4">
        <div className="h-5 bg-gray-200 rounded w-1/3" />
        <div className="h-8 bg-gray-200 rounded-full w-full" />
        <div className="h-16 bg-gray-100 rounded w-full" />
      </div>
    );
  }

  const { totalCupos, totalOcupados, porcentajeGlobal, proyectos } = data;

  return (
    <div className="bg-white rounded-2xl border border-cato-border p-6 shadow-card text-left space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-cato-navy">
              Ocupación de Cupos por Proyecto Receptor
            </h3>
            <span className="text-[11px] bg-blue-100 text-cato-navy font-bold px-2 py-0.5 rounded-full">
              Estilo Google Storage
            </span>
          </div>
          <p className="text-xs text-cato-muted mt-0.5">
            Distribución de {totalOcupados} voluntarios asignados sobre una capacidad total de {totalCupos} cupos institucionales.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-2xl font-black text-cato-navy">{porcentajeGlobal}%</span>
          <div className="text-left text-[11px] leading-tight text-cato-muted">
            <p className="font-bold text-cato-slate">{totalOcupados} / {totalCupos} cupos</p>
            <p>cubiertos en {data.semestre}</p>
          </div>
          <Link
            to="/ubicacion"
            className="ml-2 inline-flex items-center gap-1 text-xs font-bold text-cato-navy hover:text-cato-navy-dark hover:underline p-1.5 rounded-lg bg-cato-canvas"
            title="Ir a Ubicación Inteligente (P-14)"
          >
            <span>Asignar</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 1. Barra Segmentada Interactiva estilo Google Drive */}
      <div className="space-y-2">
        <div className="w-full h-8 bg-gray-100 rounded-xl overflow-hidden flex p-1 gap-1 border border-cato-border shadow-inner">
          {proyectos.map((p) => {
            const segmentWidth = ((p.cupoOcupado / totalCupos) * 100).toFixed(1);
            return (
              <div
                key={p.id}
                onMouseEnter={() => setHoveredProject(p)}
                onMouseLeave={() => setHoveredProject(null)}
                style={{
                  width: `${segmentWidth}%`,
                  backgroundColor: p.color,
                }}
                className="h-full rounded-lg transition-all duration-200 cursor-pointer hover:opacity-90 hover:scale-y-105 relative group shrink-0"
                title={`${p.nombre}: ${p.cupoOcupado}/${p.cupoMaximo} (${p.porcentaje}%)`}
              />
            );
          })}
          {/* Espacio Disponible Restante */}
          {totalCupos > totalOcupados && (
            <div
              style={{
                width: `${(((totalCupos - totalOcupados) / totalCupos) * 100).toFixed(1)}%`,
              }}
              className="h-full bg-gray-200/80 rounded-lg"
              title={`Cupos Libres Disponibles: ${totalCupos - totalOcupados}`}
            />
          )}
        </div>

        {/* Tooltip Dinámico / Estado Seleccionado */}
        {hoveredProject && (
          <div className="p-3 bg-cato-navy text-white rounded-xl text-xs flex items-center justify-between gap-3 animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: hoveredProject.color }}
              />
              <span className="font-bold">{hoveredProject.nombre}</span>
              <span className="text-blue-200 text-[11px]">({hoveredProject.poblacion})</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-white/20 px-2 py-0.5 rounded font-mono font-bold">
                {hoveredProject.cupoOcupado} / {hoveredProject.cupoMaximo} cupos ({hoveredProject.porcentaje}%)
              </span>
              <span className="text-cato-gold font-bold flex items-center gap-1">
                <Bus className="w-3 h-3" />
                {hoveredProject.montoPasajeFijo} Bs/día
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Lista Desglosada con Barras Individuales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
        {proyectos.map((p) => {
          const isFull = p.cupoOcupado >= p.cupoMaximo;
          const isWarning = p.porcentaje >= 85 && !isFull;

          return (
            <div
              key={p.id}
              className="p-3.5 rounded-xl border border-cato-border bg-cato-canvas hover:bg-white hover:border-cato-slate transition-all duration-150 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: p.color }}
                  />
                  <h4 className="font-bold text-xs text-cato-navy truncate">{p.nombre}</h4>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    isFull
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                      : isWarning
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {isFull ? 'Lleno' : isWarning ? 'Alerta Cupo' : 'Disponible'}
                </span>
              </div>

              {/* Barra pequeña de progreso individual */}
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(p.porcentaje, 100)}%`,
                    backgroundColor: p.color,
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-cato-muted font-medium pt-0.5">
                <span>{p.cupoOcupado} de {p.cupoMaximo} cubiertos</span>
                <span className="font-bold text-cato-slate">{p.porcentaje}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
