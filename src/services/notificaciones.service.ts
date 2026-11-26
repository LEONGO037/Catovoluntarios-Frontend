import { apiClient } from './api.client';

export interface Notificacion {
  id: number;
  titulo: string;
  mensaje: string;
  leida: boolean;
  enlaceDestino: string | null;
}

export const notificacionesService = {
  listar(semestre: string): Promise<Notificacion[]> {
    const query = new URLSearchParams({ semestre });
    return apiClient.get(`/notificaciones?${query}`);
  },

  marcarLeida(id: number): Promise<{ id: number; leida: boolean }> {
    return apiClient.patch(`/notificaciones/${id}/leida`);
  },
};
