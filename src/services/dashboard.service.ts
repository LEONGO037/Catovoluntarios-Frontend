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
    try {
      return await apiClient.get<DashboardMetricsResponse>(`/dashboard/metrics?semestre=${semestre}`);
    } catch {
      return {
        semestre,
        kpis: {
          totalPostulantes: {
            value: 142,
            label: 'Total Postulantes Semestre',
            tendencia: '+18% vs Gestión 1/2026',
            descripcion: 'Aspirantes registrados en plataforma',
          },
          voluntariosActivos: {
            value: 86,
            label: 'Voluntarios Activos en Campo',
            tendencia: '92% de retención',
            descripcion: 'Asignados con inducción completada',
          },
          polizasValidadas: {
            value: 78,
            label: 'Pólizas de Seguro Validadas',
            tendencia: 'Póliza UCB APC-7083',
            descripcion: 'Habilitados legalmente ante Pastoral',
          },
          horasTotalesMes: {
            value: 1248,
            label: 'Horas Totales del Mes',
            tendencia: 'Meta mensual superada',
            descripcion: 'Horas presenciales registradas y aprobadas',
          },
        },
      };
    }
  },

  async getCuposProyectos(semestre = '2/2026'): Promise<CuposProyectosResponse> {
    try {
      return await apiClient.get<CuposProyectosResponse>(`/dashboard/cupos-proyectos?semestre=${semestre}`);
    } catch {
      return {
        semestre,
        totalCupos: 114,
        totalOcupados: 86,
        porcentajeGlobal: 75,
        proyectos: [
          {
            id: 1,
            nombre: 'Hogar San Ramón (Adultos Mayores)',
            cupoMaximo: 25,
            cupoOcupado: 24,
            porcentaje: 96,
            poblacion: 'Adultos Mayores / Geriatría y Memoria',
            montoPasajeFijo: 10.0,
            color: '#004077',
          },
          {
            id: 2,
            nombre: 'Comedor San Calixto (Personas en Calle)',
            cupoMaximo: 20,
            cupoOcupado: 18,
            porcentaje: 90,
            poblacion: 'Personas en situación de vulnerabilidad extrema',
            montoPasajeFijo: 10.0,
            color: '#FFCC00',
          },
          {
            id: 3,
            nombre: 'Hospital del Niño - Área Lúdica',
            cupoMaximo: 15,
            cupoOcupado: 15,
            porcentaje: 100,
            poblacion: 'Niñez y salud pediátrica internada',
            montoPasajeFijo: 12.0,
            color: '#8B5CF6',
          },
          {
            id: 4,
            nombre: 'Centro Terapéutico Kallpa (Discapacidad)',
            cupoMaximo: 18,
            cupoOcupado: 12,
            porcentaje: 67,
            poblacion: 'Personas con discapacidad y autismo',
            montoPasajeFijo: 15.0,
            color: '#10B981',
          },
          {
            id: 5,
            nombre: 'Aldeas Infantiles SOS Mallasa',
            cupoMaximo: 20,
            cupoOcupado: 11,
            porcentaje: 55,
            poblacion: 'Primera infancia y apoyo escolar',
            montoPasajeFijo: 20.0,
            color: '#0EA5E9',
          },
          {
            id: 6,
            nombre: 'Comunidad Terapéutica Huajchilla',
            cupoMaximo: 16,
            cupoOcupado: 6,
            porcentaje: 38,
            poblacion: 'Rehabilitación y adicciones',
            montoPasajeFijo: 20.0,
            color: '#F97316',
          },
        ],
      };
    }
  },

  async getSemaforoOperativo(mes = 'Noviembre 2026'): Promise<SemaforoOperativoResponse> {
    try {
      return await apiClient.get<SemaforoOperativoResponse>(`/dashboard/semaforo-operativo?mes=${mes}`);
    } catch {
      return {
        mes,
        totalEvaluados: 86,
        distribucion: {
          morado: { count: 28, porcentaje: 33, label: 'Excelente / Destacado' },
          verde: { count: 44, porcentaje: 51, label: 'Normal / Buen Cumplimiento' },
          amarillo: { count: 10, porcentaje: 12, label: 'Alerta / Atrasos Observados' },
          rojo: { count: 4, porcentaje: 4, label: 'Riesgo / Abandono Notificado' },
        },
      };
    }
  },

  async getNotificaciones(): Promise<NotificacionUrgente[]> {
    try {
      return await apiClient.get<NotificacionUrgente[]>('/dashboard/notificaciones-urgentes');
    } catch {
      return [
        {
          id: 'NOTIF-01',
          tipo: 'ALERTA_DOCUMENTAL',
          prioridad: 'ALTA',
          titulo: '5 Cartas de Menores sin Validar',
          descripcion: 'Postulantes menores de 18 años subieron carta de padres y cédula del tutor pendientes de aprobación.',
          accion: 'Revisar en P-11',
          tiempo: 'Hace 2 horas',
        },
        {
          id: 'NOTIF-02',
          tipo: 'TRASLADO_PENDIENTE',
          prioridad: 'MEDIA',
          titulo: '3 Solicitudes de Traslado de Centro',
          descripcion: 'Estudiantes solicitaron reubicación en las primeras 4 semanas por cruce de materias con taller.',
          accion: 'Gestionar en P-15',
          tiempo: 'Hace 5 horas',
        },
        {
          id: 'NOTIF-03',
          tipo: 'SEGURO_UNIVERSITARIO',
          prioridad: 'ALTA',
          titulo: '8 Pólizas APC-7083 por Vencer',
          descripcion: 'Renovaciones del seguro de accidentes vencen este viernes. Voluntarios deben cargar actualización.',
          accion: 'Ver listado',
          tiempo: 'Ayer',
        },
        {
          id: 'NOTIF-04',
          tipo: 'CIERRE_CONVOCATORIA',
          prioridad: 'INFORMATIVA',
          titulo: 'Convocatoria Fase 2 cierra en 4 días',
          descripcion: 'Fecha límite de recepción de postulaciones web para Gestión 2/2026: 22 de Noviembre.',
          accion: 'Ver Landing P-01',
          tiempo: 'Programado',
        },
      ];
    }
  },
};
