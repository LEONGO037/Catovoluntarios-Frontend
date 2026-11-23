import { apiClient } from './api.client';
import type {
  EvaluacionPayload,
  EvaluacionVista,
  FichaPsicologica,
  PostulanteEvaluable,
} from '../features/entrevistas/types/entrevistas.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const CLAVE_TOKEN = 'catovoluntarios_token';

function cabeceraAutorizacion(): Record<string, string> {
  const token = localStorage.getItem(CLAVE_TOKEN);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function errorDeRespuesta(respuesta: Response): Promise<Error> {
  const cuerpo: { message?: string | string[] } = await respuesta.json().catch(() => ({}));
  const mensaje = Array.isArray(cuerpo.message) ? cuerpo.message.join('. ') : cuerpo.message;
  return new Error(mensaje || `Error ${respuesta.status}: ${respuesta.statusText}`);
}

/**
 * api.client.ts (M01) solo envía JSON; el informe PDF viaja como multipart/form-data,
 * así que esta función usa fetch directamente con el mismo token.
 */
async function enviarMultipart<T>(metodo: 'POST' | 'PATCH', ruta: string, datos: FormData): Promise<T> {
  const respuesta = await fetch(`${API_BASE_URL}${ruta}`, {
    method: metodo,
    headers: cabeceraAutorizacion(),
    body: datos,
  });
  if (!respuesta.ok) throw await errorDeRespuesta(respuesta);
  return (await respuesta.json()) as T;
}

function aFormData(datos: Partial<EvaluacionPayload>, informe: File | null, postulacionId?: number): FormData {
  const formulario = new FormData();
  if (postulacionId !== undefined) formulario.append('postulacionId', String(postulacionId));
  Object.entries(datos).forEach(([clave, valor]) => {
    if (valor === undefined || valor === null || valor === '') return;
    if (Array.isArray(valor)) {
      valor.forEach((v) => formulario.append(clave, String(v)));
    } else {
      formulario.append(clave, String(valor));
    }
  });
  if (informe) formulario.append('informe', informe);
  return formulario;
}

/** M03 — P-09 (solo Administración Pastoral). */
export const psicologiaApi = {
  listarPostulantes(): Promise<PostulanteEvaluable[]> {
    return apiClient.get('/psicologia/postulantes');
  },

  obtenerFicha(postulacionId: number): Promise<FichaPsicologica> {
    return apiClient.get(`/psicologia/evaluacion/${postulacionId}`);
  },

  crear(postulacionId: number, datos: EvaluacionPayload, informe: File): Promise<EvaluacionVista> {
    return enviarMultipart('POST', '/psicologia/evaluacion', aFormData(datos, informe, postulacionId));
  },

  actualizar(id: number, datos: Partial<EvaluacionPayload>, informe: File | null): Promise<EvaluacionVista> {
    return enviarMultipart('PATCH', `/psicologia/evaluacion/${id}`, aFormData(datos, informe));
  },

  /** Descarga el PDF protegido y lo abre en una pestaña nueva. */
  async abrirInforme(id: number): Promise<void> {
    const ventana = window.open('', '_blank');
    const respuesta = await fetch(`${API_BASE_URL}/psicologia/evaluacion/${id}/informe`, {
      headers: cabeceraAutorizacion(),
    });
    if (!respuesta.ok) {
      ventana?.close();
      throw await errorDeRespuesta(respuesta);
    }
    const url = URL.createObjectURL(await respuesta.blob());
    if (ventana) {
      ventana.location.href = url;
    } else {
      window.location.assign(url);
    }
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  },
};
