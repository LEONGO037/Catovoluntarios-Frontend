import React, { useState, useMemo } from 'react';
import {
  Users2,
  Building2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import type { UserRole } from '../../../../types/roles.types';
import type { VoluntarioAdmitido } from '../../types/proyectos.types';
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
  userRole = 'admin',
}) => {
  const { proyectos } = useProyectos();
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    proyectos[0]?.id || ''
  );

  const {
    voluntarios,
    currentProyecto,
    assignedVolunteers,
    unassignedVolunteers,
    balanceDemografico,
    filtros,
    setFiltros,
    asignar,
    desasignar,
  } = useMatching(proyectos, selectedProjectId || proyectos[0]?.id || '');

  const [assignCandidate, setAssignCandidate] = useState<VoluntarioAdmitido | null>(null);

  const isAdmin = userRole === 'admin';

  // Conteo de voluntarios por proyecto
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
    setAssignCandidate(vol);
  };

  const handleConfirmAssign = (voluntarioId: string, proyectoId: string) => {
    asignar(voluntarioId, proyectoId);
  };

  const handleUnassign = (voluntarioId: string) => {
    if (window.confirm('¿Está seguro de desasignar este voluntario del proyecto?')) {
      desasignar(voluntarioId);
    }
  };

  if (!isAdmin) {
    return (
      <div className="space-y-4">
        <AlertBanner
          type="warning"
          title="Acceso Restringido a Administrador Pastoral"
          message="La pantalla P-14 (Asignación Inteligente y Ubicación de Voluntarios) es de uso exclusivo de la Administración de Pastoral para garantizar el equilibrio demográfico institucional."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-cato-navy tracking-tight flex items-center gap-2">
            <Users2 className="w-6 h-6 text-cato-navy" />
            P-14: Asignación Inteligente y Ubicación de Voluntarios
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

      {/* Main Split-Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda: Postulantes por Ubicar (5 cols) */}
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

        {/* Columna Derecha: Proyectos Receptores y Ubicados (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Tabs de Proyectos Receptores */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-cato-border">
            {proyectos.map((p) => {
              const isActive = (currentProyecto?.id || selectedProjectId) === p.id;
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
                  <Building2 className={`w-3.5 h-3.5 ${isActive ? 'text-cato-gold-dark' : 'text-cato-steel'}`} />
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
              {/* Balance Demográfico en Tiempo Real */}
              <DemographicBalance
                balance={balanceDemografico}
                project={currentProyecto}
              />

              {/* Tabla de Voluntarios Asignados al Proyecto Activo */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-cato-slate px-1">
                  <span>Nómina de Voluntarios Asignados al Centro ({assignedVolunteers.length})</span>
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
              Seleccione un Proyecto Receptor para visualizar su balance demográfico y nómina.
            </div>
          )}
        </div>
      </div>

      {/* Modal de Asignación Rápida */}
      <QuickAssignModal
        isOpen={Boolean(assignCandidate)}
        onClose={() => setAssignCandidate(null)}
        volunteer={assignCandidate}
        proyectos={proyectos}
        currentProjectId={currentProyecto?.id || proyectos[0]?.id || ''}
        onConfirm={handleConfirmAssign}
        assignedCounts={assignedCounts}
      />
    </div>
  );
};
