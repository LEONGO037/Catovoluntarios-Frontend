import { useState, useCallback } from 'react';
import type {
  TrasladoRegistro,
  NotificacionTraslado,
  MotivoTraslado,
} from '../types/proyectos.types';
import { proyectosService } from '../services/proyectos.service';

export function useTraslados() {
  const [traslados, setTraslados] = useState<TrasladoRegistro[]>(() =>
    proyectosService.getTraslados()
  );
  const [notificaciones, setNotificaciones] = useState<NotificacionTraslado[]>(() =>
    proyectosService.getNotificaciones()
  );

  // Control temporal: Semana 3 de las 4 permitidas del semestre
  const [semanaSemestre] = useState<number>(3);
  const periodoHabilitado = semanaSemestre <= 4;

  const refreshData = useCallback(() => {
    setTraslados(proyectosService.getTraslados());
    setNotificaciones(proyectosService.getNotificaciones());
  }, []);

  const ejecutarTraslado = useCallback(
    (params: {
      voluntarioId: string;
      proyectoDestinoId: string;
      motivo: MotivoTraslado;
      fechaEfectiva: string;
    }) => {
      if (!periodoHabilitado) {
        throw new Error(
          'El periodo de reasignaciones ordinarias (primeras 4 semanas) ha concluido'
        );
      }
      const nuevo = proyectosService.ejecutarTraslado(params);
      refreshData();
      return nuevo;
    },
    [periodoHabilitado, refreshData]
  );

  const marcarNotificacionLeida = useCallback(
    (id: string) => {
      proyectosService.marcarNotificacionLeida(id);
      refreshData();
    },
    [refreshData]
  );

  return {
    traslados,
    notificaciones,
    semanaSemestre,
    periodoHabilitado,
    ejecutarTraslado,
    marcarNotificacionLeida,
    refreshData,
  };
}
