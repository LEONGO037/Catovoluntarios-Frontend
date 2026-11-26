import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { postulacionesApi } from '../../../services/postulaciones.service';
import { NotificationModal } from '../../../components/feedback/NotificationModal';
import { useActiveSemester } from '../../../components/layout/active-semester';
import {
  Users,
  RotateCcw,
  Search,
  Check,
  AlertTriangle,
  Award,
  Briefcase,
  UserPlus,
  UserMinus,
  Mail,
  Loader2,
} from 'lucide-react';

interface CatoliderVigente {
  id: number;
  nombres: string;
  primerApellido: string;
  email: string;
  ci: string;
  modalidadLiderazgo?: string;
  semestreLiderazgo?: string;
  esCatoliderVigente: boolean;
}

interface VoluntarioElegible {
  id: number;
  nombres: string;
  primerApellido: string;
  ci: string;
  carrera?: string;
  email?: string;
}

export const SeleccionCatolideres: React.FC = () => {
  const activeSemester = useActiveSemester();
  const [modalResetAbierto, setModalResetAbierto] = useState(false);
  const [semestreReset, setSemestreReset] = useState('1/2026');
  const [reseteando, setReseteando] = useState(false);

  const [liderARevocar, setLiderARevocar] = useState<CatoliderVigente | null>(null);
  const [revocando, setRevocando] = useState(false);

  const [voluntariosElegibles, setVoluntariosElegibles] = useState<VoluntarioElegible[]>([]);
  const [catolideresVigentes, setCatolideresVigentes] = useState<CatoliderVigente[]>([]);
  const [cargando, setCargando] = useState(false);

  // Filtros de búsqueda y modalidad
  const [busquedaCandidato, setBusquedaCandidato] = useState('');
  const [busquedaLider, setBusquedaLider] = useState('');
  const [filtroModalidad, setFiltroModalidad] = useState<'TODOS' | 'CAMPO' | 'GESTION'>('TODOS');

  // Formulario de asignación
  const [voluntarioId, setVoluntarioId] = useState<number>(0);
  const [modalidad, setModalidad] = useState('Catolíder y Voluntario de Campo');
  const [catoliderTipo, setCatoliderTipo] = useState('Titular');
  const [semestre, setSemestre] = useState(activeSemester || '2/2026');
  const [asignando, setAsignando] = useState(false);

  // Notificación amigable
  const [notificacion, setNotificacion] = useState<{
    abierto: boolean;
    tipo: 'success' | 'error' | 'warning' | 'info';
    titulo: string;
    mensaje: string;
  }>({
    abierto: false,
    tipo: 'info',
    titulo: '',
    mensaje: '',
  });

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    try {
      const [elegibles, vigentes] = await Promise.all([
        postulacionesApi.obtenerVoluntariosElegibles(),
        postulacionesApi.obtenerCatolideresVigentes('ADMIN_PASTORAL', activeSemester),
      ]);
      setVoluntariosElegibles(elegibles);
      setCatolideresVigentes(vigentes);
      setVoluntarioId((prevId) => {
        const existe = elegibles.some((e: VoluntarioElegible) => e.id === prevId);
        if (existe) return prevId;
        return elegibles.length > 0 ? elegibles[0].id : 0;
      });
    } catch {
      setCatolideresVigentes([]);
      setVoluntariosElegibles([]);
    } finally {
      setCargando(false);
    }
  }, [activeSemester]);

  useEffect(() => {
    setSemestre(activeSemester);
    cargarDatos();
  }, [activeSemester, cargarDatos]);

  const candidatosFiltrados = useMemo(() => {
    if (!busquedaCandidato.trim()) return voluntariosElegibles;
    const query = busquedaCandidato.toLowerCase();
    return voluntariosElegibles.filter(
      (v) =>
        v.nombres.toLowerCase().includes(query) ||
        v.primerApellido.toLowerCase().includes(query) ||
        v.ci.toLowerCase().includes(query) ||
        (v.carrera && v.carrera.toLowerCase().includes(query)),
    );
  }, [voluntariosElegibles, busquedaCandidato]);

  const lideresFiltrados = useMemo(() => {
    return catolideresVigentes.filter((l) => {
      const texto = `${l.nombres} ${l.primerApellido} ${l.email}`.toLowerCase();
      const coincideTexto = !busquedaLider.trim() || texto.includes(busquedaLider.toLowerCase());
      const mod = (l.modalidadLiderazgo || '').toLowerCase();
      const coincideModalidad =
        filtroModalidad === 'TODOS' ||
        (filtroModalidad === 'CAMPO' && mod.includes('campo')) ||
        (filtroModalidad === 'GESTION' && mod.includes('gestión'));
      return coincideTexto && coincideModalidad;
    });
  }, [catolideresVigentes, busquedaLider, filtroModalidad]);

  const handleEjecutarReset = async () => {
    setReseteando(true);
    try {
      const res = await postulacionesApi.resetCatolideres(semestreReset);
      setModalResetAbierto(false);
      setNotificacion({
        abierto: true,
        tipo: 'success',
        titulo: 'Reinicio Semestral Exitoso',
        mensaje: res.message || 'Los roles del semestre indicado han sido restablecidos.',
      });
      await cargarDatos();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al resetear';
      setNotificacion({
        abierto: true,
        tipo: 'error',
        titulo: 'Error de Reinicio',
        mensaje: `No se pudo restablecer los liderazgos: ${msg}`,
      });
    } finally {
      setReseteando(false);
    }
  };

  const handleConfirmarRevocacion = async () => {
    if (!liderARevocar) return;
    setRevocando(true);
    try {
      const res = await postulacionesApi.revocarCatolider(liderARevocar.id);
      setLiderARevocar(null);
      setNotificacion({
        abierto: true,
        tipo: 'success',
        titulo: 'Liderazgo Revocado',
        mensaje: res.message,
      });
      await cargarDatos();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al revocar liderazgo';
      setNotificacion({
        abierto: true,
        tipo: 'error',
        titulo: 'No se pudo revocar',
        mensaje: msg,
      });
    } finally {
      setRevocando(false);
    }
  };

  const handleAsignar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voluntarioId) {
      setNotificacion({
        abierto: true,
        tipo: 'warning',
        titulo: 'Selección Requerida',
        mensaje: 'Por favor, selecciona un voluntario candidato de la lista.',
      });
      return;
    }
    setAsignando(true);
    try {
      await postulacionesApi.asignarCatolider({
        voluntarioId,
        modalidadLiderazgo: modalidad,
        semestre,
        catoliderTipo,
      });
      setNotificacion({
        abierto: true,
        tipo: 'success',
        titulo: 'Designación Confirmada',
        mensaje: 'El voluntario ha sido designado exitosamente como Catolíder para este semestre.',
      });
      await cargarDatos();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al asignar';
      setNotificacion({
        abierto: true,
        tipo: 'error',
        titulo: 'Error de Asignación',
        mensaje: `No se pudo asignar el liderazgo: ${msg}`,
      });
    } finally {
      setAsignando(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado Institucional con Jerarquía Refinada */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-cato-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-cato-gold bg-cato-navy px-3 py-0.5 rounded-full uppercase tracking-wider">
              Liderazgo Pastoral
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Gestión Semestral {activeSemester}
            </span>
          </div>
          <h1 className="text-2xl font-black text-cato-navy mt-1.5 tracking-tight">
            Selección y Asignación Semestral de Catolíderes
          </h1>
          <p className="text-xs text-cato-muted mt-0.5">
            Designa coordinadores para la gestión activa y administra sus permisos de consulta de forma individual o semestral.
          </p>
        </div>

        {/* Botón Secundario Discreto de Reseteo Semestral */}
        <button
          type="button"
          onClick={() => setModalResetAbierto(true)}
          className="px-3.5 py-2 rounded-xl bg-white border border-rose-200 hover:bg-rose-50 hover:border-rose-300 text-rose-700 font-bold text-xs inline-flex items-center gap-2 shadow-2xs transition-all self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
          <span>Reiniciar Liderazgos Semestre Anterior</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Panel Izquierdo: Flujo de Designación en 3 Pasos (4/12 columnas) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-cato-border p-5 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-cato-navy/10 text-cato-navy flex items-center justify-center">
                <UserPlus className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-cato-navy leading-tight">
                  Asignar Nuevo Catolíder
                </h2>
                <p className="text-[11px] text-slate-400">
                  Designación para gestión {activeSemester}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {voluntariosElegibles.length} disponibles
            </span>
          </div>

          <form onSubmit={handleAsignar} className="space-y-5 text-xs">
            {/* Paso 1: Voluntario Candidato */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-cato-slate uppercase text-[11px] tracking-wide">
                  1. Seleccionar Voluntario *
                </label>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={busquedaCandidato}
                  onChange={(e) => setBusquedaCandidato(e.target.value)}
                  placeholder="Buscar por nombre, carnet o carrera..."
                  className="cato-input pl-8 py-2 text-xs bg-slate-50/70 focus:bg-white"
                />
              </div>

              <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 border border-slate-200/80 rounded-xl p-2 bg-slate-50/40">
                {candidatosFiltrados.length === 0 ? (
                  <p className="text-slate-400 text-center py-6 text-xs italic">
                    No hay voluntarios elegibles disponibles.
                  </p>
                ) : (
                  candidatosFiltrados.map((v) => {
                    const seleccionado = voluntarioId === v.id;
                    const iniciales = `${v.nombres[0] || ''}${v.primerApellido[0] || ''}`.toUpperCase();
                    return (
                      <div
                        key={v.id}
                        onClick={() => setVoluntarioId(v.id)}
                        className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          seleccionado
                            ? 'bg-cato-navy text-white border-cato-navy shadow-sm'
                            : 'bg-white hover:bg-slate-50 hover:border-slate-300 border-slate-200/80 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-lg font-extrabold text-xs flex items-center justify-center shrink-0 ${
                              seleccionado
                                ? 'bg-cato-gold text-cato-navy'
                                : 'bg-slate-100 text-cato-navy border border-slate-200'
                            }`}
                          >
                            {iniciales}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-xs leading-tight truncate">
                              {v.nombres} {v.primerApellido}
                            </div>
                            <div
                              className={`text-[10px] truncate mt-0.5 ${
                                seleccionado ? 'text-blue-100' : 'text-slate-400'
                              }`}
                            >
                              CI: {v.ci} {v.carrera ? `• ${v.carrera}` : ''}
                            </div>
                          </div>
                        </div>

                        {seleccionado && (
                          <div className="w-5 h-5 rounded-full bg-cato-gold text-cato-navy flex items-center justify-center shrink-0 ml-2">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Paso 2: Modalidad */}
            <div className="space-y-2">
              <label className="block font-bold text-cato-slate uppercase text-[11px] tracking-wide">
                2. Modalidad de Liderazgo *
              </label>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => setModalidad('Catolíder y Voluntario de Campo')}
                  className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    modalidad === 'Catolíder y Voluntario de Campo'
                      ? 'border-cato-navy bg-blue-50/70 ring-1 ring-cato-navy/30'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                      modalidad === 'Catolíder y Voluntario de Campo'
                        ? 'bg-cato-navy text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-cato-navy block">
                      Catolíder y Voluntario de Campo
                    </span>
                    <span className="text-[11px] text-slate-500 leading-snug block mt-0.5">
                      Coordina el equipo y participa presencialmente en el centro receptor.
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setModalidad('Solo Catolíder de Gestión')}
                  className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    modalidad === 'Solo Catolíder de Gestión'
                      ? 'border-cato-navy bg-blue-50/70 ring-1 ring-cato-navy/30'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                      modalidad === 'Solo Catolíder de Gestión'
                        ? 'bg-cato-navy text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-cato-navy block">
                      Solo Catolíder de Gestión
                    </span>
                    <span className="text-[11px] text-slate-500 leading-snug block mt-0.5">
                      Supervisa logística, planificación operativa y enlace con Pastoral.
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Paso 3: Tipo Segmentado y Vigencia */}
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-cato-slate uppercase text-[11px] tracking-wide mb-1.5">
                  3. Tipo de Designación *
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
                  {['Titular', 'Aprendiz / Co-líder'].map((tipo) => (
                    <button
                      key={tipo}
                      type="button"
                      onClick={() => setCatoliderTipo(tipo)}
                      className={`py-2 px-2.5 rounded-lg text-[11px] font-bold transition-all ${
                        catoliderTipo === tipo
                          ? 'bg-white text-cato-navy shadow-2xs border border-slate-200/60'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {tipo}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-cato-slate uppercase text-[11px] tracking-wide mb-1">
                  Semestre de Vigencia *
                </label>
                <input
                  type="text"
                  value={semestre}
                  onChange={(e) => setSemestre(e.target.value)}
                  placeholder="2/2026"
                  className="cato-input text-xs font-mono font-semibold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={asignando || !voluntarioId}
              className="w-full btn-primary text-xs py-3 rounded-xl font-bold shadow-sm disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {asignando ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Designando liderazgo...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Confirmar Designación</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Panel Derecho: Directorio Moderno de Catolíderes Activos (8/12 columnas) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-cato-border shadow-xs overflow-hidden flex flex-col">
          {/* Barra Superior del Directorio */}
          <div className="p-4 sm:p-5 bg-slate-50/70 border-b border-cato-border space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-cato-navy">
                    Catolíderes Activos ({catolideresVigentes.length})
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Equipo habilitado para consulta de postulaciones en el semestre {activeSemester}
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Vigencia {activeSemester}
              </span>
            </div>

            {/* Buscador + Filtro Rápido por Modalidad */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={busquedaLider}
                  onChange={(e) => setBusquedaLider(e.target.value)}
                  placeholder="Filtrar líderes por nombre o correo..."
                  className="cato-input pl-8 py-1.5 text-xs bg-white"
                />
              </div>
              <div className="inline-flex p-1 bg-slate-200/60 rounded-xl border border-slate-200 text-[11px] font-bold self-start">
                {[
                  { id: 'TODOS', label: 'Todos' },
                  { id: 'CAMPO', label: 'De Campo' },
                  { id: 'GESTION', label: 'De Gestión' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFiltroModalidad(tab.id as 'TODOS' | 'CAMPO' | 'GESTION')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      filtroModalidad === tab.id
                        ? 'bg-white text-cato-navy shadow-2xs'
                        : 'text-slate-600 hover:text-cato-navy'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tabla / Lista Enriquecida */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-cato-border bg-slate-50/50 text-slate-500 font-bold text-[10px] uppercase tracking-wider">
                  <th className="py-3 px-5">Catolíder</th>
                  <th className="py-3 px-4">Modalidad</th>
                  <th className="py-3 px-4">Vigencia</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {cargando ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-cato-navy" />
                      Cargando equipo de Catolíderes...
                    </td>
                  </tr>
                ) : lideresFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      {catolideresVigentes.length === 0
                        ? `No hay Catolíderes asignados para el semestre ${activeSemester}.`
                        : 'Ningún Catolíder coincide con el filtro de búsqueda.'}
                    </td>
                  </tr>
                ) : (
                  lideresFiltrados.map((lider) => {
                    const iniciales = `${lider.nombres?.[0] || ''}${lider.primerApellido?.[0] || ''}`.toUpperCase();
                    const esCampo = (lider.modalidadLiderazgo || '').toLowerCase().includes('campo');
                    return (
                      <tr key={lider.id} className="hover:bg-blue-50/25 transition-colors group">
                        <td className="py-4 px-5 align-middle">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-cato-navy text-cato-gold font-extrabold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                              {iniciales}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 text-[13px]">
                                {lider.nombres} {lider.primerApellido}
                              </div>
                              <a
                                href={`mailto:${lider.email}`}
                                className="text-[11px] text-slate-500 hover:text-cato-navy inline-flex items-center gap-1 mt-0.5"
                              >
                                <Mail className="w-3 h-3 text-slate-400" />
                                {lider.email}
                              </a>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 align-middle">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
                              esCampo
                                ? 'bg-blue-50 text-cato-navy border-blue-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {esCampo ? (
                              <Users className="w-3 h-3 text-blue-600" />
                            ) : (
                              <Briefcase className="w-3 h-3 text-slate-500" />
                            )}
                            {lider.modalidadLiderazgo || 'Catolíder Estándar'}
                          </span>
                        </td>

                        <td className="py-4 px-4 align-middle">
                          <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                            {lider.semestreLiderazgo || activeSemester}
                          </span>
                        </td>

                        <td className="py-4 px-4 align-middle">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Activo
                          </span>
                        </td>

                        <td className="py-4 px-5 align-middle text-right">
                          <button
                            type="button"
                            onClick={() => setLiderARevocar(lider)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold text-rose-600 bg-white border border-rose-200 hover:bg-rose-50 hover:border-rose-300 transition-colors shadow-2xs"
                            title="Retirar liderazgo y volver a Voluntario"
                          >
                            <UserMinus className="w-3.5 h-3.5" />
                            Revocar
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación de Revocación Individual */}
      {liderARevocar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
              <UserMinus className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-center text-cato-navy">
              ¿Revocar liderazgo a {liderARevocar.nombres} {liderARevocar.primerApellido}?
            </h3>
            <p className="text-xs text-slate-600 mt-2 text-center leading-relaxed">
              Esta persona volverá al rol de <strong>Voluntario</strong>, dejará de tener acceso de consulta a la Bandeja de Postulantes y quedará disponible nuevamente en la lista de candidatos.
            </p>

            <div className="mt-6 flex flex-col gap-2">
              <button
                type="button"
                disabled={revocando}
                onClick={handleConfirmarRevocacion}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors disabled:opacity-50 shadow-xs"
              >
                {revocando ? 'Revocando liderazgo...' : 'Sí, Revocar Liderazgo'}
              </button>
              <button
                type="button"
                onClick={() => setLiderARevocar(null)}
                className="w-full py-2 px-4 rounded-xl border border-slate-300 text-slate-600 text-xs font-semibold hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Reseteo Semestral */}
      {modalResetAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-200 animate-in zoom-in-95 duration-150">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-center text-cato-navy">
              ¿Reiniciar Roles de Liderazgo del Semestre Anterior?
            </h3>
            <p className="text-xs text-slate-600 mt-2 text-center leading-relaxed">
              Esta acción revertirá a los Catolíderes del semestre anterior al rol estándar de <strong>Catovoluntario</strong> para que nadie conserve privilegios de consulta sin la debida reasignación por Pastoral UCB.
            </p>

            <div className="mt-4">
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Indicar Semestre a Restablecer:
              </label>
              <input
                type="text"
                value={semestreReset}
                onChange={(e) => setSemestreReset(e.target.value)}
                placeholder="1/2026"
                className="cato-input text-xs"
              />
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <button
                type="button"
                disabled={reseteando}
                onClick={handleEjecutarReset}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors disabled:opacity-50 shadow-xs"
              >
                {reseteando ? 'Restableciendo liderazgos...' : 'Sí, Reiniciar Roles de Liderazgo'}
              </button>
              <button
                type="button"
                onClick={() => setModalResetAbierto(false)}
                className="w-full py-2 px-4 rounded-xl border border-slate-300 text-slate-600 text-xs font-semibold hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Notificación */}
      <NotificationModal
        abierto={notificacion.abierto}
        tipo={notificacion.tipo}
        titulo={notificacion.titulo}
        mensaje={notificacion.mensaje}
        onCerrar={() => setNotificacion((prev) => ({ ...prev, abierto: false }))}
      />
    </div>
  );
};
