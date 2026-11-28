import React, { useState, useMemo } from 'react';
import {
  Plus,
  Building2,
  Users,
  Search,
  Filter,
  Coins,
  RotateCcw,
} from 'lucide-react';
import type {
  ProyectoReceptor,
  CrearProyectoReceptorDto,
} from '../../types/proyectos.types';
import type { UserRole } from '../../../../types/auth.types';
import { useAuth } from '../../../auth/hooks/useAuth';
import { useActiveSemester } from '../../../../components/layout/active-semester';
import { useProyectos } from '../../hooks/useProyectos';
import { ProjectCard } from './ProjectCard';
import { ProjectDetailsModal } from './ProjectDetailsModal';
import { ProjectFormModal } from './ProjectFormModal';
import { ReuseProjectModal } from './ReuseProjectModal';
import { Button } from '../../../../components/ui/Button';
import { ZONAS_LA_PAZ } from '../../../../constants/zonas';
import { AlertBanner } from '../../../../components/feedback/AlertBanner';

export interface P13ReceptorCatalogProps {
  userRole?: UserRole;
  voluntariosCountsByProject?: Record<string, number>;
}

export const P13ReceptorCatalog: React.FC<P13ReceptorCatalogProps> = ({
  userRole,
  voluntariosCountsByProject: externalCounts,
}) => {
  const { user } = useAuth();
  const activeSemester = useActiveSemester();
  const effectiveRole: UserRole = userRole ?? user?.rol ?? 'CATOLIDER';
  const isAdmin = effectiveRole === 'ADMIN_PASTORAL';

  const {
    proyectos,
    proyectosHistoricos,
    instituciones,
    catolideres,
    voluntariosCountsByProject: fetchedCounts,
    error,
    createProyecto,
    updateProyecto,
    reactivarProyecto,
    reutilizarProyecto,
    deleteProyecto,
  } = useProyectos(activeSemester);

  const countsByProject = useMemo(
    () => ({ ...fetchedCounts, ...externalCounts }),
    [fetchedCounts, externalCounts]
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZona, setSelectedZona] = useState('Todas');
  const [showInactives, setShowInactives] = useState(false);
  const [actionError, setActionError] = useState('');
  const [selectedProjectForView, setSelectedProjectForView] =
    useState<ProyectoReceptor | null>(null);
  const [selectedProjectForEdit, setSelectedProjectForEdit] =
    useState<ProyectoReceptor | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isReuseOpen, setIsReuseOpen] = useState(false);

  const proyectosInactivosActuales = useMemo(
    () => proyectos.filter((p) => p.estado === 'inactivo'),
    [proyectos]
  );

  const stats = useMemo(() => {
    const activos = proyectos.filter((p) => p.estado === 'activo');
    const total = activos.length;
    const totalCupos = activos.reduce((acc, p) => acc + p.cupo_maximo_voluntarios, 0);
    const totalAsignados = activos.reduce(
      (acc, p) => acc + (countsByProject[p.id] || 0),
      0
    );
    const promedioPasajes =
      total > 0
        ? Math.round(
            activos.reduce((acc, p) => acc + p.monto_pasaje_fijo, 0) / total
          )
        : 0;

    return { total, totalCupos, totalAsignados, promedioPasajes };
  }, [proyectos, countsByProject]);

  const filteredProyectos = useMemo(() => {
    return proyectos.filter((p) => {
      if (!showInactives && p.estado === 'inactivo') return false;
      const query = searchTerm.toLowerCase();
      const matchSearch =
        p.nombre_proyecto.toLowerCase().includes(query) ||
        p.nombre_supervisor_centro.toLowerCase().includes(query) ||
        p.direccion_exacta.toLowerCase().includes(query) ||
        (p.institucion?.nombre_institucion.toLowerCase().includes(query) ?? false);
      const matchZona = selectedZona === 'Todas' || p.macrodistrito_zona === selectedZona;
      return matchSearch && matchZona;
    });
  }, [proyectos, searchTerm, selectedZona, showInactives]);

  const handleOpenCreate = () => {
    setActionError('');
    setSelectedProjectForEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (project: ProyectoReceptor) => {
    setActionError('');
    setSelectedProjectForEdit(project);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: CrearProyectoReceptorDto) => {
    setActionError('');
    if (selectedProjectForEdit) {
      await updateProyecto(selectedProjectForEdit.id, data);
    } else {
      await createProyecto(data);
    }
  };

  const handleReactivate = async (project: ProyectoReceptor) => {
    setActionError('');
    try {
      await reactivarProyecto(project.id);
    } catch (err: unknown) {
      setActionError(
        err instanceof Error ? err.message : 'No se pudo reactivar el Proyecto Receptor.'
      );
    }
  };

  const handleDelete = async (project: ProyectoReceptor) => {
    const count = countsByProject[project.id] || 0;
    const confirmMessage =
      count > 0
        ? `El Proyecto Receptor "${project.nombre_proyecto}" tiene ${count} voluntarios asignados. ¿Está seguro de eliminarlo? Sus voluntarios quedarán sin ubicar.`
        : `¿Está seguro de eliminar el Proyecto Receptor "${project.nombre_proyecto}"?`;

    if (window.confirm(confirmMessage)) {
      setActionError('');
      try {
        await deleteProyecto(project.id);
      } catch (err: unknown) {
        setActionError(
          err instanceof Error ? err.message : 'No se pudo eliminar el Proyecto Receptor.'
        );
      }
    }
  };

  return (
    <div className="space-y-6">
      {!isAdmin && (
        <AlertBanner
          type="info"
          title="Modo Consulta (Solo Lectura)"
          message="Como Catolíder tiene acceso de consulta al catálogo de Proyectos Receptores y sus respectivas fichas técnicas de la gestión activa."
        />
      )}

      {(error || actionError) && (
        <AlertBanner
          type="danger"
          title="Error de sincronización"
          message={actionError || error}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-cato-navy border border-blue-200">
              Gestión {activeSemester}
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-cato-navy tracking-tight">
            Catálogo y Ficha de Proyectos Receptores
          </h2>
          <p className="text-xs text-cato-muted mt-0.5">
            Registro de Proyectos Receptores, instituciones vinculadas, convenios activos, pasajes fijos y asignación de liderazgo (RF-10, RF-11).
          </p>
        </div>

        {isAdmin && (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsReuseOpen(true)}
              className="text-xs"
            >
              <RotateCcw className="w-4 h-4" />
              Reutilizar / Reactivar
            </Button>
            <Button variant="cta" onClick={handleOpenCreate} className="shadow-sm">
              <Plus className="w-4 h-4" />
              Nuevo Proyecto Receptor
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="cato-card p-4 space-y-1">
          <div className="flex items-center justify-between text-cato-steel">
            <span className="text-xs font-semibold text-cato-slate">Proyectos Activos</span>
            <Building2 className="w-4 h-4 text-cato-navy" />
          </div>
          <div className="text-2xl font-black text-cato-navy">{stats.total}</div>
          <p className="text-[11px] text-cato-muted">Gestión {activeSemester}</p>
        </div>

        <div className="cato-card p-4 space-y-1">
          <div className="flex items-center justify-between text-cato-steel">
            <span className="text-xs font-semibold text-cato-slate">Cupos Totales</span>
            <Users className="w-4 h-4 text-cato-steel" />
          </div>
          <div className="text-2xl font-black text-cato-navy">{stats.totalCupos}</div>
          <p className="text-[11px] text-cato-muted">Capacidad máxima autorizada</p>
        </div>

        <div className="cato-card p-4 space-y-1">
          <div className="flex items-center justify-between text-cato-steel">
            <span className="text-xs font-semibold text-cato-slate">Voluntarios Asignados</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{stats.totalAsignados}</div>
          <p className="text-[11px] text-cato-muted">Ubicados en centros</p>
        </div>

        <div className="cato-card p-4 space-y-1">
          <div className="flex items-center justify-between text-cato-steel">
            <span className="text-xs font-semibold text-cato-slate">Pasaje Promedio</span>
            <Coins className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700">Bs. {stats.promedioPasajes}</div>
          <p className="text-[11px] text-cato-muted">Tarifa fija por jornada</p>
        </div>
      </div>

      <div className="cato-card p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-cato-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por proyecto, institución, supervisor o dirección..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-cato-input text-xs text-cato-text focus:outline-none focus:border-cato-navy focus:ring-1 focus:ring-cato-navy"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {proyectosInactivosActuales.length > 0 && (
            <label className="flex items-center gap-1.5 text-xs text-cato-slate font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={showInactives}
                onChange={(e) => setShowInactives(e.target.checked)}
                className="w-4 h-4 rounded text-cato-navy border-cato-input"
              />
              <span>Mostrar inactivos ({proyectosInactivosActuales.length})</span>
            </label>
          )}

          <div className="flex items-center gap-2 flex-1 md:flex-initial">
            <Filter className="w-4 h-4 text-cato-steel shrink-0" />
            <select
              value={selectedZona}
              onChange={(e) => setSelectedZona(e.target.value)}
              className="w-full md:w-64 h-10 px-3 rounded-lg border border-cato-input text-xs text-cato-text bg-white focus:outline-none focus:border-cato-navy"
            >
              <option value="Todas">Todas las Zonas / Macrodistritos</option>
              {ZONAS_LA_PAZ.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredProyectos.length === 0 ? (
        <div className="cato-card py-12 text-center text-cato-muted">
          <Building2 className="w-10 h-10 mx-auto text-cato-steel/50 mb-2" />
          <p className="text-sm font-semibold text-cato-slate">
            No se encontraron Proyectos Receptores en la Gestión {activeSemester}
          </p>
          <p className="text-xs text-cato-muted mt-1">
            Intente con otro término de búsqueda o registre/reutilice un Proyecto Receptor para esta gestión.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProyectos.map((proyecto) => (
            <ProjectCard
              key={proyecto.id}
              project={proyecto}
              assignedCount={countsByProject[proyecto.id] || 0}
              userRole={effectiveRole}
              onViewDetails={setSelectedProjectForView}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              onReactivate={handleReactivate}
            />
          ))}
        </div>
      )}

      <ProjectDetailsModal
        isOpen={Boolean(selectedProjectForView)}
        onClose={() => setSelectedProjectForView(null)}
        project={selectedProjectForView}
        assignedCount={
          selectedProjectForView ? countsByProject[selectedProjectForView.id] || 0 : 0
        }
        canEdit={isAdmin}
        onEdit={handleOpenEdit}
      />

      {isAdmin && (
        <>
          <ProjectFormModal
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleFormSubmit}
            projectToEdit={selectedProjectForEdit}
            instituciones={instituciones}
            catolideres={catolideres}
            semestre={activeSemester}
          />
          <ReuseProjectModal
            isOpen={isReuseOpen}
            onClose={() => setIsReuseOpen(false)}
            semestreDestino={activeSemester}
            proyectosHistoricos={proyectosHistoricos}
            proyectosInactivosActuales={proyectosInactivosActuales}
            catolideres={catolideres}
            onReuse={reutilizarProyecto}
            onReactivate={reactivarProyecto}
          />
        </>
      )}
    </div>
  );
};
