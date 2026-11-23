import React, { useMemo } from 'react';
import {
  ArrowLeftRight,
  Clock,
  CheckCircle,
} from 'lucide-react';
import type { UserRole } from '../../../../types/roles.types';
import { useProyectos } from '../../hooks/useProyectos';
import { useMatching } from '../../hooks/useMatching';
import { useTraslados } from '../../hooks/useTraslados';
import { TransferForm } from './TransferForm';
import { NotificationFeed } from './NotificationFeed';
import { TransferHistoryTable } from './TransferHistoryTable';
import { AlertBanner } from '../../../../components/feedback/AlertBanner';

export interface P15TransferManagerProps {
  userRole?: UserRole;
}

export const P15TransferManager: React.FC<P15TransferManagerProps> = ({
  userRole = 'admin',
}) => {
  const { proyectos } = useProyectos();
  const { voluntarios, refreshVoluntarios } = useMatching(proyectos, proyectos[0]?.id || '');
  const {
    traslados,
    notificaciones,
    semanaSemestre,
    periodoHabilitado,
    ejecutarTraslado,
    marcarNotificacionLeida,
  } = useTraslados();

  const isAdmin = userRole === 'admin';

  // Solo voluntarios que actualmente tienen un proyecto asignado
  const voluntariosAsignados = useMemo(() => {
    return voluntarios.filter((v) => Boolean(v.proyecto_id));
  }, [voluntarios]);

  // Cupos ocupados actuales por proyecto
  const assignedCounts = useMemo(() => {
    return voluntarios.reduce<Record<string, number>>((acc, v) => {
      if (v.proyecto_id) {
        acc[v.proyecto_id] = (acc[v.proyecto_id] || 0) + 1;
      }
      return acc;
    }, {});
  }, [voluntarios]);

  const handleExecuteTransfer = (params: {
    voluntarioId: string;
    proyectoDestinoId: string;
    motivo: Parameters<typeof ejecutarTraslado>[0]['motivo'];
    fechaEfectiva: string;
  }) => {
    ejecutarTraslado(params);
    refreshVoluntarios();
  };

  if (!isAdmin) {
    return (
      <div className="space-y-4">
        <AlertBanner
          type="warning"
          title="Acceso Restringido a Administrador Pastoral"
          message="La pantalla de Gestión de Reasignaciones y Traslados entre Proyectos es de uso exclusivo de la Administración Pastoral durante el primer mes de actividades."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Semana Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-cato-navy tracking-tight flex items-center gap-2">
            <ArrowLeftRight className="w-6 h-6 text-cato-navy" />
            Gestión de Reasignaciones y Traslados entre Proyectos
          </h2>
          <p className="text-xs text-cato-muted mt-0.5">
            Procedimiento formal de reubicación justificada y emisión de alertas cruzadas (RF-13).
          </p>
        </div>

        {/* Indicador de Semana del Semestre */}
        <div
          className={`px-3.5 py-2 rounded-lg border flex items-center gap-2.5 text-xs font-semibold ${periodoHabilitado
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : 'bg-red-50 text-red-900 border-red-300'
            }`}
        >
          <Clock className="w-4 h-4 text-emerald-700" />
          <div>
            <div>Semana {semanaSemestre} de 4 del Semestre</div>
            <div className="text-[10px] text-emerald-700 font-normal">
              Periodo Ordinario de Traslados Habilitado
            </div>
          </div>
          <CheckCircle className="w-4 h-4 text-emerald-600 ml-1" />
        </div>
      </div>

      {/* Grid: Formulario (Izq) y Panel de Notificaciones (Der) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7">
          <TransferForm
            voluntariosAsignados={voluntariosAsignados}
            proyectos={proyectos}
            assignedCounts={assignedCounts}
            onSubmitTransfer={handleExecuteTransfer}
            disabled={!periodoHabilitado}
          />
        </div>

        <div className="lg:col-span-5">
          <NotificationFeed
            notifications={notificaciones}
            onMarkAsRead={marcarNotificacionLeida}
          />
        </div>
      </div>

      {/* Historial Auditable de Traslados */}
      <TransferHistoryTable traslados={traslados} />
    </div>
  );
};
