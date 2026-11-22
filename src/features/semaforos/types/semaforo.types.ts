export type ColorSemaforo = 'Verde' | 'Amarillo' | 'Rojo' | 'Morado';
export type NivelVoluntario = 'JUNIOR' | 'PRO' | 'SUPER_PRO';

export interface VoluntarioSemaforo {
  idAsignacion: number;
  idUsuario: number;
  ci: string;
  nombreCompleto: string;
  carrera: string;
  telefono: string;
  horarioComprometido: string;
  horasMesEstimadas: number;
  colorSemaforo: ColorSemaforo;
  observacionesDesempeno: string;
  notificarAbandono: boolean;
  reportado: boolean;
}

export interface ProyectoResumen {
  id: number;
  nombre: string;
  cupoMaximo: number;
  cupoOcupado: number;
  supervisor?: string;
}

export interface ReporteProyectoResponse {
  proyecto: ProyectoResumen;
  periodo: {
    mes: string;
    anio: number;
  };
  resumen: {
    total: number;
    verdes: number;
    amarillos: number;
    rojos: number;
    morados: number;
  };
  voluntarios: VoluntarioSemaforo[];
}

export interface PremioHistorico {
  id: number;
  idUsuario: number;
  semestre: string;
  proyectoId?: number;
  nombreProyecto?: string;
  nombrePremio: string;
  categoria?: string;
  descripcion: string;
  createdAt?: string;
}

export interface VoluntarioBaseMadre {
  id: number;
  ci: string;
  nombres: string;
  primerApellido: string;
  segundoApellido?: string;
  nombreCompleto: string;
  carrera: string;
  email: string;
  telefono?: string;
  semestresActivos: string;
  proyectoReciente: string;
  horasTotalesHistoricas: number;
  nivelCalculado: NivelVoluntario;
  estado: string;
  totalPremios: number;
  premios: PremioHistorico[];
}

export interface BaseMadreResponse {
  kpis: {
    totalHistoricos: number;
    horasSocialesCertificadas: number;
    totalSuperPro: number;
    activosSemestreActual: number;
  };
  totalRegistros: number;
  voluntarios: VoluntarioBaseMadre[];
}

export interface VoluntarioRanking {
  posicion: number;
  idUsuario: number;
  nombreCompleto: string;
  ci: string;
  carrera: string;
  proyecto: string;
  horasSemestre: number;
  semaforosMorados: number;
  evaluacionInstitucion: number;
  nivel: NivelVoluntario;
  score: number;
  merito: string;
  aprobadoRetiro: boolean;
}

export interface RankingResponse {
  formula: string;
  podio: VoluntarioRanking[];
  rankingCompleto: VoluntarioRanking[];
}

export interface FeedbackInstitucion {
  id?: number;
  proyectoId: number;
  nombreProyecto: string;
  semestre: string;
  voluntariosRecibidos: number;
  voluntariosCulminados: number;
  bajasAbandonos: number;
  calificacionGrupo: number;
  calificacionCatolider: number;
  solicitaContinuidadConvenio: boolean;
  cuposSolicitadosProximoSemestre: number;
  bloque4ObservacionesSugerenciasLibres: string;
  nombreResponsableLlenado: string;
  cargoResponsable?: string;
  documentoRespaldoUrl?: string;
  fechaEvaluacion?: string;
  esBorrador?: boolean;
}

export interface PlantillaCertificado {
  usuarioId: number;
  nombreCompleto: string;
  ci: string;
  carrera: string;
  proyectoReceptor: string;
  semestre: string;
  horasCumplidas: number;
  fechaEmision: string;
  actividadesRealizadas: string;
  textoPreformateadoCopiar: string;
}
