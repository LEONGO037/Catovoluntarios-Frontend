/* oxlint-disable react/set-state-in-effect */
import React, { useState, useEffect, useCallback } from 'react';
import {
  FileBadge,
  Building2,
  CheckCircle2,
  Copy,
  Download,
  Star,
  Send,
  Users,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { semaforosService } from '../../services/semaforos.service';
import type {
  FeedbackInstitucion,
  PlantillaCertificado,
} from '../../types/semaforo.types';

export const P21FeedbackCertificados: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'feedback' | 'certificados'>('feedback');

  // Estados Feedback
  const [feedback, setFeedback] = useState<FeedbackInstitucion>({
    proyectoId: 1,
    nombreProyecto: 'Hogar de Ancianos San Ramón',
    semestre: '2/2026',
    voluntariosRecibidos: 12,
    voluntariosCulminados: 11,
    bajasAbandonos: 1,
    calificacionGrupo: 5,
    calificacionCatolider: 5,
    solicitaContinuidadConvenio: true,
    cuposSolicitadosProximoSemestre: 14,
    bloque4ObservacionesSugerenciasLibres:
      'Agradecemos sinceramente el apoyo brindado por la Pastoral Universitaria y sus estudiantes este semestre. Los voluntarios mostraron un alto grado de empatía, calidez y puntualidad en cada jornada en el Hogar. En particular destacamos el trabajo de Rodrigo Quispe, quien confeccionó juegos de mesa adaptados para el área de memoria. Para el próximo semestre sugerimos mantener los talleres en sábados por la mañana.',
    nombreResponsableLlenado: 'Lic. Miriam Salinas',
    cargoResponsable: 'Trabajadora Social y Supervisora de Voluntariado',
  });

  const [notificacion, setNotificacion] = useState<{
    tipo: 'success' | 'warning';
    mensaje: string;
  } | null>(null);

  // Estados Certificados
  const [certificado, setCertificado] = useState<PlantillaCertificado | null>(null);
  const [copiado, setCopiado] = useState<boolean>(false);
  const [usuarioCertificadoId, setUsuarioCertificadoId] = useState<number>(1);

  // Lista de voluntarios en el centro para la tabla de evaluación individual P-21
  const evaluacionesVoluntarios = [
    {
      id: 1,
      nombre: 'Rodrigo Quispe Mendoza',
      carrera: 'Ing. Biomédica',
      tareas: 'Estimulación cognitiva, memoria, lectura guiada y juegos adaptados',
      calificacion: 5,
      contribucion:
        'Excelente disposición; diseñó juegos de mesa adaptados que motivaron a los abuelitos.',
      beneficiarios: '28 adultos mayores',
    },
    {
      id: 2,
      nombre: 'Camila Vargas Ramos',
      carrera: 'Psicología',
      tareas: 'Acompañamiento, soporte en comedor y dinámicas en jardín',
      calificacion: 5,
      contribucion:
        'Cálida y muy paciente. Gran empatía en el pabellón San José.',
      beneficiarios: '24 adultos mayores',
    },
    {
      id: 3,
      nombre: 'Diego Fernández Calle',
      carrera: 'Administración',
      tareas: 'Paseos en jardín y apoyo en logística de comedor',
      calificacion: 3,
      contribucion:
        'Tuvo 2 atrasos al inicio del ciclo, pero cumplió de forma responsable.',
      beneficiarios: '15 adultos mayores',
    },
    {
      id: 4,
      nombre: 'Esteban Choque Huanca',
      carrera: 'Ing. Civil',
      tareas: 'Apoyo en lavado de bandejas',
      calificacion: 1,
      contribucion: 'Abandonó en la tercera semana. Dejó las tareas asignadas.',
      beneficiarios: '4 personas',
    },
  ];

  // Cargar datos de feedback
  const cargarFeedback = useCallback(async () => {
    try {
      const data = await semaforosService.obtenerFeedbackProyecto(1, '2/2026');
      setFeedback(data);
    } catch (e) {
      console.error('Error cargando feedback:', e);
    }
  }, []);

  // Cargar certificado
  const cargarCertificado = useCallback(async () => {
    try {
      const cert = await semaforosService.generarPlantillaCertificado(
        usuarioCertificadoId,
        '2/2026',
      );
      setCertificado(cert);
    } catch (e) {
      console.error('Error cargando certificado:', e);
    }
  }, [usuarioCertificadoId]);

  useEffect(() => {
    void cargarFeedback();
  }, [cargarFeedback]);

  useEffect(() => {
    void cargarCertificado();
  }, [cargarCertificado]);

  // Guardar / Enviar Feedback
  const handleGuardarFeedback = async () => {
    if (
      !feedback.bloque4ObservacionesSugerenciasLibres ||
      feedback.bloque4ObservacionesSugerenciasLibres.trim() === ''
    ) {
      setNotificacion({
        tipo: 'warning',
        mensaje:
          'El Bloque 4 de observaciones y sugerencias libres es obligatorio según Pastoral.',
      });
      return;
    }

    try {
      await semaforosService.guardarFeedbackProyecto(feedback);
      setNotificacion({
        tipo: 'success',
        mensaje:
          '¡Informe semestral del centro y Bloque 4 libre registrado exitosamente para Pastoral!',
      });
      setTimeout(() => setNotificacion(null), 5000);
    } catch (err: any) {
      alert(err.message || 'Error guardando feedback');
    }
  };

  // Copiar plantilla de certificado al portapapeles
  const handleCopiarCertificado = () => {
    if (!certificado) return;
    navigator.clipboard.writeText(certificado.textoPreformateadoCopiar);
    setCopiado(true);
    setNotificacion({
      tipo: 'success',
      mensaje:
        '¡Datos oficiales del certificado copiados al portapapeles! Listo para pegar en Word o documento oficial.',
    });
    setTimeout(() => {
      setCopiado(false);
      setNotificacion(null);
    }, 4000);
  };

  // Descargar plantilla
  const handleDescargarPlantilla = () => {
    if (!certificado) return;
    const element = document.createElement('a');
    const file = new Blob([certificado.textoPreformateadoCopiar], {
      type: 'text/plain;charset=utf-8',
    });
    element.href = URL.createObjectURL(file);
    element.download = `Certificado_${certificado.ci.replace(/\s+/g, '_')}_2-2026.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header con Badge de Pantalla */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cato-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-100 text-cato-navy font-bold text-xs font-mono">
              P-21
            </span>
            <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-semibold text-xs">
              Requerimiento RF-23
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-cato-navy mt-1 tracking-tight flex items-center gap-2">
            <FileBadge className="w-6 h-6 text-cato-navy" />
            Feedback Semestral de Centros y Emisión de Certificados
          </h1>
          <p className="text-xs text-cato-muted mt-0.5">
            Cierre de gestión con proyectos receptores, Bloque 4 libre y generador de plantillas descargables de certificación.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {activeTab === 'feedback' ? (
            <button
              onClick={handleGuardarFeedback}
              className="btn-cta text-xs flex items-center gap-1.5 shadow-sm"
              type="button"
            >
              <Send className="w-4 h-4" />
              Enviar Informe a Pastoral UCB
            </button>
          ) : (
            <button
              onClick={handleCopiarCertificado}
              className="btn-cta text-xs flex items-center gap-1.5 shadow-sm"
              type="button"
            >
              <Copy className="w-4 h-4" />
              {copiado ? '¡Copiado al Portapapeles!' : 'Copiar Datos de Certificado'}
            </button>
          )}
        </div>
      </div>

      {/* Alerta toast */}
      {notificacion && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 shadow-sm animate-fadeIn ${
            notificacion.tipo === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-amber-50 border-amber-300 text-amber-800'
          }`}
        >
          {notificacion.tipo === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          )}
          <span className="font-semibold">{notificacion.mensaje}</span>
        </div>
      )}

      {/* 2. Pestañas de Navegación P-21 */}
      <div className="border-b border-cato-border flex items-center gap-3">
        <button
          onClick={() => setActiveTab('feedback')}
          className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'feedback'
              ? 'border-cato-navy text-cato-navy'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          type="button"
        >
          <Building2 className="w-4 h-4" />
          Feedback e Informe del Proyecto Receptor (RF-23)
          <span className="bg-purple-100 text-purple-800 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
            Bloque 4 Libre
          </span>
        </button>

        <button
          onClick={() => setActiveTab('certificados')}
          className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'certificados'
              ? 'border-cato-navy text-cato-navy'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          type="button"
        >
          <FileText className="w-4 h-4 text-cato-navy" />
          Plantilla y Emisión de Certificados de Conclusión
          <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
            1-Clic Copy
          </span>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* SECCIÓN 1: INFORME Y FEEDBACK SEMESTRAL DEL PROYECTO RECEPTOR */}
      {/* ==================================================================== */}
      {activeTab === 'feedback' && (
        <div className="space-y-6">
          {/* Bloque 1: Identificación y Métricas Globales */}
          <div className="cato-card p-5 space-y-4 shadow-sm">
            <div className="border-b border-cato-border pb-3 flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-cato-navy flex items-center gap-2">
                <Building2 className="w-4 h-4 text-cato-steel" />
                1. Datos del Centro y Métricas Globales del Periodo
              </h2>
              <span className="text-xs text-cato-muted font-mono">Semestre 2/2026</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block font-bold text-cato-navy mb-1">Proyecto Receptor</label>
                <input
                  type="text"
                  readOnly
                  value={feedback.nombreProyecto}
                  className="w-full font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold text-cato-navy mb-1">Supervisor en Sitio</label>
                <input
                  type="text"
                  readOnly
                  value={feedback.nombreResponsableLlenado}
                  className="w-full font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold text-cato-navy mb-1">Cargo Institucional</label>
                <input
                  type="text"
                  readOnly
                  value={feedback.cargoResponsable}
                  className="w-full font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold text-cato-navy mb-1">Catolíder Asignado</label>
                <input
                  type="text"
                  readOnly
                  value="Mateo Alarcón (Catolíder Titular)"
                  className="w-full font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-700"
                />
              </div>
            </div>

            {/* Métricas del centro */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-blue-800 uppercase">
                    Voluntarios Recibidos
                  </span>
                  <div className="text-2xl font-black text-cato-navy mt-0.5">
                    {feedback.voluntariosRecibidos} Voluntarios
                  </div>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>

              <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase">
                    Culminaron Satisfactoriamente
                  </span>
                  <div className="text-2xl font-black text-emerald-700 mt-0.5">
                    {feedback.voluntariosCulminados} Voluntarios
                  </div>
                </div>
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>

              <div className="bg-red-50/70 p-3.5 rounded-xl border border-red-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-red-800 uppercase">
                    Bajas / Abandonos
                  </span>
                  <div className="text-2xl font-black text-red-700 mt-0.5">
                    {feedback.bajasAbandonos} Voluntario
                  </div>
                </div>
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
            </div>
          </div>

          {/* Bloque 2: Evaluación Individual por Voluntario */}
          <div className="cato-card p-0 overflow-hidden shadow-card">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-cato-border flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-cato-navy flex items-center gap-2">
                <Users className="w-4 h-4 text-cato-steel" />
                2. Evaluación Individual por Voluntario (Aporte y Desempeño en Campo)
              </h2>
              <span className="text-xs text-cato-muted font-semibold">
                Escala: 1 (Deficiente) a 5 (Excelente)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-slate-200 text-cato-navy font-bold">
                    <th className="py-2.5 px-4 min-w-[180px]">Voluntario</th>
                    <th className="py-2.5 px-3 min-w-[200px]">Tareas Realizadas en el Centro</th>
                    <th className="py-2.5 px-3 text-center w-36">Calificación</th>
                    <th className="py-2.5 px-4 min-w-[240px]">
                      Contribución y Mejoras Observadas
                    </th>
                    <th className="py-2.5 px-3 text-center w-32">Beneficiarios</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {evaluacionesVoluntarios.map((item) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50 ${
                        item.calificacion === 1 ? 'bg-red-50/20' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-slate-900">{item.nombre}</div>
                        <div className="text-[11px] text-slate-500">{item.carrera}</div>
                      </td>

                      <td className="py-3 px-3 text-slate-700 leading-relaxed">
                        {item.tareas}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-0.5 text-amber-500 font-bold text-sm">
                          {Array.from({ length: item.calificacion }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          ({item.calificacion}/5)
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-600 italic">
                        "{item.contribucion}"
                      </td>

                      <td className="py-3 px-3 text-center font-mono font-bold text-cato-navy">
                        {item.beneficiarios}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bloque 3: Solicitud de Cupos y Renovación de Convenio */}
          <div className="cato-card p-5 space-y-4 shadow-sm">
            <div className="border-b border-cato-border pb-3 flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-cato-navy flex items-center gap-2">
                <Building2 className="w-4 h-4 text-cato-steel" />
                3. Solicitud de Cupos y Renovación de Convenio (Semestre 1/2027)
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">¿Desean renovar convenio?</span>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs border border-emerald-300">
                  Sí, con agrado ✓
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
                <thead>
                  <tr className="bg-slate-50 text-cato-navy border-b border-slate-200 font-bold">
                    <th className="py-2.5 px-3">Área de Servicio Solicitada</th>
                    <th className="py-2.5 px-3">Perfil Recomendado</th>
                    <th className="py-2.5 px-3 text-center">Mañana</th>
                    <th className="py-2.5 px-3 text-center">Tarde</th>
                    <th className="py-2.5 px-3 text-center">Sábados</th>
                    <th className="py-2.5 px-3 text-center font-extrabold">Cupos Requeridos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-800">
                      Estimulación Cognitiva y Memoria
                    </td>
                    <td className="py-2 px-3 text-slate-500">Psicología / Fisioterapia / Biomédica</td>
                    <td className="py-2 px-3 text-center font-bold">2</td>
                    <td className="py-2 px-3 text-center font-bold">2</td>
                    <td className="py-2 px-3 text-center font-bold">2</td>
                    <td className="py-2 px-3 text-center font-black text-cato-navy">6 Cupos</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-800">
                      Enfermería y Acompañamiento
                    </td>
                    <td className="py-2 px-3 text-slate-500">Medicina / Enfermería</td>
                    <td className="py-2 px-3 text-center font-bold">2</td>
                    <td className="py-2 px-3 text-center font-bold">2</td>
                    <td className="py-2 px-3 text-center font-bold">0</td>
                    <td className="py-2 px-3 text-center font-black text-cato-navy">4 Cupos</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-800">
                      Cocina y Comedor Comunitario
                    </td>
                    <td className="py-2 px-3 text-slate-500">Cualquier carrera UCB</td>
                    <td className="py-2 px-3 text-center font-bold">3</td>
                    <td className="py-2 px-3 text-center font-bold">1</td>
                    <td className="py-2 px-3 text-center font-bold">0</td>
                    <td className="py-2 px-3 text-center font-black text-cato-navy">4 Cupos</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="bg-blue-50/60 font-black border-t border-slate-200 text-cato-navy">
                    <td colSpan={5} className="py-2.5 px-3 text-right">
                      TOTAL VACANTES SOLICITADAS PARA EL PRÓXIMO SEMESTRE:
                    </td>
                    <td className="py-2.5 px-3 text-center text-sm font-black text-cato-navy">
                      14 Vacantes
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Bloque 4 (NUEVO REQUERIMIENTO PASTORAL): Observaciones y Sugerencias Libres */}
          <div className="bg-gradient-to-r from-purple-50/70 to-blue-50/50 rounded-2xl border-2 border-purple-300 p-6 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📝</span>
                <div>
                  <h3 className="text-sm font-black text-purple-950 uppercase tracking-tight">
                    Bloque 4: Observaciones, Sugerencias y Testimonio Libre del Proyecto Receptor
                  </h3>
                  <p className="text-xs text-purple-800">
                    Requerimiento específico de Pastoral UCB para evitar informes físicos largos y agilizar la retroalimentación.
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-purple-200 text-purple-900 font-extrabold text-[11px]">
                Obligatorio
              </span>
            </div>

            <textarea
              rows={4}
              value={feedback.bloque4ObservacionesSugerenciasLibres}
              onChange={(e) =>
                setFeedback((f) => ({
                  ...f,
                  bloque4ObservacionesSugerenciasLibres: e.target.value,
                }))
              }
              placeholder="Escriba aquí los comentarios institucionales, anécdotas, sugerencias de mejora o testimonios del centro respecto al desempeño de los voluntarios y su Catolíder..."
              className="w-full text-xs p-3.5 rounded-xl border border-purple-300 bg-white focus:border-purple-600 focus:ring-1 focus:ring-purple-600 shadow-xs leading-relaxed"
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500 italic">
                Firma institucional registrada para: <strong>{feedback.nombreResponsableLlenado}</strong> ({feedback.cargoResponsable}).
              </span>
              <button
                type="button"
                onClick={handleGuardarFeedback}
                className="btn-cta text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-4 h-4" />
                Confirmar y Transmitir Informe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SECCIÓN 2: GENERADOR DE PLANTILLAS Y EMISIÓN DE CERTIFICADOS */}
      {/* ==================================================================== */}
      {activeTab === 'certificados' && certificado && (
        <div className="space-y-6">
          {/* Banner Explicativo Pastoral */}
          <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎓</span>
              <div>
                <h3 className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                  Generador Oficial de Datos de Certificados de Conclusión
                </h3>
                <p className="text-xs text-emerald-900 mt-0.5 leading-relaxed">
                  Genera la plantilla y resumen descargable con los datos exactos del estudiante y actividades del centro, para copiar y pegar en un solo clic en Word o plantilla oficial sin redactar nada desde cero.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleDescargarPlantilla}
                className="btn-secondary text-xs flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                Descargar Texto (.txt)
              </button>
              <button
                type="button"
                onClick={handleCopiarCertificado}
                className="btn-cta text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Copy className="w-4 h-4" />
                {copiado ? '¡Copiado!' : 'Copiar Datos'}
              </button>
            </div>
          </div>

          {/* Selector de Voluntario */}
          <div className="cato-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <label className="text-xs font-bold text-cato-navy shrink-0">
                Seleccionar Estudiante Voluntario:
              </label>
              <select
                value={usuarioCertificadoId}
                onChange={(e) => setUsuarioCertificadoId(Number(e.target.value))}
                className="text-xs border border-cato-border rounded-lg p-2 bg-white font-semibold text-slate-800 w-full sm:w-80"
              >
                <option value={1}>Rodrigo Quispe Mendoza (8392104 LP) — 54 hrs</option>
                <option value={2}>Camila Vargas Ramos (9283102 LP) — 48 hrs</option>
                <option value={3}>Ignacio Ticona Mamani (7610943 LP) — 48 hrs</option>
                <option value={4}>Sofía Arce Del Carpio (8401923 LP) — 44 hrs</option>
              </select>
            </div>

            <div className="text-xs text-cato-muted font-medium">
              Horas Auditadas: <strong className="text-cato-navy">{certificado.horasCumplidas} hrs cumplidas</strong>
            </div>
          </div>

          {/* Vista Previa de la Plantilla de Certificado */}
          <div className="bg-white rounded-2xl border-2 border-slate-300 p-8 shadow-xl space-y-6 max-w-4xl mx-auto relative overflow-hidden">
            {/* Membrete institucional Pastoral */}
            <div className="text-center space-y-2 border-b-2 border-cato-gold pb-6">
              <div className="w-12 h-12 rounded-2xl bg-cato-navy text-cato-gold font-black text-2xl flex items-center justify-center mx-auto shadow-md">
                C
              </div>
              <h2 className="text-lg font-black text-cato-navy tracking-tight uppercase">
                Universidad Católica Boliviana "San Pablo" — Regional La Paz
              </h2>
              <p className="text-xs font-bold text-cato-subtitle uppercase tracking-widest">
                Dirección de Pastoral Universitaria · Programa Catovoluntarios
              </p>
            </div>

            {/* Título Certificado */}
            <div className="text-center space-y-1">
              <span className="text-xs text-slate-400 font-mono uppercase tracking-wider block">
                Plantilla Oficial de Certificación Social
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                CERTIFICADO DE CULMINACIÓN DE VOLUNTARIADO
              </h3>
            </div>

            {/* Cuerpo del Certificado */}
            <div className="text-sm text-slate-700 leading-relaxed text-center max-w-2xl mx-auto space-y-4">
              <p>La Dirección de Pastoral Universitaria certifica que el/la estudiante universitario/a:</p>
              
              <div className="py-2 border-y border-dashed border-slate-300">
                <div className="text-xl font-extrabold text-cato-navy tracking-tight">
                  {certificado.nombreCompleto}
                </div>
                <div className="text-xs font-bold text-slate-600 mt-0.5">
                  Carnet de Identidad: <span className="font-mono text-slate-900">{certificado.ci}</span> · Carrera: {certificado.carrera}
                </div>
              </div>

              <p className="text-xs leading-relaxed text-justify">
                Ha culminado satisfactoriamente su participación activa en el Programa de Solidaridad y Servicio Social Universitario "Catovoluntarios" durante el periodo <strong>{certificado.semestre}</strong>, habiendo realizado sus jornadas de voluntariado en el Proyecto Receptor:
              </p>

              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 font-extrabold text-cato-navy text-sm">
                "{certificado.proyectoReceptor}"
              </div>

              <p className="text-xs leading-relaxed text-justify">
                Cumpliendo un total de <strong className="text-cato-navy">{certificado.horasCumplidas} HORAS CRONOLÓGICAS DE VOLUNTARIADO SOCIAL</strong> en campo, habiendo desempeñado actividades de {certificado.actividadesRealizadas.toLowerCase()} con alto sentido de madurez humana, ética y carisma pastoral.
              </p>
            </div>

            {/* Firmas simuladas */}
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 text-center text-xs">
              <div className="space-y-1">
                <div className="w-40 border-b border-slate-400 mx-auto pb-6"></div>
                <div className="font-extrabold text-slate-800">Lic. Andrea Moscoso</div>
                <div className="text-[11px] text-slate-500">Coordinadora de Pastoral UCB</div>
              </div>

              <div className="space-y-1">
                <div className="w-40 border-b border-slate-400 mx-auto pb-6"></div>
                <div className="font-extrabold text-slate-800">Lic. Miriam Salinas</div>
                <div className="text-[11px] text-slate-500">Supervisora del Proyecto Receptor</div>
              </div>
            </div>

            {/* Footer de la plantilla */}
            <div className="text-center text-[10px] text-slate-400 font-mono pt-4 border-t border-slate-100 flex items-center justify-between">
              <span>La Paz, {certificado.fechaEmision}</span>
              <span>Código Validación Pastoral: CERT-2026-LP-{certificado.usuarioId}04</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
