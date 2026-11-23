// Tipos de M03 (P-07, P-08, P-09). Reflejan las respuestas del backend /api/entrevistas y /api/psicologia.

export type EstadoCita = 'PROGRAMADA' | 'ASISTIO' | 'FALTO' | 'REPROGRAMADA' | 'CANCELADA';
export type EstadoMarcadoRapido = 'ASISTIO' | 'FALTO' | 'REPROGRAMADA';
export type DictamenEntrevista = 'RECOMENDADO' | 'RECOMENDADO_CON_OBSERVACION' | 'NO_RECOMENDADO';
export type DictamenPsicologico = 'APROBADO' | 'OBSERVADO' | 'NO_HABILITADO';
export type PoblacionSugerida =
  | 'NINEZ_PRIMERA_INFANCIA'
  | 'ADULTOS_MAYORES'
  | 'SITUACION_CALLE_ADICCIONES'
  | 'DISCAPACIDAD'
  | 'SALUD_HOSPITALES'
  | 'CUIDADO_ANIMAL_MEDIO_AMBIENTE';
export type DiaSemana =
  | 'LUNES'
  | 'MARTES'
  | 'MIERCOLES'
  | 'JUEVES'
  | 'VIERNES'
  | 'SABADO'
  | 'DOMINGO';

// ---------- P-07 ----------
export interface FranjaDisponible {
  inicio: string;
  hora: string;
  capacidad: number;
  ocupadas: number;
  disponible: boolean;
}

export interface DiaAgenda {
  fecha: string;
  diaIso: number;
  franjas: FranjaDisponible[];
}

export interface DisponibilidadSemanal {
  semanaInicio: string;
  horaInicio: string;
  horaFin: string;
  duracionMinutos: number;
  zonaHoraria: string;
  dias: DiaAgenda[];
}

export interface PostulanteCita {
  postulacionId: number;
  codigoPostulacion: string;
  nombreCompleto: string;
  ci: string;
  carrera: string;
  edad: number;
}

export interface CitaVista {
  id: number;
  fechaHora: string;
  fecha: string;
  hora: string;
  estado: EstadoCita;
  catoliderId: number | null;
  catoliderNombre: string | null;
  postulante: PostulanteCita;
  fichaRegistrada: boolean;
  puedeGestionar: boolean;
}

export interface CatoliderActivo {
  userId: number;
  nombreCompleto: string;
}

export interface CitasDelDia {
  fecha: string;
  catolideres: CatoliderActivo[];
  citas: CitaVista[];
}

export interface MiEntrevista {
  postulacion: {
    codigoPostulacion: string;
    estadoPostulacion: string;
    nombreCompleto: string;
  } | null;
  entrevista: CitaVista | null;
}

// ---------- P-08 ----------
export interface HorarioDisponible {
  dia: DiaSemana;
  horaInicio: string;
  horaFin: string;
}

export interface FichaEntrevista {
  observacionesMotivacion: string | null;
  manejoTransporte: string | null;
  tiempoSemanal: string | null;
  horariosDisponibles: HorarioDisponible[];
  observacionesCompromiso: string | null;
  observacionesTrabajoEquipo: string | null;
  aperturaReligiosaEscala: number | null;
  observacionesRecomendaciones: string | null;
  proyectoReceptorSugeridoId: number | null;
  proyectoReceptorSugeridoNombre: string | null;
  dictamen: DictamenEntrevista | null;
}

export interface DetalleEntrevista {
  cita: CitaVista;
  ficha: FichaEntrevista;
}

export interface RegistrarFichaPayload {
  observacionesMotivacion?: string;
  manejoTransporte?: string;
  tiempoSemanal?: string;
  horariosDisponibles: HorarioDisponible[];
  observacionesCompromiso?: string;
  observacionesTrabajoEquipo?: string;
  aperturaReligiosaEscala: number;
  observacionesRecomendaciones?: string;
  proyectoReceptorSugeridoId: number;
  dictamen: DictamenEntrevista;
}

export interface ProyectoReceptorOpcion {
  id: number;
  nombreProyecto: string;
}

// ---------- P-09 ----------
export interface SubdimensionesEsre {
  socializacion?: number;
  eficacia?: number;
  proactividad?: number;
  gestionPersonal?: number;
}

export interface PostulanteEvaluable extends PostulanteCita {
  fechaEntrevista: string;
  dictamenEntrevista: DictamenEntrevista | null;
  evaluacion: { id: number; dictamen: DictamenPsicologico } | null;
}

export interface EvaluacionVista {
  id: number;
  postulacionId: number;
  puntajeGlobalEsre: number | null;
  subdimensionesEsre: SubdimensionesEsre | null;
  dictamen: DictamenPsicologico;
  poblacionesSugeridas: PoblacionSugerida[];
  observacionesConfidenciales: string | null;
  registradoPorId: number | null;
  registradoPorNombre: string | null;
  nombreInforme: string;
}

export interface FichaPsicologica {
  postulante: PostulanteCita;
  fechaEntrevista: string | null;
  dictamenEntrevista: DictamenEntrevista | null;
  nombreInformeEsperado: string;
  evaluacion: EvaluacionVista | null;
}

export interface EvaluacionPayload {
  puntajeGlobalEsre: number;
  socializacion?: number;
  eficacia?: number;
  proactividad?: number;
  gestionPersonal?: number;
  dictamen: DictamenPsicologico;
  poblacionesSugeridas: PoblacionSugerida[];
  observacionesConfidenciales?: string;
}
