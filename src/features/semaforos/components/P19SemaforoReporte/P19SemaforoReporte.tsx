/* oxlint-disable react/set-state-in-effect */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Activity,
  Save,
  Send,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Phone,
} from 'lucide-react';
import { useActiveSemester } from '../../../../components/layout/active-semester';
import { semaforosService } from '../../services/semaforos.service';
import { dashboardService } from '../../../../services/dashboard.service';
import type {
  VoluntarioSemaforo,
  ColorSemaforo,
} from '../../types/semaforo.types';

export const P19SemaforoReporte: React.FC = () => {
  const semestreActivo = useActiveSemester();
  const anioActivo = parseInt(semestreActivo.split('/')[1] || '2026', 10);
  const [proyectoId, setProyectoId] = useState<number>(1);
  const [listaProyectos, setListaProyectos] = useState<{ id: number; nombre: string }[]>([]);
  const [mesSeleccionado, setMesSeleccionado] = useState<string>('Septiembre');
  const [voluntarios, setVoluntarios] = useState<VoluntarioSemaforo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notificacion, setNotificacion] = useState<{
    tipo: 'success' | 'warning' | 'error';
    mensaje: string;
  } | null>(null);
  const [enviado, setEnviado] = useState<boolean>(false);

  useEffect(() => {
    dashboardService
      .getCuposProyectos()
      .then((res) => {
        if (res && res.proyectos && res.proyectos.length > 0) {
          setListaProyectos(res.proyectos.map((p) => ({ id: p.id, nombre: p.nombre })));
          setProyectoId(res.proyectos[0].id);
        }
      })
      .catch((err) => console.error('Error cargando proyectos para semaforo:', err));
  }, []);

  // Cargar datos
  const cargarDatos = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await semaforosService.obtenerReportesProyecto(
        proyectoId,
        mesSeleccionado,
        anioActivo,
      );
      setVoluntarios(data.voluntarios);
    } catch (error) {
      console.error('Error cargando reportes:', error);
    } finally {
      setIsLoading(false);
    }
  }, [proyectoId, mesSeleccionado, anioActivo]);

  useEffect(() => {
    void cargarDatos();
  }, [cargarDatos]);

  // Cambiar color de semáforo
  const handleColorChange = (idAsignacion: number, color: ColorSemaforo) => {
    setVoluntarios((prev) =>
      prev.map((v) => {
        if (v.idAsignacion === idAsignacion) {
          const autoNotificar = color === 'Rojo' ? true : v.notificarAbandono;
          return {
            ...v,
            colorSemaforo: color,
            notificarAbandono: autoNotificar,
          };
        }
        return v;
      }),
    );
  };

  // Cambiar justificación obligatoria
  const handleObservacionChange = (idAsignacion: number, texto: string) => {
    setVoluntarios((prev) =>
      prev.map((v) =>
        v.idAsignacion === idAsignacion
          ? { ...v, observacionesDesempeno: texto }
          : v,
      ),
    );
  };

  // Toggle notificación abandono
  const handleToggleAbandono = (idAsignacion: number) => {
    setVoluntarios((prev) =>
      prev.map((v) =>
        v.idAsignacion === idAsignacion
          ? { ...v, notificarAbandono: !v.notificarAbandono }
          : v,
      ),
    );
  };

  // Guardar borrador
  const handleGuardarBorrador = async () => {
    try {
      for (const v of voluntarios) {
        if (v.observacionesDesempeno.trim()) {
          await semaforosService.guardarReporteSemaforo({
            idAsignacion: v.idAsignacion,
            mes: mesSeleccionado,
            anio: anioActivo,
            colorSemaforo: v.colorSemaforo,
            observacionesDesempeno: v.observacionesDesempeno,
            notificarAbandono: v.notificarAbandono,
          });
        }
      }
      setNotificacion({
        tipo: 'success',
        mensaje: 'Borrador guardado correctamente en la base de datos.',
      });
      setTimeout(() => setNotificacion(null), 4000);
    } catch (e: any) {
      setNotificacion({
        tipo: 'error',
        mensaje: e.message || 'Error al guardar el borrador.',
      });
    }
  };

  // Enviar reporte final a Pastoral
  const handleEnviarReporte = async () => {
    // Validar que todas las filas tengan justificación
    const sinJustificacion = voluntarios.filter(
      (v) => !v.observacionesDesempeno || v.observacionesDesempeno.trim() === '',
    );

    if (sinJustificacion.length > 0) {
      setNotificacion({
        tipo: 'warning',
        mensaje: `Pastoral exige justificación obligatoria para cada voluntario. Faltan ${sinJustificacion.length} observaciones por redactar.`,
      });
      return;
    }

    try {
      for (const v of voluntarios) {
        await semaforosService.guardarReporteSemaforo({
          idAsignacion: v.idAsignacion,
          mes: mesSeleccionado,
          anio: anioActivo,
          colorSemaforo: v.colorSemaforo,
          observacionesDesempeno: v.observacionesDesempeno,
          notificarAbandono: v.notificarAbandono,
        });
      }
      setEnviado(true);
      setNotificacion({
        tipo: 'success',
        mensaje:
          '¡Reporte mensual consolidado y transmitido con éxito a Pastoral Universitaria UCB!',
      });
      setTimeout(() => setNotificacion(null), 5000);
    } catch (e: any) {
      setNotificacion({
        tipo: 'error',
        mensaje: e.message || 'Ocurrió un error al enviar el reporte.',
      });
    }
  };

  // Métricas calculadas
  const total = voluntarios.length;
  const verdes = voluntarios.filter((v) => v.colorSemaforo === 'Verde').length;
  const amarillos = voluntarios.filter((v) => v.colorSemaforo === 'Amarillo').length;
  const rojos = voluntarios.filter((v) => v.colorSemaforo === 'Rojo').length;
  const morados = voluntarios.filter((v) => v.colorSemaforo === 'Morado').length;

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cato-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-xs">
              Supervisión de Desempeño
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-cato-navy mt-1 tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-cato-steel" />
            Reporte Mensual y Semáforo de Desempeño Operativo
          </h1>
          <p className="text-xs text-cato-muted mt-0.5">
            Supervisión cualitativa mensual y sistema de alerta temprana para los voluntarios del proyecto asignado.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleGuardarBorrador}
            className="btn-secondary text-xs flex items-center gap-1.5"
            type="button"
          >
            <Save className="w-4 h-4 text-slate-500" />
            Guardar Borrador
          </button>
          <button
            onClick={handleEnviarReporte}
            className="btn-cta text-xs flex items-center gap-1.5 shadow-sm"
            type="button"
          >
            <Send className="w-4 h-4" />
            Enviar Reporte a Pastoral UCB
          </button>
        </div>
      </div>

      {/* Alerta de notificación */}
      {notificacion && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 shadow-sm transition-all ${
            notificacion.tipo === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : notificacion.tipo === 'warning'
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-red-50 border-red-300 text-red-800'
          }`}
        >
          {notificacion.tipo === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
          {notificacion.tipo === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />}
          {notificacion.tipo === 'error' && <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />}
          <span className="font-medium">{notificacion.mensaje}</span>
        </div>
      )}

      {/* 2. Banner de Filtros de Selección */}
      <div className="cato-card p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-bold text-cato-navy mb-1">
            Proyecto Institucional Asignado
          </label>
          <select
            value={proyectoId}
            onChange={(e) => setProyectoId(Number(e.target.value))}
            className="w-full text-xs font-medium border border-cato-border rounded-lg p-2 bg-slate-50 focus:border-cato-navy focus:bg-white"
          >
            {listaProyectos.length === 0 ? (
              <option value={1}>Sin proyectos registrados</option>
            ) : (
              listaProyectos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))
            )}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-cato-navy mb-1">
            Mes a Reportar (Obligatorio)
          </label>
          <select
            value={mesSeleccionado}
            onChange={(e) => setMesSeleccionado(e.target.value)}
            className="w-full text-xs font-medium border border-cato-border rounded-lg p-2 bg-white focus:border-cato-navy"
          >
            <option value="Septiembre">Mes 1 — Septiembre 2026 (En curso)</option>
            <option value="Octubre">Mes 2 — Octubre 2026</option>
            <option value="Noviembre">Mes 3 — Noviembre 2026</option>
            <option value="Diciembre">Mes 4 — Diciembre 2026 (Cierre)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-cato-navy mb-1">
            Catolíder Responsable
          </label>
          <div className="text-xs font-semibold text-slate-700 bg-slate-100 p-2 rounded-lg border border-slate-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Mateo Alarcón (Catolíder Titular)</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-cato-navy mb-1">
            Estado de Entrega
          </label>
          <div
            className={`flex items-center justify-between text-xs font-semibold p-2 rounded-lg border ${
              enviado
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-amber-50 text-amber-800 border-amber-300'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  enviado ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              ></span>
              {enviado ? 'Enviado a Pastoral' : 'Borrador en Edición'}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              Límite: 30/{mesSeleccionado.slice(0, 3)}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Tarjetas KPI de Semáforo */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="cato-card p-3.5 flex items-center justify-between border-t-4 border-t-cato-navy">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase">Voluntarios</span>
            <div className="text-2xl font-black text-slate-800 mt-0.5">{total}</div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-cato-navy flex items-center justify-center font-bold text-sm">
            <Users className="w-5 h-5 text-cato-navy" />
          </div>
        </div>

        <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 shadow-sm flex items-center justify-between border-t-4 border-t-emerald-500">
          <div>
            <span className="text-[11px] font-bold text-emerald-800 uppercase flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Verdes
            </span>
            <div className="text-2xl font-black text-emerald-700 mt-0.5">{verdes}</div>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-white/80 px-2 py-0.5 rounded-full border border-emerald-200">
            {total > 0 ? ((verdes / total) * 100).toFixed(0) : 0}%
          </span>
        </div>

        <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200 shadow-sm flex items-center justify-between border-t-4 border-t-amber-500">
          <div>
            <span className="text-[11px] font-bold text-amber-800 uppercase flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Amarillos
            </span>
            <div className="text-2xl font-black text-amber-700 mt-0.5">{amarillos}</div>
          </div>
          <span className="text-xs font-bold text-amber-600 bg-white/80 px-2 py-0.5 rounded-full border border-amber-200">
            {total > 0 ? ((amarillos / total) * 100).toFixed(0) : 0}%
          </span>
        </div>

        <div className="bg-red-50/70 p-3.5 rounded-xl border border-red-200 shadow-sm flex items-center justify-between border-t-4 border-t-red-500">
          <div>
            <span className="text-[11px] font-bold text-red-800 uppercase flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Rojos
            </span>
            <div className="text-2xl font-black text-red-700 mt-0.5">{rojos}</div>
          </div>
          <span className="text-[10px] font-extrabold text-red-700 bg-red-100 px-2 py-0.5 rounded-full border border-red-300 flex items-center gap-0.5">
            <AlertTriangle className="w-3 h-3" /> Alerta
          </span>
        </div>

        <div className="bg-purple-50/70 p-3.5 rounded-xl border border-purple-200 shadow-sm flex items-center justify-between border-t-4 border-t-purple-500">
          <div>
            <span className="text-[11px] font-bold text-purple-800 uppercase flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span> Morados
            </span>
            <div className="text-2xl font-black text-purple-700 mt-0.5">{morados}</div>
          </div>
          <span className="text-[10px] font-extrabold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full border border-purple-300 flex items-center gap-0.5">
            <Sparkles className="w-3 h-3" /> Podio
          </span>
        </div>
      </div>

      {/* 4. Tabla Matriz de Evaluación Cualitativa */}
      <div className="cato-card p-0 overflow-hidden shadow-card">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-cato-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-cato-navy flex items-center gap-2">
              <Users className="w-4 h-4 text-cato-steel" />
              Nómina de Voluntarios Asignados al Proyecto Receptor
            </h2>
            <span className="text-xs text-cato-muted">({voluntarios.length} evaluados)</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Morado (Destacado)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Verde (Normal)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Amarillo (Alerta)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Rojo (Riesgo)
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-xs text-cato-muted">
            Cargando nómina y semáforos del mes...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-slate-200 text-cato-navy font-bold">
                  <th className="py-3 px-4 min-w-[200px]">Voluntario / Carrera</th>
                  <th className="py-3 px-3 min-w-[130px]">Horario Comprometido</th>
                  <th className="py-3 px-3 text-center w-24">Horas Mes</th>
                  <th className="py-3 px-3 min-w-[200px]">Calificación Semáforo (RF-18)</th>
                  <th className="py-3 px-4 min-w-[280px]">
                    Justificación Obligatoria Pastoral (RF-19)
                  </th>
                  <th className="py-3 px-3 text-center w-32">Acción Alerta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {voluntarios.map((vol) => {
                  const esRojo = vol.colorSemaforo === 'Rojo';
                  const esMorado = vol.colorSemaforo === 'Morado';

                  return (
                    <tr
                      key={vol.idAsignacion}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        esRojo
                          ? 'bg-red-50/20'
                          : esMorado
                            ? 'bg-purple-50/20'
                            : ''
                      }`}
                    >
                      {/* Voluntario */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800 text-sm">
                          {vol.nombreCompleto}
                        </div>
                        <div className="text-[11px] text-cato-muted font-mono flex items-center gap-2 mt-0.5">
                          <span>{vol.ci}</span>
                          <span>•</span>
                          <span className="text-slate-600 font-sans">{vol.carrera}</span>
                        </div>
                        {vol.telefono && (
                          <a
                            href={`https://wa.me/591${vol.telefono.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold hover:underline mt-1"
                          >
                            <Phone className="w-3 h-3" /> {vol.telefono}
                          </a>
                        )}
                      </td>

                      {/* Horario */}
                      <td className="py-3 px-3 text-slate-600">
                        <div className="flex items-center gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{vol.horarioComprometido}</span>
                        </div>
                      </td>

                      {/* Horas */}
                      <td className="py-3 px-3 text-center">
                        <span className="font-extrabold text-cato-navy text-sm font-mono">
                          {vol.horasMesEstimadas} h
                        </span>
                      </td>

                      {/* Selector de Semáforo */}
                      <td className="py-3 px-3">
                        <div className="inline-flex p-1 rounded-lg bg-slate-100 border border-slate-200 gap-1">
                          {/* Morado */}
                          <button
                            type="button"
                            onClick={() => handleColorChange(vol.idAsignacion, 'Morado')}
                            className={`px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all ${
                              vol.colorSemaforo === 'Morado'
                                ? 'bg-purple-600 text-white shadow-sm ring-1 ring-purple-600'
                                : 'text-purple-700 hover:bg-purple-100'
                            }`}
                            title="Excelente — Postulación automática a podio y beca"
                          >
                            🟣 Morado
                          </button>

                          {/* Verde */}
                          <button
                            type="button"
                            onClick={() => handleColorChange(vol.idAsignacion, 'Verde')}
                            className={`px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all ${
                              vol.colorSemaforo === 'Verde'
                                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-600'
                                : 'text-emerald-700 hover:bg-emerald-100'
                            }`}
                            title="Normal — Asistencia y cumplimiento correcto"
                          >
                            🟢 Verde
                          </button>

                          {/* Amarillo */}
                          <button
                            type="button"
                            onClick={() => handleColorChange(vol.idAsignacion, 'Amarillo')}
                            className={`px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all ${
                              vol.colorSemaforo === 'Amarillo'
                                ? 'bg-amber-500 text-white shadow-sm ring-1 ring-amber-500'
                                : 'text-amber-700 hover:bg-amber-100'
                            }`}
                            title="Alerta — Atrasos o actitud observada"
                          >
                            🟡 Amarillo
                          </button>

                          {/* Rojo */}
                          <button
                            type="button"
                            onClick={() => handleColorChange(vol.idAsignacion, 'Rojo')}
                            className={`px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all ${
                              vol.colorSemaforo === 'Rojo'
                                ? 'bg-red-600 text-white shadow-sm ring-1 ring-red-600'
                                : 'text-red-700 hover:bg-red-100'
                            }`}
                            title="Riesgo crítico o abandono"
                          >
                            🔴 Rojo
                          </button>
                        </div>
                      </td>

                      {/* Justificación obligatoria */}
                      <td className="py-3 px-4">
                        <textarea
                          rows={2}
                          value={vol.observacionesDesempeno}
                          onChange={(e) =>
                            handleObservacionChange(vol.idAsignacion, e.target.value)
                          }
                          placeholder="Redactar justificativo del semáforo asignado (Obligatorio Pastoral)..."
                          className={`w-full text-xs p-2 rounded-lg border transition-all resize-y ${
                            !vol.observacionesDesempeno.trim()
                              ? 'border-red-300 bg-red-50/30 focus:border-red-500 focus:bg-white'
                              : 'border-slate-300 bg-white focus:border-cato-navy'
                          }`}
                        />
                        {!vol.observacionesDesempeno.trim() && (
                          <span className="text-[10px] text-red-600 font-semibold block mt-0.5">
                            * Justificación requerida
                          </span>
                        )}
                      </td>

                      {/* Notificar Abandono */}
                      <td className="py-3 px-3 text-center">
                        <label className="inline-flex flex-col items-center cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={vol.notificarAbandono}
                            onChange={() => handleToggleAbandono(vol.idAsignacion)}
                            className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                          />
                          <span
                            className={`text-[10px] mt-1 font-bold ${
                              vol.notificarAbandono ? 'text-red-600' : 'text-slate-400'
                            }`}
                          >
                            {vol.notificarAbandono ? 'Alerta Pastoral' : 'Sin alerta'}
                          </span>
                        </label>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer de la tabla */}
        <div className="p-4 bg-slate-50 border-t border-cato-border flex flex-col sm:flex-row items-center justify-between text-xs text-cato-muted gap-2">
          <div>
            Mostrando <strong>{voluntarios.length} voluntarios</strong> registrados para el periodo{' '}
            <strong>{mesSeleccionado} 2026</strong>.
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-cato-navy">
              Normativa Pastoral UCB:
            </span>
            <span>Los semáforos morados clasifican directamente para el ranking RF-22 de premiaciones.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
