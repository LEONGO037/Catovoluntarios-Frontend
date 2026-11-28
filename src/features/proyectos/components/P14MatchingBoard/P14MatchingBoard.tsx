import React, { useState, useMemo } from 'react';
import {
  Users2,
  Building2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import type { UserRole } from '../../../../types/auth.types';
import type { VoluntarioAdmitido } from '../../types/proyectos.types';
import { useAuth } from '../../../auth/hooks/useAuth';
import { useActiveSemester } from '../../../../components/layout/active-semester';
import { useProyectos } from '../../hooks/useProyectos';
import { useMatching } from '../../hooks/useMatching';
import { UnassignedVolunteers } from './UnassignedVolunteers';
import { DemographicBalance } from './DemographicBalance';
import { AssignedTable } from './AssignedTable';
import { QuickAssignModal } from './QuickAssignModal';
import { AlertBanner } from '../../../../components/feedback/AlertBanner';

export interface P14MatchingBoardProps {
  userRole?: UserRole;
  voluntariosCountsByProject?: Record<string, number>;
}

export const P14MatchingBoard: React.FC<P14MatchingBoardProps> = ({
  userRole,
}) => {
  const { user } = useAuth();
  const activeSemester = useActiveSemester();
  const effectiveRole: UserRole = userRole ?? user?.rol ?? 'CATOLIDER';
  const isAdmin = effectiveRole === 'ADMIN_PASTORAL';

  const { proyectos, error: proyectosError } = useProyectos(activeSemester);
  const proyectosActivos = useMemo(
    () => proyectos.filter((p) => p.estado === 'activo'),
    [proyectos]
  );

  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const activeProjectId =
    selectedProjectId && proyectosActivos.some((p) => p.id === selectedProjectId)
      ? selectedProjectId
      : proyectosActivos[0]?.id || '';

  const {
    voluntarios,
    currentProyecto,
    assignedVolunteers,
    unassignedVolunteers,
    balanceDemografico,
    filtros,
    error: matchingError,
    setFiltros,
    asignar,
    desasignar,
  } = useMatching(proyectosActivos, activeProjectId, activeSemester);

  const [assignCandidate, setAssignCandidate] = useState<VoluntarioAdmitido | null>(null);
  const [actionError, setActionError] = useState('');

  const assignedCounts = useMemo(() => {
    return voluntarios.reduce<Record<string, number>>((acc, v) => {
      if (v.proyecto_id) {
        acc[v.proyecto_id] = (acc[v.proyecto_id] || 0) + 1;
      }
      return acc;
    }, {});
  }, [voluntarios]);

  const totalSinUbicar = useMemo(
    () => voluntarios.filter((v) => !v.proyecto_id).length,
    [voluntarios]
  );

  const handleOpenAssignModal = (vol: VoluntarioAdmitido) => {
    setActionError('');
    setAssignCandidate(vol);
  };

  const handleConfirmAssign = async (voluntarioId: string, proyectoId: string) => {
    setActionError('');
    await asignar(voluntarioId, proyectoId);
  };

  const handleUnassign = async (voluntarioId: string) => {
    if (window.confirm('¿Está seguro de desasignar este voluntario del Proyecto Receptor?')) {
      setActionError('');
      try {
        await desasignar(voluntarioId);
      } catch (err: unknown) {
        setActionError(
          err instanceof Error
            ? err.message
            : 'No se pudo desasignar al voluntario.'
        );
      }
    }
  };

  if (!isAdmin) {
    return (
      <div className="space-y-4">
        <AlertBanner
          type="warning"
          title="Acceso Restringido a Administrador Pastoral"
          message="La pantalla de Asignación Inteligente y Ubicación de Voluntarios es de uso exclusivo de la Administración de Pastoral para garantizar el equilibrio demográfico institucional."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {(proyectosError || matchingError || actionError) && (
        <AlertBanner
          type="danger"
          title="Error al gestionar Ubicación de Voluntarios"
          message={actionError || matchingError || proyectosError}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-cato-navy border border-blue-200">
              Gestión {activeSemester}
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-cato-navy tracking-tight flex items-center gap-2">
            <Users2 className="w-6 h-6 text-cato-navy" />
            Asignación Inteligente y Ubicación de Voluntarios
          </h2>
          <p className="text-xs text-cato-muted mt-0.5">
            Emparejamiento de admitidos con Proyectos Receptores en tiempo real y balance demográfico por sede (RF-12).
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-white px-3 py-1.5 rounded-lg border border-cato-border shadow-xs">
          <HelpCircle className="w-4 h-4 text-cato-steel" />
          <span className="text-cato-slate font-medium">
            Postulantes sin ubicar: <strong className="text-cato-navy">{totalSinUbicar}</strong>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5">
          <UnassignedVolunteers
            volunteers={unassignedVolunteers}
            totalSinUbicar={totalSinUbicar}
            filtros={filtros}
            onFiltrosChange={setFiltros}
            onAssignClick={handleOpenAssignModal}
            currentProject={currentProyecto}
          />
        </div>

        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-cato-border">
            {proyectosActivos.map((p) => {
              const isActive = (currentProyecto?.id || activeProjectId) === p.id;
              const count = assignedCounts[p.id] || 0;

              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedProjectId(p.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-t-lg text-xs font-bold transition-all whitespace-nowrap border-b-2 ${
                    isActive
                      ? 'border-cato-navy text-cato-navy bg-white shadow-xs'
                      : 'border-transparent text-cato-muted hover:text-cato-slate hover:bg-white/60'
                  }`}
                >
                  <Building2
                    className={`w-3.5 h-3.5 ${
                      isActive ? 'text-cato-gold-dark' : 'text-cato-steel'
                    }`}
                  />
                  <span>{p.nombre_proyecto}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      count >= p.cupo_maximo_voluntarios
                        ? 'bg-red-100 text-red-800'
                        : 'bg-cato-canvas text-cato-slate'
                    }`}
                  >
                    {count}/{p.cupo_maximo_voluntarios}
                  </span>
                </button>
              );
            })}
          </div>

          {currentProyecto ? (
            <>
              <DemographicBalance
                balance={balanceDemografico}
                project={currentProyecto}
              />

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-cato-slate px-1">
                  <span>
                    Nómina de Voluntarios Asignados al Centro ({assignedVolunteers.length})
                  </span>
                  <span className="text-[11px] text-cato-muted font-normal">
                    Contacto telefónico directo vía enlace oficial de WhatsApp
                  </span>
                </div>
                <AssignedTable
                  volunteers={assignedVolunteers}
                  onUnassign={handleUnassign}
                  canManage={isAdmin}
                />
              </div>
            </>
          ) : (
            <div className="p-8 text-center bg-white rounded-xl border border-cato-border text-xs text-cato-muted">
              <AlertCircle className="w-8 h-8 mx-auto text-cato-steel/50 mb-2" />
              No existen Proyectos Receptores activos en la Gestión {activeSemester}.
            </div>
          )}
        </div>
      </div>

      <QuickAssignModal
        isOpen={Boolean(assignCandidate)}
        onClose={() => setAssignCandidate(null)}
        volunteer={assignCandidate}
        proyectos={proyectosActivos}
        currentProjectId={currentProyecto?.id || activeProjectId}
        onConfirm={handleConfirmAssign}
        assignedCounts={assignedCounts}
      />
    </div>
  );
};
