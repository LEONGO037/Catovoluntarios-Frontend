import React, { useState, useEffect, useCallback } from 'react';
import type {
  Postulacion,
  PostulacionKpis,
  FilterPostulacionesParams,
  EstadoPostulacion,
} from '../types/postulacion.types';
import { postulacionesApi } from '../../../services/postulaciones.service';
import { KpiBandejaCards } from './KpiBandejaCards';
import { FiltrosPostulantes } from './FiltrosPostulantes';
import { TablaPostulantes } from './TablaPostulantes';
import { ExpedientePostulanteDrawer } from './ExpedientePostulanteDrawer';
import { useActiveSemester } from '../../../components/layout/active-semester';
import { useAuth } from '../../auth/hooks/useAuth';
import { ShieldCheck, Eye } from 'lucide-react';

export const BandejaPostulantes: React.FC = () => {
  const activeSemester = useActiveSemester();
  const { user } = useAuth();
  const userRol: 'ADMIN_PASTORAL' | 'CATOLIDER' =
    user?.rol === 'CATOLIDER' ? 'CATOLIDER' : 'ADMIN_PASTORAL';

  const [kpis, setKpis] = useState<PostulacionKpis>({
    total: 0,
    aptos: 0,
    observadosSobrecarga: 0,
    descartados: 0,
    pendientes: 0,
  });

  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [cargando, setCargando] = useState(false);
  const [filtros, setFiltros] = useState<FilterPostulacionesParams>({
    page: 1,
    limit: 10,
  });
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [postulacionSeleccionada, setPostulacionSeleccionada] = useState<Postulacion | null>(null);
  const [drawerAbierto, setDrawerAbierto] = useState(false);

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    try {
      const [kpiRes, listRes] = await Promise.all([
        postulacionesApi.obtenerKpis(userRol, activeSemester),
        postulacionesApi.obtenerPostulaciones(
          { ...filtros, semestre: activeSemester },
          userRol,
        ),
      ]);
      setKpis(kpiRes);
      setPostulaciones(listRes.items);
      setTotal(listRes.total);
      setTotalPages(listRes.totalPages);
    } catch {
      setPostulaciones([]);
      setKpis({
        total: 0,
        aptos: 0,
        observadosSobrecarga: 0,
        descartados: 0,
        pendientes: 0,
      });
      setTotal(0);
      setTotalPages(1);
    } finally {
      setCargando(false);
    }
  }, [filtros, userRol, activeSemester]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const handleActualizarEstado = async (
    id: number,
    nuevoEstado: EstadoPostulacion,
    observaciones?: string,
  ) => {
    await postulacionesApi.actualizarEstado(id, nuevoEstado, observaciones, userRol);
    await cargarDatos();
  };

  return (
    <div className="space-y-6">
      {/* Barra de Título y Selector de Rol RBAC */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-cato-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cato-gold bg-cato-navy px-3 py-1 rounded-full uppercase tracking-wider">
              Gestión de Admisión
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Gestión Semestre {activeSemester}
            </span>
          </div>
          <h1 className="text-2xl font-black text-cato-navy mt-1">
            Bandeja Central de Postulantes
          </h1>
          <p className="text-xs text-cato-muted">
            Consulta de aspirantes, validación de carga académica y derivación a entrevistas.
          </p>
        </div>

        {/* Indicador de Permisos RBAC del Usuario Autenticado */}
        <div className="flex items-center gap-2">
          {userRol === 'CATOLIDER' ? (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold shadow-2xs">
              <Eye className="w-3.5 h-3.5 text-amber-600" />
              Modo Consulta (Catolíder)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Administración Pastoral
            </span>
          )}
        </div>
      </div>

      {/* Tarjetas KPI */}
      <KpiBandejaCards
        kpis={kpis}
        filtroActivo={filtros.estado || ''}
        onSelectFiltro={(estado) =>
          setFiltros((prev) => ({
            ...prev,
            estado: estado as EstadoPostulacion | '',
            page: 1,
          }))
        }
      />

      {/* Barra de Filtros */}
      <FiltrosPostulantes
        filtros={filtros}
        onChangeFiltros={(nuevos) => setFiltros((prev) => ({ ...prev, ...nuevos }))}
        onLimpiar={() => setFiltros({ page: 1, limit: 10 })}
      />

      {/* Tabla de Postulantes */}
      <TablaPostulantes
        postulaciones={postulaciones}
        cargando={cargando}
        page={filtros.page || 1}
        totalPages={totalPages}
        total={total}
        onCambiarPagina={(p) => setFiltros((prev) => ({ ...prev, page: p }))}
        onVerDetalle={(postulacion) => {
          setPostulacionSeleccionada(postulacion);
          setDrawerAbierto(true);
        }}
      />

      {/* Drawer de Expediente */}
      <ExpedientePostulanteDrawer
        postulacion={postulacionSeleccionada}
        abierto={drawerAbierto}
        onCerrar={() => {
          setDrawerAbierto(false);
          setPostulacionSeleccionada(null);
        }}
        userRol={userRol}
        onActualizarEstado={handleActualizarEstado}
      />
    </div>
  );
};
