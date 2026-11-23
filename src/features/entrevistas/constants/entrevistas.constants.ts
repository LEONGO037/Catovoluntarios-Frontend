import type {
  DiaSemana,
  DictamenEntrevista,
  DictamenPsicologico,
  EstadoCita,
  PoblacionSugerida,
} from '../types/entrevistas.types';

/** P-07: las 4 fases visibles del ciclo de voluntariado. M03 corresponde a la fase 2. */
export const CICLO_ETAPAS = [
  'Convocatoria',
  'Postulación y Selección',
  'Ubicación de Voluntarios',
  'Desarrollo del Voluntariado',
] as const;
export const ETAPA_ACTUAL_M03 = 1; // índice 0-based → "Postulación y Selección"

export const ZONA_HORARIA_AGENDA = 'America/La_Paz';

export const ESTADO_CITA: Record<EstadoCita, { etiqueta: string; clase: string }> = {
  PROGRAMADA: { etiqueta: 'Programada', clase: 'bg-cato-canvas text-cato-slate border border-cato-border px-2.5 py-0.5 rounded-full text-xs font-semibold' },
  ASISTIO: { etiqueta: 'Asistió', clase: 'badge-semaforo-green' },
  FALTO: { etiqueta: 'Faltó', clase: 'badge-semaforo-red' },
  REPROGRAMADA: { etiqueta: 'Por reprogramar', clase: 'badge-semaforo-amber' },
  CANCELADA: { etiqueta: 'Cancelada', clase: 'bg-cato-canvas text-cato-muted border border-cato-border px-2.5 py-0.5 rounded-full text-xs font-semibold' },
};

export const DICTAMEN_ENTREVISTA: Record<DictamenEntrevista, { etiqueta: string; clase: string }> = {
  RECOMENDADO: { etiqueta: 'Recomendado', clase: 'badge-semaforo-green' },
  RECOMENDADO_CON_OBSERVACION: { etiqueta: 'Recomendado con Observación', clase: 'badge-semaforo-amber' },
  NO_RECOMENDADO: { etiqueta: 'No Recomendado', clase: 'badge-semaforo-red' },
};

export const DICTAMEN_PSICOLOGICO: Record<DictamenPsicologico, { etiqueta: string; clase: string }> = {
  APROBADO: { etiqueta: 'Aprobado', clase: 'badge-semaforo-green' },
  OBSERVADO: { etiqueta: 'Observado / En Seguimiento', clase: 'badge-semaforo-amber' },
  NO_HABILITADO: { etiqueta: 'No Habilitado', clase: 'badge-semaforo-red' },
};

/** Mismas 6 poblaciones del formulario de postulación (M02). Códigos = poblacion_sugerida_enum. */
export const POBLACIONES: { codigo: PoblacionSugerida; etiqueta: string }[] = [
  { codigo: 'NINEZ_PRIMERA_INFANCIA', etiqueta: 'Niños y primera infancia' },
  { codigo: 'ADULTOS_MAYORES', etiqueta: 'Adultos mayores' },
  { codigo: 'SITUACION_CALLE_ADICCIONES', etiqueta: 'Personas en situación de calle / adicciones' },
  { codigo: 'DISCAPACIDAD', etiqueta: 'Personas con discapacidad' },
  { codigo: 'SALUD_HOSPITALES', etiqueta: 'Salud y hospitales' },
  { codigo: 'CUIDADO_ANIMAL_MEDIO_AMBIENTE', etiqueta: 'Cuidado animal y medio ambiente' },
];

export const DIAS_SEMANA: { valor: DiaSemana; etiqueta: string }[] = [
  { valor: 'LUNES', etiqueta: 'Lunes' },
  { valor: 'MARTES', etiqueta: 'Martes' },
  { valor: 'MIERCOLES', etiqueta: 'Miércoles' },
  { valor: 'JUEVES', etiqueta: 'Jueves' },
  { valor: 'VIERNES', etiqueta: 'Viernes' },
  { valor: 'SABADO', etiqueta: 'Sábado' },
  { valor: 'DOMINGO', etiqueta: 'Domingo' },
];

/** Texto pendiente: Pastoral aún no entregó las preguntas guía de la entrevista. */
export const PREGUNTA_GUIA_PENDIENTE = 'Pregunta guía pendiente';
