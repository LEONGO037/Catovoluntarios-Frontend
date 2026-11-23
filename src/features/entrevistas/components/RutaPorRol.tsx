import type { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';
import type { UserRole } from '../../../types/auth.types';

interface RutaPorRolProps {
  roles: UserRole[];
  children: ReactNode;
}

/**
 * Protección de rutas por rol para M03 (la restricción real vive en el backend).
 * Candidata a moverse al módulo de auth de M01 al integrar.
 */
export const RutaPorRol: FC<RutaPorRolProps> = ({ roles, children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.rol)) {
    return (
      <div className="min-h-screen bg-cato-canvas flex items-center justify-center p-6">
        <div className="cato-card max-w-md text-center space-y-3">
          <ShieldAlert className="w-10 h-10 text-cato-navy mx-auto" />
          <h1 className="text-xl">Acceso restringido</h1>
          <p className="text-sm text-cato-muted">
            Tu rol no tiene permiso para ver esta pantalla.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
