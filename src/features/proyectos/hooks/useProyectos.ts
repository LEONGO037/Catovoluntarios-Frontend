import { useState, useCallback, useEffect } from 'react';
import type { ProyectoReceptor, CatoliderInfo } from '../types/proyectos.types';
import { proyectosService } from '../services/proyectos.service';

export function useProyectos() {
  const [proyectos, setProyectos] = useState<ProyectoReceptor[]>(() =>
    proyectosService.getProyectosSync()
  );
  const [catolideres, setCatolideres] = useState<CatoliderInfo[]>(() =>
    proyectosService.getCatolideresSync()
  );
  const [isLoading, setIsLoading] = useState(false);

  const refreshProyectos = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await proyectosService.fetchProyectos();
      setProyectos(data);
      const cats = await proyectosService.fetchCatolideres();
      setCatolideres(cats);
    } catch (err) {
      console.error('Error fetching proyectos:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProyectos();
  }, [refreshProyectos]);

  const createProyecto = useCallback(
    async (data: Omit<ProyectoReceptor, 'id' | 'estado'>) => {
      const created = await proyectosService.createProyecto(data);
      await refreshProyectos();
      return created;
    },
    [refreshProyectos]
  );

  const updateProyecto = useCallback(
    async (id: string, data: Partial<ProyectoReceptor>) => {
      const updated = await proyectosService.updateProyecto(id, data);
      await refreshProyectos();
      return updated;
    },
    [refreshProyectos]
  );

  const deleteProyecto = useCallback(
    async (id: string) => {
      await proyectosService.deleteProyecto(id);
      await refreshProyectos();
    },
    [refreshProyectos]
  );

  return {
    proyectos,
    catolideres,
    isLoading,
    refreshProyectos,
    createProyecto,
    updateProyecto,
    deleteProyecto,
  };
}
