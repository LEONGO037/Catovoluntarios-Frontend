import { apiClient } from '../../../services/api.client';
import type {
  ProyectoReceptor,
  VoluntarioAdmitido,
  TrasladoRegistro,
  NotificacionTraslado,
  MotivoTraslado,
  CatoliderInfo,
} from '../types/proyectos.types';

// Repositorio de gestión de proyectos y asignaciones conectado al Backend
class ProyectosService {
  private proyectos: ProyectoReceptor[] = [];
  private voluntarios: VoluntarioAdmitido[] = [];
  private traslados: TrasladoRegistro[] = [];
  private notificaciones: NotificacionTraslado[] = [];
  private catolideres: CatoliderInfo[] = [];

  // ==========================================
  // RF-10: Catálogo de Proyectos Receptores
  // ==========================================

  getProyectosSync(): ProyectoReceptor[] {
    return [...this.proyectos];
  }

  getProyectos(): ProyectoReceptor[] {
    return [...this.proyectos];
  }

  getProyectoById(id: string): ProyectoReceptor | undefined {
    return this.proyectos.find((p) => p.id === id);
  }

  async fetchProyectos(): Promise<ProyectoReceptor[]> {
    try {
      const res = await apiClient.get<any>('/proyectos?limit=100');
      const items: any[] = Array.isArray(res) ? res : res?.data || [];

      this.proyectos = items.map((p) => {
        let pob: string[] = ['General'];
        if (Array.isArray(p.poblacion_objetivo)) {
          pob = p.poblacion_objetivo;
        } else if (typeof p.poblacion_objetivo === 'string' && p.poblacion_objetivo.trim()) {
          pob = [p.poblacion_objetivo];
        }

        return {
          id: String(p.id_proyecto || p.id),
          nombre_proyecto: p.nombre_proyecto || p.nombreProyecto || '',
          direccion_exacta: p.direccion_exacta || p.direccionExacta || '',
          macrodistrito_zona: p.macrodistrito_zona || p.macrodistritoZona || 'Centro',
          nombre_supervisor_centro:
            p.nombre_supervisor_centro || p.supervisor_nombre || p.supervisorNombre || '',
          telefono_contacto:
            p.telefono_contacto || p.supervisor_telefono || p.supervisorTelefono || '',
          correo: p.correo || '',
          fecha_inicio_convenio: p.fecha_inicio_convenio || '',
          fecha_fin_convenio: p.fecha_fin_convenio || '',
          poblacion_objetivo: pob,
          actividades_semestre_actual:
            p.actividades_semestre_actual || p.actividadesSemestreActual || '',
          monto_pasaje_fijo: Number(p.monto_pasaje_fijo || p.monto_pasaje_por_dia || 10),
          cupo_maximo_voluntarios: Number(
            p.cupo_maximo_voluntarios || p.cupo_maximo || p.cupoMaximo || 15
          ),
          catolider_titular_id: p.catolider_titular_id ? String(p.catolider_titular_id) : '',
          catolider_titular_nombre: p.catolider_titular_nombre,
          catolider_aprendiz_id: p.catolider_aprendiz_id ? String(p.catolider_aprendiz_id) : '',
          catolider_aprendiz_nombre: p.catolider_aprendiz_nombre,
          estado: p.activo !== false ? 'activo' : 'inactivo',
        };
      });

      return [...this.proyectos];
    } catch (err) {
      console.warn('No se pudieron obtener proyectos del backend, usando estado local:', err);
      return [...this.proyectos];
    }
  }

  async createProyecto(
    data: Omit<ProyectoReceptor, 'id' | 'estado'>
  ): Promise<ProyectoReceptor> {
    try {
      const payload = {
        nombre_proyecto: data.nombre_proyecto,
        direccion_exacta: data.direccion_exacta,
        macrodistrito_zona: data.macrodistrito_zona,
        nombre_supervisor_centro: data.nombre_supervisor_centro,
        telefono_contacto: data.telefono_contacto,
        correo: data.correo,
        fecha_inicio_convenio: data.fecha_inicio_convenio,
        fecha_fin_convenio: data.fecha_fin_convenio,
        poblacion_objetivo: Array.isArray(data.poblacion_objetivo)
          ? data.poblacion_objetivo.join(', ')
          : data.poblacion_objetivo,
        actividades_semestre_actual: data.actividades_semestre_actual,
        monto_pasaje_fijo: Number(data.monto_pasaje_fijo),
        cupo_maximo_voluntarios: Number(data.cupo_maximo_voluntarios),
        catolider_titular_id: data.catolider_titular_id ? Number(data.catolider_titular_id) : null,
        catolider_aprendiz_id: data.catolider_aprendiz_id ? Number(data.catolider_aprendiz_id) : null,
      };

      const res = await apiClient.post<any>('/proyectos', payload);
      await this.fetchProyectos();
      return (
        this.getProyectoById(String(res.id_proyecto || res.id)) || {
          ...data,
          id: String(res.id_proyecto || res.id),
          estado: 'activo',
        }
      );
    } catch (err) {
      console.error('Error al crear proyecto en backend:', err);
      // Fallback local
      const newProj: ProyectoReceptor = {
        ...data,
        id: `proj-${Date.now()}`,
        estado: 'activo',
      };
      this.proyectos = [newProj, ...this.proyectos];
      return newProj;
    }
  }

  async updateProyecto(
    id: string,
    data: Partial<ProyectoReceptor>
  ): Promise<ProyectoReceptor> {
    try {
      const payload: Record<string, any> = {};
      if (data.nombre_proyecto) payload.nombre_proyecto = data.nombre_proyecto;
      if (data.direccion_exacta) payload.direccion_exacta = data.direccion_exacta;
      if (data.macrodistrito_zona) payload.macrodistrito_zona = data.macrodistrito_zona;
      if (data.nombre_supervisor_centro) payload.nombre_supervisor_centro = data.nombre_supervisor_centro;
      if (data.telefono_contacto) payload.telefono_contacto = data.telefono_contacto;
      if (data.correo) payload.correo = data.correo;
      if (data.fecha_inicio_convenio) payload.fecha_inicio_convenio = data.fecha_inicio_convenio;
      if (data.fecha_fin_convenio) payload.fecha_fin_convenio = data.fecha_fin_convenio;
      if (data.poblacion_objetivo) {
        payload.poblacion_objetivo = Array.isArray(data.poblacion_objetivo)
          ? data.poblacion_objetivo.join(', ')
          : data.poblacion_objetivo;
      }
      if (data.actividades_semestre_actual) payload.actividades_semestre_actual = data.actividades_semestre_actual;
      if (data.monto_pasaje_fijo !== undefined) payload.monto_pasaje_fijo = Number(data.monto_pasaje_fijo);
      if (data.cupo_maximo_voluntarios !== undefined) payload.cupo_maximo_voluntarios = Number(data.cupo_maximo_voluntarios);
      if (data.catolider_titular_id !== undefined) {
        payload.catolider_titular_id = data.catolider_titular_id ? Number(data.catolider_titular_id) : null;
      }
      if (data.catolider_aprendiz_id !== undefined) {
        payload.catolider_aprendiz_id = data.catolider_aprendiz_id ? Number(data.catolider_aprendiz_id) : null;
      }

      await apiClient.put<any>(`/proyectos/${id}`, payload);
      await this.fetchProyectos();
      const updated = this.getProyectoById(id);
      if (updated) return updated;
    } catch (err) {
      console.warn('Error al actualizar proyecto en backend, usando fallback local:', err);
    }

    this.proyectos = this.proyectos.map((p) => (p.id === id ? { ...p, ...data } : p));
    const local = this.getProyectoById(id);
    if (!local) throw new Error('Proyecto no encontrado');
    return local;
  }

  async deleteProyecto(id: string): Promise<void> {
    try {
      await apiClient.delete(`/proyectos/${id}`);
    } catch (err) {
      console.warn('Error al eliminar proyecto en backend:', err);
    }
    this.proyectos = this.proyectos.filter((p) => p.id !== id);
    this.voluntarios = this.voluntarios.map((v) =>
      v.proyecto_id === id ? { ...v, proyecto_id: undefined, fecha_asignacion: undefined } : v
    );
  }

  getCatolideresSync(): CatoliderInfo[] {
    return [...this.catolideres];
  }

  getCatolideres(): CatoliderInfo[] {
    return [...this.catolideres];
  }

  async fetchCatolideres(): Promise<CatoliderInfo[]> {
    try {
      const res = await apiClient.get<any[]>('/users/catolideres-vigentes');
      if (Array.isArray(res) && res.length > 0) {
        this.catolideres = res.map((u) => ({
          id: String(u.id),
          nombre: `${u.nombres || ''} ${u.primerApellido || ''}`.trim() || u.email,
          correo: u.email,
          telefono: u.telefono || '70000000',
          carrera: u.carrera || 'Pastoral Universitaria',
          nivel: (u.nivel === 'Super Pro' ? 'Super Pro' : 'Pro') as 'Pro' | 'Super Pro',
        }));
      }
    } catch (err) {
      console.warn('No se pudieron obtener catolideres vigentes, usando fallback:', err);
    }
    return [...this.catolideres];
  }

  // ==========================================
  // RF-12: Asignación Inteligente y Ubicación
  // ==========================================

  getVoluntariosSync(): VoluntarioAdmitido[] {
    return [...this.voluntarios];
  }

  getVoluntarios(): VoluntarioAdmitido[] {
    return [...this.voluntarios];
  }

  getVoluntariosSinUbicar(): VoluntarioAdmitido[] {
    return this.voluntarios.filter((v) => !v.proyecto_id);
  }

  getVoluntariosPorProyecto(proyectoId: string): VoluntarioAdmitido[] {
    return this.voluntarios.filter((v) => v.proyecto_id === proyectoId);
  }

  async fetchVoluntarios(proyectosList?: ProyectoReceptor[]): Promise<VoluntarioAdmitido[]> {
    const listProyectos = proyectosList && proyectosList.length > 0 ? proyectosList : this.proyectos;

    try {
      // 1. Obtener postulantes admitidos sin ubicar
      const admitidos = await apiClient.get<any[]>('/ubicacion/postulantes-admitidos');
      const unassigned: VoluntarioAdmitido[] = (Array.isArray(admitidos) ? admitidos : []).map(
        (e) => ({
          id: String(e.id_usuario),
          nombre_completo: e.nombre_completo,
          ci: e.ci,
          telefono: e.celular || '70000000',
          correo: `${e.nombre_completo.toLowerCase().replace(/\s+/g, '.')}@ucb.edu.bo`,
          carrera: e.carrera,
          edad: e.edad || 20,
          condicion:
            String(e.condicion).toUpperCase() === 'ANTIGUO' ? 'Antiguo' : 'Nuevo',
          horario_comprometido: 'Tarde (14:00 - 18:00)',
          poblacion_sugerida: e.poblacion_sugerida || 'General',
          poliza_validada: true,
          proyecto_id: undefined,
          fecha_asignacion: undefined,
        })
      );

      // 2. Obtener voluntarios asignados por cada proyecto
      const assigned: VoluntarioAdmitido[] = [];
      for (const proj of listProyectos) {
        try {
          const proVoluntarios = await apiClient.get<any[]>(
            `/ubicacion/proyectos/${proj.id}/voluntarios`
          );
          if (Array.isArray(proVoluntarios)) {
            proVoluntarios.forEach((v) => {
              assigned.push({
                id: String(v.id_usuario),
                nombre_completo: v.nombre,
                ci: `CI-${v.id_usuario}`,
                telefono: v.celular || '70000000',
                correo: `${v.nombre.toLowerCase().replace(/\s+/g, '.')}@ucb.edu.bo`,
                carrera: v.carrera,
                edad: v.edad || 21,
                condicion:
                  String(v.condicion).toUpperCase() === 'ANTIGUO' ? 'Antiguo' : 'Nuevo',
                horario_comprometido: v.horario_comprometido || 'Tarde (14:00 - 18:00)',
                poblacion_sugerida: proj.poblacion_objetivo[0] || 'General',
                poliza_validada: Boolean(v.poliza_validada),
                proyecto_id: String(proj.id),
                fecha_asignacion: new Date().toISOString().split('T')[0],
              });
            });
          }
        } catch {
          // Ignorar fallo por proyecto individual
        }
      }

      this.voluntarios = [...unassigned, ...assigned];
      return [...this.voluntarios];
    } catch (err) {
      console.warn('Error al obtener voluntarios de API, usando estado local:', err);
      return [...this.voluntarios];
    }
  }

  async asignarVoluntario(voluntarioId: string, proyectoId: string): Promise<void> {
    const voluntario = this.voluntarios.find((v) => v.id === voluntarioId);

    const today = new Date().toISOString().split('T')[0];

    try {
      await apiClient.post('/ubicacion/asignar', {
        id_usuario: Number(voluntarioId),
        id_proyecto: Number(proyectoId),
        semestre: '2/2026',
        condicion: voluntario?.condicion === 'Antiguo' ? 'ANTIGUO' : 'NUEVO',
        horario_comprometido: voluntario?.horario_comprometido || 'Tarde (14:00 - 18:00)',
        poliza_validada: true,
        induccion_completada: true,
      });
    } catch (err) {
      console.warn('Fallo en endpoint /ubicacion/asignar, aplicando localmente:', err);
    }

    this.voluntarios = this.voluntarios.map((v) => {
      if (v.id === voluntarioId) {
        return {
          ...v,
          proyecto_id: proyectoId,
          fecha_asignacion: today,
        };
      }
      return v;
    });
  }

  async desasignarVoluntario(voluntarioId: string): Promise<void> {
    const vol = this.voluntarios.find((v) => v.id === voluntarioId);
    if (vol && vol.proyecto_id) {
      try {
        // Buscar las asignaciones de ese proyecto para obtener el id de asignacion
        const asignaciones = await apiClient.get<any[]>(
          `/ubicacion/proyectos/${vol.proyecto_id}/voluntarios`
        );
        const match = Array.isArray(asignaciones)
          ? asignaciones.find((a) => String(a.id_usuario) === String(voluntarioId))
          : null;
        if (match && match.id_asignacion) {
          await apiClient.delete(`/ubicacion/asignaciones/${match.id_asignacion}`);
        }
      } catch (err) {
        console.warn('Error al desasignar en backend:', err);
      }
    }

    this.voluntarios = this.voluntarios.map((v) => {
      if (v.id === voluntarioId) {
        return {
          ...v,
          proyecto_id: undefined,
          fecha_asignacion: undefined,
        };
      }
      return v;
    });
  }

  // ==========================================
  // RF-13: Gestión de Reasignaciones y Traslados
  // ==========================================

  getTrasladosSync(): TrasladoRegistro[] {
    return [...this.traslados];
  }

  getTraslados(): TrasladoRegistro[] {
    return [...this.traslados];
  }

  getNotificacionesSync(): NotificacionTraslado[] {
    return [...this.notificaciones];
  }

  getNotificaciones(): NotificacionTraslado[] {
    return [...this.notificaciones];
  }

  async fetchTraslados(): Promise<TrasladoRegistro[]> {
    try {
      const res = await apiClient.get<any[]>('/ubicacion/reasignaciones/historial');
      if (Array.isArray(res)) {
        this.traslados = res.map((t) => {
          const vol = this.voluntarios.find((v) => v.id === String(t.id_usuario));
          const pOrig = this.getProyectoById(String(t.id_proyecto_origen));
          const pDest = this.getProyectoById(String(t.id_proyecto_destino));

          return {
            id: String(t.id_historial || t.id),
            voluntario_id: String(t.id_usuario),
            voluntario_nombre: vol ? vol.nombre_completo : `Voluntario #${t.id_usuario}`,
            voluntario_carrera: vol ? vol.carrera : 'General',
            proyecto_origen_id: String(t.id_proyecto_origen),
            proyecto_origen_nombre: pOrig ? pOrig.nombre_proyecto : `Proyecto #${t.id_proyecto_origen}`,
            proyecto_destino_id: String(t.id_proyecto_destino),
            proyecto_destino_nombre: pDest ? pDest.nombre_proyecto : `Proyecto #${t.id_proyecto_destino}`,
            motivo_traslado: t.motivo_traslado as MotivoTraslado,
            fecha_efectiva: t.fecha_efectiva ? String(t.fecha_efectiva).split('T')[0] : '',
            fecha_solicitud: t.createdAt ? String(t.createdAt).split('T')[0] : '',
            estado: 'completado',
          };
        });
      }
    } catch (err) {
      console.warn('Error al obtener historial de reasignaciones:', err);
    }
    return [...this.traslados];
  }

  async fetchNotificaciones(): Promise<NotificacionTraslado[]> {
    try {
      const res = await apiClient.get<any[]>('/ubicacion/notificaciones');
      if (Array.isArray(res)) {
        this.notificaciones = res.map((n) => ({
          id: String(n.id_notificacion || n.id),
          traslado_id: String(n.id_asignacion || '0'),
          tipo:
            n.tipo_notificacion === 'ALTA_CATOLIDER'
              ? 'alta_lider_destino'
              : n.tipo_notificacion === 'BAJA_CATOLIDER'
              ? 'baja_lider_origen'
              : 'actualizacion_voluntario',
          destinatario_rol: n.rol_destinatario === 'VOLUNTARIO' ? 'voluntario' : 'catolider',
          destinatario_nombre: `Usuario #${n.id_usuario_destinatario}`,
          titulo: n.titulo,
          mensaje: n.mensaje,
          fecha: n.fecha_envio ? String(n.fecha_envio).replace('T', ' ').substring(0, 16) : '',
          leido: Boolean(n.leido),
        }));
      }
    } catch (err) {
      console.warn('Error al obtener notificaciones de backend:', err);
    }
    return [...this.notificaciones];
  }

  async marcarNotificacionLeida(id: string): Promise<void> {
    try {
      await apiClient.patch(`/ubicacion/notificaciones/${id}/marcar-leida`);
    } catch (err) {
      console.warn('Error al marcar notificacion leida en backend:', err);
    }
    this.notificaciones = this.notificaciones.map((n) =>
      n.id === id ? { ...n, leido: true } : n
    );
  }

  async ejecutarTraslado(params: {
    voluntarioId: string;
    proyectoDestinoId: string;
    motivo: MotivoTraslado;
    fechaEfectiva: string;
  }): Promise<TrasladoRegistro> {
    const { voluntarioId, proyectoDestinoId, motivo, fechaEfectiva } = params;

    const voluntario = this.voluntarios.find((v) => v.id === voluntarioId);
    if (!voluntario) throw new Error('Voluntario no encontrado');
    if (!voluntario.proyecto_id) throw new Error('El voluntario no tiene un proyecto asignado');

    const proyectoOrigen = this.getProyectoById(voluntario.proyecto_id);
    const proyectoDestino = this.getProyectoById(proyectoDestinoId);
    if (!proyectoOrigen) throw new Error('Proyecto de origen no encontrado');
    if (!proyectoDestino) throw new Error('Proyecto de destino no encontrado');

    try {
      // Buscar la asignación activa de origen
      const asignaciones = await apiClient.get<any[]>(
        `/ubicacion/proyectos/${proyectoOrigen.id}/voluntarios`
      );
      const match = Array.isArray(asignaciones)
        ? asignaciones.find((a) => String(a.id_usuario) === String(voluntarioId))
        : null;

      if (match && match.id_asignacion) {
        await apiClient.post('/ubicacion/reasignar', {
          id_asignacion_origen: match.id_asignacion,
          id_proyecto_destino: Number(proyectoDestinoId),
          motivo_traslado: motivo,
          fecha_efectiva: fechaEfectiva,
          observaciones: 'Traslado solicitado desde plataforma web',
        });
        await this.fetchTraslados();
        await this.fetchNotificaciones();
      }
    } catch (err) {
      console.warn('Error al ejecutar traslado en backend, aplicando localmente:', err);
    }

    // Actualizar ubicación en memoria
    this.voluntarios = this.voluntarios.map((v) => {
      if (v.id === voluntarioId) {
        return {
          ...v,
          proyecto_id: proyectoDestinoId,
          fecha_asignacion: fechaEfectiva,
        };
      }
      return v;
    });

    const now = new Date();
    const nuevoTraslado: TrasladoRegistro = {
      id: `tras-${Date.now()}`,
      voluntario_id: voluntario.id,
      voluntario_nombre: voluntario.nombre_completo,
      voluntario_carrera: voluntario.carrera,
      proyecto_origen_id: proyectoOrigen.id,
      proyecto_origen_nombre: proyectoOrigen.nombre_proyecto,
      proyecto_destino_id: proyectoDestino.id,
      proyecto_destino_nombre: proyectoDestino.nombre_proyecto,
      motivo_traslado: motivo,
      fecha_efectiva: fechaEfectiva,
      fecha_solicitud: now.toISOString().split('T')[0],
      estado: 'completado',
    };

    this.traslados = [nuevoTraslado, ...this.traslados];
    return nuevoTraslado;
  }
}

export const proyectosService = new ProyectosService();
