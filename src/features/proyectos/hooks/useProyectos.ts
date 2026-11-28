import { useState, useCallback, useEffect } from 'react';
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

    Promise.all([
      proyectosService.fetchProyectos(semestre, controller.signal),
      proyectosService.fetchInstituciones(controller.signal).catch(() => []),
      proyectosService.fetchProyectosHistoricos(semestre, controller.signal).catch(() => []),
      proyectosService.fetchCatolideres(semestre, controller.signal).catch(() => []),
    ])
      .then(async ([projs, insts, historicos, cats]) => {
        if (!active || controller.signal.aborted) return;
        setProyectos(projs);
        setInstituciones(
          insts.length > 0 ? insts : proyectosService.getInstitucionesSync()
        );
        setProyectosHistoricos(historicos);
        setCatolideres(cats);
        setError('');

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

  const createProyecto = useCallback(
    async (data: CrearProyectoReceptorDto) => {
      const created = await proyectosService.createProyecto(data);
      refreshProyectos();
      return created;
    },
    [refreshProyectos]
  );

  const updateProyecto = useCallback(
    async (id: string, data: ActualizarProyectoReceptorDto) => {
      const updated = await proyectosService.updateProyecto(id, data, semestre);
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
    proyectos,
    proyectosHistoricos,
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
