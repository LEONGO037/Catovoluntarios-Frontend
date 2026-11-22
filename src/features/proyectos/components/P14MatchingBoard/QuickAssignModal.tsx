import React, { useState } from 'react';
import type { VoluntarioAdmitido, ProyectoReceptor } from '../../types/proyectos.types';
import { Modal } from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';
import { formatCurrency } from '../../../../utils/formatters';

export interface QuickAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  volunteer: VoluntarioAdmitido | null;
  proyectos: ProyectoReceptor[];
  currentProjectId: string;
  onConfirm: (voluntarioId: string, proyectoId: string) => void;
  assignedCounts: Record<string, number>;
}

export const QuickAssignModal: React.FC<QuickAssignModalProps> = ({
  isOpen,
  onClose,
  volunteer,
  proyectos,
  currentProjectId,
  onConfirm,
  assignedCounts,
}) => {
  const [selectedProjId, setSelectedProjId] = useState(currentProjectId);

  if (!volunteer) return null;

  const handleConfirm = () => {
    onConfirm(volunteer.id, selectedProjId);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ubicación de Voluntario en Proyecto Receptor"
      subtitle={`Asignación para: ${volunteer.nombre_completo} (${volunteer.carrera})`}
      size="md"
    >
      <div className="space-y-4">
        {/* Info del voluntario */}
        <div className="p-3 bg-cato-canvas rounded-lg border border-cato-border text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-cato-muted">Condición:</span>
            <span className="font-bold text-cato-navy">{volunteer.condicion} ({volunteer.edad} años)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cato-muted">Población Sugerida (P-09):</span>
            <span className="font-bold text-cato-slate">{volunteer.poblacion_sugerida}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cato-muted">Horario Comprometido:</span>
            <span className="font-medium text-cato-text">{volunteer.horario_comprometido}</span>
          </div>
        </div>

        {/* Selector de Proyecto Destino */}
        <div>
          <label className="block text-xs font-semibold text-cato-slate mb-1.5">
            Seleccione el Proyecto Receptor de destino:
          </label>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {proyectos.map((p) => {
              const count = assignedCounts[p.id] || 0;
              const isFull = count >= p.cupo_maximo_voluntarios;
              const isSelected = selectedProjId === p.id;
              const matchesPop = p.poblacion_objetivo.includes(volunteer.poblacion_sugerida);

              return (
                <div
                  key={p.id}
                  onClick={() => !isFull && setSelectedProjId(p.id)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                    isFull
                      ? 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
                      : isSelected
                      ? 'bg-blue-50 border-cato-navy ring-1 ring-cato-navy'
                      : 'bg-white border-cato-border hover:border-cato-steel'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cato-navy">{p.nombre_proyecto}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isFull
                          ? 'bg-red-100 text-red-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {count} / {p.cupo_maximo_voluntarios} cupos
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-cato-muted mt-1">
                    <span>{p.macrodistrito_zona}</span>
                    <span>Pasaje: {formatCurrency(p.monto_pasaje_fijo)}</span>
                  </div>
                  {matchesPop && (
                    <div className="mt-1 text-[10px] font-bold text-emerald-700">
                      Coincide con la población sugerida de psicología
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal actions */}
        <div className="pt-3 border-t border-cato-border flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" size="sm" onClick={handleConfirm}>
            Confirmar Ubicación
          </Button>
        </div>
      </div>
    </Modal>
  );
};
