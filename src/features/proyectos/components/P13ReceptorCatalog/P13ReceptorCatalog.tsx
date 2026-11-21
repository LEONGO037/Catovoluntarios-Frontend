import React, { useState, useMemo } from 'react';
import {
  Plus,
  Building2,
  Users,
  Search,
  Filter,
  Coins,
} from 'lucide-react';
import type { ProyectoReceptor } from '../../types/proyectos.types';
import type { UserRole } from '../../../../types/roles.types';
import { useProyectos } from '../../hooks/useProyectos';
import { ProjectCard } from './ProjectCard';
import { ProjectDetailsModal } from './ProjectDetailsModal';
import { ProjectFormModal } from './ProjectFormModal';
import { Button } from '../../../../components/ui/Button';
import { ZONAS_LA_PAZ } from '../../../../constants/zonas';
import { AlertBanner } from '../../../../components/feedback/AlertBanner';

export interface P13ReceptorCatalogProps {
  userRole: UserRole;
  voluntariosCountsByProject: Record<string, number>;
}

export const P13ReceptorCatalog: React.FC<P13ReceptorCatalogProps> = ({
  userRole,
  voluntariosCountsByProject,
}) => {
  const {
    proyectos,
    catolideres,
    createProyecto,
    updateProyecto,
    deleteProyecto,
  } = useProyectos();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZona, setSelectedZona] = useState('Todas');
  const [selectedProjectForView, setSelectedProjectForView] = useState<ProyectoReceptor | null>(null);
  const [selectedProjectForEdit, setSelectedProjectForEdit] = useState<ProyectoReceptor | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const isAdmin = userRole === 'admin';

  // Métricas de cabecera
  const stats = useMemo(() => {
    const total = proyectos.length;
    const totalCupos = proyectos.reduce((acc, p) => acc + p.cupo_maximo_voluntarios, 0);
    const totalAsignados = Object.values(voluntariosCountsByProject).reduce(
      (acc, c) => acc + c,
      0
    );
    const promedioPasajes =
      total > 0
        ? Math.round(
            proyectos.reduce((acc, p) => acc + p.monto_pasaje_fijo, 0) / total
          )
        : 0;

    return { total, totalCupos, totalAsignados, promedioPasajes };
  }, [proyectos, voluntariosCountsByProject]);

  // Proyectos filtrados
  const filteredProyectos = useMemo(() => {
    return proyectos.filter((p) => {
      const matchSearch =
        p.nombre_proyecto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.nombre_supervisor_centro.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.direccion_exacta.toLowerCase().includes(searchTerm.toLowerCase());
      const matchZona = selectedZona === 'Todas' || p.macrodistrito_zona === selectedZona;
      return matchSearch && matchZona;
    });
  }, [proyectos, searchTerm, selectedZona]);

  const handleOpenCreate = () => {
    setSelectedProjectForEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (project: ProyectoReceptor) => {
    setSelectedProjectForEdit(project);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: Omit<ProyectoReceptor, 'id' | 'estado'>) => {
    if (selectedProjectForEdit) {
      updateProyecto(selectedProjectForEdit.id, data);
    } else {
      createProyecto(data);
    }
  };

  const handleDelete = (project: ProyectoReceptor) => {
    const count = voluntariosCountsByProject[project.id] || 0;
    const confirmMessage = count > 0
      ? `El proyecto "${project.nombre_proyecto}" tiene ${count} voluntarios asignados. ¿Está seguro de eliminarlo? Sus voluntarios quedarán sin ubicar.`
      : `¿Está seguro de eliminar el proyecto "${project.nombre_proyecto}"?`;

    if (window.confirm(confirmMessage)) {
      deleteProyecto(project.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner de Consulta para Catolíderes */}
      {!isAdmin && (
        <AlertBanner
          type="info"
          title="Modo Consulta (Solo Lectura)"
          message="Como Catolíder tiene acceso de lectura al catálogo de Proyectos Receptores institucionales y sus respectivas fichas técnicas."
        />
      )}

      {/* Header and Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-cato-navy tracking-tight">
            P-13: Catálogo y Ficha de Proyectos Receptores
          </h2>
          <p className="text-xs text-cato-muted mt-0.5">
            Registro de instituciones aliadas, convenios activos, pasajes fijos y asignación de liderazgo (RF-10, RF-11).
          </p>
        </div>

        {isAdmin && (
          <Button variant="cta" onClick={handleOpenCreate} className="shadow-sm">
            <Plus className="w-4 h-4" />
            Nuevo Proyecto Receptor
          </Button>
        )}
      </div>

      {/* Tarjetas KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="cato-card p-4 space-y-1">
          <div className="flex items-center justify-between text-cato-steel">
            <span className="text-xs font-semibold text-cato-slate">Proyectos Activos</span>
            <Building2 className="w-4 h-4 text-cato-navy" />
          </div>
          <div className="text-2xl font-black text-cato-navy">{stats.total}</div>
          <p className="text-[11px] text-cato-muted">Convenios semestrales vigentes</p>
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

      {/* Buscador y Filtros */}
      <div className="cato-card p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-cato-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, supervisor o dirección..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-cato-input text-xs text-cato-text focus:outline-none focus:border-cato-navy focus:ring-1 focus:ring-cato-navy"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
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

      {/* Grid de Proyectos */}
      {filteredProyectos.length === 0 ? (
        <div className="cato-card py-12 text-center text-cato-muted">
          <Building2 className="w-10 h-10 mx-auto text-cato-steel/50 mb-2" />
          <p className="text-sm font-semibold text-cato-slate">
            No se encontraron Proyectos Receptores
          </p>
          <p className="text-xs text-cato-muted mt-1">
            Intente con otro término de búsqueda o modifique los filtros seleccionados.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProyectos.map((proyecto) => (
            <ProjectCard
              key={proyecto.id}
              project={proyecto}
              assignedCount={voluntariosCountsByProject[proyecto.id] || 0}
              userRole={userRole}
              onViewDetails={setSelectedProjectForView}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal de Consulta Ficha Técnica */}
      <ProjectDetailsModal
        isOpen={Boolean(selectedProjectForView)}
        onClose={() => setSelectedProjectForView(null)}
        project={selectedProjectForView}
        assignedCount={
          selectedProjectForView
            ? voluntariosCountsByProject[selectedProjectForView.id] || 0
            : 0
        }
        canEdit={isAdmin}
        onEdit={handleOpenEdit}
      />

      {/* Modal de Creación / Edición */}
      {isAdmin && (
        <ProjectFormModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          projectToEdit={selectedProjectForEdit}
          catolideres={catolideres}
        />
      )}
    </div>
  );
};
