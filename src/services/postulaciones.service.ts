import { apiClient } from './api.client';
import type {
  Postulacion,
  PostulacionFormData,
  PostulacionKpis,
  FilterPostulacionesParams,
  PaginatedPostulaciones,
  EstadoPostulacion,
} from '../features/admision/types/postulacion.types';

export const postulacionesApi = {
  /**
   * Envía el formulario público de postulación
   */
  async enviarPostulacion(data: PostulacionFormData): Promise<{
    message: string;
    codigoPostulacion: string;
    postulacion: Postulacion;
  }> {
    return apiClient<{
      message: string;
      codigoPostulacion: string;
      postulacion: Postulacion;
    }>('/postulaciones', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Obtiene las métricas KPI de postulantes
   */
  async obtenerKpis(
    userRol: string = 'ADMIN_PASTORAL',
    semestre?: string,
  ): Promise<PostulacionKpis> {
    const qs = semestre ? `?semestre=${encodeURIComponent(semestre)}` : '';
    return apiClient<PostulacionKpis>(`/postulaciones/kpis${qs}`, {
      headers: {
        'x-user-rol': userRol,
      },
    });
  },

  /**
   * Consulta filtrada y paginada de postulantes (P-06)
   */
  async obtenerPostulaciones(
    params: FilterPostulacionesParams = {},
    userRol: string = 'ADMIN_PASTORAL',
  ): Promise<PaginatedPostulaciones> {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.carrera) query.append('carrera', params.carrera);
    if (params.zonaResidencia) query.append('zonaResidencia', params.zonaResidencia);
    if (params.estado) query.append('estado', params.estado);
    if (params.semestre) query.append('semestre', params.semestre);
    if (params.page) query.append('page', String(params.page));
    if (params.limit) query.append('limit', String(params.limit));

    const qs = query.toString();
    const endpoint = `/postulaciones${qs ? `?${qs}` : ''}`;

    return apiClient<PaginatedPostulaciones>(endpoint, {
      headers: {
        'x-user-rol': userRol,
      },
    });
  },

  /**
   * Obtiene la ficha completa de un postulante por su ID
   */
  async obtenerPorId(
    id: number,
    userRol: string = 'ADMIN_PASTORAL',
  ): Promise<Postulacion> {
    return apiClient<Postulacion>(`/postulaciones/${id}`, {
      headers: {
        'x-user-rol': userRol,
      },
    });
  },

  /**
   * Actualiza el estado de la postulación (Solo Admin Pastoral)
   */
  async actualizarEstado(
    id: number,
    estado: EstadoPostulacion,
    observaciones?: string,
    userRol: string = 'ADMIN_PASTORAL',
  ): Promise<{ message: string; postulacion: Postulacion }> {
    return apiClient<{ message: string; postulacion: Postulacion }>(
      `/postulaciones/${id}/estado`,
      {
        method: 'PATCH',
        headers: {
          'x-user-rol': userRol,
        },
        body: JSON.stringify({ estado, observaciones }),
      },
    );
  },

  /**
   * Reseteo semestral de Catolíderes a rol Voluntario (P-06B)
   */
  async resetCatolideres(
    semestreAnterior: string,
    userRol: string = 'ADMIN_PASTORAL',
  ): Promise<{ message: string; catolideresRestablecidos: number }> {
    return apiClient<{ message: string; catolideresRestablecidos: number }>(
      '/users/reset-catolideres',
      {
        method: 'POST',
        headers: {
          'x-user-rol': userRol,
        },
        body: JSON.stringify({ semestreAnterior }),
      },
    );
  },

  /**
   * Asignación semestral de Catolíder (P-06B)
   */
  async asignarCatolider(
    data: {
      voluntarioId: number;
      modalidadLiderazgo: string;
      semestre: string;
      catoliderTipo?: string;
    },
    userRol: string = 'ADMIN_PASTORAL',
  ): Promise<{ message: string; user: any }> {
    return apiClient<{ message: string; user: any }>('/users/assign-catolider', {
      method: 'POST',
      headers: {
        'x-user-rol': userRol,
      },
      body: JSON.stringify(data),
    });
  },

  /**
   * Consulta de Catolíderes vigentes
   */
  async obtenerCatolideresVigentes(
    userRol: string = 'ADMIN_PASTORAL',
    semestre?: string,
  ): Promise<any[]> {
    const qs = semestre ? `?semestre=${encodeURIComponent(semestre)}` : '';
    return apiClient<any[]>(`/users/catolideres-vigentes${qs}`, {
      headers: {
        'x-user-rol': userRol,
      },
    });
  },

  /**
   * Consulta de voluntarios candidatos a liderazgo
   */
  async obtenerVoluntariosElegibles(userRol: string = 'ADMIN_PASTORAL'): Promise<any[]> {
    return apiClient<any[]>('/users/voluntarios-elegibles', {
      headers: {
        'x-user-rol': userRol,
      },
    });
  },

  /**
   * Revocación individual del rol de Catolíder
   */
  async revocarCatolider(
    id: number,
    userRol: string = 'ADMIN_PASTORAL',
  ): Promise<{ message: string; user: any }> {
    return apiClient<{ message: string; user: any }>(
      `/users/${id}/unassign-catolider`,
      {
        method: 'PATCH',
        headers: {
          'x-user-rol': userRol,
        },
      },
    );
  },
};
