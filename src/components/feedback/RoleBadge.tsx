import React from 'react';
import type { UserRole } from '../../types/roles.types';
import { cn } from '../../utils/cn';

export interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, className }) => {
  const roleConfig: Record<UserRole, { label: string; className: string }> = {
    voluntario: {
      label: 'Catovoluntario',
      className: 'badge-role-voluntario',
    },
    catolider: {
      label: 'Catolíder',
      className: 'badge-role-catolider',
    },
    postulante: {
      label: 'Postulante',
      className: 'badge-role-postulante',
    },
    interesado: {
      label: 'Interesado',
      className: 'badge-role-interesado',
    },
    admin: {
      label: 'Administración Pastoral',
      className: 'badge-role-admin',
    },
  };

  const current = roleConfig[role];

  return (
    <span className={cn('inline-flex items-center', current.className, className)}>
      {current.label}
    </span>
  );
};
