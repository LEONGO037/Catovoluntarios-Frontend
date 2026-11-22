import React, { useEffect } from 'react';
import { AlertTriangle, CheckCircle2, XCircle, Info, X } from 'lucide-react';

export type NotificationType = 'error' | 'warning' | 'success' | 'info';

interface NotificationModalProps {
  abierto: boolean;
  tipo?: NotificationType;
  titulo: string;
  mensaje: string;
  textoBoton?: string;
  onCerrar: () => void;
  onConfirmar?: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  abierto,
  tipo = 'warning',
  titulo,
  mensaje,
  textoBoton = 'Entendido',
  onCerrar,
  onConfirmar,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && abierto) {
        onCerrar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  const config = {
    error: {
      icono: <XCircle className="w-8 h-8 text-red-600" />,
      bgIcono: 'bg-red-50 text-red-600',
      borde: 'border-red-200',
      boton: 'bg-red-600 hover:bg-red-700 text-white',
    },
    warning: {
      icono: <AlertTriangle className="w-8 h-8 text-amber-600" />,
      bgIcono: 'bg-amber-50 text-amber-600',
      borde: 'border-amber-200',
      boton: 'bg-cato-navy hover:bg-cato-navy-dark text-white',
    },
    success: {
      icono: <CheckCircle2 className="w-8 h-8 text-emerald-600" />,
      bgIcono: 'bg-emerald-50 text-emerald-600',
      borde: 'border-emerald-200',
      boton: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    },
    info: {
      icono: <Info className="w-8 h-8 text-blue-600" />,
      bgIcono: 'bg-blue-50 text-blue-600',
      borde: 'border-blue-200',
      boton: 'bg-cato-navy hover:bg-cato-navy-dark text-white',
    },
  }[tipo];

  return (
    <div
      onClick={onCerrar}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-all duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border ${config.borde} relative animate-in fade-in zoom-in-95 duration-150`}
      >
        {/* Botón X de Cierre */}
        <button
          type="button"
          onClick={onCerrar}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          title="Cerrar ventana"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className={`w-14 h-14 rounded-2xl ${config.bgIcono} flex items-center justify-center mb-4 shadow-sm`}>
            {config.icono}
          </div>

          <h3 className="text-lg font-bold text-cato-navy">
            {titulo}
          </h3>

          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            {mensaje}
          </p>

          <div className="mt-6 w-full flex gap-3">
            <button
              type="button"
              onClick={() => {
                if (onConfirmar) onConfirmar();
                else onCerrar();
              }}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-sm ${config.boton}`}
            >
              {textoBoton}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
