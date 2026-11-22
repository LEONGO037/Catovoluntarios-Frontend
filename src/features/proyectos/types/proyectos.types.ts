export type MotivoTraslado =
  | 'Cruce con materias universitarias'
  | 'Dificultad de transporte/distancia'
  | 'Solicitud de supervisor del centro'
  | 'Incompatibilidad de perfil';

export interface ProyectoReceptor {
  id: string;
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
  catolider_titular_nombre?: string;
  catolider_aprendiz_id?: string;
  catolider_aprendiz_nombre?: string;
  estado: 'activo' | 'inactivo';
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
  fecha_efectiva: string;
  fecha_solicitud: string;
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
  fecha: string;
  leido: boolean;
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
