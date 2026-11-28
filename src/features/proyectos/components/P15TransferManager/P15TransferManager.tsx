import React, { useMemo } from 'react';
import {
  ArrowLeftRight,
  Clock,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import type { UserRole } from '../../../../types/auth.types';
import type { MotivoTraslado } from '../../types/proyectos.types';
import { useAuth } from '../../../auth/hooks/useAuth';
import { useActiveSemester } from '../../../../components/layout/active-semester';
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
  userRole,
}) => {
  const { user } = useAuth();
  const activeSemester = useActiveSemester();
  const effectiveRole: UserRole = userRole ?? user?.rol ?? 'CATOLIDER';
  const isAdmin = effectiveRole === 'ADMIN_PASTORAL';

  const { proyectos, error: proyectosError } = useProyectos(activeSemester);
  const {
    voluntarios,
    refreshVoluntarios,
    error: matchingError,
  } = useMatching(proyectos, proyectos[0]?.id || '', activeSemester);

  const {
    traslados,
    notificaciones,
    semanaSemestre,
    maxSemanasOrdinarias,
    periodoOrdinarioHabilitado,
    periodoHabilitado,
    autorizacionExcepcional,
    setAutorizacionExcepcional,
    error: trasladosError,
    ejecutarTraslado,
    marcarNotificacionLeida,
  } = useTraslados(activeSemester, proyectos);

  const voluntariosAsignados = useMemo(() => {
    return voluntarios.filter((v) => Boolean(v.proyecto_id));
  }, [voluntarios]);

  const assignedCounts = useMemo(() => {
    return voluntarios.reduce<Record<string, number>>((acc, v) => {
      if (v.proyecto_id) {
        acc[v.proyecto_id] = (acc[v.proyecto_id] || 0) + 1;
      }
      return acc;
    }, {});
  }, [voluntarios]);

  const handleExecuteTransfer = async (params: {
    voluntarioId: string;
    proyectoDestinoId: string;
    motivo: MotivoTraslado;
    motivoOtroDetalle?: string;
    fechaEfectiva: string;
  }) => {
    await ejecutarTraslado(params);
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
      {(proyectosError || matchingError || trasladosError) && (
        <AlertBanner
          type="danger"
          title="Error al cargar Reasignaciones"
          message={trasladosError || matchingError || proyectosError}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-cato-navy border border-blue-200">
              Gestión {activeSemester}
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-cato-navy tracking-tight flex items-center gap-2">
            <ArrowLeftRight className="w-6 h-6 text-cato-navy" />
            Gestión de Reasignaciones y Traslados entre Proyectos
          </h2>
          <p className="text-xs text-cato-muted mt-0.5">
            Procedimiento formal de reubicación justificada y emisión de alertas cruzadas (RF-13).
          </p>
        </div>

        <div
          className={`px-3.5 py-2 rounded-lg border flex items-center gap-2.5 text-xs font-semibold ${
            periodoOrdinarioHabilitado
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : autorizacionExcepcional
              ? 'bg-amber-50 text-amber-900 border-amber-300'
              : 'bg-red-50 text-red-900 border-red-300'
          }`}
        >
          <Clock
            className={`w-4 h-4 ${
              periodoOrdinarioHabilitado
                ? 'text-emerald-700'
                : autorizacionExcepcional
                ? 'text-amber-700'
                : 'text-red-700'
            }`}
          />
          <div>
            <div>
              Semana {semanaSemestre} de {maxSemanasOrdinarias} ({activeSemester})
            </div>
            <div className="text-[10px] font-normal">
              {periodoOrdinarioHabilitado
                ? 'Periodo Ordinario de Traslados Habilitado'
                : autorizacionExcepcional
                ? 'Habilitado por Autorización Excepcional de Pastoral'
                : 'Ventana ordinaria de 4 semanas concluida'}
            </div>
          </div>
          {periodoOrdinarioHabilitado ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 ml-1" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-600 ml-1" />
          )}
        </div>
      </div>

      {!periodoOrdinarioHabilitado && (
        <AlertBanner
          type="warning"
          title="Ventana Ordinaria de 4 Semanas Finalizada"
          message={`La Gestión ${activeSemester} se encuentra en la semana ${semanaSemestre}. Los traslados regulares solo se admiten en las primeras ${maxSemanasOrdinarias} semanas, salvo autorización excepcional de Pastoral.`}
          action={
            <label className="flex items-center gap-2 text-xs font-semibold text-amber-950 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-amber-300">
              <input
                type="checkbox"
                checked={autorizacionExcepcional}
                onChange={(e) => setAutorizacionExcepcional(e.target.checked)}
                className="w-4 h-4 rounded text-cato-navy border-amber-400"
              />
              <span>Habilitar traslado excepcional</span>
            </label>
          }
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7">
          <TransferForm
            voluntariosAsignados={voluntariosAsignados}
            proyectos={proyectos}
            assignedCounts={assignedCounts}
            semestre={activeSemester}
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

      <TransferHistoryTable traslados={traslados} semestre={activeSemester} />
    </div>
  );
};
