import { useState, useCallback } from 'react';
import type { ProyectoReceptor, CatoliderInfo } from '../types/proyectos.types';
import { proyectosService } from '../services/proyectos.service';

export function useProyectos() {
  const [proyectos, setProyectos] = useState<ProyectoReceptor[]>(() =>
    proyectosService.getProyectos()
  );
  const [catolideres] = useState<CatoliderInfo[]>(() =>
    proyectosService.getCatolideres()
  );

  const refreshProyectos = useCallback(() => {
    setProyectos(proyectosService.getProyectos());
  }, []);

  const createProyecto = useCallback(
    (data: Omit<ProyectoReceptor, 'id' | 'estado'>) => {
      const created = proyectosService.createProyecto(data);
      refreshProyectos();
      return created;
    },
    [refreshProyectos]
  );

  const updateProyecto = useCallback(
    (id: string, data: Partial<ProyectoReceptor>) => {
      const updated = proyectosService.updateProyecto(id, data);
      refreshProyectos();
      return updated;
    },
    [refreshProyectos]
  );

  const deleteProyecto = useCallback(
    (id: string) => {
      proyectosService.deleteProyecto(id);
      refreshProyectos();
    },
    [refreshProyectos]
  );

  return {
    proyectos,
    catolideres,
    refreshProyectos,
    createProyecto,
    updateProyecto,
    deleteProyecto,
  };
}
