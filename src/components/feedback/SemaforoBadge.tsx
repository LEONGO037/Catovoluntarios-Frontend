import React from 'react';
import { cn } from '../../utils/cn';

export type SemaforoColor = 'Verde' | 'Amarillo' | 'Rojo' | 'Morado' | string;

interface SemaforoBadgeProps {
  color: SemaforoColor;
  label?: string;
  className?: string;
}

export const SemaforoBadge: React.FC<SemaforoBadgeProps> = ({ color, label, className }) => {
  const normColor = color.toLowerCase();

  let badgeClass = 'badge-semaforo-green';
  let defaultLabel = 'Normal / Buen Cumplimiento';

  if (normColor.includes('morado') || normColor.includes('purple')) {
    badgeClass = 'badge-semaforo-purple';
    defaultLabel = 'Excelente / Destacado';
  } else if (normColor.includes('amarillo') || normColor.includes('amber')) {
    badgeClass = 'badge-semaforo-amber';
    defaultLabel = 'Alerta / Atrasos';
  } else if (normColor.includes('rojo') || normColor.includes('red')) {
    badgeClass = 'badge-semaforo-red';
    defaultLabel = 'Riesgo / Abandono';
  }

  return (
    <span className={cn(badgeClass, 'inline-flex items-center gap-1.5', className)}>
      <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
      {label || defaultLabel}
    </span>
  );
};
