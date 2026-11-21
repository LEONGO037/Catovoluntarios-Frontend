import type {
  ProyectoReceptor,
  VoluntarioAdmitido,
  TrasladoRegistro,
  NotificacionTraslado,
  MotivoTraslado,
  CatoliderInfo,
} from '../types/proyectos.types';
import {
  INITIAL_PROYECTOS,
  INITIAL_VOLUNTARIOS,
  INITIAL_TRASLADOS,
  INITIAL_NOTIFICACIONES,
  INITIAL_CATOLIDERES,
} from './proyectos.mock';

// Local in-memory repository to simulate API client operations
class ProyectosService {
  private proyectos: ProyectoReceptor[] = [...INITIAL_PROYECTOS];
  private voluntarios: VoluntarioAdmitido[] = [...INITIAL_VOLUNTARIOS];
  private traslados: TrasladoRegistro[] = [...INITIAL_TRASLADOS];
  private notificaciones: NotificacionTraslado[] = [...INITIAL_NOTIFICACIONES];
  private catolideres: CatoliderInfo[] = [...INITIAL_CATOLIDERES];

  // RF-10: Catálogo de Proyectos Receptores
  getProyectos(): ProyectoReceptor[] {
    return [...this.proyectos];
  }

  getProyectoById(id: string): ProyectoReceptor | undefined {
    return this.proyectos.find((p) => p.id === id);
  }

  createProyecto(
    data: Omit<ProyectoReceptor, 'id' | 'estado'>
  ): ProyectoReceptor {
    const titular = this.catolideres.find((c) => c.id === data.catolider_titular_id);
    const aprendiz = data.catolider_aprendiz_id
      ? this.catolideres.find((c) => c.id === data.catolider_aprendiz_id)
      : undefined;

    const newProyecto: ProyectoReceptor = {
      ...data,
      id: `proj-${Date.now()}`,
      estado: 'activo',
      catolider_titular_nombre: titular ? titular.nombre : undefined,
      catolider_aprendiz_nombre: aprendiz ? aprendiz.nombre : undefined,
    };

    this.proyectos = [newProyecto, ...this.proyectos];
    return newProyecto;
  }

  updateProyecto(id: string, data: Partial<ProyectoReceptor>): ProyectoReceptor {
    const titular = data.catolider_titular_id
      ? this.catolideres.find((c) => c.id === data.catolider_titular_id)
      : undefined;
    const aprendiz = data.catolider_aprendiz_id
      ? this.catolideres.find((c) => c.id === data.catolider_aprendiz_id)
      : undefined;

    this.proyectos = this.proyectos.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          ...data,
          catolider_titular_nombre: titular
            ? titular.nombre
            : p.catolider_titular_nombre,
          catolider_aprendiz_nombre: aprendiz
            ? aprendiz.nombre
            : p.catolider_aprendiz_nombre,
        };
      }
      return p;
    });

    const updated = this.getProyectoById(id);
    if (!updated) throw new Error('Proyecto no encontrado');
    return updated;
  }

  deleteProyecto(id: string): void {
    // Desasignar voluntarios vinculados antes de eliminar
    this.voluntarios = this.voluntarios.map((v) =>
      v.proyecto_id === id ? { ...v, proyecto_id: undefined, fecha_asignacion: undefined } : v
    );
    this.proyectos = this.proyectos.filter((p) => p.id !== id);
  }

  getCatolideres(): CatoliderInfo[] {
    return [...this.catolideres];
  }

  // RF-12: Asignación Inteligente y Ubicación
  getVoluntarios(): VoluntarioAdmitido[] {
    return [...this.voluntarios];
  }

  getVoluntariosSinUbicar(): VoluntarioAdmitido[] {
    return this.voluntarios.filter((v) => !v.proyecto_id);
  }

  getVoluntariosPorProyecto(proyectoId: string): VoluntarioAdmitido[] {
    return this.voluntarios.filter((v) => v.proyecto_id === proyectoId);
  }

  asignarVoluntario(voluntarioId: string, proyectoId: string): void {
    const proyecto = this.getProyectoById(proyectoId);
    if (!proyecto) throw new Error('Proyecto no encontrado');

    const asignados = this.getVoluntariosPorProyecto(proyectoId);
    if (asignados.length >= proyecto.cupo_maximo_voluntarios) {
      throw new Error('El proyecto ha alcanzado su cupo máximo de voluntarios');
    }

    const today = new Date().toISOString().split('T')[0];
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

  desasignarVoluntario(voluntarioId: string): void {
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

  // RF-13: Gestión de Reasignaciones y Traslados
  getTraslados(): TrasladoRegistro[] {
    return [...this.traslados];
  }

  getNotificaciones(): NotificacionTraslado[] {
    return [...this.notificaciones];
  }

  marcarNotificacionLeida(id: string): void {
    this.notificaciones = this.notificaciones.map((n) =>
      n.id === id ? { ...n, leido: true } : n
    );
  }

  ejecutarTraslado(params: {
    voluntarioId: string;
    proyectoDestinoId: string;
    motivo: MotivoTraslado;
    fechaEfectiva: string;
  }): TrasladoRegistro {
    const { voluntarioId, proyectoDestinoId, motivo, fechaEfectiva } = params;

    const voluntario = this.voluntarios.find((v) => v.id === voluntarioId);
    if (!voluntario) throw new Error('Voluntario no encontrado');
    if (!voluntario.proyecto_id) throw new Error('El voluntario no tiene un proyecto asignado');

    const proyectoOrigen = this.getProyectoById(voluntario.proyecto_id);
    if (!proyectoOrigen) throw new Error('Proyecto de origen no encontrado');

    const proyectoDestino = this.getProyectoById(proyectoDestinoId);
    if (!proyectoDestino) throw new Error('Proyecto de destino no encontrado');

    if (proyectoOrigen.id === proyectoDestino.id) {
      throw new Error('El proyecto de destino debe ser diferente al de origen');
    }

    const ocupacionDestino = this.getVoluntariosPorProyecto(proyectoDestinoId).length;
    if (ocupacionDestino >= proyectoDestino.cupo_maximo_voluntarios) {
      throw new Error('El proyecto de destino no cuenta con cupos disponibles');
    }

    // Actualizar ubicación del voluntario
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
    const formattedNow = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    // Registrar traslado auditable
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

    // Generar alertas automáticas cruzadas
    const notifOrigen: NotificacionTraslado = {
      id: `notif-${Date.now()}-1`,
      traslado_id: nuevoTraslado.id,
      tipo: 'baja_lider_origen',
      destinatario_rol: 'catolider',
      destinatario_nombre: proyectoOrigen.catolider_titular_nombre || 'Catolíder de Origen',
      titulo: 'Baja de Voluntario por Traslado Autorizado',
      mensaje: `El voluntario ${voluntario.nombre_completo} (${voluntario.carrera}) fue trasladado a ${proyectoDestino.nombre_proyecto}. Motivo: ${motivo}.`,
      fecha: formattedNow,
      leido: false,
    };

    const notifDestino: NotificacionTraslado = {
      id: `notif-${Date.now()}-2`,
      traslado_id: nuevoTraslado.id,
      tipo: 'alta_lider_destino',
      destinatario_rol: 'catolider',
      destinatario_nombre: proyectoDestino.catolider_titular_nombre || 'Catolíder de Destino',
      titulo: 'Alta de Voluntario Reasignado a su Sede',
      mensaje: `Se ha incorporado el voluntario ${voluntario.nombre_completo} (${voluntario.carrera}) a ${proyectoDestino.nombre_proyecto}. Fecha efectiva: ${fechaEfectiva}.`,
      fecha: formattedNow,
      leido: false,
    };

    const notifVoluntario: NotificacionTraslado = {
      id: `notif-${Date.now()}-3`,
      traslado_id: nuevoTraslado.id,
      tipo: 'actualizacion_voluntario',
      destinatario_rol: 'voluntario',
      destinatario_nombre: voluntario.nombre_completo,
      titulo: 'Sede de Voluntariado Actualizada',
      mensaje: `Tu solicitud de traslado hacia ${proyectoDestino.nombre_proyecto} fue aprobada. Tu portal (P-18) ahora refleja tu nueva sede y tarifa de pasajes (${proyectoDestino.monto_pasaje_fijo} Bs/día).`,
      fecha: formattedNow,
      leido: false,
    };

    this.notificaciones = [
      notifOrigen,
      notifDestino,
      notifVoluntario,
      ...this.notificaciones,
    ];

    return nuevoTraslado;
  }
}

export const proyectosService = new ProyectosService();
