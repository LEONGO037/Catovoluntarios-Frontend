import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { KpiCards } from './KpiCards';
import { QuotaStorageBar } from './QuotaStorageBar';
import { SemaforoWidget } from './SemaforoWidget';
import { UrgentNotifications } from './UrgentNotifications';
import type {
  DashboardMetricsResponse,
  CuposProyectosResponse,
  SemaforoOperativoResponse,
  NotificacionUrgente,
} from '../../../services/dashboard.service';
import { dashboardService } from '../../../services/dashboard.service';
import { Download, RefreshCw } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const DashboardPastoral: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetricsResponse | null>(null);
  const [cupos, setCupos] = useState<CuposProyectosResponse | null>(null);
  const [semaforos, setSemaforos] = useState<SemaforoOperativoResponse | null>(null);
  const [notifications, setNotifications] = useState<NotificacionUrgente[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [m, c, s, n] = await Promise.all([
        dashboardService.getMetrics('2/2026'),
        dashboardService.getCuposProyectos('2/2026'),
        dashboardService.getSemaforoOperativo('Noviembre 2026'),
        dashboardService.getNotificaciones(),
      ]);
      setMetrics(m);
      setCupos(c);
      setSemaforos(s);
      setNotifications(n);
    } catch (err) {
      console.error('Error al cargar datos del dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchAll = async () => {
      try {
        const [m, c, s, n] = await Promise.all([
          dashboardService.getMetrics('2/2026'),
          dashboardService.getCuposProyectos('2/2026'),
          dashboardService.getSemaforoOperativo('Noviembre 2026'),
          dashboardService.getNotificaciones(),
        ]);
        if (isMounted) {
          setMetrics(m);
          setCupos(c);
          setSemaforos(s);
          setNotifications(n);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error al cargar datos del dashboard:', err);
        if (isMounted) setIsLoading(false);
      }
    };
    fetchAll();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleExportReport = () => {
    const totalPost = metrics?.kpis?.totalPostulantes?.value ?? 0;
    const activos = metrics?.kpis?.voluntariosActivos?.value ?? 0;
    const polizas = metrics?.kpis?.polizasValidadas?.value ?? 0;
    const horas = metrics?.kpis?.horasTotalesMes?.value ?? 0;

    const blob = new Blob(
      [
        `PROGRAMA CATOVOLUNTARIOS UCB — GESTIÓN 2/2026\nReporte Ejecutivo Pastoral\nFecha: ${new Date().toLocaleDateString()}\nTotal Postulantes: ${totalPost}\nVoluntarios en Campo: ${activos}\nPólizas Validadas: ${polizas}\nHoras Mes: ${horas} h\n`,
      ],
      { type: 'text/plain;charset=utf-8' },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Reporte_Ejecutivo_Pastoral_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-7 text-left">
      {/* 1. Header con Saludo y Acciones Rápidas */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-cato-border shadow-card">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-cato-navy bg-blue-100 px-3 py-0.5 rounded-full">
              Dashboard Ejecutivo
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Gestión 2/2026 en curso
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-cato-navy">
            Bienvenido(a), {user ? `${user.nombres} ${user.primerApellido}` : 'Usuario'}
          </h1>
          <p className="text-xs sm:text-sm text-cato-muted max-w-2xl">
            Cuadro de mando integral de Pastoral Universitaria UCB Regional La Paz. Supervisión de admisión, cupos por proyecto y semáforos cualitativos.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={loadDashboardData}
            isLoading={isLoading}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            title="Refrescar métricas"
          >
            Actualizar
          </Button>

          <Button
            variant="cta"
            size="sm"
            onClick={handleExportReport}
            leftIcon={<Download className="w-3.5 h-3.5" />}
            className="shadow-sm font-bold"
          >
            Descargar Reporte (.txt)
          </Button>
        </div>
      </div>

      {/* 2. Tarjetas KPI Principales */}
      <KpiCards metrics={metrics} isLoading={isLoading} />

      {/* 3. Barra Visual de Ocupación de Cupos */}
      <QuotaStorageBar data={cupos} isLoading={isLoading} />

      {/* 4. Semáforo Operativo del Mes */}
      <SemaforoWidget data={semaforos} isLoading={isLoading} />

      {/* 5. Alertas y Notificaciones Urgentes */}
      <UrgentNotifications notifications={notifications} isLoading={isLoading} />
    </div>
  );
};
