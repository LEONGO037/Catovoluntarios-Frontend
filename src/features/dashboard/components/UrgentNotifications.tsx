import React from 'react';
import type { NotificacionUrgente } from '../../../services/dashboard.service';
import { AlertCircle, Clock, ShieldAlert, FileText, ArrowLeftRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';

interface UrgentNotificationsProps {
  notifications: NotificacionUrgente[];
  isLoading?: boolean;
}

export const UrgentNotifications: React.FC<UrgentNotificationsProps> = ({
  notifications,
  isLoading,
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />;
  }

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'ALERTA_DOCUMENTAL':
        return <FileText className="w-5 h-5 text-amber-600" />;
      case 'TRASLADO_PENDIENTE':
        return <ArrowLeftRight className="w-5 h-5 text-blue-600" />;
      case 'SEGURO_UNIVERSITARIO':
        return <ShieldAlert className="w-5 h-5 text-rose-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-cato-navy" />;
    }
  };

  const getRedirect = (tipo: string) => {
    switch (tipo) {
      case 'ALERTA_DOCUMENTAL':
        return '/validacion-documental';
      case 'TRASLADO_PENDIENTE':
        return '/reasignaciones';
      case 'SEGURO_UNIVERSITARIO':
        return '/documentos';
      default:
        return '/dashboard';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-cato-border p-6 shadow-card text-left space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-cato-border">
        <div>
          <h3 className="text-base font-bold text-cato-navy flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            Acciones y Alertas Operativas de Pastoral
          </h3>
          <p className="text-xs text-cato-muted mt-0.5">
            Alertas del sistema que requieren seguimiento.
          </p>
        </div>
        <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2.5 py-0.5 rounded-full">
          {notifications.length} pendientes
        </span>
      </div>

      {notifications.length === 0 ? (
        <div className="p-6 text-center text-xs text-cato-muted bg-cato-canvas rounded-xl">
          No hay alertas urgentes pendientes en este momento.
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className="p-4 rounded-xl border border-cato-border bg-cato-canvas hover:bg-white hover:border-cato-navy/30 transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-white border border-cato-border shrink-0 shadow-2xs">
                  {getIcon(notif.tipo)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs text-cato-navy">{notif.titulo}</h4>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.2 rounded-full uppercase tracking-wider ${
                        notif.prioridad === 'ALTA'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {notif.prioridad}
                    </span>
                  </div>
                  <p className="text-xs text-cato-muted leading-relaxed">{notif.descripcion}</p>
                  <p className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {notif.tiempo}
                  </p>
                </div>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate(getRedirect(notif.tipo))}
                className="shrink-0 text-xs self-end sm:self-center"
              >
                Revisar
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
