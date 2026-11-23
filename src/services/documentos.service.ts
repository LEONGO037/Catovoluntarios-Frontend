import { apiClient } from './api.client';
import type {
  VoluntarioExpediente,
  ParticipanteInduccion,
  SesionInduccion,
  DocumentoVoluntario,
  EstadoDocumento,
  EstadoInduccion,
} from '../types/documentos.types';

export const documentosService = {
  // P-10: Obtener expediente de usuario actual
  async getMisDocumentos(): Promise<VoluntarioExpediente> {
    return await apiClient.get<VoluntarioExpediente>('/documentos/mis-documentos');
  },

  // P-10: Subir un documento
  async subirDocumento(data: Partial<DocumentoVoluntario>): Promise<DocumentoVoluntario> {
    return await apiClient.post<DocumentoVoluntario>('/documentos/upload', data);
  },

  // P-10: Descargar plantilla oficial
  async descargarModeloCartaMenores(): Promise<{ url: string; nombre: string }> {
    return await apiClient.get<{ url: string; nombre: string }>('/documentos/modelo-carta-menores');
  },

  // P-11: Obtener bandeja de validación para Pastoral
  async getBandejaValidacion(): Promise<{
    kpis: {
      pendientesRevision: number;
      observados: number;
      habilitadosEsteSemestre: number;
      polizasProximasVencer: number;
    };
    voluntarios: VoluntarioExpediente[];
  }> {
    return await apiClient.get<{
      kpis: {
        pendientesRevision: number;
        observados: number;
        habilitadosEsteSemestre: number;
        polizasProximasVencer: number;
      };
      voluntarios: VoluntarioExpediente[];
    }>('/documentos/bandeja-validacion');
  },

  // P-11: Validar un documento específico u observar
  async validarDocumento(
    documentoId: number,
    estado: EstadoDocumento,
    observaciones?: string,
  ): Promise<DocumentoVoluntario> {
    return await apiClient.patch<DocumentoVoluntario>(`/documentos/${documentoId}/validar`, {
      estado,
      observacionesValidacion: observaciones,
    });
  },

  // P-12: Participantes de inducción
  async getParticipantesInduccion(proyecto = ''): Promise<{
    kpis: {
      voluntariosHabilitados: number;
      induccionCompletada: number;
      pendientesInduccion: number;
      reprogramarAsistencia: number;
    };
    participantes: ParticipanteInduccion[];
  }> {
    return await apiClient.get<{
      kpis: {
        voluntariosHabilitados: number;
        induccionCompletada: number;
        pendientesInduccion: number;
        reprogramarAsistencia: number;
      };
      participantes: ParticipanteInduccion[];
    }>(`/documentos/induccion/participantes?proyecto=${encodeURIComponent(proyecto)}`);
  },

  // P-12: Registrar asistencia a inducción
  async registrarAsistenciaInduccion(
    participanteId: number,
    data: {
      asistioCharla: boolean;
      fechaCharla?: string;
      asistioRecorrido: boolean;
      fechaRecorrido?: string;
      estadoInduccion: EstadoInduccion;
      observaciones?: string;
    },
  ): Promise<ParticipanteInduccion> {
    return await apiClient.post<ParticipanteInduccion>('/documentos/induccion/asistencia', {
      asistenciaId: participanteId,
      ...data,
    });
  },

  // P-12: Crear nueva sesión de inducción
  async crearSesionInduccion(sesion: Partial<SesionInduccion>): Promise<SesionInduccion> {
    return await apiClient.post<SesionInduccion>('/documentos/induccion/sesiones', sesion);
  },
};
