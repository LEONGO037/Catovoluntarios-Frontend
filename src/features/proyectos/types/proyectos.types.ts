export type MotivoTraslado =
  | 'Cruce con materias universitarias'
  | 'Dificultad de transporte/distancia'
  | 'Solicitud de supervisor del centro'
  | 'Incompatibilidad de perfil'
  | 'Otro';

export interface Institucion {
  id: string;
  nombre_institucion: string;
  direccion_exacta: string;
  macrodistrito_zona: string;
  nombre_supervisor_centro: string;
  telefono_contacto: string;
  correo: string;
  fecha_inicio_convenio: string;
  fecha_fin_convenio: string;
  activo: boolean;
}

export interface ProyectoReceptor {
  id: string;
  institucion_id: string;
  semestre: string;
  nombre_proyecto: string;
  direccion_exacta: string;
  macrodistrito_zona: string;
  nombre_supervisor_centro: string;
  telefono_contacto: string;
  correo: string;
  fecha_inicio_convenio: string;
  fecha_fin_convenio: string;
  poblacion_objetivo: string[];
  actividades_semestre_actual: string;
  monto_pasaje_fijo: number;
  cupo_maximo_voluntarios: number;
  cupos_ocupados?: number;
  catolider_titular_id: string;
  catolider_titular_nombre?: string;
  catolider_aprendiz_id?: string;
  catolider_aprendiz_nombre?: string;
  estado: 'activo' | 'inactivo';
  institucion?: Institucion;
}

export interface CrearInstitucionDto {
  nombre_institucion: string;
  direccion_exacta: string;
  macrodistrito_zona: string;
  nombre_supervisor_centro: string;
  telefono_contacto: string;
  correo: string;
  fecha_inicio_convenio: string;
  fecha_fin_convenio: string;
}

export type ActualizarInstitucionDto = Partial<CrearInstitucionDto> & {
  activo?: boolean;
};

export interface CrearProyectoReceptorDto {
  institucion_id?: string;
  institucion?: CrearInstitucionDto;
  semestre: string;
  nombre_proyecto: string;
  direccion_exacta: string;
  macrodistrito_zona: string;
  nombre_supervisor_centro: string;
  telefono_contacto: string;
  correo: string;
  fecha_inicio_convenio: string;
  fecha_fin_convenio: string;
  poblacion_objetivo: string[];
  actividades_semestre_actual: string;
  monto_pasaje_fijo: number;
  cupo_maximo_voluntarios: number;
  catolider_titular_id: string;
  catolider_aprendiz_id?: string;
}

export type ActualizarProyectoReceptorDto = Partial<CrearProyectoReceptorDto> & {
  activo?: boolean;
};

export interface ReutilizarProyectoDto {
  proyectoOrigenId: string;
  semestreDestino: string;
  actividades_semestre_actual?: string;
  cupo_maximo_voluntarios?: number;
  monto_pasaje_fijo?: number;
  catolider_titular_id?: string;
  catolider_aprendiz_id?: string;
}

export interface VoluntarioAdmitido {
  id: string;
  nombre_completo: string;
  ci: string;
  telefono: string;
  correo: string;
  carrera: string;
  edad: number;
  condicion: 'Nuevo' | 'Antiguo';
  horario_comprometido: string;
  poblacion_sugerida: string;
  puntaje_esre?: number;
  poliza_validada: boolean;
  proyecto_id?: string;
  fecha_asignacion?: string;
}

export interface CatoliderInfo {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  carrera: string;
  nivel: 'Pro' | 'Super Pro';
}

export interface ReasignarUbicacionDto {
  id_asignacion_origen: number;
  id_proyecto_destino: number;
  motivo_traslado: MotivoTraslado;
  motivo_otro_detalle?: string;
  fecha_efectiva: string;
  semestre: string;
  observaciones?: string;
}

export interface TrasladoRegistro {
  id: string;
  voluntario_id: string;
  voluntario_nombre: string;
  voluntario_carrera: string;
  proyecto_origen_id: string;
  proyecto_origen_nombre: string;
  proyecto_destino_id: string;
  proyecto_destino_nombre: string;
  motivo_traslado: MotivoTraslado;
  motivo_otro_detalle?: string;
  fecha_efectiva: string;
  fecha_solicitud: string;
  semestre?: string;
  estado: 'completado';
}

export interface NotificacionTraslado {
  id: string;
  traslado_id: string;
  tipo: 'baja_lider_origen' | 'alta_lider_destino' | 'actualizacion_voluntario';
  destinatario_rol: 'catolider' | 'voluntario';
  destinatario_nombre: string;
  titulo: string;
  mensaje: string;
  motivo?: MotivoTraslado | string;
  motivo_otro_detalle?: string;
  proyecto_origen_nombre?: string;
  proyecto_destino_nombre?: string;
  fecha: string;
  leido: boolean;
}

export interface PeriodoTrasladoEstado {
  semestre: string;
  semanaActual: number;
  maxSemanasOrdinarias: number;
  periodoOrdinarioHabilitado: boolean;
  fechaInicioReferencia: string;
  fuente: 'backend' | 'calculado';
}

export interface BalanceDemografico {
  totalAsignados: number;
  cupoMaximo: number;
  porcentajeOcupacion: number;
  nuevos: number;
  antiguos: number;
  porcentajeNuevos: number;
  porcentajeAntiguos: number;
  promedioEdad: number;
  distribucionCarreras: { carrera: string; cantidad: number }[];
}

export interface FiltrosUbicacion {
  carrera: string;
  condicion: 'Todos' | 'Nuevo' | 'Antiguo';
  rangoEdad: 'Todos' | '18-20' | '21-23' | '24+';
  poblacionSugerida: string;
  searchTerm: string;
}
