import { useEffect, useState, type FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { AlertBanner } from '../../../../components/feedback/AlertBanner';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { entrevistasApi } from '../../../../services/entrevistas.service';
import { useFichaEntrevista, useProyectosReceptores } from '../../hooks/useFichaEntrevista';
import type { DetalleEntrevista, RegistrarFichaPayload } from '../../types/entrevistas.types';
import { AreaTexto } from '../AreaTexto';
import { EstadoCarga } from '../EstadoCarga';
import {
  BloqueFicha,
  DictamenPreliminar,
  EncabezadoFicha,
  EscalaApertura,
  HorariosPostulante,
  type FichaFormValues,
} from './BloquesFicha';

function valoresIniciales(detalle: DetalleEntrevista): FichaFormValues {
  const f = detalle.ficha;
  return {
    observacionesMotivacion: f.observacionesMotivacion ?? '',
    manejoTransporte: f.manejoTransporte ?? '',
    tiempoSemanal: f.tiempoSemanal ?? '',
    horariosDisponibles: f.horariosDisponibles,
    observacionesCompromiso: f.observacionesCompromiso ?? '',
    observacionesTrabajoEquipo: f.observacionesTrabajoEquipo ?? '',
    aperturaReligiosaEscala: f.aperturaReligiosaEscala,
    observacionesRecomendaciones: f.observacionesRecomendaciones ?? '',
    proyectoReceptorSugeridoId: f.proyectoReceptorSugeridoId !== null ? String(f.proyectoReceptorSugeridoId) : '',
    dictamen: f.dictamen ?? '',
  };
}

const textoOpcional = (valor: string): string | undefined => (valor.trim() === '' ? undefined : valor.trim());

/** P-08: Ficha digital de entrevista (Catolíder entrevistador y Administración Pastoral). */
export const P08FichaEntrevista: FC = () => {
  const entrevistaId = Number(useParams().entrevistaId);
  const detalle = useFichaEntrevista(entrevistaId);
  const proyectos = useProyectosReceptores();
  const [aviso, setAviso] = useState<{ tipo: 'success' | 'danger'; texto: string } | null>(null);

  const { register, control, handleSubmit, reset, formState } = useForm<FichaFormValues>();

  // Se espera también a los proyectos: si el select no tiene aún sus opciones, perdería el valor inicial.
  const listoParaEditar = Boolean(detalle.datos) && !proyectos.cargando;
  useEffect(() => {
    if (detalle.datos && listoParaEditar) reset(valoresIniciales(detalle.datos));
  }, [detalle.datos, listoParaEditar, reset]);

  const guardar = async (v: FichaFormValues) => {
    setAviso(null);
    const payload: RegistrarFichaPayload = {
      observacionesMotivacion: textoOpcional(v.observacionesMotivacion),
      manejoTransporte: textoOpcional(v.manejoTransporte),
      tiempoSemanal: textoOpcional(v.tiempoSemanal),
      horariosDisponibles: v.horariosDisponibles,
      observacionesCompromiso: textoOpcional(v.observacionesCompromiso),
      observacionesTrabajoEquipo: textoOpcional(v.observacionesTrabajoEquipo),
      aperturaReligiosaEscala: v.aperturaReligiosaEscala as number,
      observacionesRecomendaciones: textoOpcional(v.observacionesRecomendaciones),
      proyectoReceptorSugeridoId: Number(v.proyectoReceptorSugeridoId),
      dictamen: v.dictamen as RegistrarFichaPayload['dictamen'],
    };
    try {
      const actualizado = await entrevistasApi.registrarFicha(entrevistaId, payload);
      reset(valoresIniciales(actualizado));
      setAviso({ tipo: 'success', texto: 'Ficha de entrevista guardada.' });
      await detalle.recargar();
    } catch (e) {
      setAviso({ tipo: 'danger', texto: e instanceof Error ? e.message : 'No se pudo guardar la ficha' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!Number.isInteger(entrevistaId)) {
    return <AlertBanner type="danger">Entrevista no válida.</AlertBanner>;
  }

  const cita = detalle.datos?.cita;
  const habilitada = cita?.estado === 'ASISTIO';
  const { errors, isSubmitting } = formState;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1>Ficha digital de entrevista</h1>
          <p className="text-sm text-cato-muted mt-1">Guía de entrevista pastoral digitalizada.</p>
        </div>
        <Link to="/ficha-entrevista" className="btn-outline text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver al listado
        </Link>
      </header>

      {aviso && (
        <AlertBanner type={aviso.tipo} onClose={() => setAviso(null)}>
          {aviso.texto}
        </AlertBanner>
      )}

      <EstadoCarga cargando={detalle.cargando && !detalle.datos} error={detalle.error} onReintentar={detalle.recargar} />

      {cita && listoParaEditar && (
        <>
          <EncabezadoFicha cita={cita} />
          {!habilitada && (
            <AlertBanner type="warning">
              La ficha se habilita cuando la cita está marcada como «Asistió» en la agenda (P-07).
            </AlertBanner>
          )}
          {habilitada && cita.fichaRegistrada && (
            <AlertBanner type="info">Esta ficha ya fue registrada. Puedes corregirla y volver a guardar.</AlertBanner>
          )}

          <form onSubmit={handleSubmit(guardar)} className="space-y-6">
            <fieldset disabled={!habilitada || isSubmitting} className="space-y-6">
              <BloqueFicha numero={1} titulo="Motivación y expectativas">
                <AreaTexto etiqueta="Resumen cualitativo" {...register('observacionesMotivacion')} />
              </BloqueFicha>

              <BloqueFicha numero={2} titulo="Compromiso y autonomía">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input label="Manejo de transporte" placeholder="¿Cómo llegaría al Proyecto Receptor?" {...register('manejoTransporte')} />
                  <Input label="Tiempo semanal" placeholder="Horas por semana que puede dedicar" {...register('tiempoSemanal')} />
                </div>
                <HorariosPostulante control={control} register={register} />
                <AreaTexto etiqueta="Resumen cualitativo" {...register('observacionesCompromiso')} />
              </BloqueFicha>

              <BloqueFicha numero={3} titulo="Trabajo en equipo y resolución de conflictos">
                <AreaTexto etiqueta="Resumen cualitativo" {...register('observacionesTrabajoEquipo')} />
              </BloqueFicha>

              <BloqueFicha numero={4} titulo="Apertura y afinidad con el carisma católico institucional">
                <Controller
                  control={control}
                  name="aperturaReligiosaEscala"
                  rules={{ required: 'Selecciona un valor del 1 al 10' }}
                  render={({ field }) => (
                    <EscalaApertura valor={field.value} onCambiar={field.onChange} error={errors.aperturaReligiosaEscala?.message} />
                  )}
                />
              </BloqueFicha>

              <BloqueFicha numero={5} titulo="Observaciones y recomendaciones" conPreguntaGuia={false} destacado>
                <AreaTexto
                  rows={6}
                  etiqueta="Notas del Catolíder"
                  ayuda="Madurez, vulnerabilidades u otros aspectos que Pastoral deba conocer."
                  {...register('observacionesRecomendaciones')}
                />
              </BloqueFicha>

              <section className="cato-card space-y-5">
                <Select
                  label="Proyecto Receptor sugerido"
                  required
                  error={errors.proyectoReceptorSugeridoId?.message}
                  options={[
                    { value: '', label: proyectos.cargando ? 'Cargando…' : 'Selecciona un Proyecto Receptor' },
                    ...(proyectos.datos ?? []).map((p) => ({ value: p.id, label: p.nombreProyecto })),
                  ]}
                  {...register('proyectoReceptorSugeridoId', { required: 'Selecciona el Proyecto Receptor sugerido' })}
                />
                {proyectos.error && <p className="text-xs text-rose-600">{proyectos.error}</p>}
                <Controller
                  control={control}
                  name="dictamen"
                  rules={{ required: 'Selecciona el dictamen preliminar' }}
                  render={({ field }) => (
                    <DictamenPreliminar valor={field.value} onCambiar={field.onChange} error={errors.dictamen?.message} />
                  )}
                />
              </section>
            </fieldset>

            <div className="flex justify-end">
              <Button type="submit" variant="primary" size="lg" disabled={!habilitada} isLoading={isSubmitting} leftIcon={<Save className="w-4 h-4" />}>
                Guardar ficha
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};
