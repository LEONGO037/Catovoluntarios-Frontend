import { entrevistasApi } from '../../../services/entrevistas.service';
import { useConsulta } from './useConsulta';

export function useDisponibilidad(semana: string) {
  return useConsulta(() => entrevistasApi.disponibilidad(semana), [semana]);
}

export function useCitasDelDia(fecha: string) {
  return useConsulta(() => entrevistasApi.citasDelDia(fecha), [fecha]);
}

export function useMiEntrevista() {
  return useConsulta(() => entrevistasApi.miEntrevista(), []);
}
