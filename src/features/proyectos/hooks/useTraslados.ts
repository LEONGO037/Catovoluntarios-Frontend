import { useState, useCallback, useEffect } from 'react';
import type {
  TrasladoRegistro,
  NotificacionTraslado,
  MotivoTraslado,
} from '../types/proyectos.types';
import { proyectosService } from '../services/proyectos.service';

export function useTraslados() {
  const [traslados, setTraslados] = useState<TrasladoRegistro[]>(() =>
    proyectosService.getTrasladosSync()
  );
  const [notificaciones, setNotificaciones] = useState<NotificacionTraslado[]>(() =>
    proyectosService.getNotificacionesSync()
  );

  // Control temporal: Semana 3 de las 4 permitidas del semestre
  const [semanaSemestre] = useState<number>(3);
  const periodoHabilitado = semanaSemestre <= 4;

  const refreshData = useCallback(async () => {
    try {
      const t = await proyectosService.fetchTraslados();
      setTraslados(t);
      const n = await proyectosService.fetchNotificaciones();
      setNotificaciones(n);
    } catch (err) {
      console.error('Error fetching traslados data:', err);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const ejecutarTraslado = useCallback(
    async (params: {
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
      const nuevo = await proyectosService.ejecutarTraslado(params);
      await refreshData();
      return nuevo;
    },
    [periodoHabilitado, refreshData]
  );

  const marcarNotificacionLeida = useCallback(
    async (id: string) => {
      await proyectosService.marcarNotificacionLeida(id);
      await refreshData();
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
