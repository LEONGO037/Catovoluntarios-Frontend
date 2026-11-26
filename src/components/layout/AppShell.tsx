import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Modal } from '../ui/Modal';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/api.client';
import { notificacionesService, type Notificacion } from '../../services/notificaciones.service';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { ActiveSemesterContext } from './active-semester';

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
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedSemestre, setSelectedSemestre] = useState(
    () => sessionStorage.getItem('catovoluntarios_semestre') || '2/2026',
  );
  const [semestres, setSemestres] = useState<string[]>([]);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [cargandoNotificaciones, setCargandoNotificaciones] = useState(true);
  const [errorNotificaciones, setErrorNotificaciones] = useState('');
  const navigate = useNavigate();
  const puedeVerNotificaciones = user?.rol === 'ADMIN_PASTORAL' || user?.rol === 'CATOLIDER'
    || user?.rol === 'VOLUNTARIO';

  useEffect(() => {
    const controller = new AbortController();
    apiClient.get<{ opciones: string[]; activa: string }>('/documentos/gestiones', {
      signal: controller.signal,
    })
      .then(({ opciones, activa }) => {
        setSemestres(opciones);
        setSelectedSemestre((actual) =>
          sessionStorage.getItem('catovoluntarios_semestre') && opciones.includes(actual)
            ? actual
            : activa,
        );
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!puedeVerNotificaciones) return;
    let vigente = true;
    notificacionesService.listar(selectedSemestre)
      .then((datos) => {
        if (!vigente) return;
        setNotificaciones(datos);
        setErrorNotificaciones('');
      })
      .catch((error: unknown) => {
        if (!vigente) return;
        setErrorNotificaciones(error instanceof Error ? error.message : 'No se pudieron cargar las notificaciones.');
      })
      .finally(() => {
        if (vigente) setCargandoNotificaciones(false);
      });
    return () => { vigente = false; };
  }, [puedeVerNotificaciones, selectedSemestre, showNotificationsModal]);

  const elegirSemestre = (semestre: string) => {
    if (semestre === selectedSemestre) return;
    sessionStorage.setItem('catovoluntarios_semestre', semestre);
    setNotificaciones([]);
    setCargandoNotificaciones(true);
    setSelectedSemestre(semestre);
  };

  const abrirNotificaciones = () => {
    setCargandoNotificaciones(true);
    setShowNotificationsModal(true);
  };

  const leerNotificacion = async (notificacion: Notificacion, abrirEnlace: boolean) => {
    try {
      if (!notificacion.leida) {
        await notificacionesService.marcarLeida(notificacion.id);
        setNotificaciones((actuales) => actuales.map((actual) =>
          actual.id === notificacion.id ? { ...actual, leida: true } : actual,
        ));
      }
      if (abrirEnlace && notificacion.enlaceDestino?.startsWith('/')) {
        setShowNotificationsModal(false);
        navigate(notificacion.enlaceDestino);
      }
    } catch (error) {
      setErrorNotificaciones(error instanceof Error ? error.message : 'No se pudo marcar como leída.');
    }
  };

  const opcionesSemestre = semestres.length ? semestres : [selectedSemestre];

  return (
    <div className="min-h-screen bg-cato-canvas flex text-cato-text">
      {/* Sidebar persistente */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        selectedSemestre={selectedSemestre}
        semestres={opcionesSemestre}
        onSelectSemestre={elegirSemestre}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          selectedSemestre={selectedSemestre}
          semestres={opcionesSemestre}
          onSelectSemestre={elegirSemestre}
          urgentCount={notificaciones.filter(({ leida }) => !leida).length}
          onOpenNotifications={puedeVerNotificaciones ? abrirNotificaciones : undefined}
        />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <ActiveSemesterContext.Provider value={selectedSemestre}>
            {children}
          </ActiveSemesterContext.Provider>
        </main>
      </div>

      <Modal
        isOpen={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
        title={
          <div className="flex items-center gap-2 text-rose-600">
            <Bell className="w-5 h-5" />
            <span>Notificaciones</span>
          </div>
        }
        subtitle={`Gestión ${selectedSemestre}`}
      >
        <div className="space-y-3">
          {errorNotificaciones && <p role="alert" className="text-sm text-rose-700">{errorNotificaciones}</p>}
          {cargandoNotificaciones && <p role="status" className="text-sm text-cato-muted">Cargando notificaciones…</p>}
          {!cargandoNotificaciones && !errorNotificaciones && notificaciones.length === 0 && (
            <div className="p-8 text-center text-xs text-cato-muted bg-cato-canvas rounded-xl border border-cato-border">
              No tienes notificaciones en esta gestión.
            </div>
          )}
          {notificaciones.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left ${
                  notif.leida ? 'border-cato-border bg-white' : 'border-blue-200 bg-blue-50'
                }`}
              >
                <div>
                  <h5 className="font-bold text-sm text-cato-navy">
                    {notif.titulo}
                  </h5>
                  <p className="text-sm text-cato-muted mt-0.5 break-words">{notif.mensaje}</p>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  {notif.enlaceDestino && (
                    <button type="button" onClick={() => void leerNotificacion(notif, true)}
                      className="text-xs font-semibold px-3 py-1.5 bg-cato-navy text-white rounded-lg">
                      Ver detalle
                    </button>
                  )}
                  {!notif.leida && (
                    <button type="button" onClick={() => void leerNotificacion(notif, false)}
                      className="text-xs font-semibold px-3 py-1.5 text-cato-navy rounded-lg border border-cato-border bg-white">
                      Marcar como leída
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      </Modal>
    </div>
  );
};
