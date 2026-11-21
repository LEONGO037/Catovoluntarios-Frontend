import React from 'react';
import {
  MapPin,
  User,
  Phone,
  Mail,
  Calendar,
  Users,
  Eye,
  Edit,
  Trash2,
  ShieldCheck,
} from 'lucide-react';
import type { ProyectoReceptor } from '../../types/proyectos.types';
import type { UserRole } from '../../../../types/roles.types';
import { formatCurrency, formatDate } from '../../../../utils/formatters';
import { Button } from '../../../../components/ui/Button';

export interface ProjectCardProps {
  project: ProyectoReceptor;
  assignedCount: number;
  userRole: UserRole;
  onViewDetails: (project: ProyectoReceptor) => void;
  onEdit: (project: ProyectoReceptor) => void;
  onDelete: (project: ProyectoReceptor) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  assignedCount,
  userRole,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const isAdmin = userRole === 'admin';
  const ocupacionPct = Math.min(
    100,
    Math.round((assignedCount / project.cupo_maximo_voluntarios) * 100)
  );

  const getOccupancyColor = () => {
    if (ocupacionPct >= 100) return 'bg-red-500';
    if (ocupacionPct >= 75) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="bg-cato-surface border border-cato-border rounded-xl p-5 shadow-card hover:border-cato-steel transition-all duration-150 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cato-steel">
                {project.macrodistrito_zona}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-cato-navy font-semibold border border-blue-200">
                Pasaje: {formatCurrency(project.monto_pasaje_fijo)} / día
              </span>
            </div>
            <h3 className="text-base font-bold text-cato-navy mt-1 line-clamp-1">
              {project.nombre_proyecto}
            </h3>
          </div>
        </div>

        {/* Address & Supervisor */}
        <div className="space-y-2 text-xs text-cato-muted mb-4">
          <div className="flex items-center gap-2 text-cato-text">
            <MapPin className="w-4 h-4 text-cato-steel shrink-0" />
            <span className="truncate">{project.direccion_exacta}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-cato-steel shrink-0" />
            <span className="truncate font-medium">
              Supervisor: {project.nombre_supervisor_centro}
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-cato-steel" />
              {project.telefono_contacto}
            </span>
            <span className="flex items-center gap-1.5 truncate">
              <Mail className="w-3.5 h-3.5 text-cato-steel" />
              {project.correo}
            </span>
          </div>
        </div>

        {/* Poblaciones Tags */}
        <div className="mb-4">
          <div className="text-[11px] font-semibold text-cato-slate mb-1.5">
            Población Atendida:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {project.poblacion_objetivo.map((pob, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded bg-cato-canvas text-cato-slate border border-cato-border font-medium"
              >
                {pob}
              </span>
            ))}
          </div>
        </div>

        {/* Catolíderes vinculados */}
        <div className="bg-cato-surface-header p-2.5 rounded-lg border border-cato-border/80 mb-4 text-xs space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-cato-slate flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-role-catolider-primary" />
              Catolíder Titular:
            </span>
            <span className="font-bold text-cato-navy truncate max-w-[140px]">
              {project.catolider_titular_nombre || 'Sin asignar'}
            </span>
          </div>
          {project.catolider_aprendiz_nombre && (
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-cato-border/50">
              <span className="text-cato-muted">Catolíder Aprendiz:</span>
              <span className="font-medium text-cato-text truncate max-w-[140px]">
                {project.catolider_aprendiz_nombre}
              </span>
            </div>
          )}
        </div>

        {/* Cupos Bar */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-cato-slate flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-cato-steel" />
              Ocupación de Cupos:
            </span>
            <span className="text-cato-navy">
              {assignedCount} / {project.cupo_maximo_voluntarios} ({ocupacionPct}%)
            </span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getOccupancyColor()}`}
              style={{ width: `${ocupacionPct}%` }}
            />
          </div>
        </div>

        {/* Convenio */}
        <div className="flex items-center gap-1.5 text-[11px] text-cato-muted mb-4">
          <Calendar className="w-3.5 h-3.5 text-cato-steel" />
          <span>
            Convenio: {formatDate(project.fecha_inicio_convenio)} al{' '}
            {formatDate(project.fecha_fin_convenio)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-cato-border flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(project)}
          className="flex-1 text-xs"
        >
          <Eye className="w-3.5 h-3.5" />
          Ver Ficha
        </Button>

        {isAdmin && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(project)}
              className="text-xs text-cato-slate hover:text-cato-navy"
              title="Editar Proyecto"
            >
              <Edit className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(project)}
              className="text-xs text-red-600 hover:bg-red-50 hover:border-red-300"
              title="Eliminar Proyecto"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
