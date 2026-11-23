import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Modal } from '../ui/Modal';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dashboardService, type NotificacionUrgente } from '../../services/dashboard.service';

export interface AppShellProps {
  children: React.ReactNode;
  currentView?: string;
  onNavigate?: (view: any) => void;
  currentRole?: any;
  onRoleChange?: (role: any) => void;
  pageTitle?: string;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedSemestre, setSelectedSemestre] = useState('2/2026');
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [urgentNotifications, setUrgentNotifications] = useState<NotificacionUrgente[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    dashboardService
      .getNotificaciones()
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          setUrgentNotifications(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setUrgentNotifications([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedSemestre]);

  return (
    <div className="min-h-screen bg-cato-canvas flex text-cato-text">
      {/* Sidebar persistente */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        selectedSemestre={selectedSemestre}
        onSelectSemestre={setSelectedSemestre}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          selectedSemestre={selectedSemestre}
          onSelectSemestre={setSelectedSemestre}
          urgentCount={urgentNotifications.length}
          onOpenNotifications={() => setShowNotificationsModal(true)}
        />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Modal de Notificaciones Urgentes de Pastoral */}
      <Modal
        isOpen={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
        title={
          <div className="flex items-center gap-2 text-rose-600">
            <Bell className="w-5 h-5" />
            <span>Notificaciones y Alertas Urgentes de Pastoral</span>
          </div>
        }
        subtitle="Asuntos operativos que requieren atención inmediata en el semestre activo"
      >
        <div className="space-y-3">
          {urgentNotifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-cato-muted bg-cato-canvas rounded-xl border border-cato-border">
              No hay alertas ni notificaciones urgentes pendientes en este momento.
            </div>
          ) : (
            urgentNotifications.map((notif) => (
              <div
                key={notif.id}
                className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left"
              >
                <div>
                  <h5 className="font-bold text-sm text-cato-navy">
                    {notif.titulo}
                  </h5>
                  <p className="text-xs text-cato-muted mt-0.5">{notif.descripcion}</p>
                </div>
                <button
                  onClick={() => {
                    setShowNotificationsModal(false);
                    if (notif.accion) navigate(notif.accion);
                  }}
                  className="shrink-0 text-xs font-semibold px-3 py-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                >
                  Ver Detalle
                </button>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
};
