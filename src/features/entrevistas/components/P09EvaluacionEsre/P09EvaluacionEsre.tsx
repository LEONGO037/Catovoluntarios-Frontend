import { useEffect, useState, type FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Lock, Save } from 'lucide-react';
import { AlertBanner } from '../../../../components/feedback/AlertBanner';
import { Button } from '../../../../components/ui/Button';
import { psicologiaApi } from '../../../../services/psicologia.service';
import { DICTAMEN_ENTREVISTA } from '../../constants/entrevistas.constants';
import { useFichaPsicologica } from '../../hooks/useEvaluacionPsicologica';
import type { EvaluacionPayload, EvaluacionVista } from '../../types/entrevistas.types';
import { EstadoCarga } from '../EstadoCarga';
import {
  DictamenPsicologicoSelect,
  FichaResumenPostulante,
  InformePdfUpload,
  ObservacionesConfidenciales,
  PoblacionesMultiSelect,
  PuntajesEsre,
  validarInforme,
  type EsreFormValues,
} from './ComponentesEsre';

const aTexto = (n: number | null | undefined): string => (n === null || n === undefined ? '' : String(n));
const aNumero = (v: string): number | undefined => (v.trim() === '' ? undefined : Number(v));

function valoresIniciales(e: EvaluacionVista | null): EsreFormValues {
  return {
    puntajeGlobalEsre: aTexto(e?.puntajeGlobalEsre),
    socializacion: aTexto(e?.subdimensionesEsre?.socializacion),
    eficacia: aTexto(e?.subdimensionesEsre?.eficacia),
    proactividad: aTexto(e?.subdimensionesEsre?.proactividad),
    gestionPersonal: aTexto(e?.subdimensionesEsre?.gestionPersonal),
    dictamen: e?.dictamen ?? '',
    poblacionesSugeridas: e?.poblacionesSugeridas ?? [],
    observacionesConfidenciales: e?.observacionesConfidenciales ?? '',
  };
}

/** P-09: Módulo confidencial de evaluación psicológica E-SRE (solo Administración Pastoral). */
export const P09EvaluacionEsre: FC = () => {
  const postulacionId = Number(useParams().postulacionId);
  const ficha = useFichaPsicologica(postulacionId);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [errorArchivo, setErrorArchivo] = useState<string | null>(null);
  const [aviso, setAviso] = useState<{ tipo: 'success' | 'danger'; texto: string } | null>(null);
  const { register, control, handleSubmit, reset, formState } = useForm<EsreFormValues>({
    defaultValues: valoresIniciales(null),
  });

  useEffect(() => {
    if (ficha.datos) reset(valoresIniciales(ficha.datos.evaluacion));
  }, [ficha.datos, reset]);

  const datos = ficha.datos;
  const evaluacion = datos?.evaluacion ?? null;

  const seleccionarArchivo = (nuevo: File | null) => {
    setArchivo(nuevo);
    setErrorArchivo(nuevo && datos ? validarInforme(nuevo, datos.nombreInformeEsperado) : null);
  };

  const verInforme = async () => {
    if (!evaluacion) return;
    try {
      await psicologiaApi.abrirInforme(evaluacion.id);
    } catch (e) {
      setAviso({ tipo: 'danger', texto: e instanceof Error ? e.message : 'No se pudo abrir el informe' });
    }
  };

  const guardar = async (v: EsreFormValues) => {
    if (!datos) return;
    if (!evaluacion && !archivo) {
      setErrorArchivo('El informe psicológico en PDF es obligatorio');
      return;
    }
    if (errorArchivo) return;
    setAviso(null);
    const payload: EvaluacionPayload = {
      puntajeGlobalEsre: Number(v.puntajeGlobalEsre),
      socializacion: aNumero(v.socializacion),
      eficacia: aNumero(v.eficacia),
      proactividad: aNumero(v.proactividad),
      gestionPersonal: aNumero(v.gestionPersonal),
      dictamen: v.dictamen as EvaluacionPayload['dictamen'],
      poblacionesSugeridas: v.poblacionesSugeridas,
      observacionesConfidenciales: v.observacionesConfidenciales.trim() || undefined,
    };
    try {
      if (evaluacion) {
        await psicologiaApi.actualizar(evaluacion.id, payload, archivo);
      } else {
        await psicologiaApi.crear(postulacionId, payload, archivo as File);
      }
      setArchivo(null);
      setAviso({ tipo: 'success', texto: 'Evaluación psicológica guardada.' });
      await ficha.recargar();
    } catch (e) {
      setAviso({ tipo: 'danger', texto: e instanceof Error ? e.message : 'No se pudo guardar la evaluación' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!Number.isInteger(postulacionId)) {
    return <AlertBanner type="danger">Postulación no válida.</AlertBanner>;
  }

  const { errors, isSubmitting } = formState;
  const habilitada = Boolean(datos?.fechaEntrevista);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1>Evaluación psicológica E-SRE</h1>
          <p className="text-sm text-cato-muted mt-1 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> Información confidencial · solo Administración Pastoral
          </p>
        </div>
        <Link to="/psicologia" className="btn-outline text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver al listado
        </Link>
      </header>

      {aviso && (
        <AlertBanner type={aviso.tipo} onClose={() => setAviso(null)}>
          {aviso.texto}
        </AlertBanner>
      )}

      <EstadoCarga cargando={ficha.cargando && !datos} error={ficha.error} onReintentar={ficha.recargar} />

      {datos && (
        <>
          <FichaResumenPostulante postulante={datos.postulante} />
          {datos.dictamenEntrevista && (
            <p className="text-sm text-cato-muted">
              Dictamen de la entrevista:{' '}
              <span className={DICTAMEN_ENTREVISTA[datos.dictamenEntrevista].clase}>
                {DICTAMEN_ENTREVISTA[datos.dictamenEntrevista].etiqueta}
              </span>
            </p>
          )}
          {!habilitada && (
            <AlertBanner type="warning">
              El postulante todavía no tiene la entrevista marcada como «Asistió»; la evaluación aún no puede registrarse.
            </AlertBanner>
          )}

          <form onSubmit={handleSubmit(guardar)} className="space-y-6">
            <fieldset disabled={!habilitada || isSubmitting} className="space-y-6">
              <PuntajesEsre register={register} errors={errors} />
              <InformePdfUpload
                nombreEsperado={datos.nombreInformeEsperado}
                archivo={archivo}
                error={errorArchivo}
                informeActual={evaluacion?.nombreInforme ?? null}
                onSeleccionar={seleccionarArchivo}
                onVerActual={verInforme}
              />
              <section className="cato-card space-y-6">
                <Controller
                  control={control}
                  name="dictamen"
                  rules={{ required: 'Selecciona el dictamen psicológico' }}
                  render={({ field }) => (
                    <DictamenPsicologicoSelect valor={field.value} onCambiar={field.onChange} error={errors.dictamen?.message} />
                  )}
                />
                <Controller
                  control={control}
                  name="poblacionesSugeridas"
                  rules={{ validate: (v) => v.length > 0 || 'Selecciona al menos una población sugerida' }}
                  render={({ field }) => (
                    <PoblacionesMultiSelect
                      valor={field.value}
                      onCambiar={field.onChange}
                      error={errors.poblacionesSugeridas?.message}
                    />
                  )}
                />
              </section>
              <ObservacionesConfidenciales register={register} />
            </fieldset>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-cato-muted">
                Registrado por: <span className="font-medium text-cato-text">{evaluacion?.registradoPorNombre ?? 'Tú, al guardar'}</span>
              </p>
              <Button type="submit" variant="primary" size="lg" disabled={!habilitada} isLoading={isSubmitting} leftIcon={<Save className="w-4 h-4" />}>
                {evaluacion ? 'Guardar cambios' : 'Registrar evaluación'}
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};
