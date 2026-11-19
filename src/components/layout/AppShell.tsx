import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Modal } from '../ui/Modal';
import { Bell, AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedSemestre, setSelectedSemestre] = useState('2/2026');
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const navigate = useNavigate();

  const urgentNotifications = [
    {
      id: '1',
      title: '5 Cartas de Autorización de Menores sin Validar',
      desc: 'Postulantes menores de 18 años requieren aprobación de carta de padres para avanzar.',
      action: '/validacion-documental',
      btnText: 'Ir a Validación (P-11)',
      priority: 'high',
    },
    {
      id: '2',
      title: '3 Solicitudes de Traslado entre Proyectos',
      desc: 'Reubicaciones solicitadas durante las primeras 4 semanas por cruce de horarios.',
      action: '/reasignaciones',
      btnText: 'Gestionar en P-15',
      priority: 'medium',
    },
    {
      id: '3',
      title: '8 Pólizas APC-7083 por Vencer',
      desc: 'Seguro de accidentes vence este mes; horas de voluntariado en campo serán bloqueadas si no renuevan.',
      action: '/documentos',
      btnText: 'Ver Pólizas (P-10)',
      priority: 'high',
    },
  ];

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
          {urgentNotifications.map((notif) => (
            <div
              key={notif.id}
              className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                  <h4 className="font-bold text-sm text-cato-slate">{notif.title}</h4>
                </div>
                <p className="text-xs text-cato-muted">{notif.desc}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowNotificationsModal(false);
                  navigate(notif.action);
                }}
                className="shrink-0 text-xs border-rose-300 text-rose-700 hover:bg-rose-100"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                {notif.btnText}
              </Button>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};
