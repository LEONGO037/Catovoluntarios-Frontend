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
  tamanio?: string;
  fechaSubida: string;
  numeroPoliza?: string;
  idPoliza?: string;
  numeroCertificado?: string;
  vigenciaInicio?: string;
  vigenciaFin?: string;
  asegurado?: string;
  estado: EstadoDocumento;
  observacionesValidacion?: string;
}

export interface VoluntarioExpediente {
  id: number;
  ci: string;
  nombreCompleto: string;
  nombres: string;
  primerApellido: string;
  segundoApellido?: string;
  email: string;
  telefono: string;
  carrera: string;
  semestreCarrera?: string;
  edad: number;
  esMenor: boolean;
  rol: UserRole;
  proyectoAsignado: string;
  catoliderAsignado?: string;
  polizaValidada: boolean;
  induccionCompletada: boolean;
  habilitadoCampo: boolean;
  documentos: DocumentoVoluntario[];
  estadoGeneral: 'PENDIENTE' | 'APROBADO' | 'OBSERVADO';
}

export interface ParticipanteInduccion {
  id: number;
  userId: number;
  nombreCompleto: string;
  ci: string;
  rol: UserRole;
  catolider: string;
  documentosHabilitados: boolean;
  fechaCharla?: string;
  recorridoSitio?: string;
  estadoInduccion: EstadoInduccion;
  proyectoNombre: string;
  observaciones?: string;
}

export interface SesionInduccion {
  id: number;
  titulo: string;
  fechaHora: string;
  modalidad: 'PRESENCIAL' | 'VIRTUAL';
  lugarEnlace: string;
  facilitador: string;
  proyectoNombre?: string;
  semana: string;
}
