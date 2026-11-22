import { apiClient } from '../../../services/api.client';
import type {
  ReporteProyectoResponse,
  BaseMadreResponse,
  RankingResponse,
  FeedbackInstitucion,
  PlantillaCertificado,
  ColorSemaforo,
  VoluntarioBaseMadre,
} from '../types/semaforo.types';
import {
  MOCK_REPORTE_PROYECTO,
  MOCK_BASE_MADRE,
  MOCK_RANKING,
  MOCK_FEEDBACK,
  MOCK_CERTIFICADO,
} from './semaforos.mock';

export interface GuardarReporteDTO {
  idAsignacion: number;
  mes: string;
  anio?: number;
  colorSemaforo: ColorSemaforo;
  observacionesDesempeno: string;
  notificarAbandono?: boolean;
}

export interface GuardarPremioDTO {
  idUsuario: number;
  semestre: string;
  proyectoId?: number;
  nombrePremio: string;
  categoria?: string;
  descripcion: string;
}

class SemaforosService {
  async obtenerReportesProyecto(
    proyectoId: number = 1,
    mes: string = 'Septiembre',
    anio: number = 2026,
  ): Promise<ReporteProyectoResponse> {
    try {
      const data = await apiClient.get<ReporteProyectoResponse>(
        `/semaforos/proyecto/${proyectoId}?mes=${encodeURIComponent(mes)}&anio=${anio}`,
      );
      return data;
    } catch {
      console.info('Utilizando mock local para P-19 Reportes Proyecto');
      return {
        ...MOCK_REPORTE_PROYECTO,
        periodo: { mes: `${mes} ${anio}`, anio },
      };
    }
  }

  async guardarReporteSemaforo(dto: GuardarReporteDTO) {
    try {
      return await apiClient.post('/semaforos/reporte-mensual', dto);
    } catch {
      console.info('Guardado de reporte semáforo en memoria local (mock fallback)');
      return { success: true, ...dto };
    }
  }

  async obtenerBaseMadre(filtros: {
    busqueda?: string;
    nivel?: string;
    carrera?: string;
    semestre?: string;
    estado?: string;
  }): Promise<BaseMadreResponse> {
    try {
      const params = new URLSearchParams();
      if (filtros.busqueda) params.append('busqueda', filtros.busqueda);
      if (filtros.nivel) params.append('nivel', filtros.nivel);
      if (filtros.carrera) params.append('carrera', filtros.carrera);
      if (filtros.semestre) params.append('semestre', filtros.semestre);
      if (filtros.estado) params.append('estado', filtros.estado);

      const qs = params.toString();
      const endpoint = qs ? `/base-madre?${qs}` : '/base-madre';
      return await apiClient.get<BaseMadreResponse>(endpoint);
    } catch {
      console.info('Utilizando mock local para P-20 Base Madre');
      let filtrados = [...MOCK_BASE_MADRE.voluntarios];

      if (filtros.busqueda) {
        const term = filtros.busqueda.toLowerCase();
        filtrados = filtrados.filter(
          (v) =>
            v.nombreCompleto.toLowerCase().includes(term) ||
            v.ci.toLowerCase().includes(term) ||
            v.carrera.toLowerCase().includes(term),
        );
      }

      if (filtros.nivel && filtros.nivel !== 'TODOS') {
        filtrados = filtrados.filter((v) => v.nivelCalculado === filtros.nivel);
      }

      if (filtros.carrera && filtros.carrera !== 'TODAS') {
        filtrados = filtrados.filter((v) =>
          v.carrera.toLowerCase().includes(filtros.carrera!.toLowerCase()),
        );
      }

      if (filtros.estado && filtros.estado !== 'TODOS') {
        filtrados = filtrados.filter((v) =>
          v.estado.toLowerCase().includes(filtros.estado!.toLowerCase()),
        );
      }

      return {
        ...MOCK_BASE_MADRE,
        totalRegistros: filtrados.length,
        voluntarios: filtrados,
      };
    }
  }

  async crearPremio(dto: GuardarPremioDTO) {
    try {
      return await apiClient.post('/base-madre/premios', dto);
    } catch {
      console.info('Premio registrado en memoria local (mock fallback)');
      return { id: Date.now(), ...dto };
    }
  }

  async obtenerRankingDestacados(semestre: string = '2/2026'): Promise<RankingResponse> {
    try {
      return await apiClient.get<RankingResponse>(
        `/base-madre/ranking?semestre=${encodeURIComponent(semestre)}`,
      );
    } catch {
      console.info('Utilizando mock local para P-20 Ranking Destacados');
      return MOCK_RANKING;
    }
  }

  async obtenerFeedbackProyecto(
    proyectoId: number = 1,
    semestre: string = '2/2026',
  ): Promise<FeedbackInstitucion> {
    try {
      return await apiClient.get<FeedbackInstitucion>(
        `/proyectos/${proyectoId}/feedback-semestral?semestre=${encodeURIComponent(semestre)}`,
      );
    } catch {
      console.info('Utilizando mock local para P-21 Feedback');
      return MOCK_FEEDBACK;
    }
  }

  async guardarFeedbackProyecto(feedback: FeedbackInstitucion) {
    try {
      return await apiClient.post('/proyectos/feedback-semestral', feedback);
    } catch {
      console.info('Feedback guardado en memoria local (mock fallback)');
      return { success: true, ...feedback };
    }
  }

  async generarPlantillaCertificado(
    usuarioId: number = 1,
    semestre: string = '2/2026',
  ): Promise<PlantillaCertificado> {
    try {
      return await apiClient.get<PlantillaCertificado>(
        `/certificados/plantilla-datos/${usuarioId}?semestre=${encodeURIComponent(semestre)}`,
      );
    } catch {
      console.info('Utilizando mock local para P-21 Certificados');
      return MOCK_CERTIFICADO;
    }
  }

  exportarBaseMadreCSV(voluntarios: VoluntarioBaseMadre[]) {
    const headers = [
      'Carnet CI',
      'Nombres',
      'Primer Apellido',
      'Segundo Apellido',
      'Carrera',
      'Email',
      'Teléfono',
      'Semestres Activos',
      'Proyecto Reciente',
      'Horas Históricas',
      'Nivel Calculado',
      'Total Premios',
      'Estado',
    ];

    const rows = voluntarios.map((v) => [
      `"${v.ci}"`,
      `"${v.nombres}"`,
      `"${v.primerApellido}"`,
      `"${v.segundoApellido || ''}"`,
      `"${v.carrera}"`,
      `"${v.email}"`,
      `"${v.telefono || ''}"`,
      `"${v.semestresActivos}"`,
      `"${v.proyectoReciente}"`,
      v.horasTotalesHistoricas,
      `"${v.nivelCalculado}"`,
      v.totalPremios,
      `"${v.estado}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Base_Madre_Catovoluntarios_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export const semaforosService = new SemaforosService();
