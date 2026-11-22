/* oxlint-disable react/set-state-in-effect */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Award,
  BookOpen,
  Trophy,
  Download,
  RefreshCw,
  Search,
  Sparkles,
  Medal,
  CheckCircle2,
  X,
  PlusCircle,
  Building2,
} from 'lucide-react';
import { semaforosService } from '../../services/semaforos.service';
import type { GuardarPremioDTO } from '../../services/semaforos.service';
import type {
  VoluntarioBaseMadre,
  VoluntarioRanking,
  NivelVoluntario,
} from '../../types/semaforo.types';

export const P20BaseMadre: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'base-madre' | 'ranking'>('base-madre');

  // Estados Base Madre
  const [voluntarios, setVoluntarios] = useState<VoluntarioBaseMadre[]>([]);
  const [kpis, setKpis] = useState({
    totalHistoricos: 418,
    horasSocialesCertificadas: 18640,
    totalSuperPro: 94,
    activosSemestreActual: 104,
  });
  const [busqueda, setBusqueda] = useState<string>('');
  const [nivelFiltro, setNivelFiltro] = useState<string>('TODOS');
  const [carreraFiltro, setCarreraFiltro] = useState<string>('TODAS');

  // Estados Ranking RF-22
  const [ranking, setRanking] = useState<VoluntarioRanking[]>([]);
  const [podio, setPodio] = useState<VoluntarioRanking[]>([]);
  const [formula, setFormula] = useState<string>('');

  // Modales
  const [voluntarioPremiosModal, setVoluntarioPremiosModal] = useState<VoluntarioBaseMadre | null>(null);
  const [showNuevoPremioModal, setShowNuevoPremioModal] = useState<boolean>(false);
  const [premioForm, setPremioForm] = useState<GuardarPremioDTO>({
    idUsuario: 1,
    semestre: '2/2026',
    nombrePremio: 'Catovoluntario Destacado',
    categoria: 'Liderazgo en Campo',
    descripcion: '',
  });

  const [notificacion, setNotificacion] = useState<string | null>(null);

  // Cargar datos Base Madre
  const cargarBaseMadre = useCallback(async () => {
    try {
      const data = await semaforosService.obtenerBaseMadre({
        busqueda,
        nivel: nivelFiltro,
        carrera: carreraFiltro,
      });
      setVoluntarios(data.voluntarios);
      setKpis(data.kpis);
    } catch (e) {
      console.error('Error cargando Base Madre:', e);
    }
  }, [busqueda, nivelFiltro, carreraFiltro]);

  // Cargar ranking
  const cargarRanking = useCallback(async () => {
    try {
      const data = await semaforosService.obtenerRankingDestacados('2/2026');
      setRanking(data.rankingCompleto);
      setPodio(data.podio);
      setFormula(data.formula);
    } catch (e) {
      console.error('Error cargando ranking:', e);
    }
  }, []);

  useEffect(() => {
    void cargarBaseMadre();
    void cargarRanking();
  }, [cargarBaseMadre, cargarRanking]);

  // Recalcular niveles
  const handleRecalcularNiveles = () => {
    setVoluntarios((prev) =>
      prev.map((v) => {
        let nuevoNivel: NivelVoluntario = 'JUNIOR';
        if (v.horasTotalesHistoricas >= 60) nuevoNivel = 'SUPER_PRO';
        else if (v.horasTotalesHistoricas >= 40) nuevoNivel = 'PRO';
        return { ...v, nivelCalculado: nuevoNivel };
      }),
    );
    setNotificacion('¡Algoritmo RF-21 ejecutado! Niveles Junior, Pro y Super Pro actualizados.');
    setTimeout(() => setNotificacion(null), 4000);
  };

  // Exportar Excel / CSV
  const handleExportarExcel = () => {
    semaforosService.exportarBaseMadreCSV(voluntarios);
    setNotificacion('Nómina oficial exportada exitosamente en formato CSV compatible con Excel.');
    setTimeout(() => setNotificacion(null), 4000);
  };

  // Guardar premio
  const handleGuardarPremio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!premioForm.nombrePremio || !premioForm.descripcion) return;

    try {
      await semaforosService.crearPremio(premioForm);
      setShowNuevoPremioModal(false);
      setNotificacion('¡Premio e incentivo registrado con éxito en la Base Madre!');
      cargarBaseMadre();
      setTimeout(() => setNotificacion(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Error guardando premio');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header con Badge de Pantalla */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cato-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-100 text-cato-navy font-bold text-xs font-mono">
              P-20
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold text-xs">
              Requerimientos RF-20, RF-21 y RF-22
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-cato-navy mt-1 tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-cato-gold" />
            Base Madre Histórica & Preselección de Premiaciones
          </h1>
          <p className="text-xs text-cato-muted mt-0.5">
            Repositorio central con más de 400 voluntarios históricos, consolidación de horas sociales y ranking RF-22.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRecalcularNiveles}
            className="btn-secondary text-xs flex items-center gap-1.5"
            type="button"
            title="Recalcula Junior (<40h), Pro (40-59h) y Super Pro (60+h)"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cato-navy" />
            Recalcular Niveles (RF-21)
          </button>
          <button
            onClick={handleExportarExcel}
            className="btn-cta text-xs flex items-center gap-1.5 shadow-sm"
            type="button"
          >
            <Download className="w-4 h-4" />
            Exportar Nómina Excel
          </button>
        </div>
      </div>

      {/* Notificación toast */}
      {notificacion && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2 shadow-sm animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{notificacion}</span>
        </div>
      )}

      {/* 2. Pestañas de Navegación P-20 */}
      <div className="border-b border-cato-border flex items-center gap-3">
        <button
          onClick={() => setActiveTab('base-madre')}
          className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'base-madre'
              ? 'border-cato-navy text-cato-navy'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          type="button"
        >
          <BookOpen className="w-4 h-4" />
          Base Madre Histórica Multi-Semestre
          <span className="bg-blue-100 text-cato-navy text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
            {kpis.totalHistoricos} Voluntarios
          </span>
        </button>

        <button
          onClick={() => setActiveTab('ranking')}
          className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'ranking'
              ? 'border-cato-navy text-cato-navy'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          type="button"
        >
          <Trophy className="w-4 h-4 text-cato-gold" />
          Preselección y Ranking de Voluntarios Destacados (RF-22)
          <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
            Top Podio
          </span>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: BASE MADRE HISTÓRICA */}
      {/* ==================================================================== */}
      {activeTab === 'base-madre' && (
        <div className="space-y-6">
          {/* 4 KPIs Clave */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="cato-card p-4 border-t-4 border-t-cato-navy">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Voluntarios Históricos
              </span>
              <div className="text-3xl font-black text-slate-800 mt-1">
                {kpis.totalHistoricos}
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% registros consolidados
              </span>
            </div>

            <div className="cato-card p-4 border-t-4 border-t-blue-500">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Horas Sociales Certificadas
              </span>
              <div className="text-3xl font-black text-cato-navy mt-1">
                {kpis.horasSocialesCertificadas.toLocaleString()} hrs
              </div>
              <span className="text-[11px] text-blue-600 font-semibold mt-1 block">
                Periodo 2023-2 a 2026-2
              </span>
            </div>

            <div className="cato-card p-4 border-t-4 border-t-amber-500">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Voluntarios Super Pro (60+ h)
              </span>
              <div className="text-3xl font-black text-amber-600 mt-1">
                {kpis.totalSuperPro}
              </div>
              <span className="text-[11px] text-amber-700 font-semibold mt-1 block">
                Candidatos a Catolíderes
              </span>
            </div>

            <div className="cato-card p-4 border-t-4 border-t-emerald-500">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Activos Gestión 2/2026
              </span>
              <div className="text-3xl font-black text-emerald-700 mt-1">
                {kpis.activosSemestreActual}
              </div>
              <span className="text-[11px] text-slate-500 font-semibold mt-1 block">
                14 proyectos receptores en convenio
              </span>
            </div>
          </div>

          {/* Filtros de Búsqueda */}
          <div className="cato-card p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto flex-1">
              {/* Buscador */}
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar por Nombre, CI o Carrera..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-cato-border rounded-lg focus:border-cato-navy"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
              </div>

              {/* Filtro Nivel */}
              <select
                value={nivelFiltro}
                onChange={(e) => setNivelFiltro(e.target.value)}
                className="text-xs border border-cato-border rounded-lg px-2.5 py-1.5 bg-white font-medium"
              >
                <option value="TODOS">Todos los Niveles (Junior, Pro, Super Pro)</option>
                <option value="SUPER_PRO">Nivel Super Pro (60+ hrs)</option>
                <option value="PRO">Nivel Pro (40 - 59 hrs)</option>
                <option value="JUNIOR">Nivel Junior (0 - 39 hrs)</option>
              </select>

              {/* Filtro Carrera */}
              <select
                value={carreraFiltro}
                onChange={(e) => setCarreraFiltro(e.target.value)}
                className="text-xs border border-cato-border rounded-lg px-2.5 py-1.5 bg-white font-medium"
              >
                <option value="TODAS">Todas las Carreras</option>
                <option value="Biomédica">Ing. Biomédica</option>
                <option value="Psicología">Psicología</option>
                <option value="Sistemas">Ing. de Sistemas</option>
                <option value="Comunicación">Comunicación Social</option>
                <option value="Medicina">Medicina</option>
                <option value="Fisioterapia">Fisioterapia</option>
              </select>

              {(busqueda || nivelFiltro !== 'TODOS' || carreraFiltro !== 'TODAS') && (
                <button
                  type="button"
                  onClick={() => {
                    setBusqueda('');
                    setNivelFiltro('TODOS');
                    setCarreraFiltro('TODAS');
                  }}
                  className="text-xs text-cato-navy font-bold hover:underline"
                >
                  Limpiar Filtros
                </button>
              )}
            </div>

            <div className="text-xs text-cato-muted font-medium shrink-0">
              Mostrando <strong className="text-slate-800">{voluntarios.length} registros</strong> filtrados
            </div>
          </div>

          {/* Tabla Base Madre */}
          <div className="cato-card p-0 overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-slate-200 text-cato-navy font-bold">
                    <th className="py-3 px-4">Carnet CI</th>
                    <th className="py-3 px-4 min-w-[200px]">Voluntario / Carrera</th>
                    <th className="py-3 px-3">Semestres Activos</th>
                    <th className="py-3 px-3 min-w-[170px]">Proyecto Reciente</th>
                    <th className="py-3 px-3 text-center">Horas Históricas</th>
                    <th className="py-3 px-3 text-center">Nivel Calculado (RF-21)</th>
                    <th className="py-3 px-3 text-center">Premios Pastoral</th>
                    <th className="py-3 px-3 text-center">Estado</th>
                    <th className="py-3 px-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {voluntarios.map((vol) => {
                    const isSuperPro = vol.nivelCalculado === 'SUPER_PRO';
                    const isPro = vol.nivelCalculado === 'PRO';

                    return (
                      <tr key={vol.id} className="hover:bg-slate-50 transition-colors">
                        {/* CI */}
                        <td className="py-3 px-4 font-mono font-bold text-slate-700">
                          {vol.ci}
                        </td>

                        {/* Nombre y Carrera */}
                        <td className="py-3 px-4">
                          <div className="font-extrabold text-slate-900 text-sm">
                            {vol.nombreCompleto}
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium">
                            {vol.carrera}
                          </div>
                          {vol.email && (
                            <div className="text-[10px] text-blue-600 font-mono mt-0.5">
                              {vol.email}
                            </div>
                          )}
                        </td>

                        {/* Semestres */}
                        <td className="py-3 px-3 text-slate-600 font-medium">
                          {vol.semestresActivos}
                        </td>

                        {/* Proyecto Reciente */}
                        <td className="py-3 px-3 text-slate-700 font-medium">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{vol.proyectoReciente}</span>
                          </div>
                        </td>

                        {/* Horas */}
                        <td className="py-3 px-3 text-center">
                          <span className="font-black text-cato-navy text-sm font-mono">
                            {vol.horasTotalesHistoricas} hrs
                          </span>
                        </td>

                        {/* Nivel Calculado */}
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black border ${
                              isSuperPro
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : isPro
                                  ? 'bg-blue-100 text-blue-900 border-blue-300'
                                  : 'bg-slate-100 text-slate-800 border-slate-300'
                            }`}
                          >
                            {isSuperPro && <Sparkles className="w-3 h-3 text-amber-600" />}
                            {vol.nivelCalculado === 'SUPER_PRO'
                              ? 'Super Pro (60+h)'
                              : vol.nivelCalculado === 'PRO'
                                ? 'Pro (40-59h)'
                                : 'Junior (<40h)'}
                          </span>
                        </td>

                        {/* Total Premios Históricos (Modal trigger) */}
                        <td className="py-3 px-3 text-center">
                          {vol.totalPremios > 0 ? (
                            <button
                              type="button"
                              onClick={() => setVoluntarioPremiosModal(vol)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 font-extrabold text-xs hover:bg-purple-100 transition-colors shadow-sm"
                              title="Haga clic para ver el desglose histórico de premios"
                            >
                              <Trophy className="w-3.5 h-3.5 text-purple-600" />
                              <span>{vol.totalPremios} {vol.totalPremios === 1 ? 'Premio' : 'Premios'}</span>
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-medium">—</span>
                          )}
                        </td>

                        {/* Estado */}
                        <td className="py-3 px-3 text-center">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {vol.estado}
                          </span>
                        </td>

                        {/* Acciones */}
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setPremioForm((p) => ({
                                ...p,
                                idUsuario: vol.id,
                              }));
                              setShowNuevoPremioModal(true);
                            }}
                            className="px-2.5 py-1 rounded border border-slate-300 text-slate-700 hover:bg-cato-navy hover:text-white hover:border-cato-navy text-[11px] font-bold transition-all"
                          >
                            + Premiar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: RANKING RF-22 Y PODIO TOP 3 */}
      {/* ==================================================================== */}
      {activeTab === 'ranking' && (
        <div className="space-y-6">
          {/* Banner de Fórmula Algorítmica RF-22 */}
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="text-3xl">📐</span>
              <div>
                <h3 className="text-xs font-extrabold text-amber-900 uppercase tracking-wider">
                  Fórmula Oficial del Algoritmo de Destacados (RF-22)
                </h3>
                <p className="text-xs text-amber-900 mt-1">
                  <code className="bg-white/90 px-2.5 py-1 rounded font-mono font-bold text-slate-900 border border-amber-200 shadow-xs">
                    {formula ||
                      'Score = (Horas_Semestre × 0.4) + (Semáforos_Morados × 15) + (Eval_Institución × 5) + (Bonus_SuperPro: 10)'}
                  </code>
                </p>
                <p className="text-[11px] text-amber-800 mt-1.5 leading-relaxed">
                  Preselección matemática transparente para las Becas Misión y el reconocimiento institucional de Pastoral Universitaria UCB.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowNuevoPremioModal(true)}
              className="btn-cta text-xs whitespace-nowrap flex items-center gap-1.5 shadow-sm shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              Asignar Nuevo Reconocimiento
            </button>
          </div>

          {/* Podio Top 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
            {/* 2do Lugar (Plata) */}
            {podio[1] && (
              <div className="cato-card p-5 border-2 border-slate-300 relative overflow-hidden flex flex-col justify-between shadow-sm order-2 md:order-1 h-[270px]">
                <div className="absolute top-0 right-0 bg-slate-300 text-slate-800 text-[10px] font-black px-3 py-0.5 rounded-bl">
                  🥈 2° LUGAR PLATA
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl">🥈</span>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">
                        {podio[1].nombreCompleto}
                      </h4>
                      <span className="text-xs text-slate-500 font-medium">
                        {podio[1].carrera} · {podio[1].proyecto}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1 bg-slate-50 p-2 rounded-lg text-center text-xs my-2 border border-slate-200">
                    <div>
                      <span className="text-slate-400 block text-[9px] font-bold">HORAS</span>
                      <strong className="text-cato-navy">{podio[1].horasSemestre} h</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] font-bold">MORADOS</span>
                      <strong className="text-purple-700">{podio[1].semaforosMorados} 🟣</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] font-bold">SCORE RF-22</span>
                      <strong className="text-slate-900">{podio[1].score} pts</strong>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 italic line-clamp-2">
                    "{podio[1].merito}"
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded border border-blue-200">
                    {podio[1].nivel}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Aprobado Retiro
                  </span>
                </div>
              </div>
            )}

            {/* 1er Lugar (Oro - Card central más alta) */}
            {podio[0] && (
              <div className="bg-gradient-to-b from-amber-50 via-white to-amber-50/40 rounded-2xl border-2 border-cato-gold p-6 relative overflow-hidden flex flex-col justify-between shadow-xl order-1 md:order-2 h-[310px]">
                <div className="absolute top-0 right-0 bg-cato-gold text-cato-navy text-[11px] font-black px-3.5 py-1 rounded-bl shadow-sm">
                  🏆 1° LUGAR ORO DESTACADO
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2.5">
                    <span className="text-4xl">🥇</span>
                    <div>
                      <h4 className="text-base font-black text-cato-navy tracking-tight">
                        {podio[0].nombreCompleto}
                      </h4>
                      <span className="text-xs text-cato-subtitle font-bold">
                        {podio[0].carrera} · {podio[0].proyecto}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1 bg-amber-100/70 p-2.5 rounded-xl text-center text-xs my-2.5 border border-amber-300">
                    <div>
                      <span className="text-amber-800 block text-[10px] font-extrabold">HORAS SEM.</span>
                      <strong className="text-cato-navy text-sm">{podio[0].horasSemestre} h</strong>
                    </div>
                    <div>
                      <span className="text-amber-800 block text-[10px] font-extrabold">MORADOS</span>
                      <strong className="text-purple-700 text-sm">{podio[0].semaforosMorados} 🟣</strong>
                    </div>
                    <div>
                      <span className="text-amber-800 block text-[10px] font-extrabold">SCORE RF-22</span>
                      <strong className="text-amber-950 text-sm font-black">{podio[0].score} pts</strong>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 italic leading-relaxed line-clamp-3">
                    "{podio[0].merito}"
                  </p>
                </div>

                <div className="pt-2 border-t border-amber-200 flex items-center justify-between text-xs">
                  <span className="text-xs font-black bg-amber-300 text-amber-950 px-2.5 py-0.5 rounded-full border border-amber-400">
                    ★ Super Pro (84h)
                  </span>
                  <span className="text-xs font-black text-amber-800 bg-white/90 px-2.5 py-0.5 rounded-full border border-amber-300 shadow-xs">
                    Nominado Beca Pastoral ★
                  </span>
                </div>
              </div>
            )}

            {/* 3er Lugar (Bronce) */}
            {podio[2] && (
              <div className="cato-card p-5 border-2 border-amber-200 relative overflow-hidden flex flex-col justify-between shadow-sm order-3 h-[270px]">
                <div className="absolute top-0 right-0 bg-amber-200 text-amber-900 text-[10px] font-black px-3 py-0.5 rounded-bl">
                  🥉 3° LUGAR BRONCE
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl">🥉</span>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">
                        {podio[2].nombreCompleto}
                      </h4>
                      <span className="text-xs text-slate-500 font-medium">
                        {podio[2].carrera} · {podio[2].proyecto}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1 bg-slate-50 p-2 rounded-lg text-center text-xs my-2 border border-slate-200">
                    <div>
                      <span className="text-slate-400 block text-[9px] font-bold">HORAS</span>
                      <strong className="text-cato-navy">{podio[2].horasSemestre} h</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] font-bold">MORADOS</span>
                      <strong className="text-purple-700">{podio[2].semaforosMorados} 🟣</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] font-bold">SCORE RF-22</span>
                      <strong className="text-slate-900">{podio[2].score} pts</strong>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 italic line-clamp-2">
                    "{podio[2].merito}"
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded border border-blue-200">
                    {podio[2].nivel}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Aprobado Retiro
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Tabla General de Posiciones */}
          <div className="cato-card p-0 overflow-hidden shadow-card">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-cato-border flex items-center justify-between">
              <h3 className="text-sm font-bold text-cato-navy flex items-center gap-2">
                <Medal className="w-4 h-4 text-cato-gold" />
                Tabla Completa de Clasificación Semestral por Algoritmo
              </h3>
              <span className="text-xs text-cato-muted font-medium">
                Gestión Semestre 2/2026
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-slate-200 text-cato-navy font-bold">
                    <th className="py-2.5 px-3 text-center w-16">Puesto</th>
                    <th className="py-2.5 px-4 min-w-[200px]">Estudiante Voluntario</th>
                    <th className="py-2.5 px-3">Proyecto Receptor</th>
                    <th className="py-2.5 px-3 text-center">Horas Semestre</th>
                    <th className="py-2.5 px-3 text-center">Semáforos Morados</th>
                    <th className="py-2.5 px-3 text-center">Nota Institución</th>
                    <th className="py-2.5 px-3 text-center">Nivel</th>
                    <th className="py-2.5 px-3 text-center font-black">Score RF-22</th>
                    <th className="py-2.5 px-3 text-center">Estado Retiro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ranking.map((item) => (
                    <tr
                      key={item.idUsuario}
                      className={`hover:bg-slate-50 ${
                        item.posicion === 1
                          ? 'bg-amber-50/40 font-semibold'
                          : item.posicion <= 3
                            ? 'bg-blue-50/20'
                            : ''
                      }`}
                    >
                      <td className="py-3 px-3 text-center font-black text-sm">
                        {item.posicion === 1 && '🥇 1°'}
                        {item.posicion === 2 && '🥈 2°'}
                        {item.posicion === 3 && '🥉 3°'}
                        {item.posicion > 3 && `#${item.posicion}`}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-slate-900">{item.nombreCompleto}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {item.ci} · <span className="font-sans">{item.carrera}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-700">{item.proyecto}</td>
                      <td className="py-3 px-3 text-center font-bold text-cato-navy">
                        {item.horasSemestre} h
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-purple-700">
                        {item.semaforosMorados} 🟣
                      </td>
                      <td className="py-3 px-3 text-center font-semibold text-slate-700">
                        {item.evaluacionInstitucion} / 5.0
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                          {item.nivel}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-black text-sm text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                          {item.score} pts
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {item.aprobadoRetiro ? (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Aprobado ✓
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">Regular</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 1: DESGLOSE HISTÓRICO DE PREMIOS DEL VOLUNTARIO */}
      {/* ==================================================================== */}
      {voluntarioPremiosModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                    Historial de Premios e Incentivos
                  </h3>
                  <p className="text-xs text-slate-500">
                    {voluntarioPremiosModal.nombreCompleto} ({voluntarioPremiosModal.ci})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setVoluntarioPremiosModal(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {voluntarioPremiosModal.premios.map((premio) => (
                <div
                  key={premio.id}
                  className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-900 text-xs">
                      {premio.nombrePremio}
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-purple-200 text-purple-900 px-2 py-0.5 rounded">
                      Semestre {premio.semestre}
                    </span>
                  </div>
                  {premio.categoria && (
                    <span className="inline-block text-[10px] font-semibold text-purple-700 bg-white px-2 py-0.5 rounded border border-purple-200">
                      Categoría: {premio.categoria}
                    </span>
                  )}
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {premio.descripcion}
                  </p>
                  {premio.nombreProyecto && (
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 pt-1 border-t border-purple-100">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      <span>{premio.nombreProyecto}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setVoluntarioPremiosModal(null)}
                className="btn-secondary text-xs px-4"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 2: ASIGNAR NUEVO PREMIO / RECONOCIMIENTO */}
      {/* ==================================================================== */}
      {showNuevoPremioModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Asignar Reconocimiento Pastoral
                  </h3>
                  <p className="text-xs text-slate-500">
                    Registro oficial en Base Madre
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNuevoPremioModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGuardarPremio} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-cato-navy mb-1">
                  Voluntario a Distinguir
                </label>
                <select
                  value={premioForm.idUsuario}
                  onChange={(e) =>
                    setPremioForm((p) => ({ ...p, idUsuario: Number(e.target.value) }))
                  }
                  className="w-full border border-cato-border rounded-lg p-2 bg-white"
                >
                  {voluntarios.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.nombreCompleto} ({v.carrera})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-cato-navy mb-1">
                  Nombre del Premio / Reconocimiento
                </label>
                <input
                  type="text"
                  required
                  value={premioForm.nombrePremio}
                  onChange={(e) =>
                    setPremioForm((p) => ({ ...p, nombrePremio: e.target.value }))
                  }
                  placeholder="Ej: Catovoluntario Destacado, Beca Misión Carmen Pampa"
                  className="w-full border border-cato-border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-bold text-cato-navy mb-1">
                  Categoría o Mérito
                </label>
                <input
                  type="text"
                  value={premioForm.categoria}
                  onChange={(e) =>
                    setPremioForm((p) => ({ ...p, categoria: e.target.value }))
                  }
                  placeholder="Ej: Liderazgo en Campo, Empatía con Adultos Mayores"
                  className="w-full border border-cato-border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-bold text-cato-navy mb-1">
                  Descripción del Reconocimiento y Motivación
                </label>
                <textarea
                  rows={3}
                  required
                  value={premioForm.descripcion}
                  onChange={(e) =>
                    setPremioForm((p) => ({ ...p, descripcion: e.target.value }))
                  }
                  placeholder="Redactar el motivo del premio, horas destacadas y aporte solidario..."
                  className="w-full border border-cato-border rounded-lg p-2"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNuevoPremioModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-cta text-xs">
                  Guardar Reconocimiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
