import React, { useState } from 'react';
import { Search, Bell, CalendarDays, ExternalLink } from 'lucide-react';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { RoleBadge } from '../feedback/RoleBadge';
import { Link } from 'react-router-dom';

interface TopbarProps {
  selectedSemestre: string;
  onSelectSemestre: (semestre: string) => void;
  urgentCount?: number;
  onOpenNotifications?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  selectedSemestre,
  onSelectSemestre,
  urgentCount = 0,
  onOpenNotifications,
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="h-16 bg-white border-b border-cato-border px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Buscador Global */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-cato-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar voluntario, CI, proyecto receptor... (Ctrl+K)"
            className="w-full h-9 pl-9 pr-4 bg-cato-canvas border border-cato-border rounded-lg text-xs text-cato-text placeholder-cato-muted focus:outline-none focus:border-cato-navy focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Acciones Derecha */}
      <div className="flex items-center gap-4">
        {/* Selector de Semestre Rápido */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-blue-50/70 border border-blue-200/60 rounded-lg text-xs">
          <CalendarDays className="w-3.5 h-3.5 text-cato-navy shrink-0" />
          <span className="text-[11px] font-medium text-cato-slate">Período:</span>
          <select
            value={selectedSemestre}
            onChange={(e) => onSelectSemestre(e.target.value)}
            className="bg-transparent font-bold text-cato-navy text-xs focus:outline-none cursor-pointer"
          >
            <option value="2/2026">Gestión 2/2026 (Activo)</option>
            <option value="1/2026">Gestión 1/2026</option>
            <option value="2/2025">Gestión 2/2025</option>
          </select>
        </div>

        {/* Notificaciones Urgentes */}
        <button
          onClick={onOpenNotifications}
          type="button"
          className="relative p-2 rounded-lg text-cato-muted hover:text-cato-navy hover:bg-cato-canvas transition-colors"
          title="Notificaciones urgentes de Pastoral"
        >
          <Bell className="w-5 h-5" />
          {urgentCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
              {urgentCount}
            </span>
          )}
        </button>

        {/* Ver Portal Público */}
        <Link
          to="/"
          target="_blank"
          className="hidden md:inline-flex items-center gap-1 text-xs text-cato-slate hover:text-cato-navy font-medium px-2 py-1 rounded hover:bg-cato-canvas transition-colors"
          title="Abrir portal público de convocatoria"
        >
          <span>Portal Público</span>
          <ExternalLink className="w-3 h-3 text-cato-muted" />
        </Link>

        {/* Separador */}
        <div className="h-6 w-px bg-cato-border hidden sm:block" />

        {/* Perfil del Usuario */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-cato-navy text-white font-bold text-xs flex items-center justify-center shadow-xs">
            {user ? user.nombres.charAt(0) : 'U'}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-cato-text leading-tight">
              {user ? `${user.nombres} ${user.primerApellido}` : 'Usuario'}
            </span>
            <div className="mt-0.5">
              <RoleBadge rol={user?.rol || 'ADMIN_PASTORAL'} showDot={false} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
