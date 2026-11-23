import type { FC, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../../auth/hooks/useAuth';

/** Layout reducido para el Postulante (no accede al App Shell operativo). */
export const LayoutPostulante: FC<{ children: ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cato-canvas flex flex-col">
      <header className="h-16 bg-cato-navy px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cato-gold flex items-center justify-center text-cato-navy font-black text-lg">
            C
          </div>
          <span className="font-black text-white tracking-tight">CATOVOLUNTARIOS</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="badge-role-postulante hidden sm:inline">Postulante</span>
          <span className="text-sm text-white hidden md:inline">{user?.nombres}</span>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="inline-flex items-center gap-1.5 text-sm text-white hover:text-cato-gold transition-colors"
          >
            <LogOut className="w-4 h-4" /> Salir
          </button>
        </div>
      </header>
      <main className="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-6 md:p-8">{children}</main>
    </div>
  );
};
