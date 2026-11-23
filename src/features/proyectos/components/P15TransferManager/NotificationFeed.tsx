import React from 'react';
import {
  Bell,
  ArrowDownRight,
  ArrowUpRight,
  UserCheck,
  Check,
} from 'lucide-react';
import type { NotificacionTraslado } from '../../types/proyectos.types';

export interface NotificationFeedProps {
  notifications: NotificacionTraslado[];
  onMarkAsRead: (id: string) => void;
}

export const NotificationFeed: React.FC<NotificationFeedProps> = ({
  notifications,
  onMarkAsRead,
}) => {
  const getIconAndStyle = (tipo: NotificacionTraslado['tipo']) => {
    switch (tipo) {
      case 'baja_lider_origen':
        return {
          icon: <ArrowDownRight className="w-4 h-4 text-red-600" />,
          badgeClass: 'bg-red-100 text-red-800 border-red-200',
          label: 'Alerta Catolíder Origen (Baja)',
        };
      case 'alta_lider_destino':
        return {
          icon: <ArrowUpRight className="w-4 h-4 text-emerald-600" />,
          badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          label: 'Alerta Catolíder Destino (Alta)',
        };
      case 'actualizacion_voluntario':
        return {
          icon: <UserCheck className="w-4 h-4 text-blue-600" />,
          badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
          label: 'Alerta Voluntario',
        };
    }
  };

  return (
    <div className="bg-white rounded-xl border border-cato-border p-5 shadow-card space-y-4">
      <div className="flex items-center justify-between border-b border-cato-border pb-3">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-cato-navy" />
          <h3 className="text-sm font-bold text-cato-navy">
            Panel de Notificaciones Automáticas Cruzadas
          </h3>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 font-bold border border-blue-200">
          {notifications.length} registros
        </span>
      </div>

      <p className="text-xs text-cato-muted">
        Alertas generadas en tiempo real para líderes de proyecto y voluntarios por cada reasignación autorizada.
      </p>

      {notifications.length === 0 ? (
        <div className="py-8 text-center text-xs text-cato-muted">
          No hay notificaciones de traslados emitidas en este semestre.
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {notifications.map((notif) => {
            const { icon, badgeClass, label } = getIconAndStyle(notif.tipo);

            return (
              <div
                key={notif.id}
                className={`p-3.5 rounded-lg border text-xs transition-colors ${
                  notif.leido
                    ? 'bg-cato-canvas/60 border-cato-border opacity-75'
                    : 'bg-white border-blue-200 shadow-xs ring-1 ring-blue-100'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    {icon}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeClass}`}
                    >
                      {label}
                    </span>
                  </div>
                  <span className="text-[10px] text-cato-muted font-mono">
                    {notif.fecha}
                  </span>
                </div>

                <div className="font-semibold text-cato-navy mb-0.5">
                  {notif.titulo} &bull; Destinatario: {notif.destinatario_nombre}
                </div>

                <p className="text-[11px] text-cato-text leading-relaxed">
                  {notif.mensaje}
                </p>

                {!notif.leido && (
                  <div className="mt-2 pt-2 border-t border-cato-border/60 flex justify-end">
                    <button
                      type="button"
                      onClick={() => onMarkAsRead(notif.id)}
                      className="text-[10px] font-semibold text-cato-slate hover:text-cato-navy flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      Marcar como notificado
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
