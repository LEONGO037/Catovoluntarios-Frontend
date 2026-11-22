import React, { useState } from 'react';
import { usePostulacionForm } from '../hooks/usePostulacionForm';
import { WizardStepper } from './WizardStepper';
import { Step1Identificacion } from './Step1Identificacion';
import { Step2FiltroAcademico } from './Step2FiltroAcademico';
import { Step3PerfilMotivacion } from './Step3PerfilMotivacion';
import { Step4Consentimiento } from './Step4Consentimiento';
import { ModalExitoPostulacion } from './ModalExitoPostulacion';
import { NotificationModal } from '../../../components/feedback/NotificationModal';
import { postulacionesApi } from '../../../services/postulaciones.service';
import { ArrowLeft, ArrowRight, Send } from 'lucide-react';

interface PostulacionWizardProps {
  onFinalizar?: () => void;
}

export const PostulacionWizard: React.FC<PostulacionWizardProps> = ({
  onFinalizar,
}) => {
  const {
    pasoActual,
    formData,
    updateField,
    zonaEspecifica,
    setZonaEspecifica,
    tieneSobrecarga,
    esMenorDeEdad,
    esRolNoEstudiantil,
    notificacion,
    mostrarNotificacion,
    cerrarNotificacion,
    avanzarPaso,
    retrocederPaso,
    validarPasoActual,
  } = usePostulacionForm();

  const [enviando, setEnviando] = useState(false);
  const [codigoGenerado, setCodigoGenerado] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pasoActual < 4) {
      avanzarPaso();
      return;
    }

    const validacion = validarPasoActual();
    if (!validacion.valido) {
      mostrarNotificacion(
        validacion.titulo || 'Atención',
        validacion.mensaje || 'Verifica los campos obligatorios.',
        'warning',
      );
      return;
    }

    setEnviando(true);
    try {
      const res = await postulacionesApi.enviarPostulacion(formData);
      setCodigoGenerado(res.codigoPostulacion);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al enviar la postulación';
      mostrarNotificacion(
        'Error de Envío',
        `No se pudo enviar la postulación: ${msg}`,
        'error',
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      {/* Cabecera Institucional */}
      <div className="text-center mb-6">
        <span className="text-xs font-bold text-cato-gold bg-cato-navy px-3 py-1 rounded-full uppercase tracking-wider">
          Convocatoria Gestión 2026
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-cato-navy mt-2 tracking-tight">
          Formulario Oficial de Postulación
        </h1>
        <p className="text-xs sm:text-sm text-cato-muted mt-1">
          Programa Catovoluntarios — Pastoral Universitaria UCB Regional La Paz
        </p>
      </div>

      {/* Stepper de 4 Pasos */}
      <WizardStepper pasoActual={pasoActual} />

      {/* Tarjeta Contenedora del Formulario */}
      <div className="cato-card border border-cato-border shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          {pasoActual === 1 && (
            <Step1Identificacion
              formData={formData}
              updateField={updateField}
              esRolNoEstudiantil={esRolNoEstudiantil}
              zonaEspecifica={zonaEspecifica}
              setZonaEspecifica={setZonaEspecifica}
            />
          )}

          {pasoActual === 2 && (
            <Step2FiltroAcademico
              formData={formData}
              updateField={updateField}
              alertaSobrecargaAbierta={false}
              setAlertaSobrecargaAbierta={() => {}}
            />
          )}

          {pasoActual === 3 && (
            <Step3PerfilMotivacion formData={formData} updateField={updateField} />
          )}

          {pasoActual === 4 && (
            <Step4Consentimiento
              formData={formData}
              updateField={updateField}
              esMenorDeEdad={esMenorDeEdad}
            />
          )}

          {/* Botones de Navegación del Wizard */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
            {pasoActual > 1 ? (
              <button
                type="button"
                onClick={retrocederPaso}
                disabled={enviando}
                className="btn-outline text-xs px-4 py-2.5 inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Anterior
              </button>
            ) : (
              <div />
            )}

            {pasoActual < 4 ? (
              <button
                type="button"
                onClick={avanzarPaso}
                disabled={pasoActual === 2 && tieneSobrecarga}
                className={`text-xs px-6 py-2.5 font-bold rounded-lg transition-all inline-flex items-center gap-2 ${
                  pasoActual === 2 && tieneSobrecarga
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'btn-cta'
                }`}
              >
                Continuar al Paso {pasoActual + 1} <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={enviando || (esMenorDeEdad && !formData.autorizacionPadresConfirmada)}
                className="btn-cta text-xs px-8 py-2.5 font-bold shadow-md disabled:opacity-50 inline-flex items-center gap-2"
              >
                {enviando ? (
                  'Enviando postulación...'
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Finalizar y Enviar Postulación
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Modal de Éxito al completar */}
      {codigoGenerado && (
        <ModalExitoPostulacion
          codigoPostulacion={codigoGenerado}
          nombres={formData.nombres}
          celular={formData.celular}
          onCerrar={() => {
            setCodigoGenerado(null);
            if (onFinalizar) onFinalizar();
          }}
        />
      )}

      {/* Modal Reusable de Notificación (Reemplaza native alert) */}
      <NotificationModal
        abierto={notificacion.abierto}
        tipo={notificacion.tipo}
        titulo={notificacion.titulo}
        mensaje={notificacion.mensaje}
        onCerrar={cerrarNotificacion}
      />
    </div>
  );
};
