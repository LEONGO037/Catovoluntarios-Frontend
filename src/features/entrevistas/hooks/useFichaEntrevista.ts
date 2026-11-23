import { entrevistasApi } from '../../../services/entrevistas.service';
import { useConsulta } from './useConsulta';

export function useListaFichas() {
  return useConsulta(() => entrevistasApi.listarFichas(), []);
}

export function useFichaEntrevista(entrevistaId: number) {
  return useConsulta(() => entrevistasApi.detalle(entrevistaId), [entrevistaId]);
}

export function useProyectosReceptores() {
  return useConsulta(() => entrevistasApi.proyectosReceptores(), []);
}
