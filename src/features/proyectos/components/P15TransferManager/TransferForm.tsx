import React, { useState, useMemo } from 'react';
import { ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import type {
  VoluntarioAdmitido,
  ProyectoReceptor,
  MotivoTraslado,
} from '../../types/proyectos.types';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';

export interface TransferFormProps {
  voluntariosAsignados: VoluntarioAdmitido[];
  proyectos: ProyectoReceptor[];
  assignedCounts: Record<string, number>;
  semestre: string;
  onSubmitTransfer: (data: {
    voluntarioId: string;
    proyectoDestinoId: string;
    motivo: MotivoTraslado;
    motivoOtroDetalle?: string;
    fechaEfectiva: string;
  }) => Promise<unknown>;
  disabled?: boolean;
}

export const TransferForm: React.FC<TransferFormProps> = ({
  voluntariosAsignados,
  proyectos,
  assignedCounts,
  semestre,
  onSubmitTransfer,
  disabled = false,
}) => {
  const [selectedVoluntarioId, setSelectedVoluntarioId] = useState('');
  const [selectedDestinoId, setSelectedDestinoId] = useState('');
  const [motivo, setMotivo] = useState<MotivoTraslado>(
    'Cruce con materias universitarias'
  );
  const [motivoOtroDetalle, setMotivoOtroDetalle] = useState('');
  const [fechaEfectiva, setFechaEfectiva] = useState(
    () => new Date().toISOString().split('T')[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const voluntarioSeleccionado = useMemo(() => {
    return voluntariosAsignados.find((v) => v.id === selectedVoluntarioId);
  }, [voluntariosAsignados, selectedVoluntarioId]);

  const proyectoOrigen = useMemo(() => {
    if (!voluntarioSeleccionado || !voluntarioSeleccionado.proyecto_id) return null;
    return proyectos.find((p) => p.id === voluntarioSeleccionado.proyecto_id) || null;
  }, [voluntarioSeleccionado, proyectos]);

  const proyectosDestinoDisponibles = useMemo(() => {
    if (!proyectoOrigen) return [];
    return proyectos.filter((p) => {
      if (p.estado === 'inactivo') return false;
      if (p.id === proyectoOrigen.id) return false;
      const cuposOcupados = assignedCounts[p.id] || 0;
      return cuposOcupados < p.cupo_maximo_voluntarios;
    });
  }, [proyectos, proyectoOrigen, assignedCounts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!selectedVoluntarioId) {
      setFeedback({
        type: 'error',
        message: 'Debe seleccionar un voluntario para el traslado.',
      });
      return;
    }
    if (!selectedDestinoId) {
      setFeedback({
        type: 'error',
        message: 'Debe seleccionar un Proyecto Receptor de destino con cupo disponible.',
      });
      return;
    }
    if (motivo === 'Otro' && !motivoOtroDetalle.trim()) {
      setFeedback({
        type: 'error',
        message: 'Debe especificar el detalle del motivo al seleccionar "Otro".',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitTransfer({
        voluntarioId: selectedVoluntarioId,
        proyectoDestinoId: selectedDestinoId,
        motivo,
        motivoOtroDetalle: motivo === 'Otro' ? motivoOtroDetalle.trim() : undefined,
        fechaEfectiva,
      });

      setFeedback({
        type: 'success',
        message:
          'Traslado procesado exitosamente. Se han emitido las alertas correspondientes para los Catolíderes de origen y destino y para el Catovoluntario.',
      });

      setSelectedVoluntarioId('');
      setSelectedDestinoId('');
      setMotivo('Cruce con materias universitarias');
      setMotivoOtroDetalle('');
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message:
          err instanceof Error ? err.message : 'Error al procesar el traslado.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-cato-border p-6 shadow-card space-y-5">
      <div className="border-b border-cato-border pb-3">
        <h3 className="text-base font-bold text-cato-navy">
          Formulario Oficial de Reasignación y Traslado (RF-13)
        </h3>
        <p className="text-xs text-cato-muted mt-0.5">
          Autorización pastoral para cambio de Proyecto Receptor en la Gestión {semestre}.
        </p>
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-lg text-xs flex items-center gap-2 border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-red-50 text-red-900 border-red-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-cato-slate mb-1">
            Voluntario Asignado para Traslado <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedVoluntarioId}
            onChange={(e) => {
              setSelectedVoluntarioId(e.target.value);
              setSelectedDestinoId('');
              setFeedback(null);
            }}
            disabled={disabled || isSubmitting}
            className="w-full h-10 px-3 py-2 border border-cato-input rounded-md text-xs text-cato-text bg-white focus:outline-none focus:border-cato-navy disabled:bg-slate-100"
          >
            <option value="">-- Seleccione un Catovoluntario asignado --</option>
            {voluntariosAsignados.map((v) => {
              const currentProj = proyectos.find((p) => p.id === v.proyecto_id);
              return (
                <option key={v.id} value={v.id}>
                  {v.nombre_completo} ({v.carrera} - {v.condicion}) — Sede actual:{' '}
                  {currentProj ? currentProj.nombre_proyecto : 'Sin asignar'}
                </option>
              );
            })}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-cato-canvas rounded-lg border border-cato-border">
          <div className="space-y-1.5">
            <span className="text-[11px] uppercase font-bold text-cato-slate">
              Proyecto Receptor de Origen (Lectura Automática)
            </span>
            <div className="p-3 bg-white rounded-md border border-cato-border text-xs min-h-[72px] flex flex-col justify-center">
              {proyectoOrigen ? (
                <div>
                  <div className="font-bold text-cato-navy">{proyectoOrigen.nombre_proyecto}</div>
                  <div className="text-[11px] text-cato-muted mt-0.5">
                    Catolíder: {proyectoOrigen.catolider_titular_nombre || 'Sin asignar'} | Zona:{' '}
                    {proyectoOrigen.macrodistrito_zona}
                  </div>
                </div>
              ) : (
                <span className="text-cato-muted italic text-[11px]">
                  Seleccione primero un voluntario para cargar su centro de origen.
                </span>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] uppercase font-bold text-cato-slate">
              Proyecto Receptor de Destino (Solo con Cupo Disponible){' '}
              <span className="text-red-500">*</span>
            </span>
            <select
              value={selectedDestinoId}
              onChange={(e) => setSelectedDestinoId(e.target.value)}
              disabled={disabled || isSubmitting || !proyectoOrigen}
              className="w-full h-[72px] px-3 py-2 border border-cato-input rounded-md text-xs text-cato-text bg-white focus:outline-none focus:border-cato-navy disabled:bg-slate-100 disabled:cursor-not-allowed"
            >
              <option value="">
                {proyectoOrigen
                  ? '-- Seleccionar Proyecto Destino --'
                  : 'Requiere voluntario seleccionado'}
              </option>
              {proyectosDestinoDisponibles.map((p) => {
                const count = assignedCounts[p.id] || 0;
                const libres = p.cupo_maximo_voluntarios - count;
                return (
                  <option key={p.id} value={p.id}>
                    {p.nombre_proyecto} ({libres} cupos disponibles | Pasaje: Bs.{' '}
                    {p.monto_pasaje_fijo})
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Motivo Estandarizado de Traslado"
            required
            value={motivo}
            onChange={(e) => {
              const next = e.target.value as MotivoTraslado;
              setMotivo(next);
              if (next !== 'Otro') {
                setMotivoOtroDetalle('');
              }
            }}
            disabled={disabled || isSubmitting}
            options={[
              {
                value: 'Cruce con materias universitarias',
                label: 'Cruce con materias universitarias',
              },
              {
                value: 'Dificultad de transporte/distancia',
                label: 'Dificultad de transporte/distancia',
              },
              {
                value: 'Solicitud de supervisor del centro',
                label: 'Solicitud de supervisor del centro',
              },
              {
                value: 'Incompatibilidad de perfil',
                label: 'Incompatibilidad de perfil',
              },
              {
                value: 'Otro',
                label: 'Otro (especificar motivo)',
              },
            ]}
          />

          <Input
            label="Fecha Efectiva del Traslado"
            type="date"
            required
            value={fechaEfectiva}
            onChange={(e) => setFechaEfectiva(e.target.value)}
            disabled={disabled || isSubmitting}
          />
        </div>

        {motivo === 'Otro' && (
          <div>
            <label
              htmlFor="motivo-otro-detalle"
              className="block text-xs font-semibold text-cato-slate mb-1"
            >
              Detalle del Motivo del Traslado <span className="text-red-500">*</span>
            </label>
            <textarea
              id="motivo-otro-detalle"
              rows={2}
              required
              disabled={disabled || isSubmitting}
              value={motivoOtroDetalle}
              onChange={(e) => setMotivoOtroDetalle(e.target.value)}
              placeholder="Describa de forma clara el motivo específico del traslado..."
              className="w-full px-3 py-2 border border-cato-input rounded-md text-xs text-cato-text placeholder-cato-muted focus:outline-none focus:border-cato-navy focus:ring-1 focus:ring-cato-navy disabled:bg-slate-100"
            />
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <Button
            variant="cta"
            type="submit"
            isLoading={isSubmitting}
            disabled={
              disabled ||
              !selectedVoluntarioId ||
              !selectedDestinoId ||
              (motivo === 'Otro' && !motivoOtroDetalle.trim())
            }
            className="w-full sm:w-auto"
          >
            <span>Ejecutar Traslado y Notificar Automáticamente</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};
