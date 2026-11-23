import { apiClient } from './api.client';
import type {
  CitaVista,
  CitasDelDia,
  DetalleEntrevista,
  DisponibilidadSemanal,
  EstadoMarcadoRapido,
  MiEntrevista,
  ProyectoReceptorOpcion,
  RegistrarFichaPayload,
} from '../features/entrevistas/types/entrevistas.types';

/** M03 — P-07 y P-08. */
export const entrevistasApi = {
  disponibilidad(semana?: string): Promise<DisponibilidadSemanal> {
    return apiClient.get(`/entrevistas/disponibilidad${semana ? `?semana=${semana}` : ''}`);
  },

  agendar(fechaHora: string): Promise<CitaVista> {
    return apiClient.post('/entrevistas/agendar', { fechaHora });
  },

  miEntrevista(): Promise<MiEntrevista> {
    return apiClient.get('/entrevistas/mi-entrevista');
  },

  citasDelDia(fecha: string): Promise<CitasDelDia> {
    return apiClient.get(`/entrevistas?fecha=${fecha}`);
  },

  cambiarEstado(id: number, estado: EstadoMarcadoRapido): Promise<CitaVista> {
    return apiClient.patch(`/entrevistas/${id}/estado`, { estado });
  },

  reprogramar(id: number, fechaHora: string): Promise<CitaVista> {
    return apiClient.patch(`/entrevistas/${id}/reprogramar`, { fechaHora });
  },

  listarFichas(): Promise<CitaVista[]> {
    return apiClient.get('/entrevistas/fichas');
  },

  detalle(id: number): Promise<DetalleEntrevista> {
    return apiClient.get(`/entrevistas/${id}`);
  },

  registrarFicha(id: number, datos: RegistrarFichaPayload): Promise<DetalleEntrevista> {
    return apiClient.post(`/entrevistas/${id}/ficha`, datos);
  },

  /** ⚠ TEMPORAL: reemplazar por GET /api/proyectos de M05 al integrar. */
  proyectosReceptores(): Promise<ProyectoReceptorOpcion[]> {
    return apiClient.get('/simulados-m03/proyectos-receptores');
  },
};
