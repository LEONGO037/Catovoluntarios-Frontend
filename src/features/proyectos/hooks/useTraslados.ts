import { useState, useCallback, useEffect } from 'react';
import type {
  TrasladoRegistro,
  NotificacionTraslado,
  MotivoTraslado,
  ProyectoReceptor,
  PeriodoTrasladoEstado,
} from '../types/proyectos.types';
import {
  proyectosService,
  calcularPeriodoTrasladoLocal,
} from '../services/proyectos.service';

export function useTraslados(semestre: string, proyectos: ProyectoReceptor[]) {
  const [traslados, setTraslados] = useState<TrasladoRegistro[]>(() =>
    proyectosService.getTrasladosSync()
  );
  const [notificaciones, setNotificaciones] = useState<NotificacionTraslado[]>(() =>
    proyectosService.getNotificacionesSync()
  );
  const [periodoEstado, setPeriodoEstado] = useState<PeriodoTrasladoEstado>(() =>
    calcularPeriodoTrasladoLocal(semestre, proyectos)
  );
  const [autorizacionExcepcional, setAutorizacionExcepcional] = useState(false);
  const [error, setError] = useState('');
  const [reloadTick, setReloadTick] = useState(0);

  const refreshData = useCallback(() => {
    setReloadTick((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    Promise.all([
      proyectosService.fetchTraslados(semestre, controller.signal),
      proyectosService.fetchNotificaciones(semestre, controller.signal),
      proyectosService.fetchPeriodoTraslado(semestre, proyectos, controller.signal),
    ])
      .then(([t, n, periodo]) => {
        if (!active || controller.signal.aborted) return;
        setTraslados(t);
        setNotificaciones(n);
        setPeriodoEstado(periodo);
        setError('');
      })
      .catch((err: unknown) => {
        if (!active || controller.signal.aborted) return;
        setError(
          err instanceof Error
            ? err.message
            : 'No se pudo cargar el historial de traslados.'
        );
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [semestre, proyectos, reloadTick]);

  const periodoHabilitado =
    periodoEstado.periodoOrdinarioHabilitado || autorizacionExcepcional;

  const ejecutarTraslado = useCallback(
    async (params: {
      voluntarioId: string;
      proyectoDestinoId: string;
      motivo: MotivoTraslado;
      motivoOtroDetalle?: string;
      fechaEfectiva: string;
    }) => {
      if (!periodoHabilitado) {
        throw new Error(
          `La ventana ordinaria de ${periodoEstado.maxSemanasOrdinarias} semanas para la Gestión ${semestre} ha concluido.`
        );
      }
      const nuevo = await proyectosService.ejecutarTraslado({
        ...params,
        semestre,
      });
      refreshData();
      return nuevo;
    },
    [periodoHabilitado, periodoEstado.maxSemanasOrdinarias, semestre, refreshData]
  );

  const marcarNotificacionLeida = useCallback(
    async (id: string) => {
      await proyectosService.marcarNotificacionLeida(id);
      refreshData();
    },
    [refreshData]
  );

  return {
    traslados,
    notificaciones,
    semanaSemestre: periodoEstado.semanaActual,
    maxSemanasOrdinarias: periodoEstado.maxSemanasOrdinarias,
    periodoOrdinarioHabilitado: periodoEstado.periodoOrdinarioHabilitado,
    periodoHabilitado,
    periodoEstado,
    autorizacionExcepcional,
    setAutorizacionExcepcional,
    error,
    ejecutarTraslado,
    marcarNotificacionLeida,
    refreshData,
  };
}
