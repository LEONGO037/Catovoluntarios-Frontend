import React from 'react';
import type { Postulacion } from '../types/postulacion.types';
import {
  MessageSquare,
  AlertTriangle,
  Loader2,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const toArraySafe = (val: unknown): string[] => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return val.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
};

interface TablaPostulantesProps {
  postulaciones: Postulacion[];
  cargando: boolean;
  onVerDetalle: (postulacion: Postulacion) => void;
  page: number;
  totalPages: number;
  total: number;
  onCambiarPagina: (nuevaPagina: number) => void;
}

export const TablaPostulantes: React.FC<TablaPostulantesProps> = ({
  postulaciones,
  cargando,
  onVerDetalle,
  page,
  totalPages,
  total,
  onCambiarPagina,
}) => {
  const getBadgeEstado = (estado: string) => {
    switch (estado) {
      case 'APTO_ENTREVISTA':
        return (
          <span className="badge-semaforo-green">
            Apto para Entrevista
          </span>
        );
      case 'OBSERVADO_SOBRECARGA':
        return (
          <span className="badge-semaforo-red inline-flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Sobrecarga (&gt;6 mat.)
          </span>
        );
      case 'DESCARTADO':
        return (
          <span className="bg-slate-100 text-slate-600 border border-slate-300 px-2.5 py-0.5 rounded-full text-xs font-semibold">
            Descartado
          </span>
        );
      case 'PENDIENTE':
      default:
        return (
          <span className="badge-semaforo-amber">
            Pendiente
          </span>
        );
    }
  };

  if (cargando) {
    return (
      <div className="bg-white rounded-2xl border border-cato-border p-12 text-center text-slate-500">
        <Loader2 className="w-8 h-8 text-cato-navy animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold">Cargando postulaciones registradas...</p>
      </div>
    );
  }

  if (postulaciones.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-cato-border p-12 text-center text-slate-500">
        <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-cato-navy">No se encontraron postulantes</h3>
        <p className="text-xs text-slate-400 mt-1">
          Intenta ajustar los filtros de búsqueda o restablecer la consulta.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-cato-border shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-cato-surface-header border-b border-cato-border text-cato-slate uppercase font-bold text-[11px] tracking-wider">
              <th className="py-3 px-4">Código</th>
              <th className="py-3 px-4">Postulante / CI</th>
              <th className="py-3 px-4">WhatsApp</th>
              <th className="py-3 px-4">Carrera / Zona</th>
              <th className="py-3 px-4">Carga / Edad</th>
              <th className="py-3 px-4">Poblaciones</th>
              <th className="py-3 px-4">Estado</th>
              <th className="py-3 px-4 text-center">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {postulaciones.map((p) => {
              const tieneSobrecarga = p.numeroMaterias > 6;
              const waUrl = `https://wa.me/591${p.celular}?text=Hola%20${encodeURIComponent(
                p.nombres,
              )},%20te%20escribimos%20de%20Pastoral%20Universitaria%20UCB%20sobre%20tu%20postulaci%C3%B3n%20${
                p.codigoPostulacion
              }`;

              return (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-cato-navy whitespace-nowrap">
                    {p.codigoPostulacion}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">
                      {p.nombres} {p.primerApellido} {p.segundoApellido || ''}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      CI: {p.ci} {p.expedido}
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-[11px] border border-emerald-200 transition-colors shadow-2xs"
                      title="Abrir chat en WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>+591 {p.celular}</span>
                    </a>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-cato-slate truncate max-w-[160px]">
                      {p.carrera}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[160px]">
                      {p.zonaResidencia}
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span
                        className={`font-bold ${
                          tieneSobrecarga ? 'text-red-600' : 'text-slate-800'
                        }`}
                      >
                        {p.numeroMaterias} mat.
                      </span>
                      {tieneSobrecarga && (
                        <AlertTriangle className="w-3.5 h-3.5 text-red-500 inline" />
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {p.edad} años {p.edad < 18 ? '(Menor)' : ''}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {(() => {
                      const poblaciones = toArraySafe(p.poblacionesInteres);
                      return (
                        <div
                          className="text-[11px] text-slate-600 truncate max-w-[140px]"
                          title={poblaciones.join(', ')}
                        >
                          {poblaciones[0] || 'General'}
                          {poblaciones.length > 1 && (
                            <span className="text-slate-400 ml-1">
                              (+{poblaciones.length - 1})
                            </span>
                          )}
                        </div>
                      );
                    })()}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {getBadgeEstado(p.estado)}
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onVerDetalle(p)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-cato-navy bg-slate-100 hover:bg-cato-navy hover:text-white rounded-lg transition-colors shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Ver Ficha
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="py-3 px-4 bg-cato-surface-header border-t border-cato-border flex items-center justify-between text-xs text-slate-500">
        <div>
          Mostrando {postulaciones.length} de {total} postulantes registrados
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onCambiarPagina(page - 1)}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-slate-300 disabled:opacity-40 hover:bg-white font-medium"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Anterior
          </button>
          <span className="font-semibold text-slate-700">
            Pág. {page} de {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onCambiarPagina(page + 1)}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-slate-300 disabled:opacity-40 hover:bg-white font-medium"
          >
            Siguiente <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
