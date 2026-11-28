import React from 'react';
import {
  MapPin,
  User,
  Phone,
  Mail,
  Calendar,
  Users,
  ShieldCheck,
  FileText,
  DollarSign,
  Building2,
} from 'lucide-react';
import type { ProyectoReceptor } from '../../types/proyectos.types';
import { Modal } from '../../../../components/ui/Modal';
import { formatCurrency, formatDate } from '../../../../utils/formatters';
import { Button } from '../../../../components/ui/Button';

export interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProyectoReceptor | null;
  assignedCount: number;
  onEdit?: (project: ProyectoReceptor) => void;
  canEdit?: boolean;
}

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  isOpen,
  onClose,
  project,
  assignedCount,
  onEdit,
  canEdit = false,
}) => {
  if (!project) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ficha Técnica del Proyecto Receptor"
      subtitle={`Gestión ${project.semestre} | Institución #${project.institucion_id} | Proyecto #${project.id}`}
      size="lg"
    >
      <div className="space-y-6">
        <div className="p-4 bg-cato-navy text-white rounded-lg">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-cato-gold uppercase tracking-wider">
                  {project.macrodistrito_zona}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/15 text-white font-semibold">
                  Gestión {project.semestre}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mt-0.5">
                {project.nombre_proyecto}
              </h2>
              {project.institucion && (
                <p className="text-xs text-blue-100 mt-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-cato-gold" />
                  <span>Institución sede: {project.institucion.nombre_institucion}</span>
                </p>
              )}
            </div>
            <div className="px-3 py-1 bg-white/10 rounded-lg text-right">
              <div className="text-[10px] text-blue-200 uppercase font-semibold">
                Tarifa Fija de Pasajes
              </div>
              <div className="text-base font-black text-cato-gold">
                {formatCurrency(project.monto_pasaje_fijo)} / día
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-cato-canvas rounded-lg border border-cato-border space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cato-navy flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-cato-steel" />
              Datos de Institución y Ubicación
            </h4>
            <div className="text-xs space-y-1.5">
              <div>
                <span className="text-cato-muted font-medium">Dirección Exacta:</span>
                <p className="text-cato-text font-semibold">{project.direccion_exacta}</p>
              </div>
              <div>
                <span className="text-cato-muted font-medium">Macrodistrito / Zona:</span>
                <p className="text-cato-text font-semibold">{project.macrodistrito_zona}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-cato-canvas rounded-lg border border-cato-border space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cato-navy flex items-center gap-1.5">
              <User className="w-4 h-4 text-cato-steel" />
              Contacto y Supervisor del Centro
            </h4>
            <div className="text-xs space-y-1.5">
              <div>
                <span className="text-cato-muted font-medium">Nombre del Supervisor:</span>
                <p className="text-cato-text font-semibold">{project.nombre_supervisor_centro}</p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <span className="text-cato-muted font-medium flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-cato-steel" /> Teléfono:
                  </span>
                  <p className="text-cato-text font-semibold">{project.telefono_contacto}</p>
                </div>
                <div>
                  <span className="text-cato-muted font-medium flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-cato-steel" /> Correo:
                  </span>
                  <p className="text-cato-text font-semibold">{project.correo}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-white rounded-lg border border-cato-border">
            <div className="text-[11px] text-cato-muted font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-cato-steel" />
              Vigencia del Convenio
            </div>
            <div className="text-xs font-bold text-cato-navy mt-1">
              {formatDate(project.fecha_inicio_convenio)} al{' '}
              {formatDate(project.fecha_fin_convenio)}
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-cato-border">
            <div className="text-[11px] text-cato-muted font-medium flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-cato-steel" />
              Capacidad de Voluntarios
            </div>
            <div className="text-xs font-bold text-cato-navy mt-1">
              {assignedCount} asignados de {project.cupo_maximo_voluntarios} cupos máximos
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-cato-border">
            <div className="text-[11px] text-cato-muted font-medium flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-cato-steel" />
              Pasaje por Jornada
            </div>
            <div className="text-xs font-bold text-cato-navy mt-1">
              {formatCurrency(project.monto_pasaje_fijo)} (Monto Fijo Pastoral)
            </div>
          </div>
        </div>

        <div className="p-4 bg-cato-surface-header rounded-lg border border-cato-border">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cato-slate mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-role-catolider-primary" />
            Catolíderes Asignados por Pastoral ({project.semestre})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-white p-2.5 rounded border border-cato-border">
              <span className="text-[10px] uppercase font-bold text-role-catolider-primary">
                Catolíder Titular
              </span>
              <p className="font-bold text-cato-navy mt-0.5">
                {project.catolider_titular_nombre || 'No asignado'}
              </p>
            </div>
            <div className="bg-white p-2.5 rounded border border-cato-border">
              <span className="text-[10px] uppercase font-bold text-cato-steel">
                Catolíder Aprendiz
              </span>
              <p className="font-bold text-cato-navy mt-0.5">
                {project.catolider_aprendiz_nombre || 'No asignado'}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-cato-slate mb-2">
            Poblaciones Objetivo
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.poblacion_objetivo.map((pob, idx) => (
              <span
                key={idx}
                className="text-xs px-3 py-1 rounded-full bg-blue-50 text-cato-navy font-semibold border border-blue-200"
              >
                {pob}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-cato-slate mb-2 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-cato-steel" />
            Actividades Específicas del Semestre ({project.semestre})
          </h4>
          <div className="p-3.5 bg-cato-canvas rounded-lg border border-cato-border text-xs text-cato-text leading-relaxed whitespace-pre-line">
            {project.actividades_semestre_actual}
          </div>
        </div>

        <div className="pt-4 border-t border-cato-border flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cerrar Ficha
          </Button>
          {canEdit && onEdit && (
            <Button
              variant="primary"
              onClick={() => {
                onClose();
                onEdit(project);
              }}
            >
              Editar Institución y Proyecto
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
