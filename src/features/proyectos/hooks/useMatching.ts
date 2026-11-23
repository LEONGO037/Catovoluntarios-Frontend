import { useState, useMemo, useCallback } from 'react';
import type {
  VoluntarioAdmitido,
  ProyectoReceptor,
  BalanceDemografico,
  FiltrosUbicacion,
} from '../types/proyectos.types';
import { proyectosService } from '../services/proyectos.service';

export function useMatching(
  proyectos: ProyectoReceptor[],
  selectedProyectoId: string
) {
  const [voluntarios, setVoluntarios] = useState<VoluntarioAdmitido[]>(() =>
    proyectosService.getVoluntarios()
  );

  const [filtros, setFiltros] = useState<FiltrosUbicacion>({
    carrera: 'Todas',
    condicion: 'Todos',
    rangoEdad: 'Todos',
    poblacionSugerida: 'Todas',
    searchTerm: '',
  });

  const refreshVoluntarios = useCallback(() => {
    setVoluntarios(proyectosService.getVoluntarios());
  }, []);

  const currentProyecto = useMemo(
    () => proyectos.find((p) => p.id === selectedProyectoId) || proyectos[0],
    [proyectos, selectedProyectoId]
  );

  // Voluntarios asignados al proyecto seleccionado
  const assignedVolunteers = useMemo(() => {
    if (!currentProyecto) return [];
    return voluntarios.filter((v) => v.proyecto_id === currentProyecto.id);
  }, [voluntarios, currentProyecto]);

  // Balance demográfico en tiempo real
  const balanceDemografico = useMemo<BalanceDemografico>(() => {
    const total = assignedVolunteers.length;
    const cupoMax = currentProyecto ? currentProyecto.cupo_maximo_voluntarios : 0;
    const ocupacion = cupoMax > 0 ? Math.round((total / cupoMax) * 100) : 0;

    const nuevos = assignedVolunteers.filter((v) => v.condicion === 'Nuevo').length;
    const antiguos = assignedVolunteers.filter((v) => v.condicion === 'Antiguo').length;

    const pctNuevos = total > 0 ? Math.round((nuevos / total) * 100) : 0;
    const pctAntiguos = total > 0 ? Math.round((antiguos / total) * 100) : 0;

    const edadSum = assignedVolunteers.reduce((acc, v) => acc + v.edad, 0);
    const promedioEdad = total > 0 ? Number((edadSum / total).toFixed(1)) : 0;

    // Conteo por carrera
    const careerCounts = assignedVolunteers.reduce<Record<string, number>>(
      (acc, v) => {
        acc[v.carrera] = (acc[v.carrera] || 0) + 1;
        return acc;
      },
      {}
    );

    const distribucionCarreras = Object.entries(careerCounts)
      .map(([carrera, cantidad]) => ({ carrera, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad);

    return {
      totalAsignados: total,
      cupoMaximo: cupoMax,
      porcentajeOcupacion: ocupacion,
      nuevos,
      antiguos,
      porcentajeNuevos: pctNuevos,
      porcentajeAntiguos: pctAntiguos,
      promedioEdad,
      distribucionCarreras,
    };
  }, [assignedVolunteers, currentProyecto]);

  // Postulantes por ubicar filtrados (Columna izquierda)
  const unassignedVolunteers = useMemo(() => {
    return voluntarios
      .filter((v) => !v.proyecto_id)
      .filter((v) => {
        if (filtros.carrera !== 'Todas' && v.carrera !== filtros.carrera) {
          return false;
        }
        if (filtros.condicion !== 'Todos' && v.condicion !== filtros.condicion) {
          return false;
        }
        if (filtros.rangoEdad !== 'Todos') {
          if (filtros.rangoEdad === '18-20' && (v.edad < 18 || v.edad > 20)) {
            return false;
          }
          if (filtros.rangoEdad === '21-23' && (v.edad < 21 || v.edad > 23)) {
            return false;
          }
          if (filtros.rangoEdad === '24+' && v.edad < 24) {
            return false;
          }
        }
        if (
          filtros.poblacionSugerida !== 'Todas' &&
          v.poblacion_sugerida !== filtros.poblacionSugerida
        ) {
          return false;
        }
        if (filtros.searchTerm) {
          const term = filtros.searchTerm.toLowerCase();
          const matchName = v.nombre_completo.toLowerCase().includes(term);
          const matchCi = v.ci.toLowerCase().includes(term);
          const matchCareer = v.carrera.toLowerCase().includes(term);
          if (!matchName && !matchCi && !matchCareer) return false;
        }
        return true;
      });
  }, [voluntarios, filtros]);

  const asignar = useCallback(
    (voluntarioId: string, proyectoId: string) => {
      proyectosService.asignarVoluntario(voluntarioId, proyectoId);
      refreshVoluntarios();
    },
    [refreshVoluntarios]
  );

  const desasignar = useCallback(
    (voluntarioId: string) => {
      proyectosService.desasignarVoluntario(voluntarioId);
      refreshVoluntarios();
    },
    [refreshVoluntarios]
  );

  return {
    voluntarios,
    currentProyecto,
    assignedVolunteers,
    unassignedVolunteers,
    balanceDemografico,
    filtros,
    setFiltros,
    asignar,
    desasignar,
    refreshVoluntarios,
  };
}
