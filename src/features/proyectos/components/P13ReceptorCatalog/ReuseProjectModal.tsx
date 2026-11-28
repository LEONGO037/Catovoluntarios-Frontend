import React, { useState } from 'react';
import { History, RotateCcw, Building2, CheckCircle2 } from 'lucide-react';
import type {
  ProyectoReceptor,
  CatoliderInfo,
  ReutilizarProyectoDto,
} from '../../types/proyectos.types';
import { Modal } from '../../../../components/ui/Modal';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { Button } from '../../../../components/ui/Button';
import { formatCurrency } from '../../../../utils/formatters';

export interface ReuseProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  semestreDestino: string;
  proyectosHistoricos: ProyectoReceptor[];
  proyectosInactivosActuales: ProyectoReceptor[];
  catolideres: CatoliderInfo[];
  onReuse: (dto: ReutilizarProyectoDto) => Promise<unknown>;
  onReactivate: (projectId: string) => Promise<unknown>;
}

interface ReuseContentProps {
  onClose: () => void;
  semestreDestino: string;
  proyectosHistoricos: ProyectoReceptor[];
  proyectosInactivosActuales: ProyectoReceptor[];
  catolideres: CatoliderInfo[];
  onReuse: (dto: ReutilizarProyectoDto) => Promise<unknown>;
  onReactivate: (projectId: string) => Promise<unknown>;
}

const ReuseProjectContent: React.FC<ReuseContentProps> = ({
  onClose,
  semestreDestino,
  proyectosHistoricos,
  proyectosInactivosActuales,
  catolideres,
  onReuse,
  onReactivate,
}) => {
  const [selectedSourceId, setSelectedSourceId] = useState(
    proyectosHistoricos[0]?.id || ''
  );

  const selectedSource = proyectosHistoricos.find((p) => p.id === selectedSourceId);

  const [actividades, setActividades] = useState(
    selectedSource?.actividades_semestre_actual || ''
  );
  const [cupo, setCupo] = useState<number>(
    selectedSource?.cupo_maximo_voluntarios || 10
  );
  const [pasaje, setPasaje] = useState<number>(
    selectedSource?.monto_pasaje_fijo || 15
  );
  const [titularId, setTitularId] = useState(
    selectedSource?.catolider_titular_id || catolideres[0]?.id || ''
  );
  const [aprendizId, setAprendizId] = useState(
    selectedSource?.catolider_aprendiz_id || ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSelectSource = (id: string) => {
    setSelectedSourceId(id);
    const found = proyectosHistoricos.find((p) => p.id === id);
    if (found) {
      setActividades(found.actividades_semestre_actual);
      setCupo(found.cupo_maximo_voluntarios);
      setPasaje(found.monto_pasaje_fijo);
      setTitularId(found.catolider_titular_id || catolideres[0]?.id || '');
      setAprendizId(found.catolider_aprendiz_id || '');
    }
  };

  const handleReuseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSourceId) {
      setErrorMsg('Seleccione un Proyecto Receptor previo para reutilizar.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await onReuse({
        proyectoOrigenId: selectedSourceId,
        semestreDestino,
        actividades_semestre_actual: actividades.trim(),
        cupo_maximo_voluntarios: Number(cupo),
        monto_pasaje_fijo: Number(pasaje),
        catolider_titular_id: titularId || undefined,
        catolider_aprendiz_id: aprendizId || undefined,
      });
      onClose();
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : 'No se pudo reutilizar el Proyecto Receptor.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReactivateClick = async (projectId: string) => {
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await onReactivate(projectId);
      onClose();
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : 'No se pudo reactivar el Proyecto Receptor.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-50 text-red-800 text-xs border border-red-200">
          {errorMsg}
        </div>
      )}

      {proyectosInactivosActuales.length > 0 && (
        <div className="space-y-2.5 p-4 rounded-xl border border-amber-200 bg-amber-50/60">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
            <RotateCcw className="w-4 h-4 text-amber-700" />
            Proyectos Inactivos en Gestión {semestreDestino}
          </h4>
          <div className="space-y-2">
            {proyectosInactivosActuales.map((proj) => (
              <div
                key={proj.id}
                className="p-3 rounded-lg bg-white border border-amber-200 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-cato-navy">{proj.nombre_proyecto}</div>
                  <div className="text-[11px] text-cato-muted">
                    {proj.macrodistrito_zona} | Pasaje: {formatCurrency(proj.monto_pasaje_fijo)}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="primary"
                  disabled={isSubmitting}
                  onClick={() => void handleReactivateClick(proj.id)}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Reactivar
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleReuseSubmit} className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cato-navy">
          <History className="w-4 h-4 text-cato-steel" />
          <span>Habilitar Proyecto de Gestión Anterior en {semestreDestino}</span>
        </div>

        {proyectosHistoricos.length === 0 ? (
          <div className="p-6 text-center rounded-xl border border-cato-border bg-cato-canvas text-xs text-cato-muted">
            <Building2 className="w-8 h-8 mx-auto text-cato-steel/50 mb-2" />
            No se encontraron Proyectos Receptores de gestiones anteriores disponibles para clonar.
          </div>
        ) : (
          <>
            <Select
              label="Proyecto Receptor de Origen"
              value={selectedSourceId}
              onChange={(e) => handleSelectSource(e.target.value)}
              options={proyectosHistoricos.map((p) => ({
                value: p.id,
                label: `${p.nombre_proyecto} (Gestión ${p.semestre} - ${p.macrodistrito_zona})`,
              }))}
            />

            {selectedSource && (
              <div className="p-3 rounded-lg bg-cato-canvas border border-cato-border text-xs space-y-1">
                <div className="font-bold text-cato-navy">
                  Institución vinculada: {selectedSource.institucion?.nombre_institucion || selectedSource.nombre_proyecto}
                </div>
                <div className="text-[11px] text-cato-muted">
                  Supervisor: {selectedSource.nombre_supervisor_centro} | Dirección:{' '}
                  {selectedSource.direccion_exacta}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Tarifa Fija de Pasajes (Bs/día)"
                value={String(pasaje)}
                onChange={(e) => setPasaje(Number(e.target.value))}
                options={[
                  { value: '10', label: 'Bs. 10 / día' },
                  { value: '12', label: 'Bs. 12 / día' },
                  { value: '15', label: 'Bs. 15 / día' },
                  { value: '20', label: 'Bs. 20 / día' },
                ]}
              />
              <Input
                label="Cupo Máximo de Voluntarios"
                type="number"
                min={1}
                max={50}
                value={cupo}
                onChange={(e) => setCupo(Number(e.target.value))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Catolíder Titular"
                value={titularId}
                onChange={(e) => setTitularId(e.target.value)}
                options={[
                  { value: '', label: '-- Seleccionar Catolíder Titular --' },
                  ...catolideres.map((c) => ({
                    value: c.id,
                    label: `${c.nombre} (${c.carrera})`,
                  })),
                ]}
              />
              <Select
                label="Catolíder Aprendiz (Opcional)"
                value={aprendizId}
                onChange={(e) => setAprendizId(e.target.value)}
                options={[
                  { value: '', label: '-- Sin Catolíder Aprendiz --' },
                  ...catolideres
                    .filter((c) => c.id !== titularId)
                    .map((c) => ({
                      value: c.id,
                      label: `${c.nombre} (${c.carrera})`,
                    })),
                ]}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-cato-slate mb-1">
                Actividades Específicas para Gestión {semestreDestino}
              </label>
              <textarea
                rows={3}
                required
                value={actividades}
                onChange={(e) => setActividades(e.target.value)}
                className="w-full px-3 py-2 border border-cato-input rounded-md text-xs text-cato-text focus:outline-none focus:border-cato-navy"
              />
            </div>
          </>
        )}

        <div className="pt-3 border-t border-cato-border flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
            Cerrar
          </Button>
          {proyectosHistoricos.length > 0 && (
            <Button variant="cta" type="submit" isLoading={isSubmitting}>
              Habilitar en Gestión {semestreDestino}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export const ReuseProjectModal: React.FC<ReuseProjectModalProps> = (props) => {
  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
      title="Reutilizar o Reactivar Proyecto Receptor"
      subtitle={`Habilite proyectos de gestiones anteriores o reactive registros inactivos para la Gestión ${props.semestreDestino}`}
      size="lg"
    >
      <ReuseProjectContent
        key={`${props.semestreDestino}-${props.isOpen ? 'open' : 'closed'}`}
        onClose={props.onClose}
        semestreDestino={props.semestreDestino}
        proyectosHistoricos={props.proyectosHistoricos}
        proyectosInactivosActuales={props.proyectosInactivosActuales}
        catolideres={props.catolideres}
        onReuse={props.onReuse}
        onReactivate={props.onReactivate}
      />
    </Modal>
  );
};
