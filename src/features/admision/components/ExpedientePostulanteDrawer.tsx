import React, { useState } from 'react';
import type {
  Postulacion,
  EstadoPostulacion,
} from '../types/postulacion.types';
import {
  X,
  User,
  Heart,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Check,
} from 'lucide-react';

const toArraySafe = (val: unknown): string[] => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return val.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
};

interface ExpedienteDrawerProps {
  postulacion: Postulacion | null;
  abierto: boolean;
  onCerrar: () => void;
  userRol: 'ADMIN_PASTORAL' | 'CATOLIDER';
  onActualizarEstado: (
    id: number,
    estado: EstadoPostulacion,
    observaciones?: string,
  ) => Promise<void>;
}

export const ExpedientePostulanteDrawer: React.FC<ExpedienteDrawerProps> = ({
  postulacion,
  abierto,
  onCerrar,
  userRol,
  onActualizarEstado,
}) => {
  const [tabActiva, setTabActiva] = useState<'datos' | 'perfil' | 'compromiso'>('datos');
  const [nuevoEstado, setNuevoEstado] = useState<EstadoPostulacion>(
    postulacion?.estado || 'PENDIENTE',
  );
  const [observaciones, setObservaciones] = useState<string>(
    postulacion?.observacionesPostulacion || '',
  );
  const [guardando, setGuardando] = useState(false);
  const [feedbackMensaje, setFeedbackMensaje] = useState<{
    tipo: 'success' | 'error';
    texto: string;
  } | null>(null);

  React.useEffect(() => {
    if (postulacion) {
      setNuevoEstado(postulacion.estado);
      setObservaciones(postulacion.observacionesPostulacion || '');
      setFeedbackMensaje(null);
    }
  }, [postulacion]);

  if (!abierto || !postulacion) return null;

  const esCatolider = userRol === 'CATOLIDER';
  const tieneSobrecarga = postulacion.numeroMaterias > 6;
  const esMenor = postulacion.edad < 18;

  const handleGuardarCambios = async (estadoParaGuardar?: EstadoPostulacion) => {
    if (esCatolider) return;
    const estadoFinal = estadoParaGuardar || nuevoEstado;
    setGuardando(true);
    setFeedbackMensaje(null);
    try {
      await onActualizarEstado(postulacion.id, estadoFinal, observaciones);
      setFeedbackMensaje({
        tipo: 'success',
        texto: 'Resolución guardada exitosamente.',
      });
      setTimeout(() => {
        onCerrar();
      }, 900);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar el estado';
      setFeedbackMensaje({
        tipo: 'error',
        texto: `No se pudo actualizar: ${msg}`,
      });
    } finally {
      setGuardando(false);
    }
  };

  const seleccionarYGuardar = (estado: EstadoPostulacion) => {
    setNuevoEstado(estado);
  };

  const waUrl = `https://wa.me/591${postulacion.celular}?text=Hola%20${encodeURIComponent(
    postulacion.nombres,
  )},%20te%20escribimos%20de%20Pastoral%20Universitaria%20UCB%20sobre%20tu%20postulaci%C3%B3n%20${
    postulacion.codigoPostulacion
  }`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Cabecera Principal */}
        <div className="p-6 border-b border-cato-border bg-gradient-to-r from-cato-navy via-slate-900 to-cato-navy text-white flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-widest text-cato-gold bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
                {postulacion.codigoPostulacion}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-white/10 text-white">
                Gestión 2/2026
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {postulacion.nombres} {postulacion.primerApellido} {postulacion.segundoApellido || ''}
            </h2>
            <p className="text-xs text-slate-300 flex items-center gap-3">
              <span>C.I.: {postulacion.ci} {postulacion.expedido}</span>
              <span>•</span>
              <span>{postulacion.carrera}</span>
              <span>•</span>
              <span>{postulacion.tipoRelacionUcb}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onCerrar}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            title="Cerrar Ficha"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resumen Rápido para Toma de Decisiones (Executive Summary Card) */}
        <div className="p-4 bg-slate-50 border-b border-cato-border">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Badge Carga */}
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                  tieneSobrecarga
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                }`}
              >
                {tieneSobrecarga ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                )}
                <span>
                  {postulacion.numeroMaterias} materias ({tieneSobrecarga ? 'Carga Elevada' : 'Carga Óptima'})
                </span>
              </div>

              {/* Badge Edad & Permiso */}
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                  esMenor
                    ? postulacion.autorizacionPadresConfirmada
                      ? 'bg-blue-100 text-blue-900 border-blue-300'
                      : 'bg-rose-100 text-rose-900 border-rose-300'
                    : 'bg-slate-200 text-slate-800 border-slate-300'
                }`}
              >
                {esMenor ? (
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                ) : (
                  <User className="w-3.5 h-3.5 text-slate-600" />
                )}
                <span>
                  {postulacion.edad} años{' '}
                  {esMenor
                    ? postulacion.autorizacionPadresConfirmada
                      ? '(Menor con autorización)'
                      : '(Menor sin autorización)'
                    : '(Mayor de edad)'}
                </span>
              </div>

              {/* Badge Población */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white text-cato-slate border border-slate-300">
                <Heart className="w-3.5 h-3.5 text-cato-gold" />
                <span>Interés: {toArraySafe(postulacion.poblacionesInteres)[0] || 'Comunitario'}</span>
              </div>
            </div>

            {/* Enlace Directo a WhatsApp */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Contactar (+591 {postulacion.celular})</span>
            </a>
          </div>
        </div>

        {/* Pestañas de Navegación del Drawer */}
        <div className="flex border-b border-cato-border bg-white text-xs font-bold text-slate-600">
          <button
            type="button"
            onClick={() => setTabActiva('datos')}
            className={`flex-1 py-3.5 text-center border-b-2 transition-all flex items-center justify-center gap-2 ${
              tabActiva === 'datos'
                ? 'border-cato-navy text-cato-navy bg-slate-50/50'
                : 'border-transparent hover:bg-slate-50'
            }`}
          >
            <User className="w-4 h-4 text-slate-400" />
            Datos Personales & Académicos
          </button>
          <button
            type="button"
            onClick={() => setTabActiva('perfil')}
            className={`flex-1 py-3.5 text-center border-b-2 transition-all flex items-center justify-center gap-2 ${
              tabActiva === 'perfil'
                ? 'border-cato-navy text-cato-navy bg-slate-50/50'
                : 'border-transparent hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-slate-400" />
            Perfil, Vocación & Habilidades
          </button>
          <button
            type="button"
            onClick={() => setTabActiva('compromiso')}
            className={`flex-1 py-3.5 text-center border-b-2 transition-all flex items-center justify-center gap-2 ${
              tabActiva === 'compromiso'
                ? 'border-cato-navy text-cato-navy bg-slate-50/50'
                : 'border-transparent hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            Consentimiento & Compromisos
          </button>
        </div>

        {/* Contenido de la Ficha */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700">
          {tabActiva === 'datos' && (
            <div className="space-y-5">
              {/* Bloque de Información Personal */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <h3 className="text-xs font-bold text-cato-slate uppercase mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  Datos de Contacto e Institucionales
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Relación UCB</span>
                    <span className="font-semibold text-slate-900">{postulacion.tipoRelacionUcb}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Carrera</span>
                    <span className="font-semibold text-slate-900">{postulacion.carrera}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Fecha de Nacimiento</span>
                    <span className="font-semibold text-slate-900">
                      {postulacion.fechaNacimiento} ({postulacion.edad} años)
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Celular / WhatsApp</span>
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-700 font-bold underline inline-flex items-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3 text-emerald-600" />
                      +591 {postulacion.celular}
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Correo Electrónico</span>
                    <span className="font-semibold text-slate-900">{postulacion.correoElectronico}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Zona de Residencia</span>
                    <span className="font-semibold text-slate-900">{postulacion.zonaResidencia}</span>
                  </div>
                </div>
              </div>

              {/* Detalle de Carga Académica */}
              <div
                className={`p-5 rounded-2xl border ${
                  tieneSobrecarga
                    ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                    : 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {tieneSobrecarga ? (
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    )}
                    <span className="font-bold text-sm">
                      {postulacion.numeroMaterias} Materias Inscritas
                    </span>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-white/80 shadow-2xs">
                    {tieneSobrecarga ? 'Requiere Atención por Sobrecarga' : 'Carga Académica Compatible'}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed">
                  {tieneSobrecarga
                    ? 'El postulante declaró una carga superior al límite recomendado de 6 materias. Se sugiere dialogar la disponibilidad horaria en la entrevista presencial.'
                    : 'Cumple satisfactoriamente con la política de prevención de sobrecarga académica de Pastoral Universitaria.'}
                </p>

                {postulacion.tieneMateriasPesadas && (
                  <div className="mt-3 pt-3 border-t border-amber-200/80">
                    <span className="font-bold text-xs">Materias de alta exigencia declaradas:</span>
                    <p className="italic mt-1 text-slate-700 bg-white/70 p-2.5 rounded-lg border border-amber-200">
                      {postulacion.detalleMateriasPesadas || 'No especificadas'}
                    </p>
                  </div>
                )}
              </div>

              {/* Actividades Extracurriculares */}
              {postulacion.actividadesExtracurriculares > 0 && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <span className="font-bold text-slate-900">
                    Actividades extracurriculares adicionales:
                  </span>{' '}
                  <span className="font-semibold text-slate-700">
                    {postulacion.actividadesExtracurriculares} ({postulacion.detalleActividades || 'No especificadas'})
                  </span>
                </div>
              )}
            </div>
          )}

          {tabActiva === 'perfil' && (
            <div className="space-y-5">
              {/* Poblaciones */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-slate-500 block text-xs uppercase font-bold">
                  Poblaciones de Interés Preferidas:
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {toArraySafe(postulacion.poblacionesInteres).map((pob) => (
                    <span
                      key={pob}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-100 text-blue-900 border border-blue-200 font-bold text-xs"
                    >
                      <Heart className="w-3.5 h-3.5 text-blue-600" />
                      {pob}
                    </span>
                  ))}
                </div>
              </div>

              {/* Habilidades */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-slate-500 block text-xs uppercase font-bold">
                  Habilidades y Talentos Destacados:
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {toArraySafe(postulacion.habilidadesDestacadas).length > 0 ? (
                    toArraySafe(postulacion.habilidadesDestacadas).map((hab) => (
                      <span
                        key={hab}
                        className="px-3 py-1 rounded-full bg-white border border-slate-300 text-slate-800 font-medium text-xs shadow-2xs"
                      >
                        {hab}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 italic">No especificadas</span>
                  )}
                </div>
              </div>

              {/* 3 Palabras */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-slate-500 block text-xs uppercase font-bold">
                  3 Palabras que Definen su Personalidad:
                </span>
                <div className="flex flex-wrap gap-2.5 pt-1">
                  {toArraySafe(postulacion.tresPalabrasPersonalidad).map((palabra, i) => (
                    <span
                      key={i}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-100 text-amber-950 border border-amber-300 font-black text-xs shadow-2xs"
                    >
                      &quot;{palabra}&quot;
                    </span>
                  ))}
                </div>
              </div>

              {/* Experiencia Previa */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900">Experiencia previa en voluntariado: </span>
                <span className="font-semibold text-slate-700">
                  {postulacion.experienciaVoluntariadoPrevia ? 'Sí' : 'No'}
                </span>
                {postulacion.detalleExperiencia && (
                  <p className="mt-1.5 text-slate-600 italic bg-white p-3 rounded-xl border border-slate-200">
                    {postulacion.detalleExperiencia}
                  </p>
                )}
              </div>

              {/* Alergias */}
              {postulacion.alergiasCondicionesMedicas && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-950 space-y-1">
                  <span className="font-bold">Alergias o consideraciones médicas registradas: </span>
                  <p className="text-xs text-rose-900 mt-1">
                    {postulacion.alergiasCondicionesMedicas}
                  </p>
                </div>
              )}
            </div>
          )}

          {tabActiva === 'compromiso' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">Condición de Edad:</span>
                  <span
                    className={`px-3 py-1 rounded-full font-bold text-xs ${
                      esMenor
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}
                  >
                    {esMenor ? 'Menor de 18 años' : 'Mayor de edad'}
                  </span>
                </div>

                {esMenor && (
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-800">
                      Autorización de Padres / Tutores Legales:
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      {postulacion.autorizacionPadresConfirmada ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">
                            Consentimiento confirmado en formulario institucional
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-600" />
                          <span className="text-rose-600 font-bold">
                            Pendiente de verificación presencial
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )}

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800">
                    Compromisos Formativos y Disponibilidad de 4 hrs semanales:
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">
                      Términos aceptados por el postulante
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Panel Inferior: Decisiones de Admisión en 1 Clic (Sin combobox genérico) */}
        <div className="p-6 border-t border-cato-border bg-slate-50">
          {esCatolider ? (
            <div className="p-4 rounded-2xl bg-blue-50/90 border border-blue-200 text-blue-950 text-xs flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
              <span>
                <strong>Modo Coordinador (Solo Consulta):</strong> Acceso habilitado para preparar la entrevista personal de los aspirantes asignados. Las resoluciones formales corresponden a Pastoral Universitaria.
              </span>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-cato-slate uppercase mb-2">
                  Resolución Rápida de Admisión (Selecciona en un clic):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Opción 1: Apto para Entrevista */}
                  <button
                    type="button"
                    onClick={() => seleccionarYGuardar('APTO_ENTREVISTA')}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      nuevoEstado === 'APTO_ENTREVISTA'
                        ? 'border-emerald-600 bg-emerald-100/70 shadow-sm ring-2 ring-emerald-600'
                        : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-emerald-950">Apto para Entrevista</span>
                      <CheckCircle2
                        className={`w-4 h-4 ${
                          nuevoEstado === 'APTO_ENTREVISTA' ? 'text-emerald-700' : 'text-slate-300'
                        }`}
                      />
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1">
                      Habilita al aspirante para la entrevista presencial.
                    </span>
                  </button>

                  {/* Opción 2: Observado por Sobrecarga */}
                  <button
                    type="button"
                    onClick={() => seleccionarYGuardar('OBSERVADO_SOBRECARGA')}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      nuevoEstado === 'OBSERVADO_SOBRECARGA'
                        ? 'border-amber-600 bg-amber-100/70 shadow-sm ring-2 ring-amber-600'
                        : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-amber-950">Observar por Carga</span>
                      <AlertTriangle
                        className={`w-4 h-4 ${
                          nuevoEstado === 'OBSERVADO_SOBRECARGA' ? 'text-amber-700' : 'text-slate-300'
                        }`}
                      />
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1">
                      Carga elevada o requiere acuerdo de ajuste horario.
                    </span>
                  </button>

                  {/* Opción 3: Descartado */}
                  <button
                    type="button"
                    onClick={() => seleccionarYGuardar('DESCARTADO')}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      nuevoEstado === 'DESCARTADO'
                        ? 'border-rose-600 bg-rose-100/70 shadow-sm ring-2 ring-rose-600'
                        : 'border-slate-200 bg-white hover:border-rose-300 hover:bg-rose-50/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-rose-950">Descartar</span>
                      <XCircle
                        className={`w-4 h-4 ${
                          nuevoEstado === 'DESCARTADO' ? 'text-rose-700' : 'text-slate-300'
                        }`}
                      />
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1">
                      No cumple requisitos mínimos institucionales.
                    </span>
                  </button>
                </div>
              </div>

              {/* Observaciones Internas */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                  Observaciones internas de Pastoral:
                </label>
                <textarea
                  rows={2}
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Detalles sobre horarios acordados, condiciones de entrevista o motivo de observación..."
                  className="cato-input py-2 h-auto text-xs"
                />
              </div>

              {/* Feedback Message */}
              {feedbackMensaje && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    feedbackMensaje.tipo === 'success'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-rose-100 text-rose-900 border border-rose-300'
                  }`}
                >
                  {feedbackMensaje.tipo === 'success' ? (
                    <Check className="w-4 h-4 text-emerald-700" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-700" />
                  )}
                  <span>{feedbackMensaje.texto}</span>
                </div>
              )}

              {/* Botones de Acción */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onCerrar}
                  className="btn-outline text-xs px-5 py-2.5 font-bold"
                >
                  Cerrar Ficha
                </button>
                <button
                  type="button"
                  disabled={guardando}
                  onClick={() => handleGuardarCambios()}
                  className="btn-primary text-xs px-6 py-2.5 font-bold shadow-sm inline-flex items-center gap-2"
                >
                  {guardando ? (
                    'Guardando resolución...'
                  ) : (
                    <>
                      <Check className="w-4 h-4" /> Guardar Resolución
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
