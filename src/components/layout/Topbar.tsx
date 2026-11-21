import React from 'react';
import { Search, ShieldAlert, UserCheck } from 'lucide-react';
import type { UserRole } from '../../types/roles.types';
import { RoleBadge } from '../feedback/RoleBadge';

export interface TopbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  pageTitle: string;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentRole,
  onRoleChange,
  searchTerm = '',
  onSearchChange,
  pageTitle,
}) => {
  return (
    <header className="h-16 bg-white border-b border-cato-border px-6 flex items-center justify-between shadow-xs sticky top-0 z-10">
      {/* Title */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-base font-bold text-cato-navy leading-none">{pageTitle}</h1>
          <p className="text-xs text-cato-muted mt-1">Programa Pastoral Catovoluntarios</p>
        </div>
      </div>

      {/* Search and Role Switcher */}
      <div className="flex items-center gap-4">
        {onSearchChange && (
          <div className="relative w-64 hidden sm:block">
            <Search className="w-4 h-4 text-cato-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar proyectos o voluntarios..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-cato-input text-xs text-cato-text focus:outline-none focus:border-cato-navy focus:ring-1 focus:ring-cato-navy bg-cato-surface-header"
            />
          </div>
        )}

        {/* Role Simulator for testing RBAC */}
        <div className="flex items-center gap-2 pl-3 border-l border-cato-border">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-[11px] text-cato-muted font-semibold flex items-center justify-end gap-1">
              <UserCheck className="w-3.5 h-3.5 text-cato-steel" />
              Rol de Sesión (Simulador RBAC):
            </span>
            <div className="mt-0.5">
              <RoleBadge role={currentRole} />
            </div>
          </div>

          <select
            value={currentRole}
            onChange={(e) => onRoleChange(e.target.value as UserRole)}
            className="text-xs h-8 px-2 border border-cato-input rounded-md bg-white text-cato-slate font-medium focus:outline-none focus:border-cato-navy"
            aria-label="Seleccionar rol de prueba"
          >
            <option value="admin">Administrador Pastoral</option>
            <option value="catolider">Catolíder (Solo Lectura P-13)</option>
            <option value="voluntario">Catovoluntario</option>
          </select>

          {currentRole === 'catolider' && (
            <div
              className="hidden lg:flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200"
              title="Como Catolíder tiene acceso de solo lectura a P-13 y restringido en P-14/P-15"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Modo Consulta</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
