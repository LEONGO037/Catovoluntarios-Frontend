import type { FC } from 'react';
import { Loader2 } from 'lucide-react';
import { AlertBanner } from '../../../components/feedback/AlertBanner';
import { Button } from '../../../components/ui/Button';

interface EstadoCargaProps {
  cargando: boolean;
  error: string | null;
  onReintentar?: () => void;
}

/** Indicador común de carga / error para las pantallas M03. Devuelve null si no hay nada que mostrar. */
export const EstadoCarga: FC<EstadoCargaProps> = ({ cargando, error, onReintentar }) => {
  if (cargando) {
    return (
      <div className="flex items-center justify-center gap-2 py-10 text-sm text-cato-muted">
        <Loader2 className="w-5 h-5 animate-spin text-cato-navy" />
        Cargando…
      </div>
    );
  }
  if (error) {
    return (
      <AlertBanner type="danger" title="No se pudo cargar la información">
        <p>{error}</p>
        {onReintentar && (
          <Button variant="outline" size="sm" className="mt-3" onClick={onReintentar}>
            Reintentar
          </Button>
        )}
      </AlertBanner>
    );
  }
  return null;
};
