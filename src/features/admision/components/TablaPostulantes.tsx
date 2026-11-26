import React from 'react';
import type { Postulacion } from '../types/postulacion.types';
import { calcularEdadDesdeFecha } from '../hooks/usePostulacionForm';
import {
  MessageSquare,
  AlertTriangle,
  Loader2,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  MapPin,
  BookOpen,
} from 'lucide-react';

interface TablaPostulantesProps {
  postulaciones: Postulacion[];
  cargando: boolean;
  onVerDetalle: (postulacion: Postulacion) => void;
  page: number;
  totalPages: number;
  total: number;
  onCambiarPagina: (nuevaPagina: number) => void;
}

const toArraySafe = (val: unknown): string[] => {
  if (!val) return [];
  if (Array.isArray(val)) return val.map(String).filter(Boolean);
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
    } catch {
      return trimmed.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
};

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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Apto para Entrevista
          </span>
        );
      case 'OBSERVADO_SOBRECARGA':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            Sobrecarga (&gt;6 mat.)
          </span>
        );
      case 'DESCARTADO':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Descartado
          </span>
        );
      case 'PENDIENTE':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Pendiente
          </span>
        );
    }
  };

  if (cargando) {
    return (
      <div className="bg-white rounded-2xl border border-cato-border p-14 text-center text-slate-500 shadow-xs">
        <Loader2 className="w-8 h-8 text-cato-navy animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold">Cargando postulaciones registradas...</p>
      </div>
    );
  }

  if (postulaciones.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-cato-border p-14 text-center text-slate-500 shadow-xs">
        <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-cato-navy">No se encontraron postulantes</h3>
        <p className="text-xs text-slate-400 mt-1">
          Intenta ajustar los filtros de búsqueda o verificar la gestión seleccionada.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-cato-border shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/90 border-b border-cato-border text-slate-500 uppercase font-bold text-[10px] tracking-wider">
              <th className="py-3.5 px-4">Código</th>
              <th className="py-3.5 px-4">Postulante</th>
              <th className="py-3.5 px-4">Contacto</th>
              <th className="py-3.5 px-4">Formación / Zona</th>
              <th className="py-3.5 px-4">Carga / Edad</th>
              <th className="py-3.5 px-4">Poblaciones de Interés</th>
              <th className="py-3.5 px-4">Estado</th>
              <th className="py-3.5 px-4 text-right">Expediente</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {postulaciones.map((p) => {
              const tieneSobrecarga = p.numeroMaterias > 6;
              const edadReal =
                p.edad ??
                p.edadCalculada ??
                calcularEdadDesdeFecha(p.fechaNacimiento);
              const iniciales = `${p.nombres?.[0] || ''}${p.primerApellido?.[0] || ''}`.toUpperCase();
              const poblaciones = toArraySafe(p.poblacionesInteres);
              const waUrl = `https://wa.me/591${p.celular}?text=Hola%20${encodeURIComponent(
                p.nombres,
              )},%20te%20escribimos%20de%20Pastoral%20Universitaria%20UCB%20sobre%20tu%20postulaci%C3%B3n%20${
                p.codigoPostulacion
              }`;

              return (
                <tr
                  key={p.id}
                  className="hover:bg-blue-50/30 transition-colors group"
                >
                  {/* Código */}
                  <td className="py-4 px-4 whitespace-nowrap align-middle">
                    <span className="font-mono font-bold text-[11px] text-cato-navy bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                      {p.codigoPostulacion}
                    </span>
                  </td>

                  {/* Postulante */}
                  <td className="py-4 px-4 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-cato-navy/10 text-cato-navy font-extrabold text-xs flex items-center justify-center shrink-0 border border-cato-navy/15">
                        {iniciales || 'CV'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-[13px] leading-tight">
                          {p.nombres} {p.primerApellido} {p.segundoApellido || ''}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {p.tipoDocumento === 'PASAPORTE' ? 'Pasaporte' : 'C.I.'}:{' '}
                          <span className="font-medium text-slate-700">
                            {p.ci} {p.tipoDocumento === 'PASAPORTE' ? '' : p.expedido}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Contacto */}
                  <td className="py-4 px-4 align-middle whitespace-nowrap">
                    <div className="space-y-1">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[11px] border border-emerald-200 transition-colors"
                        title="Abrir chat en WhatsApp"
                      >
                        <MessageSquare className="w-3 h-3 text-emerald-600" />
                        <span>{p.celular}</span>
                      </a>
                      <div className="text-[11px] text-slate-400 truncate max-w-[170px]" title={p.correoElectronico}>
                        {p.correoElectronico}
                      </div>
                    </div>
                  </td>

                  {/* Formación y Zona */}
                  <td className="py-4 px-4 align-middle">
                    <div className="font-semibold text-slate-800 max-w-[200px] leading-snug">
                      {p.carrera}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 max-w-[200px] truncate" title={p.zonaResidencia}>
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{p.zonaResidencia}</span>
                    </div>
                  </td>

                  {/* Carga y Edad */}
                  <td className="py-4 px-4 align-middle whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-[11px] ${
                          tieneSobrecarga
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-slate-100 text-slate-800 border border-slate-200'
                        }`}
                      >
                        <BookOpen className="w-3 h-3 text-slate-500" />
                        {p.numeroMaterias} mat.
                      </span>
                      {tieneSobrecarga && (
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 font-medium">
                      {edadReal > 0 ? `${edadReal} años` : 'Edad no especificada'}
                      {edadReal > 0 && edadReal < 18 && (
                        <span className="ml-1.5 text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          Menor
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Poblaciones */}
                  <td className="py-4 px-4 align-middle">
                    <div className="flex flex-wrap gap-1 max-w-[190px]" title={poblaciones.join(', ')}>
                      {poblaciones.length > 0 ? (
                        <>
                          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-100 font-semibold text-[10px]">
                            {poblaciones[0]}
                          </span>
                          {poblaciones.length > 1 && (
                            <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold text-[10px]">
                              +{poblaciones.length - 1}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">General</span>
                      )}
                    </div>
                  </td>

                  {/* Estado */}
                  <td className="py-4 px-4 align-middle whitespace-nowrap">
                    {getBadgeEstado(p.estado)}
                  </td>

                  {/* Acción */}
                  <td className="py-4 px-4 align-middle text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onVerDetalle(p)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-cato-navy bg-white border border-slate-200 hover:bg-cato-navy hover:text-white hover:border-cato-navy rounded-xl transition-all shadow-2xs"
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
      <div className="py-3.5 px-5 bg-slate-50/80 border-t border-cato-border flex items-center justify-between text-xs text-slate-500">
        <div>
          Mostrando <strong className="text-slate-700">{postulaciones.length}</strong> de{' '}
          <strong className="text-slate-700">{total}</strong> postulantes registrados
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onCambiarPagina(page - 1)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50 font-semibold text-slate-700 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Anterior
          </button>
          <span className="font-bold text-slate-700 px-2">
            Pág. {page} de {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onCambiarPagina(page + 1)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50 font-semibold text-slate-700 transition-colors"
          >
            Siguiente <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
