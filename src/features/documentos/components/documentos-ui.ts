import type { EstadoDocumento, TipoDocumento } from '../../../types/documentos.types';

export const nombresDocumento: Record<TipoDocumento, string> = {
  POLIZA_ACCIDENTES_APC7083: 'Póliza de accidentes UCB',
  COMPROMISO_VOLUNTARIADO: 'Carta de compromiso',
  CI_ANVERSO_REVERSO: 'CI (frente y reverso)',
  CARTA_AUTORIZACION_PADRES_MENOR: 'Carta de autorización del menor',
  CI_PADRE_TUTOR_MENOR: 'CI del padre, madre o tutor',
  OTRO_RESPALDO: 'Otro respaldo',
};

export const estadosDocumento: Record<EstadoDocumento, string> = {
  PENDIENTE: 'Pendiente',
  APROBADO: 'Aprobado',
  OBSERVADO: 'Observado',
  RECHAZADO: 'Rechazado',
};

export const colorDocumento: Record<EstadoDocumento, string> = {
  PENDIENTE: 'bg-slate-100 text-slate-700',
  APROBADO: 'bg-emerald-100 text-emerald-800',
  OBSERVADO: 'bg-amber-100 text-amber-900',
  RECHAZADO: 'bg-rose-100 text-rose-900',
};

export const mensajeError = (error: unknown) =>
  error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
