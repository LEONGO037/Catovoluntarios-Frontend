import React from 'react';
import { Search, Filter, Users, RefreshCw } from 'lucide-react';
import type { VoluntarioAdmitido, FiltrosUbicacion, ProyectoReceptor } from '../../types/proyectos.types';
import { CARRERAS_UCB } from '../../../../constants/carreras';
import { POBLACIONES_OBJETIVO } from '../../../../constants/poblaciones';
import { VolunteerCard } from './VolunteerCard';

export interface UnassignedVolunteersProps {
  volunteers: VoluntarioAdmitido[];
  totalSinUbicar: number;
  filtros: FiltrosUbicacion;
  onFiltrosChange: (filtros: FiltrosUbicacion) => void;
  onAssignClick: (volunteer: VoluntarioAdmitido) => void;
  currentProject?: ProyectoReceptor;
}

export const UnassignedVolunteers: React.FC<UnassignedVolunteersProps> = ({
  volunteers,
  totalSinUbicar,
  filtros,
  onFiltrosChange,
  onAssignClick,
  currentProject,
}) => {
  const handleResetFilters = () => {
    onFiltrosChange({
      carrera: 'Todas',
      condicion: 'Todos',
      rangoEdad: 'Todos',
      poblacionSugerida: 'Todas',
      searchTerm: '',
    });
  };

  return (
    <div className="bg-white rounded-xl border border-cato-border shadow-card flex flex-col h-[780px]">
      {/* Header */}
      <div className="p-4 border-b border-cato-border bg-cato-surface-header flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-cato-navy" />
            <h3 className="text-sm font-bold text-cato-navy">
              Postulantes Admitidos por Ubicar
            </h3>
          </div>
          <p className="text-[11px] text-cato-muted mt-0.5">
            Padrón habilitado con seguro validado
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200">
          <span>{volunteers.length}</span>
          <span className="text-[10px] text-blue-600 font-normal">/ {totalSinUbicar}</span>
        </div>
      </div>

      {/* Filtros de Búsqueda y Cruce */}
      <div className="p-3 border-b border-cato-border bg-cato-canvas space-y-2 text-xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-cato-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, CI o carrera..."
            value={filtros.searchTerm}
            onChange={(e) =>
              onFiltrosChange({ ...filtros, searchTerm: e.target.value })
            }
            className="w-full h-8 pl-8 pr-2.5 rounded-md border border-cato-input text-xs bg-white focus:outline-none focus:border-cato-navy"
          />
        </div>

        {/* Filtros en grid */}
        <div className="grid grid-cols-2 gap-1.5">
          <select
            value={filtros.carrera}
            onChange={(e) =>
              onFiltrosChange({ ...filtros, carrera: e.target.value })
            }
            className="h-7 px-2 rounded border border-cato-input bg-white text-[11px] text-cato-text focus:outline-none"
          >
            <option value="Todas">Todas las Carreras</option>
            {CARRERAS_UCB.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={filtros.condicion}
            onChange={(e) =>
              onFiltrosChange({
                ...filtros,
                condicion: e.target.value as FiltrosUbicacion['condicion'],
              })
            }
            className="h-7 px-2 rounded border border-cato-input bg-white text-[11px] text-cato-text focus:outline-none"
          >
            <option value="Todos">Condición: Todos</option>
            <option value="Nuevo">Nuevos</option>
            <option value="Antiguo">Antiguos</option>
          </select>

          <select
            value={filtros.rangoEdad}
            onChange={(e) =>
              onFiltrosChange({
                ...filtros,
                rangoEdad: e.target.value as FiltrosUbicacion['rangoEdad'],
              })
            }
            className="h-7 px-2 rounded border border-cato-input bg-white text-[11px] text-cato-text focus:outline-none"
          >
            <option value="Todos">Edad: Todas</option>
            <option value="18-20">18 - 20 años</option>
            <option value="21-23">21 - 23 años</option>
            <option value="24+">24+ años</option>
          </select>

          <select
            value={filtros.poblacionSugerida}
            onChange={(e) =>
              onFiltrosChange({
                ...filtros,
                poblacionSugerida: e.target.value,
              })
            }
            className="h-7 px-2 rounded border border-cato-input bg-white text-[11px] text-cato-text focus:outline-none"
          >
            <option value="Todas">Población Sugerida</option>
            {POBLACIONES_OBJETIVO.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Reset button */}
        {(filtros.carrera !== 'Todas' ||
          filtros.condicion !== 'Todos' ||
          filtros.rangoEdad !== 'Todos' ||
          filtros.poblacionSugerida !== 'Todas' ||
          filtros.searchTerm) && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="w-full flex items-center justify-center gap-1 text-[11px] text-cato-slate hover:text-cato-navy py-0.5"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Restablecer filtros</span>
          </button>
        )}
      </div>

      {/* Lista scrolleable de postulantes */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
        {volunteers.length === 0 ? (
          <div className="py-12 text-center text-cato-muted text-xs">
            <Filter className="w-8 h-8 mx-auto text-cato-steel/40 mb-2" />
            <p className="font-semibold text-cato-slate">
              No hay postulantes que coincidan
            </p>
            <p className="mt-0.5 text-[11px]">
              Ajuste los criterios de búsqueda o filtros demográficos.
            </p>
          </div>
        ) : (
          volunteers.map((vol) => {
            const matchesPopulation = Boolean(
              currentProject?.poblacion_objetivo.includes(vol.poblacion_sugerida)
            );
            return (
              <VolunteerCard
                key={vol.id}
                volunteer={vol}
                onAssignClick={onAssignClick}
                matchesCurrentProjectPopulation={matchesPopulation}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
