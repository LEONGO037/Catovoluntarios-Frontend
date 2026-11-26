/* oxlint-disable react/set-state-in-effect */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Trophy,
  Medal,
  Award,
  Star,
  Sparkles,
  CheckCircle2,
  PlusCircle,
  Search,
  Building2,
  Clock,
  X,
  Loader2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';
import { useActiveSemester } from '../../../components/layout/active-semester';
import { Button } from '../../../components/ui/Button';
import { semaforosService } from '../../semaforos/services/semaforos.service';
import type { VoluntarioRanking } from '../../semaforos/types/semaforo.types';

interface VoluntarioPodioView {
  id: number;
  posicion: number;
  nombre: string;
  carrera: string;
  proyecto: string;
  horasSemestre: number;
  puntaje: number;
  semaforo: string;
  premios: string[];
}

export const PodioExcelenciaPage: React.FC = () => {
  const { user } = useAuth();
  const semestreActivo = useActiveSemester();
  const canAward = user?.rol === 'ADMIN_PASTORAL' || user?.rol === 'CATOLIDER';
  const isVoluntario = user?.rol === 'VOLUNTARIO';

  const [ranking, setRanking] = useState<VoluntarioPodioView[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [busqueda, setBusqueda] = useState('');
  const [showPremioModal, setShowPremioModal] = useState(false);
  const [selectedVol, setSelectedVol] = useState<VoluntarioPodioView | null>(null);
  const [nuevoPremio, setNuevoPremio] = useState(`Catovoluntario Destacado ${semestreActivo}`);
  const [categoriaPremio, setCategoriaPremio] = useState('Liderazgo Solidario');
  const [descripcionPremio, setDescripcionPremio] = useState('');
  const [guardandoPremio, setGuardandoPremio] = useState(false);
  const [toast, setToast] = useState<{ tipo: 'success' | 'error'; mensaje: string } | null>(null);

  const cargarRanking = useCallback(async () => {
    setCargando(true);
    try {
      // 1. Obtener ranking calculado por algoritmo RF-22
      const dataRanking = await semaforosService.obtenerRankingDestacados(semestreActivo);
      // 2. Obtener Base Madre para asociar los premios históricos
      const dataBaseMadre = await semaforosService.obtenerBaseMadre({ semestre: semestreActivo });

      const premiosMap = new Map<number, string[]>();
      dataBaseMadre.voluntarios.forEach((v) => {
        const nombresPremios = (v.premios || []).map((p) => p.nombrePremio);
        premiosMap.set(v.id, nombresPremios);
      });

      const listaFormateada: VoluntarioPodioView[] = dataRanking.rankingCompleto.map((item: VoluntarioRanking) => {
        const misPremios = premiosMap.get(item.idUsuario) || [];
        return {
          id: item.idUsuario,
          posicion: item.posicion,
          nombre: item.nombreCompleto,
          carrera: item.carrera,
          proyecto: item.proyecto,
          horasSemestre: item.horasSemestre,
          puntaje: item.score,
          semaforo: item.semaforosMorados > 0 ? 'MORADO' : 'VERDE',
          premios: misPremios,
        };
      });

      setRanking(listaFormateada);
    } catch (err) {
      console.error('Error al cargar ranking de excelencia:', err);
      setToast({
        tipo: 'error',
        mensaje: 'No se pudo conectar con el servidor para obtener el podio de honor.',
      });
    } finally {
      setCargando(false);
    }
  }, [semestreActivo]);

  useEffect(() => {
    void cargarRanking();
  }, [cargarRanking]);

  const miRegistro = ranking.find(
    (v) =>
      v.id === user?.id ||
      v.nombre.toLowerCase().includes((user?.nombres || '').toLowerCase()),
  );

  const filtered = ranking.filter(
    (v) =>
      v.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      v.proyecto.toLowerCase().includes(busqueda.toLowerCase()) ||
      v.carrera.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const top3 = ranking.slice(0, 3);

  const handleOtorgarPremio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVol || !nuevoPremio.trim()) return;

    setGuardandoPremio(true);
    try {
      await semaforosService.crearPremio({
        idUsuario: selectedVol.id,
        semestre: semestreActivo,
        nombrePremio: nuevoPremio.trim(),
        categoria: categoriaPremio,
        descripcion:
          descripcionPremio.trim() ||
          `Distinción concedida por excelencia, compromiso y vocación pastoral durante la gestión ${semestreActivo}.`,
      });

      setToast({
        tipo: 'success',
        mensaje: `¡Reconocimiento "${nuevoPremio}" otorgado exitosamente a ${selectedVol.nombre}! Se envió una notificación a su portal.`,
      });
      setShowPremioModal(false);
      setDescripcionPremio('');
      setTimeout(() => setToast(null), 5000);
      void cargarRanking();
    } catch (err: any) {
      console.error('Error otorgando reconocimiento:', err);
      setToast({
        tipo: 'error',
        mensaje: err.message || 'Error al persistir el reconocimiento en la base de datos.',
      });
    } finally {
      setGuardandoPremio(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200 inline-flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              Reconocimiento Pastoral UCB · Gestión {semestreActivo}
            </span>
            <button
              onClick={() => void cargarRanking()}
              className="p-1 text-cato-muted hover:text-cato-navy rounded-lg hover:bg-slate-100 transition-colors"
              title="Recargar ranking"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${cargando ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-cato-navy mt-2">
            {canAward ? 'Podio y Premiación de Catovoluntarios' : 'Podio de Excelencia'}
          </h1>
          <p className="text-sm text-cato-muted mt-0.5">
            {canAward
              ? 'Visualiza el ranking de excelencia calculado por el algoritmo oficial RF-22 y otorga distinciones a los voluntarios destacados.'
              : 'Consulta el cuadro de honor semestral y verifica tu posición en el Podio de Excelencia.'}
          </p>
        </div>
      </div>

      {toast && (
        <div
          className={`px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold shadow-sm ${
            toast.tipo === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {toast.tipo === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{toast.mensaje}</span>
        </div>
      )}

      {/* Banner Personalizado para Catovoluntario */}
      {isVoluntario && miRegistro && (
        <div className="bg-gradient-to-r from-cato-navy via-cato-navy-dark to-[#001830] text-white rounded-2xl p-6 shadow-lg border border-cato-gold/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cato-gold text-cato-navy flex items-center justify-center font-black text-2xl shadow-md shrink-0">
              #{miRegistro.posicion}
            </div>
            <div>
              <span className="text-[11px] uppercase font-bold tracking-wider text-cato-gold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {miRegistro.posicion <= 3
                  ? '¡Felicidades! Estás en el Podio de Excelencia'
                  : 'Tu posición actual en el Ranking'}
              </span>
              <h2 className="text-lg sm:text-xl font-black mt-0.5">{miRegistro.nombre}</h2>
              <p className="text-xs text-blue-200 mt-0.5">
                {miRegistro.proyecto} · {miRegistro.horasSemestre} hrs acumuladas · Puntaje:{' '}
                <strong className="text-cato-gold">{miRegistro.puntaje} pts</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {miRegistro.premios.length > 0 ? (
              miRegistro.premios.map((p, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 bg-white/15 border border-cato-gold/40 text-cato-gold text-xs font-bold px-3 py-1.5 rounded-xl"
                >
                  <Award className="w-4 h-4" />
                  {p}
                </span>
              ))
            ) : (
              <span className="text-xs text-blue-200 italic">Sigue sumando horas en campo para obtener medallas</span>
            )}
          </div>
        </div>
      )}

      {cargando ? (
        <div className="bg-white rounded-2xl border border-cato-border p-12 text-center shadow-card">
          <Loader2 className="w-8 h-8 text-cato-gold animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-cato-navy">Calculando ranking ponderado RF-22 con base de datos...</p>
        </div>
      ) : ranking.length === 0 ? (
        <div className="bg-white rounded-2xl border border-cato-border p-12 text-center shadow-card">
          <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-cato-navy">No se registran asistencias para el semestre {semestreActivo}</h3>
          <p className="text-xs text-cato-muted mt-1 max-w-md mx-auto">
            El ranking se alimentará automáticamente a medida que los Catolíderes registren horas y semáforos cualitativos.
          </p>
        </div>
      ) : (
        <>
          {/* Podio Visual Top 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
            {/* Puesto 2 - Plata */}
            {top3[1] && (
              <div className="order-2 md:order-1 bg-white rounded-2xl border-2 border-slate-200 p-5 shadow-card text-center space-y-3 relative">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-700 border-2 border-slate-300 flex items-center justify-center font-black text-lg mx-auto">
                  2°
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                    Plata · {top3[1].puntaje} pts
                  </span>
                  <h3 className="font-black text-base text-cato-navy mt-1">{top3[1].nombre}</h3>
                  <p className="text-xs text-cato-muted">{top3[1].proyecto}</p>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-cato-navy bg-slate-50 py-1.5 rounded-lg">
                  <Clock className="w-3.5 h-3.5 text-cato-gold" />
                  <span>{top3[1].horasSemestre} horas certificadas</span>
                </div>
                {top3[1].premios.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-1 pt-1">
                    {top3[1].premios.map((pr, i) => (
                      <span key={i} className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
                        🏅 {pr}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Puesto 1 - Oro */}
            {top3[0] && (
              <div className="order-1 md:order-2 bg-gradient-to-b from-amber-50 to-white rounded-2xl border-2 border-cato-gold p-6 shadow-xl text-center space-y-3 relative md:-translate-y-2">
                <div className="w-14 h-14 rounded-full bg-cato-gold text-cato-navy flex items-center justify-center font-black text-xl mx-auto shadow-md">
                  <Trophy className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700">
                    1° Lugar Oro · {top3[0].puntaje} pts
                  </span>
                  <h3 className="font-black text-lg text-cato-navy mt-1">{top3[0].nombre}</h3>
                  <p className="text-xs text-cato-muted">{top3[0].proyecto}</p>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-900 bg-amber-100/70 py-1.5 rounded-lg">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  <span>{top3[0].horasSemestre} horas certificadas</span>
                </div>
                {top3[0].premios.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-1 pt-1">
                    {top3[0].premios.map((pr, i) => (
                      <span key={i} className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full font-bold">
                        🏆 {pr}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Puesto 3 - Bronce */}
            {top3[2] && (
              <div className="order-3 bg-white rounded-2xl border-2 border-orange-200 p-5 shadow-card text-center space-y-3 relative">
                <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-700 border-2 border-orange-300 flex items-center justify-center font-black text-lg mx-auto">
                  3°
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600">
                    Bronce · {top3[2].puntaje} pts
                  </span>
                  <h3 className="font-black text-base text-cato-navy mt-1">{top3[2].nombre}</h3>
                  <p className="text-xs text-cato-muted">{top3[2].proyecto}</p>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-cato-navy bg-orange-50/50 py-1.5 rounded-lg">
                  <Clock className="w-3.5 h-3.5 text-orange-500" />
                  <span>{top3[2].horasSemestre} horas certificadas</span>
                </div>
                {top3[2].premios.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-1 pt-1">
                    {top3[2].premios.map((pr, i) => (
                      <span key={i} className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
                        🏅 {pr}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tabla Completa del Cuadro de Honor */}
          <div className="bg-white rounded-2xl border border-cato-border shadow-card overflow-hidden">
            <div className="p-4 border-b border-cato-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Medal className="w-5 h-5 text-cato-gold" />
                <h2 className="font-bold text-base text-cato-navy">Ranking de Excelencia {semestreActivo}</h2>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-cato-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar voluntario o proyecto..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-cato-border rounded-lg focus:outline-none focus:ring-2 focus:ring-cato-navy/20"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-cato-canvas border-b border-cato-border text-[11px] uppercase text-cato-muted font-bold">
                    <th className="py-3 px-4">Posición</th>
                    <th className="py-3 px-4">Catovoluntario</th>
                    <th className="py-3 px-4">Proyecto Receptor</th>
                    <th className="py-3 px-4">Horas</th>
                    <th className="py-3 px-4">Puntaje</th>
                    <th className="py-3 px-4">Reconocimientos</th>
                    {canAward && <th className="py-3 px-4 text-right">Premiación</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-cato-border text-sm">
                  {filtered.map((v) => {
                    const isMe = isVoluntario && v.id === user?.id;
                    return (
                      <tr
                        key={v.id}
                        className={isMe ? 'bg-amber-50/60 font-semibold' : 'hover:bg-gray-50/70'}
                      >
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black ${
                              v.posicion === 1
                                ? 'bg-cato-gold text-cato-navy'
                                : v.posicion === 2
                                ? 'bg-slate-200 text-slate-800'
                                : v.posicion === 3
                                ? 'bg-orange-200 text-orange-900'
                                : 'bg-gray-100 text-cato-muted'
                            }`}
                          >
                            #{v.posicion}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-cato-navy flex items-center gap-1.5">
                            {v.nombre}
                            {isMe && (
                              <span className="text-[10px] bg-cato-navy text-white px-2 py-0.5 rounded-full">
                                Tú
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-cato-muted">{v.carrera}</div>
                        </td>
                        <td className="py-3 px-4 text-xs text-cato-slate">
                          <span className="inline-flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-cato-muted" />
                            {v.proyecto}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-cato-navy">{v.horasSemestre} hrs</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                            {v.puntaje}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {v.premios.length > 0 ? (
                              v.premios.map((p, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-semibold"
                                >
                                  {p}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-cato-muted">—</span>
                            )}
                          </div>
                        </td>
                        {canAward && (
                          <td className="py-3 px-4 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedVol(v);
                                setNuevoPremio(`Catovoluntario Destacado ${semestreActivo}`);
                                setCategoriaPremio('Liderazgo Solidario');
                                setDescripcionPremio('');
                                setShowPremioModal(true);
                              }}
                              leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
                            >
                              Premiar
                            </Button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modal Otorgar Premio (Solo Admin / Catolider) */}
      {showPremioModal && selectedVol && canAward && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-cato-border">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-cato-navy flex items-center gap-2">
                <Award className="w-5 h-5 text-cato-gold" />
                Otorgar Reconocimiento Oficial
              </h3>
              <button
                type="button"
                onClick={() => setShowPremioModal(false)}
                className="p-1 text-cato-muted hover:text-cato-navy"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-cato-muted">
              Voluntario a premiar: <strong className="text-cato-navy">{selectedVol.nombre}</strong> (Puesto #{selectedVol.posicion})
            </p>

            <form onSubmit={handleOtorgarPremio} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-cato-navy mb-1">
                  Título del Reconocimiento
                </label>
                <input
                  type="text"
                  value={nuevoPremio}
                  onChange={(e) => setNuevoPremio(e.target.value)}
                  placeholder="Ej: Catovoluntario de Oro, Beca Misión..."
                  className="w-full border border-cato-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cato-navy/20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-cato-navy mb-1">
                  Categoría
                </label>
                <select
                  value={categoriaPremio}
                  onChange={(e) => setCategoriaPremio(e.target.value)}
                  className="w-full border border-cato-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cato-navy/20"
                >
                  <option value="Liderazgo Solidario">Liderazgo Solidario</option>
                  <option value="Constancia y Entrega">Constancia y Entrega</option>
                  <option value="Puntualidad Ejemplar">Puntualidad Ejemplar</option>
                  <option value="Mención de Honor Pastoral">Mención de Honor Pastoral</option>
                  <option value="Espíritu Catovoluntario">Espíritu Catovoluntario</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-cato-navy mb-1">
                  Motivo o Reseña (Opcional)
                </label>
                <textarea
                  value={descripcionPremio}
                  onChange={(e) => setDescripcionPremio(e.target.value)}
                  rows={2}
                  placeholder="Detalla el mérito de este reconocimiento..."
                  className="w-full border border-cato-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-cato-navy/20"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  disabled={guardandoPremio}
                  onClick={() => setShowPremioModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="cta"
                  size="sm"
                  type="submit"
                  disabled={guardandoPremio}
                  leftIcon={guardandoPremio ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
                >
                  {guardandoPremio ? 'Guardando en BD...' : 'Confirmar y Otorgar Premio'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
