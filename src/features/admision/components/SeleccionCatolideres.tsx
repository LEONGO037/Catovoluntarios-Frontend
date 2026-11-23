import React, { useState, useEffect, useMemo } from 'react';
import { postulacionesApi } from '../../../services/postulaciones.service';
import { NotificationModal } from '../../../components/feedback/NotificationModal';
import {
  Users,
  RotateCcw,
  Search,
  Check,
  AlertTriangle,
  Award,
  Briefcase,
  UserPlus,
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
  const [modalResetAbierto, setModalResetAbierto] = useState(false);
  const [semestreReset, setSemestreReset] = useState('1/2026');
  const [reseteando, setReseteando] = useState(false);

  const [voluntariosElegibles, setVoluntariosElegibles] = useState<VoluntarioElegible[]>([]);
  const [catolideresVigentes, setCatolideresVigentes] = useState<CatoliderVigente[]>([]);
  const [cargando, setCargando] = useState(false);

  // Filtro de búsqueda para selección de candidatos
  const [busquedaCandidato, setBusquedaCandidato] = useState('');

  // Formulario de asignación
  const [voluntarioId, setVoluntarioId] = useState<number>(0);
  const [modalidad, setModalidad] = useState('Catolíder y Voluntario de Campo');
  const [catoliderTipo, setCatoliderTipo] = useState('Titular');
  const [semestre, setSemestre] = useState('2/2026');
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

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [elegibles, vigentes] = await Promise.all([
        postulacionesApi.obtenerVoluntariosElegibles(),
        postulacionesApi.obtenerCatolideresVigentes(),
      ]);
      setVoluntariosElegibles(elegibles);
      setCatolideresVigentes(vigentes);
      if (elegibles.length > 0 && !voluntarioId) {
        setVoluntarioId(elegibles[0].id);
      }
    } catch {
      setCatolideresVigentes([]);
      setVoluntariosElegibles([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

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
        titulo: 'Asignación Confirmada',
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
      {/* Encabezado Institucional */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-cato-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cato-gold bg-cato-navy px-3 py-1 rounded-full uppercase tracking-wider">
              Liderazgo Pastoral
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Gestión Semestral 2/2026
            </span>
          </div>
          <h1 className="text-2xl font-black text-cato-navy mt-1 tracking-tight">
            Selección y Asignación Semestral de Catolíderes
          </h1>
          <p className="text-xs text-cato-muted">
            Cada semestre los líderes se renuevan. Restablece los privilegios anteriores y asigna a los nuevos coordinadores confirmados.
          </p>
        </div>

        {/* Botón de Reseteo Semestral */}
        <button
          type="button"
          onClick={() => setModalResetAbierto(true)}
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs inline-flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reiniciar Liderazgos Semestre Anterior</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario de Alta de Catolíder con Selector Visual */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-cato-border p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <UserPlus className="w-5 h-5 text-cato-navy" />
            <h2 className="text-sm font-bold text-cato-navy uppercase tracking-wider">
              Asignar Nuevo Catolíder
            </h2>
          </div>

          <form onSubmit={handleAsignar} className="space-y-4 text-xs">
            {/* Buscador y Selector de Tarjetas de Candidato */}
            <div className="space-y-2">
              <label className="block font-bold text-cato-slate uppercase text-[11px]">
                Voluntario Candidato (Nivel Destacado / Pro) *
              </label>

              {/* Input de filtro */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={busquedaCandidato}
                  onChange={(e) => setBusquedaCandidato(e.target.value)}
                  placeholder="Buscar por nombre o carnet..."
                  className="cato-input pl-8 py-1.5 text-xs"
                />
              </div>

              {/* Lista Seleccionable de Candidatos */}
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1 border border-slate-200 rounded-xl p-2 bg-slate-50/50">
                {candidatosFiltrados.length === 0 ? (
                  <p className="text-slate-400 text-center py-4 text-xs italic">
                    No se encontraron voluntarios elegibles.
                  </p>
                ) : (
                  candidatosFiltrados.map((v) => {
                    const seleccionado = voluntarioId === v.id;
                    const iniciales = `${v.nombres[0] || ''}${v.primerApellido[0] || ''}`;
                    return (
                      <div
                        key={v.id}
                        onClick={() => setVoluntarioId(v.id)}
                        className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          seleccionado
                            ? 'bg-cato-navy text-white border-cato-navy shadow-xs'
                            : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center ${
                              seleccionado
                                ? 'bg-cato-gold text-cato-navy'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {iniciales}
                          </div>
                          <div>
                            <div className="font-bold text-xs leading-tight">
                              {v.nombres} {v.primerApellido}
                            </div>
                            <div
                              className={`text-[10px] ${
                                seleccionado ? 'text-slate-200' : 'text-slate-400'
                              }`}
                            >
                              CI: {v.ci} {v.carrera ? `• ${v.carrera}` : ''}
                            </div>
                          </div>
                        </div>

                        {seleccionado && (
                          <div className="w-5 h-5 rounded-full bg-cato-gold text-cato-navy flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5 font-bold" />
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Modalidad de Liderazgo (Tarjetas visuales) */}
            <div className="space-y-2">
              <label className="block font-bold text-cato-slate uppercase text-[11px]">
                Modalidad de Liderazgo *
              </label>
              <div className="grid grid-cols-1 gap-2">
                <div
                  onClick={() => setModalidad('Catolíder y Voluntario de Campo')}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                    modalidad === 'Catolíder y Voluntario de Campo'
                      ? 'border-cato-navy bg-blue-50/70 shadow-2xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <Users className="w-4 h-4 text-cato-navy shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-xs text-cato-navy block">
                      Catolíder y Voluntario de Campo
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Coordina el equipo pastoral y asiste a las actividades presenciales en el centro receptor.
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => setModalidad('Solo Catolíder de Gestión')}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                    modalidad === 'Solo Catolíder de Gestión'
                      ? 'border-cato-navy bg-blue-50/70 shadow-2xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-cato-navy shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-xs text-cato-navy block">
                      Solo Catolíder de Gestión
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Supervisa la planificación operativa, seguimiento logístico y vinculación con Pastoral.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tipo y Semestre */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-cato-slate uppercase text-[11px] mb-1">
                  Tipo *
                </label>
                <select
                  value={catoliderTipo}
                  onChange={(e) => setCatoliderTipo(e.target.value)}
                  className="cato-input bg-white text-xs font-medium"
                >
                  <option value="Titular">Titular</option>
                  <option value="Aprendiz / Co-líder">Aprendiz / Co-líder</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-cato-slate uppercase text-[11px] mb-1">
                  Semestre *
                </label>
                <input
                  type="text"
                  value={semestre}
                  onChange={(e) => setSemestre(e.target.value)}
                  placeholder="2/2026"
                  className="cato-input text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={asignando || !voluntarioId}
              className="w-full btn-primary text-xs py-2.5 font-bold shadow-xs disabled:opacity-50 inline-flex items-center justify-center gap-2 mt-2"
            >
              {asignando ? (
                'Asignando liderazgo...'
              ) : (
                <>
                  <Check className="w-4 h-4" /> Confirmar Rol de Catolíder
                </>
              )}
            </button>
          </form>
        </div>

        {/* Tabla de Catolíderes Vigentes del Semestre */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-cato-border shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 bg-cato-surface-header border-b border-cato-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-cato-gold" />
              <h2 className="text-sm font-bold text-cato-navy uppercase tracking-wider">
                Catolíderes Activos del Semestre ({catolideresVigentes.length})
              </h2>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full border border-emerald-200">
              Vigencia Semestre 2/2026
            </span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-cato-border bg-slate-50 text-cato-slate font-bold text-[11px] uppercase">
                  <th className="py-3 px-4">Líder</th>
                  <th className="py-3 px-4">Modalidad</th>
                  <th className="py-3 px-4">Semestre</th>
                  <th className="py-3 px-4">Permiso Consulta</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {cargando ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-400">
                      Cargando Catolíderes del semestre...
                    </td>
                  </tr>
                ) : catolideresVigentes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-400">
                      No hay Catolíderes asignados para este semestre aún.
                    </td>
                  </tr>
                ) : (
                  catolideresVigentes.map((lider) => (
                    <tr key={lider.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">
                          {lider.nombres} {lider.primerApellido}
                        </div>
                        <div className="text-[11px] text-slate-400">{lider.email}</div>
                      </td>
                      <td className="py-3 px-4 text-cato-slate font-medium">
                        {lider.modalidadLiderazgo || 'Catolíder Estándar'}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold">
                        {lider.semestreLiderazgo || '2/2026'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-emerald-700 font-semibold text-[11px] inline-flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          Acceso a Revisión de Postulantes
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="badge-role-catolider">
                          Activo
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

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
