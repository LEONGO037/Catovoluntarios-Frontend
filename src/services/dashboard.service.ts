import { apiClient } from './api.client';

export interface DashboardKpiItem {
  value: number;
  label: string;
  tendencia: string;
  descripcion: string;
}

export interface DashboardMetricsResponse {
  semestre: string;
  kpis: {
    totalPostulantes: DashboardKpiItem;
    voluntariosActivos: DashboardKpiItem;
    polizasValidadas: DashboardKpiItem;
    horasTotalesMes: DashboardKpiItem;
  };
}

export interface ProyectoCupoItem {
  id: number;
  nombre: string;
  cupoMaximo: number;
  cupoOcupado: number;
  porcentaje: number;
  poblacion: string;
  montoPasajeFijo: number;
  color: string;
}

export interface CuposProyectosResponse {
  semestre: string;
  totalCupos: number;
  totalOcupados: number;
  porcentajeGlobal: number;
  proyectos: ProyectoCupoItem[];
}

export interface SemaforoDistribucionItem {
  count: number;
  porcentaje: number;
  label: string;
}

export interface SemaforoOperativoResponse {
  mes: string;
  totalEvaluados: number;
  distribucion: {
    morado: SemaforoDistribucionItem;
    verde: SemaforoDistribucionItem;
    amarillo: SemaforoDistribucionItem;
    rojo: SemaforoDistribucionItem;
  };
}

export interface NotificacionUrgente {
  id: string;
  tipo: string;
  prioridad: 'ALTA' | 'MEDIA' | 'INFORMATIVA';
  titulo: string;
  descripcion: string;
  accion: string;
  tiempo: string;
}

export const dashboardService = {
  async getMetrics(semestre = '2/2026'): Promise<DashboardMetricsResponse> {
    return await apiClient.get<DashboardMetricsResponse>(`/dashboard/metrics?semestre=${semestre}`);
  },

  async getCuposProyectos(semestre = '2/2026'): Promise<CuposProyectosResponse> {
    return await apiClient.get<CuposProyectosResponse>(`/dashboard/cupos-proyectos?semestre=${semestre}`);
  },

  async getSemaforoOperativo(mes = 'Noviembre 2026'): Promise<SemaforoOperativoResponse> {
    return await apiClient.get<SemaforoOperativoResponse>(`/dashboard/semaforo-operativo?mes=${mes}`);
  },

  async getNotificaciones(): Promise<NotificacionUrgente[]> {
    return await apiClient.get<NotificacionUrgente[]>('/dashboard/notificaciones-urgentes');
  },
};
