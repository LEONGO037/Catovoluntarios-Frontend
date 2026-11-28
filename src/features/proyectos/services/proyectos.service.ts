import { apiClient } from '../../../services/api.client';
import type {
  Institucion,
  ProyectoReceptor,
  VoluntarioAdmitido,
  TrasladoRegistro,
  NotificacionTraslado,
  MotivoTraslado,
  CatoliderInfo,
  CrearInstitucionDto,
  ActualizarInstitucionDto,
  CrearProyectoReceptorDto,
  ActualizarProyectoReceptorDto,
  ReutilizarProyectoDto,
  ReasignarUbicacionDto,
  PeriodoTrasladoEstado,
} from '../types/proyectos.types';

interface RawInstitucion {
  id_institucion?: number | string;
  id?: number | string;
  nombre_institucion?: string;
  nombreInstitucion?: string;
  nombre?: string;
  direccion_exacta?: string;
  direccionExacta?: string;
  macrodistrito_zona?: string;
  macrodistritoZona?: string;
  nombre_supervisor_centro?: string;
  supervisor_nombre?: string;
  supervisorNombre?: string;
  telefono_contacto?: string;
  supervisor_telefono?: string;
  supervisorTelefono?: string;
  correo?: string;
  fecha_inicio_convenio?: string;
  fecha_fin_convenio?: string;
  activo?: boolean;
}

interface RawProyecto {
  id_proyecto?: number | string;
  id?: number | string;
  id_institucion?: number | string;
  institucion_id?: number | string;
  institucionId?: number | string;
  institucion?: RawInstitucion;
  semestre?: string;
  gestion?: string;
  nombre_proyecto?: string;
  nombreProyecto?: string;
  direccion_exacta?: string;
  direccionExacta?: string;
  macrodistrito_zona?: string;
  macrodistritoZona?: string;
  nombre_supervisor_centro?: string;
  supervisor_nombre?: string;
  supervisorNombre?: string;
  telefono_contacto?: string;
  supervisor_telefono?: string;
  supervisorTelefono?: string;
  correo?: string;
  fecha_inicio_convenio?: string;
  fecha_fin_convenio?: string;
  poblacion_objetivo?: string | string[];
  actividades_semestre_actual?: string;
  actividadesSemestreActual?: string;
  monto_pasaje_fijo?: number | string;
  monto_pasaje_por_dia?: number | string;
  cupo_maximo_voluntarios?: number | string;
  cupo_maximo?: number | string;
  cupoMaximo?: number | string;
  cupos_ocupados?: number | string;
  cuposOcupados?: number | string;
  voluntarios_count?: number | string;
  voluntariosCount?: number | string;
  catolider_titular_id?: number | string | null;
  catolider_titular_nombre?: string;
  catolider_aprendiz_id?: number | string | null;
  catolider_aprendiz_nombre?: string;
  activo?: boolean;
  estado?: string;
}

interface RawProyectosResponse {
  data?: RawProyecto[];
  items?: RawProyecto[];
}

interface RawInstitucionesResponse {
  data?: RawInstitucion[];
  items?: RawInstitucion[];
}

interface RawCatolider {
  id: number | string;
  nombres?: string;
  primerApellido?: string;
  email?: string;
  telefono?: string;
  carrera?: string;
  nivel?: string;
}

interface RawVoluntarioAdmitido {
  id_usuario?: number | string;
  id?: number | string;
  nombre_completo?: string;
  nombres?: string;
  primerApellido?: string;
  ci?: string;
  celular?: string;
  telefono?: string;
  correo?: string;
  email?: string;
  carrera?: string;
  edad?: number;
  condicion?: string;
  horario_comprometido?: string;
  poblacion_sugerida?: string;
  puntaje_esre?: number;
}

interface RawVoluntarioAsignado {
  id_asignacion?: number;
  id_usuario: number | string;
  nombre?: string;
  nombre_completo?: string;
  ci?: string;
  celular?: string;
  telefono?: string;
  correo?: string;
  email?: string;
  carrera?: string;
  edad?: number;
  condicion?: string;
  horario_comprometido?: string;
  poliza_validada?: boolean;
  fecha_asignacion?: string;
}

interface RawTraslado {
  id_historial?: number | string;
  id?: number | string;
  id_usuario?: number | string;
  voluntario_nombre?: string;
  voluntario_carrera?: string;
  id_proyecto_origen?: number | string;
  proyecto_origen_nombre?: string;
  id_proyecto_destino?: number | string;
  proyecto_destino_nombre?: string;
  motivo_traslado?: string;
  motivo_otro_detalle?: string;
  fecha_efectiva?: string;
  createdAt?: string;
  fecha_solicitud?: string;
  semestre?: string;
}

interface RawNotificacion {
  id_notificacion?: number | string;
  id?: number | string;
  id_asignacion?: number | string;
  id_traslado?: number | string;
  tipo_notificacion?: string;
  tipo?: string;
  rol_destinatario?: string;
  destinatario_rol?: string;
  id_usuario_destinatario?: number | string;
  destinatario_nombre?: string;
  usuario_destinatario_nombre?: string;
  usuario_destinatario?: {
    nombres?: string;
    primerApellido?: string;
    nombre_completo?: string;
  };
  titulo?: string;
  mensaje?: string;
  motivo_traslado?: string;
  motivo?: string;
  motivo_otro_detalle?: string;
  proyecto_origen_nombre?: string;
  proyecto_destino_nombre?: string;
  fecha_envio?: string;
  createdAt?: string;
  leido?: boolean;
  leida?: boolean;
}

interface RawPeriodoResponse {
  semestre?: string;
  semanaActual?: number;
  semana_actual?: number;
  maxSemanasOrdinarias?: number;
  max_semanas_ordinarias?: number;
  habilitado?: boolean;
  periodoOrdinarioHabilitado?: boolean;
  fechaInicio?: string;
  fecha_inicio?: string;
}

function parsePoblacion(value?: string | string[]): string[] {
  if (Array.isArray(value)) {
    return value.filter((item) => Boolean(item && item.trim()));
  }
  if (typeof value === 'string' && value.trim()) {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function parseInstitucion(raw: RawInstitucion): Institucion {
  return {
    id: String(raw.id_institucion ?? raw.id ?? ''),
    nombre_institucion: raw.nombre_institucion ?? raw.nombreInstitucion ?? raw.nombre ?? '',
    direccion_exacta: raw.direccion_exacta ?? raw.direccionExacta ?? '',
    macrodistrito_zona: raw.macrodistrito_zona ?? raw.macrodistritoZona ?? 'Centro',
    nombre_supervisor_centro:
      raw.nombre_supervisor_centro ?? raw.supervisor_nombre ?? raw.supervisorNombre ?? '',
    telefono_contacto:
      raw.telefono_contacto ?? raw.supervisor_telefono ?? raw.supervisorTelefono ?? '',
    correo: raw.correo ?? '',
    fecha_inicio_convenio: raw.fecha_inicio_convenio
      ? String(raw.fecha_inicio_convenio).split('T')[0]
      : '',
    fecha_fin_convenio: raw.fecha_fin_convenio
      ? String(raw.fecha_fin_convenio).split('T')[0]
      : '',
    activo: raw.activo !== false,
  };
}

function parseProyecto(raw: RawProyecto, fallbackSemestre: string): ProyectoReceptor {
  const inst = raw.institucion ? parseInstitucion(raw.institucion) : undefined;
  const instId = String(raw.id_institucion ?? raw.institucion_id ?? raw.institucionId ?? inst?.id ?? '');
  const id = String(raw.id_proyecto ?? raw.id ?? '');
  const activo = raw.estado ? raw.estado === 'activo' : raw.activo !== false;

  const cuposRaw = raw.cupos_ocupados ?? raw.cuposOcupados ?? raw.voluntarios_count ?? raw.voluntariosCount;

  return {
    id,
    institucion_id: instId || id,
    semestre: raw.semestre ?? raw.gestion ?? fallbackSemestre,
    nombre_proyecto: raw.nombre_proyecto ?? raw.nombreProyecto ?? inst?.nombre_institucion ?? '',
    direccion_exacta: raw.direccion_exacta ?? raw.direccionExacta ?? inst?.direccion_exacta ?? '',
    macrodistrito_zona: raw.macrodistrito_zona ?? raw.macrodistritoZona ?? inst?.macrodistrito_zona ?? 'Centro',
    nombre_supervisor_centro:
      raw.nombre_supervisor_centro ??
      raw.supervisor_nombre ??
      raw.supervisorNombre ??
      inst?.nombre_supervisor_centro ??
      '',
    telefono_contacto:
      raw.telefono_contacto ??
      raw.supervisor_telefono ??
      raw.supervisorTelefono ??
      inst?.telefono_contacto ??
      '',
    correo: raw.correo ?? inst?.correo ?? '',
    fecha_inicio_convenio: raw.fecha_inicio_convenio
      ? String(raw.fecha_inicio_convenio).split('T')[0]
      : inst?.fecha_inicio_convenio ?? '',
    fecha_fin_convenio: raw.fecha_fin_convenio
      ? String(raw.fecha_fin_convenio).split('T')[0]
      : inst?.fecha_fin_convenio ?? '',
    poblacion_objetivo: parsePoblacion(raw.poblacion_objetivo),
    actividades_semestre_actual:
      raw.actividades_semestre_actual ?? raw.actividadesSemestreActual ?? '',
    monto_pasaje_fijo: Number(raw.monto_pasaje_fijo ?? raw.monto_pasaje_por_dia ?? 10),
    cupo_maximo_voluntarios: Number(
      raw.cupo_maximo_voluntarios ?? raw.cupo_maximo ?? raw.cupoMaximo ?? 10
    ),
    cupos_ocupados: cuposRaw !== undefined ? Number(cuposRaw) : undefined,
    catolider_titular_id: raw.catolider_titular_id ? String(raw.catolider_titular_id) : '',
    catolider_titular_nombre: raw.catolider_titular_nombre,
    catolider_aprendiz_id: raw.catolider_aprendiz_id ? String(raw.catolider_aprendiz_id) : '',
    catolider_aprendiz_nombre: raw.catolider_aprendiz_nombre,
    estado: activo ? 'activo' : 'inactivo',
    institucion: inst,
  };
}

function deriveInstitucionesFromProyectos(proyectos: ProyectoReceptor[]): Institucion[] {
  const map = new Map<string, Institucion>();
  for (const p of proyectos) {
    if (p.institucion) {
      map.set(p.institucion.id, p.institucion);
      continue;
    }
    const key = p.institucion_id || p.nombre_proyecto.toLowerCase().trim();
    if (!map.has(key)) {
      map.set(key, {
        id: p.institucion_id || p.id,
        nombre_institucion: p.nombre_proyecto,
        direccion_exacta: p.direccion_exacta,
        macrodistrito_zona: p.macrodistrito_zona,
        nombre_supervisor_centro: p.nombre_supervisor_centro,
        telefono_contacto: p.telefono_contacto,
        correo: p.correo,
        fecha_inicio_convenio: p.fecha_inicio_convenio,
        fecha_fin_convenio: p.fecha_fin_convenio,
        activo: p.estado === 'activo',
      });
    }
  }
  return Array.from(map.values());
}

export function calcularPeriodoTrasladoLocal(
  semestre: string,
  proyectos?: ProyectoReceptor[],
  fechaReferencia: Date = new Date()
): PeriodoTrasladoEstado {
  const maxSemanasOrdinarias = 4;
  const match = /^([12])\/(\d{4})$/.exec(semestre.trim());
  let fechaInicio: Date;

  if (match) {
    const periodo = Number(match[1]);
    const anio = Number(match[2]);
    fechaInicio = periodo === 1 ? new Date(anio, 1, 1) : new Date(anio, 7, 1);
  } else {
    fechaInicio = new Date(fechaReferencia.getFullYear(), 7, 1);
  }

  const proyectosDelSemestre = (proyectos ?? []).filter(
    (p) => p.semestre === semestre && p.fecha_inicio_convenio
  );
  if (proyectosDelSemestre.length > 0) {
    const timestamps = proyectosDelSemestre
      .map((p) => new Date(p.fecha_inicio_convenio).getTime())
      .filter((t) => !Number.isNaN(t));
    if (timestamps.length > 0) {
      const earliest = new Date(Math.min(...timestamps));
      if (earliest.getFullYear() === fechaInicio.getFullYear()) {
        fechaInicio = earliest;
      }
    }
  }

  const diffMs = fechaReferencia.getTime() - fechaInicio.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const semanaActual = diffDays < 0 ? 1 : Math.floor(diffDays / 7) + 1;

  return {
    semestre,
    semanaActual,
    maxSemanasOrdinarias,
    periodoOrdinarioHabilitado: semanaActual <= maxSemanasOrdinarias,
    fechaInicioReferencia: fechaInicio.toISOString().split('T')[0],
    fuente: 'calculado',
  };
}

class ProyectosService {
  private instituciones: Institucion[] = [];
  private proyectos: ProyectoReceptor[] = [];
  private proyectosHistoricos: ProyectoReceptor[] = [];
  private voluntarios: VoluntarioAdmitido[] = [];
  private traslados: TrasladoRegistro[] = [];
  private notificaciones: NotificacionTraslado[] = [];
  private catolideres: CatoliderInfo[] = [];

  getProyectosSync(): ProyectoReceptor[] {
    return [...this.proyectos];
  }

  getInstitucionesSync(): Institucion[] {
    return [...this.instituciones];
  }

  getProyectoById(id: string): ProyectoReceptor | undefined {
    return (
      this.proyectos.find((p) => p.id === id) ||
      this.proyectosHistoricos.find((p) => p.id === id)
    );
  }

  async fetchInstituciones(signal?: AbortSignal): Promise<Institucion[]> {
    try {
      const res = await apiClient.get<RawInstitucion[] | RawInstitucionesResponse>(
        '/instituciones?limit=200',
        { signal }
      );
      const items = Array.isArray(res) ? res : res.data || res.items || [];
      this.instituciones = items.map(parseInstitucion);
      return [...this.instituciones];
    } catch {
      const derived = deriveInstitucionesFromProyectos([
        ...this.proyectos,
        ...this.proyectosHistoricos,
      ]);
      this.instituciones = derived;
      return [...this.instituciones];
    }
  }

  async createInstitucion(data: CrearInstitucionDto): Promise<Institucion> {
    const res = await apiClient.post<RawInstitucion>('/instituciones', data);
    const parsed = parseInstitucion(res);
    this.instituciones = [parsed, ...this.instituciones];
    return parsed;
  }

  async updateInstitucion(id: string, data: ActualizarInstitucionDto): Promise<Institucion> {
    const res = await apiClient.put<RawInstitucion>(`/instituciones/${id}`, data);
    const parsed = parseInstitucion(res);
    this.instituciones = this.instituciones.map((inst) => (inst.id === id ? parsed : inst));
    return parsed;
  }

  async fetchProyectos(semestre?: string, signal?: AbortSignal): Promise<ProyectoReceptor[]> {
    const query = new URLSearchParams({ limit: '100' });
    if (semestre) {
      query.set('semestre', semestre);
    }
    const res = await apiClient.get<RawProyecto[] | RawProyectosResponse>(
      `/proyectos?${query.toString()}`,
      { signal }
    );
    const items = Array.isArray(res) ? res : res.data || res.items || [];
    const parsed = items.map((item) => parseProyecto(item, semestre ?? '2/2026'));

    this.proyectos = semestre
      ? parsed.filter((p) => p.semestre === semestre || !p.semestre)
      : parsed;
    if (this.instituciones.length === 0) {
      this.instituciones = deriveInstitucionesFromProyectos(parsed);
    }
    return [...this.proyectos];
  }

  async fetchProyectosHistoricos(
    semestreActual: string,
    signal?: AbortSignal
  ): Promise<ProyectoReceptor[]> {
    const query = new URLSearchParams({ limit: '200', incluirInactivos: 'true' });
    const res = await apiClient.get<RawProyecto[] | RawProyectosResponse>(
      `/proyectos?${query.toString()}`,
      { signal }
    );
    const items = Array.isArray(res) ? res : res.data || res.items || [];
    const allParsed = items.map((item) => parseProyecto(item, semestreActual));
    this.proyectosHistoricos = allParsed.filter(
      (p) => p.semestre !== semestreActual || p.estado === 'inactivo'
    );
    return [...this.proyectosHistoricos];
  }

  async fetchCuposPorProyecto(
    proyectosList: ProyectoReceptor[],
    semestre: string,
    signal?: AbortSignal
  ): Promise<Record<string, number>> {
    const counts: Record<string, number> = {};
    const missingFromPayload: ProyectoReceptor[] = [];

    for (const p of proyectosList) {
      if (p.cupos_ocupados !== undefined && !Number.isNaN(p.cupos_ocupados)) {
        counts[p.id] = p.cupos_ocupados;
      } else {
        missingFromPayload.push(p);
      }
    }

    if (missingFromPayload.length === 0) {
      return counts;
    }

    const results = await Promise.allSettled(
      missingFromPayload.map(async (proj) => {
        const qs = new URLSearchParams({ semestre });
        const list = await apiClient.get<RawVoluntarioAsignado[]>(
          `/ubicacion/proyectos/${proj.id}/voluntarios?${qs.toString()}`,
          { signal }
        );
        return { id: proj.id, count: Array.isArray(list) ? list.length : 0 };
      })
    );

    for (const result of results) {
      if (result.status === 'fulfilled') {
        counts[result.value.id] = result.value.count;
      }
    }

    return counts;
  }

  async createProyecto(data: CrearProyectoReceptorDto): Promise<ProyectoReceptor> {
    let institucionId = data.institucion_id;

    if (!institucionId && data.institucion) {
      try {
        const createdInst = await this.createInstitucion(data.institucion);
        institucionId = createdInst.id;
      } catch {
        // Si /instituciones no existe separado, continuamos con payload integrado en /proyectos
      }
    }

    const payload: Record<string, unknown> = {
      semestre: data.semestre,
      gestion: data.semestre,
      id_institucion: institucionId ? Number(institucionId) || institucionId : undefined,
      institucion_id: institucionId ? Number(institucionId) || institucionId : undefined,
      nombre_proyecto: data.nombre_proyecto,
      direccion_exacta: data.direccion_exacta,
      macrodistrito_zona: data.macrodistrito_zona,
      nombre_supervisor_centro: data.nombre_supervisor_centro,
      telefono_contacto: data.telefono_contacto,
      correo: data.correo,
      fecha_inicio_convenio: data.fecha_inicio_convenio,
      fecha_fin_convenio: data.fecha_fin_convenio,
      poblacion_objetivo: data.poblacion_objetivo.join(', '),
      actividades_semestre_actual: data.actividades_semestre_actual,
      monto_pasaje_fijo: Number(data.monto_pasaje_fijo),
      cupo_maximo_voluntarios: Number(data.cupo_maximo_voluntarios),
      catolider_titular_id: data.catolider_titular_id ? Number(data.catolider_titular_id) : null,
      catolider_aprendiz_id: data.catolider_aprendiz_id ? Number(data.catolider_aprendiz_id) : null,
      activo: true,
    };

    const res = await apiClient.post<RawProyecto>('/proyectos', payload);
    const created = parseProyecto(res, data.semestre);
    await this.fetchProyectos(data.semestre);
    return this.getProyectoById(created.id) || created;
  }

  async updateProyecto(
    id: string,
    data: ActualizarProyectoReceptorDto,
    semestre: string
  ): Promise<ProyectoReceptor> {
    if (data.institucion_id && data.institucion) {
      try {
        await this.updateInstitucion(data.institucion_id, data.institucion);
      } catch {
        // Si la edicion maestra esta integrada en /proyectos/:id, se envia tambien en el payload
      }
    }

    const payload: Record<string, unknown> = { semestre };
    if (data.institucion_id !== undefined) {
      payload.id_institucion = Number(data.institucion_id) || data.institucion_id;
    }
    if (data.nombre_proyecto !== undefined) payload.nombre_proyecto = data.nombre_proyecto;
    if (data.direccion_exacta !== undefined) payload.direccion_exacta = data.direccion_exacta;
    if (data.macrodistrito_zona !== undefined) payload.macrodistrito_zona = data.macrodistrito_zona;
    if (data.nombre_supervisor_centro !== undefined) {
      payload.nombre_supervisor_centro = data.nombre_supervisor_centro;
    }
    if (data.telefono_contacto !== undefined) payload.telefono_contacto = data.telefono_contacto;
    if (data.correo !== undefined) payload.correo = data.correo;
    if (data.fecha_inicio_convenio !== undefined) {
      payload.fecha_inicio_convenio = data.fecha_inicio_convenio;
    }
    if (data.fecha_fin_convenio !== undefined) payload.fecha_fin_convenio = data.fecha_fin_convenio;
    if (data.poblacion_objetivo !== undefined) {
      payload.poblacion_objetivo = data.poblacion_objetivo.join(', ');
    }
    if (data.actividades_semestre_actual !== undefined) {
      payload.actividades_semestre_actual = data.actividades_semestre_actual;
    }
    if (data.monto_pasaje_fijo !== undefined) {
      payload.monto_pasaje_fijo = Number(data.monto_pasaje_fijo);
    }
    if (data.cupo_maximo_voluntarios !== undefined) {
      payload.cupo_maximo_voluntarios = Number(data.cupo_maximo_voluntarios);
    }
    if (data.catolider_titular_id !== undefined) {
      payload.catolider_titular_id = data.catolider_titular_id
        ? Number(data.catolider_titular_id)
        : null;
    }
    if (data.catolider_aprendiz_id !== undefined) {
      payload.catolider_aprendiz_id = data.catolider_aprendiz_id
        ? Number(data.catolider_aprendiz_id)
        : null;
    }
    if (data.activo !== undefined) {
      payload.activo = data.activo;
    }

    const res = await apiClient.put<RawProyecto>(`/proyectos/${id}`, payload);
    await this.fetchProyectos(semestre);
    return this.getProyectoById(id) || parseProyecto(res, semestre);
  }

  async reactivarProyecto(id: string, semestre: string): Promise<ProyectoReceptor> {
    try {
      const res = await apiClient.patch<RawProyecto>(`/proyectos/${id}/reactivar`, {
        semestre,
        activo: true,
      });
      await this.fetchProyectos(semestre);
      return this.getProyectoById(id) || parseProyecto(res, semestre);
    } catch {
      return await this.updateProyecto(id, { activo: true }, semestre);
    }
  }

  async reutilizarProyecto(dto: ReutilizarProyectoDto): Promise<ProyectoReceptor> {
    const origen = this.getProyectoById(dto.proyectoOrigenId);
    if (!origen) {
      throw new Error('No se encontró el Proyecto Receptor de origen para reutilizar.');
    }

    try {
      const res = await apiClient.post<RawProyecto>(
        `/proyectos/${dto.proyectoOrigenId}/reutilizar`,
        {
          semestre: dto.semestreDestino,
          actividades_semestre_actual:
            dto.actividades_semestre_actual ?? origen.actividades_semestre_actual,
          cupo_maximo_voluntarios:
            dto.cupo_maximo_voluntarios ?? origen.cupo_maximo_voluntarios,
          monto_pasaje_fijo: dto.monto_pasaje_fijo ?? origen.monto_pasaje_fijo,
          catolider_titular_id: dto.catolider_titular_id
            ? Number(dto.catolider_titular_id)
            : origen.catolider_titular_id
            ? Number(origen.catolider_titular_id)
            : null,
          catolider_aprendiz_id: dto.catolider_aprendiz_id
            ? Number(dto.catolider_aprendiz_id)
            : origen.catolider_aprendiz_id
            ? Number(origen.catolider_aprendiz_id)
            : null,
        }
      );
      await this.fetchProyectos(dto.semestreDestino);
      return parseProyecto(res, dto.semestreDestino);
    } catch {
      return await this.createProyecto({
        institucion_id: origen.institucion_id,
        semestre: dto.semestreDestino,
        nombre_proyecto: origen.nombre_proyecto,
        direccion_exacta: origen.direccion_exacta,
        macrodistrito_zona: origen.macrodistrito_zona,
        nombre_supervisor_centro: origen.nombre_supervisor_centro,
        telefono_contacto: origen.telefono_contacto,
        correo: origen.correo,
        fecha_inicio_convenio: origen.fecha_inicio_convenio,
        fecha_fin_convenio: origen.fecha_fin_convenio,
        poblacion_objetivo: origen.poblacion_objetivo,
        actividades_semestre_actual:
          dto.actividades_semestre_actual ?? origen.actividades_semestre_actual,
        monto_pasaje_fijo: dto.monto_pasaje_fijo ?? origen.monto_pasaje_fijo,
        cupo_maximo_voluntarios: dto.cupo_maximo_voluntarios ?? origen.cupo_maximo_voluntarios,
        catolider_titular_id: dto.catolider_titular_id ?? origen.catolider_titular_id,
        catolider_aprendiz_id: dto.catolider_aprendiz_id ?? origen.catolider_aprendiz_id,
      });
    }
  }

  async deleteProyecto(id: string, semestre: string): Promise<void> {
    await apiClient.delete(`/proyectos/${id}`);
    await this.fetchProyectos(semestre);
  }

  getCatolideresSync(): CatoliderInfo[] {
    return [...this.catolideres];
  }

  async fetchCatolideres(semestre: string, signal?: AbortSignal): Promise<CatoliderInfo[]> {
    const query = new URLSearchParams({ semestre });
    const res = await apiClient.get<RawCatolider[]>(
      `/users/catolideres-vigentes?${query.toString()}`,
      { signal }
    );
    if (Array.isArray(res)) {
      this.catolideres = res.map((u) => ({
        id: String(u.id),
        nombre: `${u.nombres ?? ''} ${u.primerApellido ?? ''}`.trim() || u.email || 'Catolíder',
        correo: u.email ?? '',
        telefono: u.telefono ?? '',
        carrera: u.carrera ?? 'Pastoral Universitaria',
        nivel: u.nivel === 'Super Pro' ? 'Super Pro' : 'Pro',
      }));
    }
    return [...this.catolideres];
  }

  getVoluntariosSync(): VoluntarioAdmitido[] {
    return [...this.voluntarios];
  }

  async fetchVoluntarios(
    proyectosList: ProyectoReceptor[],
    semestre: string,
    signal?: AbortSignal
  ): Promise<VoluntarioAdmitido[]> {
    const listProyectos = proyectosList.length > 0 ? proyectosList : this.proyectos;
    const qs = new URLSearchParams({ semestre });

    const admitidos = await apiClient.get<RawVoluntarioAdmitido[]>(
      `/ubicacion/postulantes-admitidos?${qs.toString()}`,
      { signal }
    );

    const unassigned: VoluntarioAdmitido[] = (Array.isArray(admitidos) ? admitidos : []).map(
      (e) => {
        const nombre =
          e.nombre_completo ?? `${e.nombres ?? ''} ${e.primerApellido ?? ''}`.trim();
        return {
          id: String(e.id_usuario ?? e.id ?? ''),
          nombre_completo: nombre,
          ci: e.ci ?? '',
          telefono: e.celular ?? e.telefono ?? '',
          correo: e.correo ?? e.email ?? '',
          carrera: e.carrera ?? '',
          edad: Number(e.edad ?? 20),
          condicion: String(e.condicion).toUpperCase() === 'ANTIGUO' ? 'Antiguo' : 'Nuevo',
          horario_comprometido: e.horario_comprometido ?? 'Por coordinar',
          poblacion_sugerida: e.poblacion_sugerida ?? 'General',
          puntaje_esre: e.puntaje_esre,
          poliza_validada: true,
          proyecto_id: undefined,
          fecha_asignacion: undefined,
        };
      }
    );

    const assignedResults = await Promise.allSettled(
      listProyectos.map(async (proj) => {
        const proVoluntarios = await apiClient.get<RawVoluntarioAsignado[]>(
          `/ubicacion/proyectos/${proj.id}/voluntarios?${qs.toString()}`,
          { signal }
        );
        return { proj, proVoluntarios };
      })
    );

    const assigned: VoluntarioAdmitido[] = [];
    for (const result of assignedResults) {
      if (result.status !== 'fulfilled') continue;
      const { proj, proVoluntarios } = result.value;
      if (!Array.isArray(proVoluntarios)) continue;

      for (const v of proVoluntarios) {
        assigned.push({
          id: String(v.id_usuario),
          nombre_completo: v.nombre_completo ?? v.nombre ?? '',
          ci: v.ci ?? '',
          telefono: v.celular ?? v.telefono ?? '',
          correo: v.correo ?? v.email ?? '',
          carrera: v.carrera ?? '',
          edad: Number(v.edad ?? 20),
          condicion: String(v.condicion).toUpperCase() === 'ANTIGUO' ? 'Antiguo' : 'Nuevo',
          horario_comprometido: v.horario_comprometido ?? 'Por coordinar',
          poblacion_sugerida: proj.poblacion_objetivo[0] ?? 'General',
          poliza_validada: Boolean(v.poliza_validada),
          proyecto_id: String(proj.id),
          fecha_asignacion: v.fecha_asignacion
            ? String(v.fecha_asignacion).split('T')[0]
            : undefined,
        });
      }
    }

    this.voluntarios = [...unassigned, ...assigned];
    return [...this.voluntarios];
  }

  async asignarVoluntario(
    voluntarioId: string,
    proyectoId: string,
    semestre: string
  ): Promise<void> {
    const voluntario = this.voluntarios.find((v) => v.id === voluntarioId);
    const proyecto = this.getProyectoById(proyectoId);

    if (proyecto) {
      const currentAssigned = this.voluntarios.filter((v) => v.proyecto_id === proyectoId).length;
      if (currentAssigned >= proyecto.cupo_maximo_voluntarios) {
        throw new Error('El Proyecto Receptor seleccionado ha alcanzado su cupo máximo.');
      }
    }

    await apiClient.post('/ubicacion/asignar', {
      id_usuario: Number(voluntarioId),
      id_proyecto: Number(proyectoId),
      semestre,
      condicion: voluntario?.condicion === 'Antiguo' ? 'ANTIGUO' : 'NUEVO',
      horario_comprometido: voluntario?.horario_comprometido || 'Tarde (14:00 - 18:00)',
      poliza_validada: voluntario?.poliza_validada ?? true,
      induccion_completada: true,
    });
  }

  async desasignarVoluntario(voluntarioId: string, semestre: string): Promise<void> {
    const vol = this.voluntarios.find((v) => v.id === voluntarioId);
    if (!vol || !vol.proyecto_id) {
      throw new Error('El voluntario no tiene una asignación activa.');
    }

    const qs = new URLSearchParams({ semestre });
    const asignaciones = await apiClient.get<RawVoluntarioAsignado[]>(
      `/ubicacion/proyectos/${vol.proyecto_id}/voluntarios?${qs.toString()}`
    );
    const match = Array.isArray(asignaciones)
      ? asignaciones.find((a) => String(a.id_usuario) === String(voluntarioId))
      : undefined;

    if (!match?.id_asignacion) {
      throw new Error('No se encontró el identificador de asignación en el servidor.');
    }

    await apiClient.delete(`/ubicacion/asignaciones/${match.id_asignacion}`);
  }

  getTrasladosSync(): TrasladoRegistro[] {
    return [...this.traslados];
  }

  getNotificacionesSync(): NotificacionTraslado[] {
    return [...this.notificaciones];
  }

  async fetchPeriodoTraslado(
    semestre: string,
    proyectosList?: ProyectoReceptor[],
    signal?: AbortSignal
  ): Promise<PeriodoTrasladoEstado> {
    try {
      const qs = new URLSearchParams({ semestre });
      const res = await apiClient.get<RawPeriodoResponse>(
        `/ubicacion/reasignaciones/periodo?${qs.toString()}`,
        { signal }
      );
      const semanaActual = Number(res.semanaActual ?? res.semana_actual);
      if (!Number.isNaN(semanaActual) && semanaActual > 0) {
        const maxSemanas = Number(res.maxSemanasOrdinarias ?? res.max_semanas_ordinarias ?? 4);
        const habilitado =
          res.periodoOrdinarioHabilitado ?? res.habilitado ?? semanaActual <= maxSemanas;
        return {
          semestre: res.semestre ?? semestre,
          semanaActual,
          maxSemanasOrdinarias: maxSemanas,
          periodoOrdinarioHabilitado: Boolean(habilitado),
          fechaInicioReferencia: res.fechaInicio ?? res.fecha_inicio ?? '',
          fuente: 'backend',
        };
      }
    } catch {
      // Si el backend no expone el endpoint de periodo, se calcula con base en la gestion activa
    }

    return calcularPeriodoTrasladoLocal(semestre, proyectosList ?? this.proyectos);
  }

  async fetchTraslados(semestre: string, signal?: AbortSignal): Promise<TrasladoRegistro[]> {
    const qs = new URLSearchParams({ semestre });
    const res = await apiClient.get<RawTraslado[]>(
      `/ubicacion/reasignaciones/historial?${qs.toString()}`,
      { signal }
    );

    if (Array.isArray(res)) {
      this.traslados = res.map((t) => {
        const vol = this.voluntarios.find((v) => v.id === String(t.id_usuario));
        const pOrig = this.getProyectoById(String(t.id_proyecto_origen));
        const pDest = this.getProyectoById(String(t.id_proyecto_destino));

        return {
          id: String(t.id_historial ?? t.id ?? ''),
          voluntario_id: String(t.id_usuario ?? ''),
          voluntario_nombre:
            t.voluntario_nombre ?? vol?.nombre_completo ?? 'Voluntario registrado',
          voluntario_carrera: t.voluntario_carrera ?? vol?.carrera ?? '',
          proyecto_origen_id: String(t.id_proyecto_origen ?? ''),
          proyecto_origen_nombre:
            t.proyecto_origen_nombre ?? pOrig?.nombre_proyecto ?? 'Proyecto origen',
          proyecto_destino_id: String(t.id_proyecto_destino ?? ''),
          proyecto_destino_nombre:
            t.proyecto_destino_nombre ?? pDest?.nombre_proyecto ?? 'Proyecto destino',
          motivo_traslado: (t.motivo_traslado as MotivoTraslado) || 'Otro',
          motivo_otro_detalle: t.motivo_otro_detalle,
          fecha_efectiva: t.fecha_efectiva ? String(t.fecha_efectiva).split('T')[0] : '',
          fecha_solicitud:
            t.fecha_solicitud || t.createdAt
              ? String(t.fecha_solicitud ?? t.createdAt).split('T')[0]
              : '',
          semestre: t.semestre ?? semestre,
          estado: 'completado',
        };
      });
    }

    return [...this.traslados];
  }

  private resolveDestinatarioNombre(raw: RawNotificacion): string {
    if (raw.destinatario_nombre?.trim()) return raw.destinatario_nombre.trim();
    if (raw.usuario_destinatario_nombre?.trim()) return raw.usuario_destinatario_nombre.trim();
    if (raw.usuario_destinatario) {
      const fromObj =
        raw.usuario_destinatario.nombre_completo ??
        `${raw.usuario_destinatario.nombres ?? ''} ${raw.usuario_destinatario.primerApellido ?? ''}`.trim();
      if (fromObj) return fromObj;
    }

    const userId = raw.id_usuario_destinatario ? String(raw.id_usuario_destinatario) : '';
    if (userId) {
      const lider = this.catolideres.find((c) => c.id === userId);
      if (lider) return lider.nombre;
      const vol = this.voluntarios.find((v) => v.id === userId);
      if (vol) return vol.nombre_completo;
    }

    const rol = raw.rol_destinatario ?? raw.destinatario_rol ?? '';
    return rol === 'VOLUNTARIO' ? 'Catovoluntario trasladado' : 'Catolíder de proyecto';
  }

  async fetchNotificaciones(
    semestre: string,
    signal?: AbortSignal
  ): Promise<NotificacionTraslado[]> {
    const qs = new URLSearchParams({ semestre });
    const res = await apiClient.get<RawNotificacion[]>(
      `/ubicacion/notificaciones?${qs.toString()}`,
      { signal }
    );

    if (Array.isArray(res)) {
      this.notificaciones = res.map((n) => {
        const tipoRaw = n.tipo_notificacion ?? n.tipo ?? '';
        const tipo: NotificacionTraslado['tipo'] =
          tipoRaw === 'ALTA_CATOLIDER' || tipoRaw === 'alta_lider_destino'
            ? 'alta_lider_destino'
            : tipoRaw === 'BAJA_CATOLIDER' || tipoRaw === 'baja_lider_origen'
            ? 'baja_lider_origen'
            : 'actualizacion_voluntario';

        const rolRaw = n.rol_destinatario ?? n.destinatario_rol ?? '';
        const fechaRaw = n.fecha_envio ?? n.createdAt ?? '';

        return {
          id: String(n.id_notificacion ?? n.id ?? ''),
          traslado_id: String(n.id_traslado ?? n.id_asignacion ?? '0'),
          tipo,
          destinatario_rol:
            rolRaw.toUpperCase() === 'VOLUNTARIO' ? 'voluntario' : 'catolider',
          destinatario_nombre: this.resolveDestinatarioNombre(n),
          titulo: n.titulo ?? 'Notificación de reasignación',
          mensaje: n.mensaje ?? '',
          motivo: n.motivo_traslado ?? n.motivo,
          motivo_otro_detalle: n.motivo_otro_detalle,
          proyecto_origen_nombre: n.proyecto_origen_nombre,
          proyecto_destino_nombre: n.proyecto_destino_nombre,
          fecha: fechaRaw ? String(fechaRaw).replace('T', ' ').substring(0, 16) : '',
          leido: Boolean(n.leido ?? n.leida),
        };
      });
    }

    return [...this.notificaciones];
  }

  async marcarNotificacionLeida(id: string): Promise<void> {
    await apiClient.patch(`/ubicacion/notificaciones/${id}/marcar-leida`);
    this.notificaciones = this.notificaciones.map((n) =>
      n.id === id ? { ...n, leido: true } : n
    );
  }

  async ejecutarTraslado(params: {
    voluntarioId: string;
    proyectoDestinoId: string;
    motivo: MotivoTraslado;
    motivoOtroDetalle?: string;
    fechaEfectiva: string;
    semestre: string;
  }): Promise<TrasladoRegistro> {
    const {
      voluntarioId,
      proyectoDestinoId,
      motivo,
      motivoOtroDetalle,
      fechaEfectiva,
      semestre,
    } = params;

    if (motivo === 'Otro' && !motivoOtroDetalle?.trim()) {
      throw new Error('Debe especificar el detalle del motivo cuando selecciona "Otro".');
    }

    const voluntario = this.voluntarios.find((v) => v.id === voluntarioId);
    if (!voluntario) throw new Error('Voluntario no encontrado.');
    if (!voluntario.proyecto_id) throw new Error('El voluntario no tiene un proyecto asignado.');

    const proyectoOrigen = this.getProyectoById(voluntario.proyecto_id);
    const proyectoDestino = this.getProyectoById(proyectoDestinoId);
    if (!proyectoOrigen) throw new Error('Proyecto Receptor de origen no encontrado.');
    if (!proyectoDestino) throw new Error('Proyecto Receptor de destino no encontrado.');

    const qs = new URLSearchParams({ semestre });
    const asignaciones = await apiClient.get<RawVoluntarioAsignado[]>(
      `/ubicacion/proyectos/${proyectoOrigen.id}/voluntarios?${qs.toString()}`
    );
    const match = Array.isArray(asignaciones)
      ? asignaciones.find((a) => String(a.id_usuario) === String(voluntarioId))
      : undefined;

    if (!match?.id_asignacion) {
      throw new Error('No se encontró la asignación activa del voluntario en el servidor.');
    }

    const detalleLimpio = motivo === 'Otro' ? motivoOtroDetalle?.trim() : undefined;
    const dto: ReasignarUbicacionDto = {
      id_asignacion_origen: match.id_asignacion,
      id_proyecto_destino: Number(proyectoDestinoId),
      motivo_traslado: motivo,
      motivo_otro_detalle: detalleLimpio,
      fecha_efectiva: fechaEfectiva,
      semestre,
      observaciones: detalleLimpio
        ? `Otro: ${detalleLimpio}`
        : 'Traslado autorizado desde plataforma web',
    };

    const res = await apiClient.post<RawTraslado>('/ubicacion/reasignar', dto);

    return {
      id: String(res.id_historial ?? res.id ?? Date.now()),
      voluntario_id: voluntario.id,
      voluntario_nombre: voluntario.nombre_completo,
      voluntario_carrera: voluntario.carrera,
      proyecto_origen_id: proyectoOrigen.id,
      proyecto_origen_nombre: proyectoOrigen.nombre_proyecto,
      proyecto_destino_id: proyectoDestino.id,
      proyecto_destino_nombre: proyectoDestino.nombre_proyecto,
      motivo_traslado: motivo,
      motivo_otro_detalle: detalleLimpio,
      fecha_efectiva: fechaEfectiva,
      fecha_solicitud: new Date().toISOString().split('T')[0],
      semestre,
      estado: 'completado',
    };
  }
}

export const proyectosService = new ProyectosService();
