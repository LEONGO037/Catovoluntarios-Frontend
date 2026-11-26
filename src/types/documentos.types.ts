import type { UserRole } from './auth.types';

export type TipoDocumento =
  | 'POLIZA_ACCIDENTES_APC7083'
  | 'COMPROMISO_VOLUNTARIADO'
  | 'CI_ANVERSO_REVERSO'
  | 'CARTA_AUTORIZACION_PADRES_MENOR'
  | 'CI_PADRE_TUTOR_MENOR'
  | 'OTRO_RESPALDO';

export type EstadoDocumento = 'PENDIENTE' | 'APROBADO' | 'OBSERVADO' | 'RECHAZADO';
export type EstadoInduccion = 'COMPLETADA' | 'EN_PROCESO' | 'PENDIENTE' | 'REPROGRAMAR';

export interface DocumentoVoluntario {
  id: number;
  tipoDocumento: TipoDocumento;
  archivoUrl: string;
  nombreArchivoOriginal: string;
  enviadoRevisionEn: string | null;
  numeroPoliza?: string;
  idPoliza?: string;
  numeroCertificado?: string;
  vigenciaInicio?: string;
  vigenciaFin?: string;
  asegurado?: string;
  estado: EstadoDocumento;
  observacionesValidacion?: string | null;
}

export interface VoluntarioExpediente {
  id: number;
  ci: string;
  nombreCompleto: string;
  carrera?: string;
  esMenor: boolean;
  proyectoAsignado?: string;
  catoliderAsignado?: string;
  induccionCompletada: boolean;
  habilitadoCampo: boolean;
  documentos: DocumentoVoluntario[];
  estadoGeneral: EstadoDocumento;
}

export interface BandejaDocumental {
  kpis: {
    pendientesRevision: number;
    observados: number;
    habilitadosEsteSemestre: number;
    polizasProximasVencer: number;
  };
  voluntarios: VoluntarioExpediente[];
}

export interface ParticipanteInduccion {
  id: number | null;
  sesionId: number | null;
  userId: number;
  nombreCompleto: string;
  ci: string;
  rol: UserRole;
  documentosHabilitados: boolean;
  asistio: boolean;
  fechaCharla?: string | null;
  recorridoSitio?: string | null;
  estadoInduccion: EstadoInduccion;
  proyectoId?: number | null;
  proyectoAsignado: string;
  observaciones?: string;
}

export interface ParticipantesInduccion {
  kpis: {
    voluntariosHabilitados: number;
    induccionCompletada: number;
    pendientesInduccion: number;
    reprogramarAsistencia: number;
  };
  participantes: ParticipanteInduccion[];
}

export interface SesionInduccion {
  id: number;
  titulo: string;
  fechaHora: string;
  modalidad: 'PRESENCIAL' | 'VIRTUAL';
  lugarEnlace?: string;
  facilitador?: string;
  proyectoId?: number;
}
