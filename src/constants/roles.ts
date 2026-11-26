import type { UserRole } from '../types/auth.types';

export interface RoleConfig {
  label: string;
  badgeClass: string;
  pillColor: string;
  bgHex: string;
  textHex: string;
  dotColor: string;
  description: string;
  defaultRoute: string;
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  ADMIN_PASTORAL: {
    label: 'Administración Pastoral',
    badgeClass: 'badge-role-admin',
    pillColor: 'bg-emerald-500',
    bgHex: '#D1FAE5',
    textHex: '#065F46',
    dotColor: '#10B981',
    description: 'Coordinación ejecutiva y gestión global de Pastoral UCB',
    defaultRoute: '/dashboard',
  },
  CATOLIDER: {
    label: 'Catolíder',
    badgeClass: 'badge-role-catolider',
    pillColor: 'bg-red-500',
    bgHex: '#FEE2E2',
    textHex: '#991B1B',
    dotColor: '#EF4444',
    description: 'Líder estudiantil a cargo de centro receptor y entrevistas',
    defaultRoute: '/asistencias',
  },
  VOLUNTARIO: {
    label: 'Catovoluntario Activo',
    badgeClass: 'badge-role-voluntario',
    pillColor: 'bg-amber-500',
    bgHex: '#FEF9C3',
    textHex: '#854D0E',
    dotColor: '#EAB308',
    description: 'Estudiante voluntario activo con horas en campo',
    defaultRoute: '/portal-voluntario',
  },
  ENCARGADO_RECEPTOR: {
    label: 'Encargado Receptor',
    badgeClass: 'bg-purple-100 text-purple-800 border border-purple-200',
    pillColor: 'bg-purple-500',
    bgHex: '#F3E8FF',
    textHex: '#6B21A8',
    dotColor: '#A855F7',
    description: 'Supervisor de institución receptora para control de asistencia y certificados',
    defaultRoute: '/receptor-asistencia',
  },
  POSTULANTE: {
    label: 'Postulante en Proceso',
    badgeClass: 'badge-role-postulante',
    pillColor: 'bg-blue-600',
    bgHex: '#DBEAFE',
    textHex: '#1E40AF',
    dotColor: '#2563EB',
    description: 'Aspirante en fase de admisión y evaluación',
    defaultRoute: '/login',
  },
  INTERESADO: {
    label: 'Interesado / Visitante',
    badgeClass: 'badge-role-interesado',
    pillColor: 'bg-sky-500',
    bgHex: '#E0F2FE',
    textHex: '#0369A1',
    dotColor: '#0EA5E9',
    description: 'Visitante explorando la convocatoria de Pastoral',
    defaultRoute: '/',
  },
};

export function getDefaultRouteForRole(rol?: UserRole): string {
  if (!rol) return '/login';
  return ROLE_CONFIGS[rol]?.defaultRoute || '/login';
}
