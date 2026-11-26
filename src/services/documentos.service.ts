import { apiClient } from './api.client';
import type {
  BandejaDocumental,
  DocumentoVoluntario,
  EstadoDocumento,
  EstadoInduccion,
  ParticipantesInduccion,
  SesionInduccion,
  VoluntarioExpediente,
} from '../types/documentos.types';

function enSemestre(path: string, semestre: string) {
  return `/documentos${path}?${new URLSearchParams({ semestre })}`;
}

export const documentosService = {
  getMisDocumentos(semestre: string, signal?: AbortSignal) {
    return apiClient.get<VoluntarioExpediente>(enSemestre('/mis-documentos', semestre), { signal });
  },

  subirDocumento(semestre: string, data: Partial<DocumentoVoluntario>, file: File) {
    const form = new FormData();
    form.set('file', file);
    form.set('nombreArchivoOriginal', file.name);
    for (const [field, value] of Object.entries(data)) {
      if (typeof value === 'string' && value.trim()) form.set(field, value.trim());
    }
    return apiClient.upload<DocumentoVoluntario>(enSemestre('/upload', semestre), form);
  },

  eliminarDocumento(semestre: string, documentoId: number) {
    return apiClient.delete(enSemestre(`/${documentoId}`, semestre));
  },

  enviarRevision(semestre: string, documentoIds: number[]) {
    return apiClient.post<{ documentos: DocumentoVoluntario[] }>(
      enSemestre('/enviar-revision', semestre),
      { documentoIds },
    );
  },

  getBandejaValidacion(semestre: string, signal?: AbortSignal) {
    return apiClient.get<BandejaDocumental>(enSemestre('/bandeja-validacion', semestre), { signal });
  },

  validarDocumento(
    semestre: string,
    documentoId: number,
    estado: Exclude<EstadoDocumento, 'PENDIENTE'>,
    enviadoRevisionEn: string | null,
    observacionesValidacion?: string,
  ) {
    return apiClient.patch<DocumentoVoluntario>(
      enSemestre(`/${documentoId}/validar`, semestre),
      { estado, enviadoRevisionEn: enviadoRevisionEn ?? undefined, observacionesValidacion },
    );
  },

  async obtenerArchivo(semestre: string, documentoId: number, signal: AbortSignal) {
    const token = localStorage.getItem('catovoluntarios_token');
    const response = await fetch(`${apiClient.baseUrl}${enSemestre(`/${documentoId}/archivo`, semestre)}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      signal,
    });
    if (!response.ok) throw new Error('No se pudo abrir el archivo original.');
    return response.blob();
  },

  getProyectosInduccion(semestre: string, signal: AbortSignal) {
    return apiClient.get<{ id: number; nombre: string }[]>(enSemestre('/induccion/proyectos', semestre), { signal });
  },

  getParticipantesInduccion(semestre: string, signal?: AbortSignal) {
    return apiClient.get<ParticipantesInduccion>(enSemestre('/induccion/participantes', semestre), { signal });
  },

  registrarAsistenciaInduccion(
    semestre: string,
    participante: { asistenciaId: number } | { userId: number; sesionId: number },
    data: {
      asistio: boolean;
      fechaCharla?: string | null;
      recorridoSitio?: string | null;
      estadoInduccion: EstadoInduccion;
      observaciones?: string;
    },
  ) {
    return apiClient.post(enSemestre('/induccion/asistencia', semestre), {
      ...participante,
      ...data,
    });
  },

  crearSesionInduccion(semestre: string, sesion: Omit<SesionInduccion, 'id'>) {
    return apiClient.post<SesionInduccion>(enSemestre('/induccion/sesiones', semestre), sesion);
  },
};
