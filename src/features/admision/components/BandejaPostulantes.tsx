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

export const BandejaPostulantes: React.FC = () => {
  // Simulación de rol activo para verificar RBAC (Pastoral vs Catolíder)
  const [userRol, setUserRol] = useState<'ADMIN_PASTORAL' | 'CATOLIDER'>('ADMIN_PASTORAL');

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
        postulacionesApi.obtenerKpis(userRol),
        postulacionesApi.obtenerPostulaciones(filtros, userRol),
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
  }, [filtros, userRol]);

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
              Gestión Semestre 2/2026
            </span>
          </div>
          <h1 className="text-2xl font-black text-cato-navy mt-1">
            Bandeja Central de Postulantes
          </h1>
          <p className="text-xs text-cato-muted">
            Consulta de aspirantes, validación de carga académica y derivación a entrevistas.
          </p>
        </div>

        {/* Switch de Rol para Probar RBAC */}
        <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-cato-border shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase">
            Rol Activo:
          </span>
          <button
            type="button"
            onClick={() => setUserRol('ADMIN_PASTORAL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              userRol === 'ADMIN_PASTORAL'
                ? 'badge-role-admin shadow-sm'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            Admin Pastoral (Control Total)
          </button>
          <button
            type="button"
            onClick={() => setUserRol('CATOLIDER')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              userRol === 'CATOLIDER'
                ? 'badge-role-catolider shadow-sm'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            Catolíder (Solo Lectura)
          </button>
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
