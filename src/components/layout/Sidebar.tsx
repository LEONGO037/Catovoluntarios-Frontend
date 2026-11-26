import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Calendar,
  FileCheck2,
  Brain,
  ClipboardList,
  Building2,
  Shuffle,
  Clock,
  Coins,
  Smile,
  Activity,
  Award,
  FileBadge,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Heart,
  UserCheck,
  Trophy,
  UploadCloud,
} from 'lucide-react';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { RoleBadge } from '../feedback/RoleBadge';
import type { UserRole } from '../../types/auth.types';
import { cn } from '../../utils/cn';

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  roles: UserRole[];
}

interface NavGroup {
  group: string;
  roles: UserRole[];
  items: NavItem[];
}

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  selectedSemestre: string;
  onSelectSemestre: (semestre: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  selectedSemestre,
  onSelectSemestre,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navGroups: NavGroup[] = [
    {
      group: 'Principal',
      roles: ['ADMIN_PASTORAL'],
      items: [
        {
          to: '/dashboard',
          label: 'Dashboard Ejecutivo',
          icon: LayoutDashboard,
          badge: 'Pastoral',
          roles: ['ADMIN_PASTORAL'],
        },
      ],
    },
    {
      group: 'Mi Voluntariado',
      roles: ['VOLUNTARIO'],
      items: [
        {
          to: '/portal-voluntario',
          label: 'Mis Voluntariados y Horas',
          icon: Smile,
          roles: ['VOLUNTARIO'],
        },
        {
          to: '/documentos',
          label: 'Carga de Documentos',
          icon: FileCheck2,
          roles: ['VOLUNTARIO'],
        },
        {
          to: '/mis-pasajes',
          label: 'Mi Planilla de Pasajes',
          icon: Coins,
          roles: ['VOLUNTARIO'],
        },
        {
          to: '/podio',
          label: 'Podio de Excelencia',
          icon: Trophy,
          roles: ['VOLUNTARIO'],
        },
      ],
    },
    {
      group: 'Centro Receptor',
      roles: ['ENCARGADO_RECEPTOR'],
      items: [
        {
          to: '/receptor-asistencia',
          label: 'Asistencia Voluntarios',
          icon: Clock,
          roles: ['ENCARGADO_RECEPTOR'],
        },
        {
          to: '/receptor-certificados',
          label: 'Subir Certificados',
          icon: UploadCloud,
          roles: ['ENCARGADO_RECEPTOR'],
        },
      ],
    },
    {
      group: 'Admisión y Convocatoria',
      roles: ['ADMIN_PASTORAL', 'CATOLIDER'],
      items: [
        {
          to: '/postulantes',
          label: 'Bandeja de Postulantes',
          icon: Users,
          roles: ['ADMIN_PASTORAL', 'CATOLIDER'],
        },
        {
          to: '/catolideres',
          label: 'Selección de Catolíderes',
          icon: UserCheck,
          roles: ['ADMIN_PASTORAL'],
        },
      ],
    },
    {
      group: 'Entrevistas y Psicología',
      roles: ['CATOLIDER'],
      items: [
        {
          to: '/entrevistas',
          label: 'Agendar Citas y Turnos',
          icon: Calendar,
          roles: ['CATOLIDER'],
        },
        {
          to: '/ficha-entrevista',
          label: 'Ficha de Entrevista',
          icon: ClipboardList,
          roles: ['CATOLIDER'],
        },
        {
          to: '/psicologia',
          label: 'Citas Psicológicas E-SRE',
          icon: Brain,
          roles: ['CATOLIDER'],
        },
      ],
    },
    {
      group: 'Documentación',
      roles: ['ADMIN_PASTORAL'],
      items: [
        {
          to: '/validacion-documental',
          label: 'Validar Documentos',
          icon: ShieldCheck,
          roles: ['ADMIN_PASTORAL'],
        },
      ],
    },
    {
      group: 'Proyectos y Ubicación',
      roles: ['ADMIN_PASTORAL'],
      items: [
        {
          to: '/proyectos',
          label: 'Proyectos Receptores',
          icon: Building2,
          roles: ['ADMIN_PASTORAL'],
        },
        {
          to: '/ubicacion',
          label: 'Ubicación Voluntarios',
          icon: Shuffle,
          roles: ['ADMIN_PASTORAL'],
        },
        {
          to: '/reasignaciones',
          label: 'Reasignaciones',
          icon: Shuffle,
          roles: ['ADMIN_PASTORAL'],
        },
      ],
    },
    {
      group: 'Campo, Horas y Finanzas',
      roles: ['ADMIN_PASTORAL', 'CATOLIDER'],
      items: [
        {
          to: '/asistencias',
          label: 'Asistencia Proyectos',
          icon: Clock,
          roles: ['CATOLIDER'],
        },
        {
          to: '/pasajes',
          label: 'Planillas de Pasajes',
          icon: Coins,
          roles: ['ADMIN_PASTORAL'],
        },
      ],
    },
    {
      group: 'Desempeño, Podio y Cierre',
      roles: ['ADMIN_PASTORAL', 'CATOLIDER'],
      items: [
        {
          to: '/semaforos',
          label: 'Semáforo de Rendimiento',
          icon: Activity,
          roles: ['CATOLIDER'],
        },
        {
          to: '/base-madre',
          label: 'Base Madre',
          icon: Award,
          roles: ['ADMIN_PASTORAL'],
        },
        {
          to: '/certificados',
          label: 'Certificados',
          icon: FileBadge,
          roles: ['ADMIN_PASTORAL'],
        },
        {
          to: '/podio',
          label: 'Podio y Premiación',
          icon: Trophy,
          roles: ['ADMIN_PASTORAL', 'CATOLIDER'],
        },
      ],
    },
  ];

  const userRole: UserRole = user?.rol || 'INTERESADO';

  return (
    <aside
      className={cn(
        'h-screen bg-cato-navy text-white flex flex-col justify-between shrink-0 transition-all duration-300 border-r border-cato-navy-dark shadow-xl z-30 select-none sticky top-0',
        isCollapsed ? 'w-[72px]' : 'w-[260px]',
      )}
    >
      {/* 1. Header con Logo y Semestre */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-cato-gold flex items-center justify-center shrink-0 shadow-sm text-cato-navy">
              <Heart className="w-5 h-5 fill-cato-navy" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-extrabold text-sm tracking-wide leading-tight text-white">
                  CATOVOLUNTARIOS
                </span>
                <span className="text-[10px] text-blue-200/80">Pastoral UCB</span>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            type="button"
            className="p-1 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
            title={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Selector de Semestre Activo */}
        {!isCollapsed && (
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-blue-300 tracking-wider">
              Semestre Activo
            </span>
            <select
              value={selectedSemestre}
              onChange={(e) => onSelectSemestre(e.target.value)}
              className="bg-cato-navy-dark border border-white/20 text-cato-gold text-xs font-semibold rounded-md px-2 py-0.5 focus:outline-none cursor-pointer"
            >
              <option value="2/2026">Gestión 2/2026</option>
              <option value="1/2026">Gestión 1/2026</option>
              <option value="2/2025">Gestión 2/2025</option>
            </select>
          </div>
        )}
      </div>

      {/* 2. Lista de Navegación Dinámica por Rol */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4 scrollbar-thin scrollbar-thumb-white/20">
        {navGroups
          .filter((g) => g.roles.includes(userRole))
          .map((group, idx) => {
            const visibleItems = group.items.filter((item) => item.roles.includes(userRole));
            if (visibleItems.length === 0) return null;

            return (
              <div key={idx} className="space-y-1">
                {!isCollapsed && (
                  <p className="px-3 text-[10px] uppercase font-bold text-blue-300/80 tracking-wider">
                    {group.group}
                  </p>
                )}
                {visibleItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    title={isCollapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-150 group',
                        isActive
                          ? 'bg-cato-gold text-cato-navy font-bold shadow-sm'
                          : 'text-blue-100/90 hover:bg-white/10 hover:text-white',
                        isCollapsed && 'justify-center px-0 py-2.5',
                      )
                    }
                  >
                    <item.icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                ))}
              </div>
            );
          })}
      </div>

      {/* 3. Footer de Usuario y Logout */}
      <div className="p-3 border-t border-white/10 bg-cato-navy-dark/60">
        {!isCollapsed ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">
                  {user ? `${user.nombres} ${user.primerApellido}` : 'Usuario'}
                </p>
                <p className="text-[10px] text-blue-200/70 truncate">
                  {user?.email || ''}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <RoleBadge rol={user?.rol || 'INTERESADO'} />
              <button
                onClick={handleLogout}
                type="button"
                className="text-xs text-rose-300 hover:text-rose-100 flex items-center gap-1 hover:underline cursor-pointer"
                title="Cerrar sesión"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Salir</span>
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            type="button"
            className="w-full flex items-center justify-center p-2 rounded-lg text-rose-300 hover:text-white hover:bg-rose-500/20 transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};
