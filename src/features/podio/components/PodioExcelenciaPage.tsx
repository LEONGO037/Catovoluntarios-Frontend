import React, { useState } from 'react';
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
} from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';
import { Button } from '../../../components/ui/Button';

interface VoluntarioPodio {
  id: number;
  posicion: number;
  nombre: string;
  carrera: string;
  proyecto: string;
  horasSemestre: number;
  puntaje: number;
  semaforo: 'VERDE' | 'AMARILLO' | 'ROJO';
  premios: string[];
}

const INITIAL_RANKING: VoluntarioPodio[] = [
  {
    id: 101,
    posicion: 1,
    nombre: 'Valentina Gutiérrez Arce',
    carrera: 'Psicología',
    proyecto: 'Hospital del Niño',
    horasSemestre: 68,
    puntaje: 98.5,
    semaforo: 'VERDE',
    premios: ['Catovoluntario de Oro 2/2026', 'Liderazgo Solidario'],
  },
  {
    id: 3, // Coincide con Mateo Flores Aliaga (VOLUNTARIO en mockUsers.json)
    posicion: 2,
    nombre: 'Mateo Flores Aliaga',
    carrera: 'Ingeniería de Sistemas',
    proyecto: 'Hogar San Ramón',
    horasSemestre: 62,
    puntaje: 95.2,
    semaforo: 'VERDE',
    premios: ['Espíritu de Servicio UCB'],
  },
  {
    id: 103,
    posicion: 3,
    nombre: 'Lucía Fernanda Torrez',
    carrera: 'Medicina',
    proyecto: 'Comedor San Calixto',
    horasSemestre: 58,
    puntaje: 93.0,
    semaforo: 'VERDE',
    premios: ['Compromiso Ejemplar'],
  },
  {
    id: 104,
    posicion: 4,
    nombre: 'Sebastián Quiroga Mamani',
    carrera: 'Derecho',
    proyecto: 'Centro Terapéutico Kallpa',
    horasSemestre: 54,
    puntaje: 89.4,
    semaforo: 'VERDE',
    premios: [],
  },
  {
    id: 105,
    posicion: 5,
    nombre: 'Sofía Alejandra Paz',
    carrera: 'Arquitectura',
    proyecto: 'Hogar San Ramón',
    horasSemestre: 50,
    puntaje: 86.8,
    semaforo: 'VERDE',
    premios: [],
  },
];

export const PodioExcelenciaPage: React.FC = () => {
  const { user } = useAuth();
  const canAward = user?.rol === 'ADMIN_PASTORAL' || user?.rol === 'CATOLIDER';
  const isVoluntario = user?.rol === 'VOLUNTARIO';

  const [ranking, setRanking] = useState<VoluntarioPodio[]>(INITIAL_RANKING);
  const [busqueda, setBusqueda] = useState('');
  const [showPremioModal, setShowPremioModal] = useState(false);
  const [selectedVol, setSelectedVol] = useState<VoluntarioPodio | null>(null);
  const [nuevoPremio, setNuevoPremio] = useState('Catovoluntario Destacado 2/2026');
  const [toast, setToast] = useState<string | null>(null);

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

  const handleOtorgarPremio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVol || !nuevoPremio.trim()) return;

    setRanking((prev) =>
      prev.map((v) =>
        v.id === selectedVol.id && !v.premios.includes(nuevoPremio.trim())
          ? { ...v, premios: [...v.premios, nuevoPremio.trim()] }
          : v,
      ),
    );
    setToast(`Reconocimiento "${nuevoPremio}" otorgado a ${selectedVol.nombre}`);
    setShowPremioModal(false);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200 inline-flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            Reconocimiento Pastoral UCB
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-cato-navy mt-2">
            {canAward ? 'Podio y Premiación de Catovoluntarios' : 'Podio de Excelencia'}
          </h1>
          <p className="text-sm text-cato-muted mt-0.5">
            {canAward
              ? 'Visualiza el ranking de excelencia del semestre y otorga reconocimientos a los voluntarios destacados.'
              : 'Consulta el cuadro de honor semestral y verifica tu posición en el Podio de Excelencia.'}
          </p>
        </div>
      </div>

      {toast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toast}</span>
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
              <span className="text-xs text-blue-200 italic">Sigue sumando horas para obtener medallas</span>
            )}
          </div>
        </div>
      )}

      {/* Podio Visual Top 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
        {/* Puesto 2 */}
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

        {/* Puesto 1 */}
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

        {/* Puesto 3 */}
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
            <h2 className="font-bold text-base text-cato-navy">Ranking de Excelencia 2/2026</h2>
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

      {/* Modal Otorgar Premio (Solo Admin / Catolider) */}
      {showPremioModal && selectedVol && canAward && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-cato-border">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-cato-navy flex items-center gap-2">
                <Award className="w-5 h-5 text-cato-gold" />
                Otorgar Reconocimiento
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
              Voluntario seleccionado: <strong className="text-cato-navy">{selectedVol.nombre}</strong>
            </p>

            <form onSubmit={handleOtorgarPremio} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-cato-navy mb-1">
                  Nombre del Premio o Mención
                </label>
                <select
                  value={nuevoPremio}
                  onChange={(e) => setNuevoPremio(e.target.value)}
                  className="w-full border border-cato-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cato-navy/20"
                >
                  <option value="Catovoluntario Destacado 2/2026">Catovoluntario Destacado 2/2026</option>
                  <option value="Espíritu de Servicio UCB">Espíritu de Servicio UCB</option>
                  <option value="Excelencia y Puntualidad en Campo">Excelencia y Puntualidad en Campo</option>
                  <option value="Liderazgo Solidario">Liderazgo Solidario</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowPremioModal(false)}>
                  Cancelar
                </Button>
                <Button variant="cta" size="sm" type="submit">
                  Confirmar Premio
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
