import { psicologiaApi } from '../../../services/psicologia.service';
import { useConsulta } from './useConsulta';

export function usePostulantesEvaluables() {
  return useConsulta(() => psicologiaApi.listarPostulantes(), []);
}

export function useFichaPsicologica(postulacionId: number) {
  return useConsulta(() => psicologiaApi.obtenerFicha(postulacionId), [postulacionId]);
}
