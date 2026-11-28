import { useState, useCallback, useEffect, useMemo } from 'react';
import type {
  Institucion,
  ProyectoReceptor,
  CatoliderInfo,
  CrearProyectoReceptorDto,
  ActualizarProyectoReceptorDto,
  ActualizarInstitucionDto,
  ReutilizarProyectoDto,
} from '../types/proyectos.types';
import { proyectosService } from '../services/proyectos.service';

export function useProyectos(semestre: string) {
  const [proyectos, setProyectos] = useState<ProyectoReceptor[]>(() =>
    proyectosService.getProyectosSync()
  );
  const [proyectosInactivos, setProyectosInactivos] = useState<ProyectoReceptor[]>(() =>
    proyectosService.getProyectosInactivosSync()
  );
  const [proyectosHistoricos, setProyectosHistoricos] = useState<ProyectoReceptor[]>([]);
  const [instituciones, setInstituciones] = useState<Institucion[]>(() =>
    proyectosService.getInstitucionesSync()
  );
  const [catolideres, setCatolideres] = useState<CatoliderInfo[]>(() =>
    proyectosService.getCatolideresSync()
  );
  const [voluntariosCountsByProject, setVoluntariosCountsByProject] = useState<
    Record<string, number>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [reloadTick, setReloadTick] = useState(0);

  const refreshProyectos = useCallback(() => {
    setReloadTick((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    let catoliderErrorMsg = '';

    Promise.all([
      proyectosService.fetchProyectos(semestre, controller.signal),
      proyectosService.fetchProyectosInactivos(semestre, controller.signal).catch(() => []),
      proyectosService.fetchInstituciones(controller.signal).catch(() => []),
      proyectosService.fetchProyectosHistoricos(semestre, controller.signal).catch(() => []),
      proyectosService.fetchCatolideres(semestre, controller.signal).catch((err: unknown) => {
        if (!controller.signal.aborted) {
          catoliderErrorMsg =
            err instanceof Error
              ? err.message
              : 'No se pudieron obtener los Catolíderes vigentes.';
        }
        return [];
      }),
    ])
      .then(async ([projs, inactivos, insts, historicos, cats]) => {
        if (!active || controller.signal.aborted) return;
        setProyectos(projs);
        setProyectosInactivos(inactivos);
        setInstituciones(
          insts.length > 0 ? insts : proyectosService.getInstitucionesSync()
        );
        setProyectosHistoricos(historicos);
        setCatolideres(cats);
        setError(catoliderErrorMsg);

        const counts = await proyectosService
          .fetchCuposPorProyecto(projs, semestre, controller.signal)
          .catch(() => ({}));
        if (active && !controller.signal.aborted) {
          setVoluntariosCountsByProject(counts);
        }
      })
      .catch((err: unknown) => {
        if (!active || controller.signal.aborted) return;
        setError(
          err instanceof Error
            ? err.message
            : 'No se pudieron cargar los Proyectos Receptores.'
        );
      })
      .finally(() => {
        if (active && !controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [semestre, reloadTick]);

  const enrichWithCatolideres = useCallback(
    (lista: ProyectoReceptor[]) => {
      if (catolideres.length === 0) return lista;
      return lista.map((p) => {
        const titular = p.catolider_titular_id
          ? catolideres.find((c) => c.id === p.catolider_titular_id)
          : undefined;
        const aprendiz = p.catolider_aprendiz_id
          ? catolideres.find((c) => c.id === p.catolider_aprendiz_id)
          : undefined;
        return {
          ...p,
          catolider_titular_nombre: p.catolider_titular_nombre || titular?.nombre,
          catolider_aprendiz_nombre: p.catolider_aprendiz_nombre || aprendiz?.nombre,
        };
      });
    },
    [catolideres]
  );

  const proyectosEnriquecidos = useMemo(
    () => enrichWithCatolideres(proyectos),
    [enrichWithCatolideres, proyectos]
  );

  const proyectosInactivosEnriquecidos = useMemo(
    () => enrichWithCatolideres(proyectosInactivos),
    [enrichWithCatolideres, proyectosInactivos]
  );

  const proyectosHistoricosEnriquecidos = useMemo(
    () => enrichWithCatolideres(proyectosHistoricos),
    [enrichWithCatolideres, proyectosHistoricos]
  );

  const createProyecto = useCallback(
    async (data: CrearProyectoReceptorDto) => {
      const created = await proyectosService.createProyecto(data);
      setProyectos(proyectosService.getProyectosSync());
      refreshProyectos();
      return created;
    },
    [refreshProyectos]
  );

  const updateProyecto = useCallback(
    async (id: string, data: ActualizarProyectoReceptorDto) => {
      const updated = await proyectosService.updateProyecto(id, data, semestre);
      setProyectos(proyectosService.getProyectosSync());
      refreshProyectos();
      return updated;
    },
    [refreshProyectos, semestre]
  );

  const updateInstitucion = useCallback(
    async (institucionId: string, data: ActualizarInstitucionDto) => {
      const updated = await proyectosService.updateInstitucion(institucionId, data);
      refreshProyectos();
      return updated;
    },
    [refreshProyectos]
  );

  const reactivarProyecto = useCallback(
    async (id: string) => {
      const reactivated = await proyectosService.reactivarProyecto(id, semestre);
      setProyectos(proyectosService.getProyectosSync());
      setProyectosInactivos(proyectosService.getProyectosInactivosSync());
      refreshProyectos();
      return reactivated;
    },
    [refreshProyectos, semestre]
  );

  const reutilizarProyecto = useCallback(
    async (dto: ReutilizarProyectoDto) => {
      const reused = await proyectosService.reutilizarProyecto(dto);
      refreshProyectos();
      return reused;
    },
    [refreshProyectos]
  );

  const deleteProyecto = useCallback(
    async (id: string) => {
      await proyectosService.deleteProyecto(id, semestre);
      refreshProyectos();
    },
    [refreshProyectos, semestre]
  );

  return {
    proyectos: proyectosEnriquecidos,
    proyectosInactivos: proyectosInactivosEnriquecidos,
    proyectosHistoricos: proyectosHistoricosEnriquecidos,
    instituciones,
    catolideres,
    voluntariosCountsByProject,
    isLoading,
    error,
    refreshProyectos,
    createProyecto,
    updateProyecto,
    updateInstitucion,
    reactivarProyecto,
    reutilizarProyecto,
    deleteProyecto,
  };
}
