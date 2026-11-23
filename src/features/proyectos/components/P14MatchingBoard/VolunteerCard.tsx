import React from 'react';
import {
  GraduationCap,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import type { VoluntarioAdmitido } from '../../types/proyectos.types';
import { Button } from '../../../../components/ui/Button';

export interface VolunteerCardProps {
  volunteer: VoluntarioAdmitido;
  onAssignClick: (volunteer: VoluntarioAdmitido) => void;
  matchesCurrentProjectPopulation?: boolean;
}

export const VolunteerCard: React.FC<VolunteerCardProps> = ({
  volunteer,
  onAssignClick,
  matchesCurrentProjectPopulation = false,
}) => {
  return (
    <div
      className={`p-3.5 rounded-lg border transition-all duration-150 bg-white ${
        matchesCurrentProjectPopulation
          ? 'border-emerald-300 shadow-xs ring-1 ring-emerald-200'
          : 'border-cato-border hover:border-cato-steel'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                volunteer.condicion === 'Nuevo'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {volunteer.condicion}
            </span>
            <span className="text-[11px] text-cato-muted font-medium">
              {volunteer.edad} años
            </span>
            {volunteer.puntaje_esre && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-semibold border border-purple-200">
                E-SRE: {volunteer.puntaje_esre} pts
              </span>
            )}
          </div>
          <h4 className="text-xs font-bold text-cato-navy mt-1">
            {volunteer.nombre_completo}
          </h4>
        </div>
      </div>

      {/* Carrera y CI */}
      <div className="space-y-1 text-[11px] text-cato-muted mb-2.5">
        <div className="flex items-center gap-1.5 text-cato-text">
          <GraduationCap className="w-3.5 h-3.5 text-cato-steel shrink-0" />
          <span className="truncate font-medium">{volunteer.carrera}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-cato-steel shrink-0" />
          <span className="truncate">{volunteer.horario_comprometido}</span>
        </div>
      </div>

      {/* Población Sugerida de Psicología */}
      <div className="mb-3 p-2 rounded bg-cato-surface-header border border-cato-border/80">
        <div className="flex items-center justify-between text-[10px] text-cato-slate font-semibold mb-1">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cato-gold-dark" />
            Población Sugerida:
          </span>
          {matchesCurrentProjectPopulation && (
            <span className="text-emerald-700 font-bold flex items-center gap-0.5">
              <ShieldCheck className="w-3 h-3" /> Coincide
            </span>
          )}
        </div>
        <div className="text-[11px] font-bold text-cato-navy truncate">
          {volunteer.poblacion_sugerida}
        </div>
      </div>

      {/* Action */}
      <Button
        variant="primary"
        size="sm"
        onClick={() => onAssignClick(volunteer)}
        className="w-full text-xs h-8"
      >
        <span>Ubicar en Proyecto</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
};
