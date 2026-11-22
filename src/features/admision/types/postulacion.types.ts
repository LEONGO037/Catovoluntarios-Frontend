export type TipoRelacionUcb =
  | 'Estudiante Regular'
  | 'Titulado/Alumni'
  | 'Docente'
  | 'Administrativo'
  | 'Familiar de personal UCB'
  | 'Externo autorizado';

export type EstadoPostulacion =
  | 'PENDIENTE'
  | 'APTO_ENTREVISTA'
  | 'OBSERVADO_SOBRECARGA'
  | 'DESCARTADO';

export interface PostulacionFormData {
  // Paso 1: Identificación
  tipoRelacionUcb: TipoRelacionUcb;
  nombres: string;
  primerApellido: string;
  segundoApellido?: string;
  ci: string;
  complemento?: string;
  expedido: string;
  fechaNacimiento: string;
  edad: number;
  celular: string;
  correoElectronico: string;
  carrera: string;
  zonaResidencia: string;

  // Paso 2: Filtro Académico (RF-03)
  numeroMaterias: number;
  tieneMateriasPesadas: boolean;
  detalleMateriasPesadas?: string;
  actividadesExtracurriculares: number;
  detalleActividades?: string;

  // Paso 3: Perfil y Motivación
  experienciaVoluntariadoPrevia: boolean;
  detalleExperiencia?: string;
  habilidadesDestacadas: string[];
  conocimientoComputacion: boolean;
  tresPalabrasPersonalidad: [string, string, string];
  alergiasCondicionesMedicas?: string;
  poblacionesInteres: string[];

  // Paso 4: Consentimiento
  requiereAutorizacionPadres: boolean;
  autorizacionPadresConfirmada: boolean;
  compromisoAceptado: boolean;
}

export interface Postulacion extends PostulacionFormData {
  id: number;
  codigoPostulacion: string;
  estado: EstadoPostulacion;
  observacionesPostulacion?: string;
  userId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PostulacionKpis {
  total: number;
  aptos: number;
  observadosSobrecarga: number;
  descartados: number;
  pendientes: number;
}

export interface FilterPostulacionesParams {
  search?: string;
  carrera?: string;
  zonaResidencia?: string;
  estado?: EstadoPostulacion | '';
  page?: number;
  limit?: number;
}

export interface PaginatedPostulaciones {
  items: Postulacion[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
