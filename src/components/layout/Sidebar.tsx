import React from 'react';
import {
  Building2,
  Users2,
  ArrowLeftRight,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export interface SidebarProps {
  currentView: 'p13' | 'p14' | 'p15';
  onNavigate: (view: 'p13' | 'p14' | 'p15') => void;
  semestre?: string;
  onSemestreChange?: (semestre: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  semestre = '2/2026',
}) => {
  const navItems = [
    {
      id: 'p13' as const,
      label: 'Proyectos Receptores',
      screen: 'P-13',
      description: 'Catálogo y Fichas',
      icon: Building2,
    },
    {
      id: 'p14' as const,
      label: 'Ubicación de Voluntarios',
      screen: 'P-14',
      description: 'Emparejamiento',
      icon: Users2,
    },
    {
      id: 'p15' as const,
      label: 'Gestión de Traslados',
      screen: 'P-15',
      description: 'Reasignaciones',
      icon: ArrowLeftRight,
    },
  ];

  return (
    <aside className="w-[260px] bg-cato-navy text-white flex flex-col shrink-0 h-screen sticky top-0 shadow-lg select-none z-20">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cato-gold text-cato-navy flex items-center justify-center font-black text-xl shadow-md">
            C
          </div>
          <div>
            <div className="font-extrabold text-white text-base tracking-tight leading-none">
              CATOVOLUNTARIOS
            </div>
            <div className="text-[11px] text-blue-200 font-medium mt-1">
              Pastoral UCB La Paz
            </div>
          </div>
        </div>
      </div>

      {/* Semestre Selector */}
      <div className="px-4 py-3 border-b border-white/10 bg-cato-navy-dark/40">
        <div className="text-[11px] uppercase tracking-wider text-blue-200/80 font-bold mb-1">
          Semestre Activo
        </div>
        <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-semibold">
          <span>Gestión {semestre}</span>
          <ChevronDown className="w-3.5 h-3.5 text-cato-gold" />
        </div>
      </div>

      {/* Module Title */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cato-gold">
          <Layers className="w-3.5 h-3.5" />
          <span>Módulo 05: Proyectos</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150',
                isActive
                  ? 'bg-cato-navy-dark text-white font-semibold shadow-inner border-l-4 border-cato-gold'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5 shrink-0',
                  isActive ? 'text-cato-gold' : 'text-blue-300'
                )}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm truncate">{item.label}</span>
                  <span
                    className={cn(
                      'text-[10px] font-bold px-1.5 py-0.5 rounded',
                      isActive ? 'bg-cato-gold text-cato-navy' : 'bg-white/10 text-blue-200'
                    )}
                  >
                    {item.screen}
                  </span>
                </div>
                <div className="text-[11px] text-blue-300/80 truncate">
                  {item.description}
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer info */}
      <div className="p-4 border-t border-white/10 bg-cato-navy-dark/30 text-[11px] text-blue-200/70">
        <div>Responsable: Kael Lopez</div>
        <div className="font-mono text-[10px] text-white/50 mt-0.5">RF-10, 11, 12, 13</div>
      </div>
    </aside>
  );
};
