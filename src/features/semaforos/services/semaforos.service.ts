import { apiClient } from '../../../services/api.client';
import type {
  ReporteProyectoResponse,
  BaseMadreResponse,
  RankingResponse,
  FeedbackInstitucion,
  PlantillaCertificado,
  ColorSemaforo,
  VoluntarioBaseMadre,
  CertificadoFundacionItem,
} from '../types/semaforo.types';

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
    return await apiClient.get<ReporteProyectoResponse>(
      `/semaforos/proyecto/${proyectoId}?mes=${encodeURIComponent(mes)}&anio=${anio}`,
    );
  }

  async guardarReporteSemaforo(dto: GuardarReporteDTO) {
    return await apiClient.post('/semaforos/reporte-mensual', dto);
  }

  async obtenerBaseMadre(filtros: {
    busqueda?: string;
    nivel?: string;
    carrera?: string;
    semestre?: string;
    estado?: string;
  }): Promise<BaseMadreResponse> {
    const params = new URLSearchParams();
    if (filtros.busqueda) params.append('busqueda', filtros.busqueda);
    if (filtros.nivel) params.append('nivel', filtros.nivel);
    if (filtros.carrera) params.append('carrera', filtros.carrera);
    if (filtros.semestre) params.append('semestre', filtros.semestre);
    if (filtros.estado) params.append('estado', filtros.estado);

    const qs = params.toString();
    const endpoint = qs ? `/base-madre?${qs}` : '/base-madre';
    return await apiClient.get<BaseMadreResponse>(endpoint);
  }

  async crearPremio(dto: GuardarPremioDTO) {
    return await apiClient.post('/base-madre/premios', dto);
  }

  async obtenerRankingDestacados(semestre: string = '2/2026'): Promise<RankingResponse> {
    return await apiClient.get<RankingResponse>(
      `/base-madre/ranking?semestre=${encodeURIComponent(semestre)}`,
    );
  }

  async obtenerFeedbackProyecto(
    proyectoId: number = 1,
    semestre: string = '2/2026',
  ): Promise<FeedbackInstitucion> {
    return await apiClient.get<FeedbackInstitucion>(
      `/proyectos/${proyectoId}/feedback-semestral?semestre=${encodeURIComponent(semestre)}`,
    );
  }

  async guardarFeedbackProyecto(feedback: FeedbackInstitucion) {
    return await apiClient.post('/proyectos/feedback-semestral', feedback);
  }

  async generarPlantillaCertificado(
    usuarioId: number = 1,
    semestre: string = '2/2026',
  ): Promise<PlantillaCertificado> {
    return await apiClient.get<PlantillaCertificado>(
      `/certificados/plantilla-datos/${usuarioId}?semestre=${encodeURIComponent(semestre)}`,
    );
  }

  async obtenerCertificadosLote(
    proyectoId?: number,
    semestre: string = '2/2026',
  ): Promise<any[]> {
    const qs = new URLSearchParams();
    if (proyectoId) qs.append('proyectoId', String(proyectoId));
    if (semestre) qs.append('semestre', semestre);
    const query = qs.toString() ? `?${qs.toString()}` : '';
    return await apiClient.get<any[]>(`/certificados/lote${query}`);
  }

  // ==========================================
  // Certificados de Fundación (Instituciones)
  // ==========================================

  async subirCertificadoFundacion(formData: FormData): Promise<CertificadoFundacionItem> {
    return await apiClient.upload<CertificadoFundacionItem>('/certificados/fundacion/upload', formData);
  }

  async obtenerCertificadosFundacionPorProyecto(
    proyectoId: number,
    semestre: string = '2/2026',
  ): Promise<CertificadoFundacionItem[]> {
    return await apiClient.get<CertificadoFundacionItem[]>(
      `/certificados/fundacion/proyecto/${proyectoId}?semestre=${encodeURIComponent(semestre)}`,
    );
  }

  async obtenerCertificadosFundacionPorUsuario(
    usuarioId: number,
    semestre: string = '2/2026',
  ): Promise<CertificadoFundacionItem[]> {
    return await apiClient.get<CertificadoFundacionItem[]>(
      `/certificados/fundacion/usuario/${usuarioId}?semestre=${encodeURIComponent(semestre)}`,
    );
  }

  async listarTodosCertificadosFundacion(
    semestre?: string,
    proyectoId?: number,
  ): Promise<CertificadoFundacionItem[]> {
    const params = new URLSearchParams();
    if (semestre) params.append('semestre', semestre);
    if (proyectoId) params.append('proyectoId', String(proyectoId));
    const qs = params.toString() ? `?${params.toString()}` : '';
    return await apiClient.get<CertificadoFundacionItem[]>(`/certificados/fundacion${qs}`);
  }

  async eliminarCertificadoFundacion(id: number): Promise<{ success: boolean; message: string }> {
    return await apiClient.delete<{ success: boolean; message: string }>(`/certificados/fundacion/${id}`);
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
