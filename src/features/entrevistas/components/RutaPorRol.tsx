import type { FC, ReactNode } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';
import type { UserRole } from '../../../types/auth.types';
import { getDefaultRouteForRole } from '../../../constants/roles';
import { Button } from '../../../components/ui/Button';

interface RutaPorRolProps {
  roles: UserRole[];
  children: ReactNode;
}

/**
 * Protección estricta de rutas por rol en el Frontend.
 * Impide que un usuario navegue manualmente por URL a módulos fuera de su rol.
 */
export const RutaPorRol: FC<RutaPorRolProps> = ({ roles, children }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.rol)) {
    const homeRoute = getDefaultRouteForRole(user.rol);
    return (
      <div className="min-h-screen bg-cato-canvas flex items-center justify-center p-6">
        <div className="bg-white border border-cato-border rounded-2xl shadow-card p-8 max-w-md text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-black text-cato-navy">Acceso Restringido</h1>
          <p className="text-sm text-cato-muted leading-relaxed">
            Tu rol actual no tiene permisos habilitados para visualizar o operar este módulo.
          </p>
          <div className="pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate(homeRoute, { replace: true })}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Volver a mi Panel Principal
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
