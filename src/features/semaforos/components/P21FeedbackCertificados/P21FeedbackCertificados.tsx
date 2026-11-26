/* oxlint-disable react/set-state-in-effect */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  FileBadge,
  Building2,
  CheckCircle2,
  Copy,
  Printer,
  Download,
  Star,
  Send,
  AlertCircle,
  FileText,
  ExternalLink,
  Trophy,
  Sparkles,
  Search,
  RefreshCw,
  Loader2,
  Medal,
} from 'lucide-react';
import { useActiveSemester } from '../../../../components/layout/active-semester';
import { Button } from '../../../../components/ui/Button';
import { semaforosService } from '../../services/semaforos.service';
import { proyectosService } from '../../../proyectos/services/proyectos.service';
import type {
  FeedbackInstitucion,
  PlantillaCertificado,
  CertificadoFundacionItem,
  VoluntarioBaseMadre,
} from '../../types/semaforo.types';

export const P21FeedbackCertificados: React.FC = () => {
  const semestreActivo = useActiveSemester();

  // Pestañas principales
  const [activeTab, setActiveTab] = useState<'oficial' | 'fundacion' | 'feedback'>('oficial');

  // Filtros de selección
  const [semestre, setSemestre] = useState<string>(semestreActivo);
  const [proyectos, setProyectos] = useState<{ id: number; nombre: string }[]>([]);
  const [proyectoFiltro, setProyectoFiltro] = useState<string>('TODOS');
  const [busquedaVoluntario, setBusquedaVoluntario] = useState<string>('');

  // Voluntarios disponibles
  const [voluntarios, setVoluntarios] = useState<VoluntarioBaseMadre[]>([]);
  const [voluntarioSeleccionadoId, setVoluntarioSeleccionadoId] = useState<number | null>(null);

  // Certificado Oficial Seleccionado
  const [certificadoOficial, setCertificadoOficial] = useState<PlantillaCertificado | null>(null);
  const [cargandoCertificado, setCargandoCertificado] = useState<boolean>(false);
  const [copiado, setCopiado] = useState<boolean>(false);

  // Certificados de Fundación
  const [certsFundacion, setCertsFundacion] = useState<CertificadoFundacionItem[]>([]);

  // Feedback Semestral Institucional
  const [feedback, setFeedback] = useState<FeedbackInstitucion>({
    proyectoId: 1,
    nombreProyecto: 'Proyecto Receptor',
    semestre: semestreActivo,
    voluntariosRecibidos: 0,
    voluntariosCulminados: 0,
    bajasAbandonos: 0,
    calificacionGrupo: 5,
    calificacionCatolider: 5,
    solicitaContinuidadConvenio: true,
    cuposSolicitadosProximoSemestre: 20,
    bloque4ObservacionesSugerenciasLibres: '',
    nombreResponsableLlenado: '',
    cargoResponsable: '',
  });
  const [guardandoFeedback, setGuardandoFeedback] = useState<boolean>(false);

  const [notificacion, setNotificacion] = useState<{
    tipo: 'success' | 'warning' | 'error';
    mensaje: string;
  } | null>(null);

  // 1. Cargar proyectos y voluntarios al montar o cambiar semestre
  const cargarDatosIniciales = useCallback(async () => {
    try {
      // Cargar lista de proyectos
      const proys = await proyectosService.fetchProyectos();
      const proysMapeados = proys.map((p: any) => ({
        id: Number(p.id),
        nombre: p.nombre_proyecto || 'Proyecto',
      }));
      setProyectos(proysMapeados);

      // Cargar voluntarios desde Base Madre
      const resBaseMadre = await semaforosService.obtenerBaseMadre({ semestre });
      if (resBaseMadre?.voluntarios) {
        setVoluntarios(resBaseMadre.voluntarios);
        if (resBaseMadre.voluntarios.length > 0 && !voluntarioSeleccionadoId) {
          setVoluntarioSeleccionadoId(resBaseMadre.voluntarios[0].id);
        }
      }

      // Cargar certificados de fundación
      const fundCerts = await semaforosService.listarTodosCertificadosFundacion(semestre);
      setCertsFundacion(fundCerts);
    } catch (e) {
      console.error('Error al cargar datos en centro de certificados:', e);
    }
  }, [semestre, voluntarioSeleccionadoId]);

  useEffect(() => {
    void cargarDatosIniciales();
  }, [cargarDatosIniciales]);

  // Actualizar semestre si cambia el contexto global
  useEffect(() => {
    setSemestre(semestreActivo);
  }, [semestreActivo]);

  // 2. Cargar detalle del certificado oficial cuando cambia el voluntario seleccionado
  const cargarDetalleCertificado = useCallback(async (userId: number) => {
    setCargandoCertificado(true);
    try {
      const data = await semaforosService.generarPlantillaCertificado(userId, semestre);
      setCertificadoOficial(data);
    } catch (err) {
      console.error('Error cargando certificado oficial:', err);
    } finally {
      setCargandoCertificado(false);
    }
  }, [semestre]);

  useEffect(() => {
    if (voluntarioSeleccionadoId) {
      void cargarDetalleCertificado(voluntarioSeleccionadoId);
    }
  }, [voluntarioSeleccionadoId, cargarDetalleCertificado]);

  // 3. Cargar Feedback institucional si se cambia a la pestaña de feedback
  const cargarFeedbackProyecto = useCallback(async (proyId: number) => {
    try {
      const data = await semaforosService.obtenerFeedbackProyecto(proyId, semestre);
      setFeedback(data);
    } catch (err) {
      console.error('Error cargando feedback:', err);
    }
  }, [semestre]);

  useEffect(() => {
    if (activeTab === 'feedback') {
      const pId = proyectoFiltro !== 'TODOS' ? Number(proyectoFiltro) : 1;
      void cargarFeedbackProyecto(pId);
    }
  }, [activeTab, proyectoFiltro, cargarFeedbackProyecto]);

  // Filtrado de voluntarios según proyecto y término de búsqueda
  const voluntariosFiltrados = useMemo(() => {
    return voluntarios.filter((v) => {
      const coincideBusqueda =
        v.nombreCompleto.toLowerCase().includes(busquedaVoluntario.toLowerCase()) ||
        v.ci.toLowerCase().includes(busquedaVoluntario.toLowerCase()) ||
        v.carrera.toLowerCase().includes(busquedaVoluntario.toLowerCase());

      const coincideProyecto =
        proyectoFiltro === 'TODOS' ||
        v.proyectoReciente.toLowerCase().includes(
          (proyectos.find((p) => String(p.id) === proyectoFiltro)?.nombre || '').toLowerCase(),
        );

      return coincideBusqueda && coincideProyecto;
    });
  }, [voluntarios, busquedaVoluntario, proyectoFiltro, proyectos]);

  // Copiar plantilla textual al portapapeles
  const handleCopiarPlantilla = async () => {
    if (!certificadoOficial?.textoPreformateadoCopiar) return;
    try {
      await navigator.clipboard.writeText(certificadoOficial.textoPreformateadoCopiar);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 3000);
    } catch {
      // Fallback si clipboard API no está permitida
    }
  };

  // Imprimir / Guardar en PDF oficial mediante ventana de impresión
  const handleImprimirPDF = () => {
    window.print();
  };

  // Descargar archivo plano con la plantilla
  const handleDescargarTxt = () => {
    if (!certificadoOficial) return;
    const blob = new Blob([certificadoOficial.textoPreformateadoCopiar], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Certificado_UCB_${certificadoOficial.nombreCompleto.replace(/\s+/g, '_')}_${semestre.replace('/', '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Guardar evaluación / feedback de institución receptora
  const handleGuardarFeedback = async () => {
    if (
      !feedback.bloque4ObservacionesSugerenciasLibres ||
      feedback.bloque4ObservacionesSugerenciasLibres.trim() === ''
    ) {
      setNotificacion({
        tipo: 'warning',
        mensaje: 'El Bloque 4 libre de observaciones y sugerencias es obligatorio según directriz de Pastoral.',
      });
      return;
    }

    setGuardandoFeedback(true);
    try {
      await semaforosService.guardarFeedbackProyecto(feedback);
      setNotificacion({
        tipo: 'success',
        mensaje: 'Evaluación y feedback semestral de la institución guardados exitosamente.',
      });
      setTimeout(() => setNotificacion(null), 5000);
    } catch (e: any) {
      setNotificacion({
        tipo: 'error',
        mensaje: e.message || 'Error al guardar el feedback del proyecto.',
      });
    } finally {
      setGuardandoFeedback(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Encabezado Oficial */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200 inline-flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              Pastoral Universitaria UCB · Gestión {semestre}
            </span>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
              Panel Exclusivo Admin
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-cato-navy mt-2">
            Centro de Certificados y Cierre Semestral
          </h1>
          <p className="text-sm text-cato-muted mt-0.5">
            Genera e imprime los diplomas oficiales universitarios en PDF, fiscaliza los certificados emitidos por fundaciones y supervisa las evaluaciones de los proyectos.
          </p>
        </div>

        <button
          onClick={() => void cargarDatosIniciales()}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-cato-navy bg-white border border-cato-border rounded-xl shadow-xs hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cato-gold" />
          <span>Sincronizar Datos</span>
        </button>
      </div>

      {/* 2. Barra de Filtros y Selección Rápida */}
      <div className="bg-white rounded-2xl border border-cato-border p-4 shadow-card grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Selector de Gestión */}
        <div>
          <label className="block text-[11px] font-bold uppercase text-cato-muted mb-1">
            Gestión / Semestre
          </label>
          <select
            value={semestre}
            onChange={(e) => setSemestre(e.target.value)}
            className="w-full text-xs font-semibold border border-cato-border rounded-xl px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cato-navy/20"
          >
            <option value="2/2026">Gestión 2/2026</option>
            <option value="1/2026">Gestión 1/2026</option>
            <option value="2/2025">Gestión 2/2025</option>
          </select>
        </div>

        {/* Selector de Proyecto */}
        <div>
          <label className="block text-[11px] font-bold uppercase text-cato-muted mb-1">
            Proyecto Receptor
          </label>
          <select
            value={proyectoFiltro}
            onChange={(e) => setProyectoFiltro(e.target.value)}
            className="w-full text-xs font-semibold border border-cato-border rounded-xl px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cato-navy/20"
          >
            <option value="TODOS">Todos los Proyectos Receptores</option>
            {proyectos.map((p) => (
              <option key={p.id} value={String(p.id)}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Buscador de Voluntario */}
        <div>
          <label className="block text-[11px] font-bold uppercase text-cato-muted mb-1">
            Buscar Catovoluntario
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-cato-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={busquedaVoluntario}
              onChange={(e) => setBusquedaVoluntario(e.target.value)}
              placeholder="Nombre, CI o carrera..."
              className="w-full text-xs pl-9 pr-3 py-2 border border-cato-border rounded-xl focus:outline-none focus:ring-2 focus:ring-cato-navy/20"
            />
          </div>
        </div>
      </div>

      {/* 3. Navegación por Pestañas */}
      <div className="flex border-b border-cato-border gap-2">
        <button
          onClick={() => setActiveTab('oficial')}
          className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'oficial'
              ? 'border-cato-gold text-cato-navy'
              : 'border-transparent text-cato-muted hover:text-cato-navy'
          }`}
        >
          <FileBadge className="w-4 h-4 text-cato-gold" />
          <span>Certificado Oficial UCB (PDF)</span>
          <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-extrabold">
            {voluntariosFiltrados.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('fundacion')}
          className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'fundacion'
              ? 'border-cato-gold text-cato-navy'
              : 'border-transparent text-cato-muted hover:text-cato-navy'
          }`}
        >
          <Building2 className="w-4 h-4 text-purple-600" />
          <span>Certificados de Fundaciones</span>
          <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-extrabold">
            {certsFundacion.length} subidos
          </span>
        </button>

        <button
          onClick={() => setActiveTab('feedback')}
          className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'feedback'
              ? 'border-cato-gold text-cato-navy'
              : 'border-transparent text-cato-muted hover:text-cato-navy'
          }`}
        >
          <FileText className="w-4 h-4 text-emerald-600" />
          <span>Feedback y Cierre Institucional</span>
        </button>
      </div>

      {notificacion && (
        <div
          className={`px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold shadow-sm ${
            notificacion.tipo === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : notificacion.tipo === 'warning'
              ? 'bg-amber-50 border border-amber-200 text-amber-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {notificacion.tipo === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          )}
          <span>{notificacion.mensaje}</span>
        </div>
      )}

      {/* ==================================================================== */}
      {/* PESTAÑA 1: CERTIFICADO OFICIAL PASTORAL UCB */}
      {/* ==================================================================== */}
      {activeTab === 'oficial' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Panel Izquierdo: Lista de Voluntarios Elegibles (Col 4) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-cato-border shadow-card p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-cato-border">
              <h3 className="font-extrabold text-sm text-cato-navy flex items-center gap-1.5">
                <Medal className="w-4 h-4 text-cato-gold" />
                Catovoluntarios Acreditados
              </h3>
              <span className="text-[11px] font-semibold text-cato-muted">
                {voluntariosFiltrados.length} elegibles
              </span>
            </div>

            <div className="max-h-[560px] overflow-y-auto space-y-2 pr-1">
              {voluntariosFiltrados.length === 0 ? (
                <div className="py-8 text-center text-xs text-cato-muted">
                  No se encontraron voluntarios con los filtros aplicados.
                </div>
              ) : (
                voluntariosFiltrados.map((v) => {
                  const isSelected = voluntarioSeleccionadoId === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVoluntarioSeleccionadoId(v.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-start justify-between gap-2 ${
                        isSelected
                          ? 'bg-amber-50/80 border-cato-gold shadow-xs'
                          : 'bg-slate-50/60 border-cato-border hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <p className="font-extrabold text-xs text-cato-navy leading-snug">
                          {v.nombreCompleto}
                        </p>
                        <p className="text-[11px] text-cato-muted">
                          CI: <strong>{v.ci}</strong> · {v.carrera}
                        </p>
                        <p className="text-[10px] text-cato-slate truncate max-w-[200px]">
                          {v.proyectoReciente}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[11px] font-black text-cato-navy bg-white border border-cato-border px-2 py-0.5 rounded-md inline-block">
                          {v.horasTotalesHistoricas} hrs
                        </span>
                        {v.nivelCalculado === 'SUPER_PRO' && (
                          <span className="block text-[9px] font-extrabold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded mt-1">
                            SUPER PRO
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Panel Derecho: Vista Previa Realista del Diploma UCB (Col 8) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Barra de Acciones del Certificado */}
            <div className="bg-white rounded-2xl border border-cato-border p-3.5 shadow-card flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <FileBadge className="w-5 h-5 text-cato-gold" />
                <span className="text-xs font-bold text-cato-navy">
                  Vista Previa del Diploma Oficial UCB
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopiarPlantilla}
                  leftIcon={<Copy className="w-4 h-4" />}
                >
                  {copiado ? '¡Copiado!' : 'Copiar Texto'}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDescargarTxt}
                  leftIcon={<Download className="w-4 h-4" />}
                >
                  Descargar TXT
                </Button>

                <Button
                  variant="cta"
                  size="sm"
                  onClick={handleImprimirPDF}
                  leftIcon={<Printer className="w-4 h-4" />}
                >
                  Imprimir / Guardar en PDF
                </Button>
              </div>
            </div>

            {/* Hoja de Certificado imprimible con diseño de gala */}
            {cargandoCertificado ? (
              <div className="bg-white rounded-2xl border border-cato-border p-16 text-center shadow-card">
                <Loader2 className="w-8 h-8 text-cato-gold animate-spin mx-auto mb-3" />
                <p className="text-sm font-semibold text-cato-navy">
                  Generando vista previa del certificado oficial...
                </p>
              </div>
            ) : !certificadoOficial ? (
              <div className="bg-white rounded-2xl border border-cato-border p-16 text-center shadow-card text-cato-muted">
                Selecciona un voluntario de la lista para visualizar su certificado oficial.
              </div>
            ) : (
              <div
                id="area-imprimible-certificado"
                className="bg-white rounded-2xl border-4 border-double border-amber-300 p-8 sm:p-12 shadow-xl relative overflow-hidden text-center space-y-6"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at center, rgba(254, 249, 195, 0.25) 0%, rgba(255, 255, 255, 1) 75%)',
                }}
              >
                {/* Ribete de esquina decorativo */}
                <div className="absolute top-2 left-2 text-cato-gold/40 text-xs font-serif select-none">
                  ✠
                </div>
                <div className="absolute top-2 right-2 text-cato-gold/40 text-xs font-serif select-none">
                  ✠
                </div>
                <div className="absolute bottom-2 left-2 text-cato-gold/40 text-xs font-serif select-none">
                  ✠
                </div>
                <div className="absolute bottom-2 right-2 text-cato-gold/40 text-xs font-serif select-none">
                  ✠
                </div>

                {/* Encabezado Institucional */}
                <div className="space-y-1">
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-cato-navy/70">
                    UNIVERSIDAD CATÓLICA BOLIVIANA "SAN PABLO"
                  </p>
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                    DEPARTAMENTO REGIONAL DE PASTORAL UNIVERSITARIA · LA PAZ
                  </p>
                  <div className="w-20 h-0.5 bg-cato-gold mx-auto my-2" />
                  <h2 className="text-xl sm:text-2xl font-serif font-black text-cato-navy tracking-tight pt-1">
                    CERTIFICADO DE CULMINACIÓN DE VOLUNTARIADO SOCIAL
                  </h2>
                </div>

                {/* Cuerpo del Diploma */}
                <div className="space-y-3 max-w-xl mx-auto text-sm text-slate-800 leading-relaxed">
                  <p className="text-xs text-cato-muted font-medium">Se confiere el presente testimonio a:</p>
                  <h3 className="text-2xl sm:text-3xl font-black text-cato-navy font-serif uppercase tracking-wide border-b-2 border-amber-200 pb-2 inline-block px-4">
                    {certificadoOficial.nombreCompleto}
                  </h3>
                  <p className="text-xs text-slate-600 font-semibold">
                    C.I. {certificadoOficial.ci} · Estudiante de la Carrera de{' '}
                    <strong className="text-cato-navy">{certificadoOficial.carrera}</strong>
                  </p>

                  <p className="pt-2 text-xs text-slate-700 leading-normal text-justify sm:text-center">
                    Por haber culminado con madurez humana, compromiso ético y vocación solidaria el
                    programa de voluntariado universitario <strong className="text-cato-navy">"Catovoluntarios"</strong>{' '}
                    durante el Semestre <strong className="text-cato-navy">{semestre}</strong>, prestando sus servicios
                    en el Proyecto Receptor:
                  </p>

                  <div className="bg-amber-50/80 border border-amber-200 rounded-xl py-2 px-4 inline-block font-extrabold text-sm text-cato-navy">
                    "{certificadoOficial.proyectoReceptor}"
                  </div>

                  <p className="text-xs text-slate-700">
                    Acreditando un total de{' '}
                    <span className="font-black text-base text-cato-navy underline decoration-cato-gold decoration-2">
                      {certificadoOficial.horasCumplidas} HORAS CRONOLÓGICAS
                    </span>{' '}
                    de servicio efectivo en campo a favor de la comunidad.
                  </p>

                  {/* Mención Honorífica si aplica */}
                  {certificadoOficial.distincionPremio && (
                    <div className="pt-2 flex items-center justify-center gap-1.5 text-xs font-black text-amber-800 bg-amber-100/80 border border-amber-300 py-1.5 px-4 rounded-full max-w-md mx-auto">
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Distinción Especial: {certificadoOficial.distincionPremio}</span>
                    </div>
                  )}
                </div>

                {/* Firmas de Autoridades de Pastoral */}
                <div className="pt-8 grid grid-cols-2 gap-8 max-w-lg mx-auto text-center border-t border-slate-200">
                  <div className="space-y-1">
                    <div className="w-36 h-0.5 bg-slate-400 mx-auto" />
                    <p className="text-[11px] font-black text-cato-navy">Pbro. Lic. Coordinador</p>
                    <p className="text-[10px] text-cato-muted">Director de Pastoral Universitaria</p>
                    <p className="text-[9px] text-slate-400">U.C.B. Regional La Paz</p>
                  </div>

                  <div className="space-y-1">
                    <div className="w-36 h-0.5 bg-slate-400 mx-auto" />
                    <p className="text-[11px] font-black text-cato-navy">Coordinación General</p>
                    <p className="text-[10px] text-cato-muted">Programa Catovoluntarios</p>
                    <p className="text-[9px] text-slate-400">Regional La Paz, {certificadoOficial.fechaEmision}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* PESTAÑA 2: CERTIFICADOS DE FUNDACIONES (Subidos por Centros) */}
      {/* ==================================================================== */}
      {activeTab === 'fundacion' && (
        <div className="bg-white rounded-2xl border border-cato-border shadow-card overflow-hidden">
          <div className="p-4 border-b border-cato-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
            <div>
              <h3 className="font-extrabold text-sm text-cato-navy flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-700" />
                Certificados Emitidos por Instituciones Aliadas
              </h3>
              <p className="text-xs text-cato-muted mt-0.5">
                Archivos PDF o diplomas propios que cada centro receptor subió desde su portal como respaldo institucional del voluntario.
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-purple-800 bg-purple-100 border border-purple-200 px-3 py-1 rounded-full">
                {certsFundacion.length} certificados registrados en BD
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-cato-canvas border-b border-cato-border text-[11px] uppercase text-cato-muted font-bold">
                  <th className="py-3 px-4">Voluntario</th>
                  <th className="py-3 px-4">CI / Carrera</th>
                  <th className="py-3 px-4">Proyecto Receptor</th>
                  <th className="py-3 px-4">Archivo PDF Subido</th>
                  <th className="py-3 px-4">Fecha de Carga</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cato-border">
                {certsFundacion.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-cato-muted">
                      Aún no hay certificados subidos por las fundaciones para la gestión {semestre}.
                    </td>
                  </tr>
                ) : (
                  certsFundacion.map((cf) => (
                    <tr key={cf.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-cato-navy">
                        {cf.usuario
                          ? `${cf.usuario.nombres} ${cf.usuario.primerApellido}`
                          : `Voluntario #${cf.idUsuario}`}
                      </td>
                      <td className="py-3 px-4 text-cato-muted">
                        {cf.usuario?.ci || 'N/D'} · {cf.usuario?.carrera || 'Carrera UCB'}
                      </td>
                      <td className="py-3 px-4 text-cato-slate font-semibold">
                        {cf.proyecto?.nombreProyecto || `Proyecto #${cf.idProyecto}`}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 text-purple-900 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-lg font-mono">
                          <FileText className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                          <span className="truncate max-w-[180px]">{cf.nombreArchivo}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-cato-muted">
                        {new Date(cf.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <a
                          href={cf.urlPdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-cato-navy text-white text-xs font-bold rounded-lg hover:bg-cato-navy-dark transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Ver / Descargar PDF</span>
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* PESTAÑA 3: FEEDBACK Y CIERRE INSTITUCIONAL (Bloques 1 al 4) */}
      {/* ==================================================================== */}
      {activeTab === 'feedback' && (
        <div className="bg-white rounded-2xl border border-cato-border shadow-card p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cato-border pb-4">
            <div>
              <h3 className="font-extrabold text-base text-cato-navy flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                Evaluación y Feedback Semestral de Proyectos Receptores
              </h3>
              <p className="text-xs text-cato-muted mt-0.5">
                Cuestionario institucional estructurado por bloques para medir el impacto y la continuidad del convenio pastoral.
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Bloque 4 Libre Obligatorio</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bloque Cuantitativo */}
            <div className="space-y-4 bg-slate-50/70 border border-cato-border rounded-xl p-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-cato-navy">
                Métricas Cuantitativas del Centro
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-cato-muted mb-1">
                    Voluntarios Recibidos
                  </label>
                  <input
                    type="number"
                    value={feedback.voluntariosRecibidos}
                    onChange={(e) =>
                      setFeedback({ ...feedback, voluntariosRecibidos: Number(e.target.value) })
                    }
                    className="w-full text-xs font-bold border border-cato-border rounded-lg px-3 py-1.5 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-cato-muted mb-1">
                    Voluntarios Culminados
                  </label>
                  <input
                    type="number"
                    value={feedback.voluntariosCulminados}
                    onChange={(e) =>
                      setFeedback({ ...feedback, voluntariosCulminados: Number(e.target.value) })
                    }
                    className="w-full text-xs font-bold border border-cato-border rounded-lg px-3 py-1.5 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-cato-muted mb-1">
                  Calificación al Desempeño del Grupo (1 a 5)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((estrella) => (
                    <button
                      key={estrella}
                      type="button"
                      onClick={() => setFeedback({ ...feedback, calificacionGrupo: estrella })}
                      className={`p-2 rounded-lg border flex items-center justify-center transition-all ${
                        feedback.calificacionGrupo >= estrella
                          ? 'bg-amber-100 border-amber-300 text-amber-600'
                          : 'bg-white border-slate-200 text-slate-300'
                      }`}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-cato-muted mb-1">
                  Calificación al Acompañamiento del Catolíder (1 a 5)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((estrella) => (
                    <button
                      key={estrella}
                      type="button"
                      onClick={() => setFeedback({ ...feedback, calificacionCatolider: estrella })}
                      className={`p-2 rounded-lg border flex items-center justify-center transition-all ${
                        feedback.calificacionCatolider >= estrella
                          ? 'bg-amber-100 border-amber-300 text-amber-600'
                          : 'bg-white border-slate-200 text-slate-300'
                      }`}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="continuidad"
                  checked={feedback.solicitaContinuidadConvenio}
                  onChange={(e) =>
                    setFeedback({ ...feedback, solicitaContinuidadConvenio: e.target.checked })
                  }
                  className="rounded text-cato-navy focus:ring-cato-navy"
                />
                <label htmlFor="continuidad" className="text-xs font-bold text-cato-navy cursor-pointer">
                  La institución solicita renovar el convenio para el próximo semestre
                </label>
              </div>
            </div>

            {/* Bloque 4 Libre Obligatorio */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-cato-navy mb-1 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-cato-gold fill-cato-gold" />
                  Bloque 4: Observaciones, Sugerencias e Impacto Social (Obligatorio)
                </label>
                <p className="text-[11px] text-cato-muted mb-2">
                  Este espacio de redacción libre sustituye formalmente los informes físicos extensos exigidos anteriormente.
                </p>
                <textarea
                  rows={6}
                  value={feedback.bloque4ObservacionesSugerenciasLibres}
                  onChange={(e) =>
                    setFeedback({
                      ...feedback,
                      bloque4ObservacionesSugerenciasLibres: e.target.value,
                    })
                  }
                  placeholder="Describe la vivencia con los voluntarios, anécdotas, sugerencias para la Pastoral y necesidades identificadas en la población beneficiaria..."
                  className="w-full text-xs p-3 border border-cato-border rounded-xl focus:outline-none focus:ring-2 focus:ring-cato-navy/20 bg-slate-50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-cato-muted mb-1">
                    Responsable de la Institución
                  </label>
                  <input
                    type="text"
                    value={feedback.nombreResponsableLlenado}
                    onChange={(e) =>
                      setFeedback({ ...feedback, nombreResponsableLlenado: e.target.value })
                    }
                    placeholder="Nombre completo"
                    className="w-full text-xs border border-cato-border rounded-lg px-3 py-1.5"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-cato-muted mb-1">
                    Cargo
                  </label>
                  <input
                    type="text"
                    value={feedback.cargoResponsable || ''}
                    onChange={(e) =>
                      setFeedback({ ...feedback, cargoResponsable: e.target.value })
                    }
                    placeholder="Ej: Directora General"
                    className="w-full text-xs border border-cato-border rounded-lg px-3 py-1.5"
                  />
                </div>
              </div>

              <div className="text-right pt-2">
                <Button
                  variant="cta"
                  onClick={handleGuardarFeedback}
                  disabled={guardandoFeedback}
                  leftIcon={
                    guardandoFeedback ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )
                  }
                >
                  {guardandoFeedback ? 'Guardando en BD...' : 'Guardar Feedback del Proyecto'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
