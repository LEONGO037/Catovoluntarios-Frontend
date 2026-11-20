import React from 'react';
import type {
  FilterPostulacionesParams,
  EstadoPostulacion,
} from '../types/postulacion.types';
import { CARRERAS_UCB } from '../constants/carreras';
import { ZONAS_RESIDENCIA } from '../constants/zonas';
import { Search, RotateCcw, Filter } from 'lucide-react';

interface FiltrosProps {
  filtros: FilterPostulacionesParams;
  onChangeFiltros: (nuevosFiltros: Partial<FilterPostulacionesParams>) => void;
  onLimpiar: () => void;
}

export const FiltrosPostulantes: React.FC<FiltrosProps> = ({
  filtros,
  onChangeFiltros,
  onLimpiar,
}) => {
  return (
    <div className="bg-white border border-cato-border rounded-2xl p-4 sm:p-5 mb-5 shadow-xs space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Buscador Rápido */}
        <div className="lg:col-span-1">
          <label className="block text-[11px] font-bold text-cato-slate uppercase mb-1">
            Búsqueda (Nombre, CI o Código)
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={filtros.search || ''}
              onChange={(e) => onChangeFiltros({ search: e.target.value, page: 1 })}
              placeholder="Ej. Pérez, 8421455, POST-2026..."
              className="cato-input pl-9 text-xs"
            />
          </div>
        </div>

        {/* Filtro por Carrera */}
        <div>
          <label className="block text-[11px] font-bold text-cato-slate uppercase mb-1">
            Carrera
          </label>
          <select
            value={filtros.carrera || ''}
            onChange={(e) => onChangeFiltros({ carrera: e.target.value, page: 1 })}
            className="cato-input bg-white text-xs font-medium"
          >
            <option value="">Todas las Carreras ({CARRERAS_UCB.length})</option>
            {CARRERAS_UCB.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Zona */}
        <div>
          <label className="block text-[11px] font-bold text-cato-slate uppercase mb-1">
            Zona de Residencia
          </label>
          <select
            value={filtros.zonaResidencia || ''}
            onChange={(e) => onChangeFiltros({ zonaResidencia: e.target.value, page: 1 })}
            className="cato-input bg-white text-xs font-medium"
          >
            <option value="">Todas las Zonas</option>
            {ZONAS_RESIDENCIA.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Estado */}
        <div>
          <label className="block text-[11px] font-bold text-cato-slate uppercase mb-1">
            Estado de Postulación
          </label>
          <select
            value={filtros.estado || ''}
            onChange={(e) =>
              onChangeFiltros({
                estado: e.target.value as EstadoPostulacion | '',
                page: 1,
              })
            }
            className="cato-input bg-white text-xs font-medium"
          >
            <option value="">Todos los Estados</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="APTO_ENTREVISTA">Apto para Entrevista</option>
            <option value="OBSERVADO_SOBRECARGA">Observado por Carga Académica</option>
            <option value="DESCARTADO">Descartado</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
        <span className="text-slate-500 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          Filtros activos para revisión ágil de expedientes
        </span>
        <button
          type="button"
          onClick={onLimpiar}
          className="text-cato-navy hover:text-cato-navy-dark font-bold underline inline-flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" /> Limpiar filtros
        </button>
      </div>
    </div>
  );
};
