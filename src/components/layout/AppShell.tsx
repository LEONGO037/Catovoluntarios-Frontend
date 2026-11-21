import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import type { UserRole } from '../../types/roles.types';

export interface AppShellProps {
  currentView: 'p13' | 'p14' | 'p15';
  onNavigate: (view: 'p13' | 'p14' | 'p15') => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  pageTitle: string;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentView,
  onNavigate,
  currentRole,
  onRoleChange,
  pageTitle,
  searchTerm,
  onSearchChange,
  children,
}) => {
  return (
    <div className="min-h-screen bg-cato-canvas flex">
      {/* Persistent Left Sidebar 260px in #004077 */}
      <Sidebar currentView={currentView} onNavigate={onNavigate} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          currentRole={currentRole}
          onRoleChange={onRoleChange}
          pageTitle={pageTitle}
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
        />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
