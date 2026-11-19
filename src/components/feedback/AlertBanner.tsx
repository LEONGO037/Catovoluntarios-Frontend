import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export type AlertType = 'info' | 'success' | 'warning' | 'danger';

interface AlertBannerProps {
  type?: AlertType;
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  type = 'info',
  title,
  children,
  onClose,
  className,
}) => {
  const styles = {
    info: {
      container: 'bg-sky-50 border-sky-200 text-sky-800',
      icon: <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />,
    },
    success: {
      container: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
    },
    warning: {
      container: 'bg-amber-50 border-amber-200 text-amber-800',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />,
    },
    danger: {
      container: 'bg-rose-50 border-rose-200 text-rose-800',
      icon: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />,
    },
  }[type];

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl border text-sm transition-all duration-150',
        styles.container,
        className,
      )}
    >
      {styles.icon}
      <div className="flex-1">
        {title && <h4 className="font-semibold text-sm mb-1">{title}</h4>}
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          className="text-gray-400 hover:text-gray-600 p-1 -mr-1 -mt-1 rounded-lg transition-colors"
          aria-label="Cerrar alerta"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
