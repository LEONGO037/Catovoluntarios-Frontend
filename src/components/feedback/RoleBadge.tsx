import type { FC } from 'react';
import type { UserRole } from '../../types/auth.types';
import { ROLE_CONFIGS } from '../../constants/roles';
import { cn } from '../../utils/cn';

interface RoleBadgeProps {
  rol: UserRole | string;
  className?: string;
  showDot?: boolean;
}

export const RoleBadge: FC<RoleBadgeProps> = ({ rol, className, showDot = true }) => {
  const config = ROLE_CONFIGS[rol as UserRole] || ROLE_CONFIGS.INTERESADO;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium px-2.5 py-0.5 rounded-full text-xs transition-colors duration-150',
        config.badgeClass,
        className,
      )}
    >
      {showDot && (
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: config.dotColor }}
        />
      )}
      {config.label}
    </span>
  );
};
