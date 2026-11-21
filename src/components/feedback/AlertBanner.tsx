import React from 'react';
import { Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface AlertBannerProps {
  type?: 'info' | 'warning' | 'success' | 'danger';
  title?: string;
  message: string | React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  type = 'info',
  title,
  message,
  className,
  action,
}) => {
  const typeStyles = {
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-900',
      icon: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
    },
    warning: {
      container: 'bg-amber-50 border-amber-200 text-amber-900',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    },
    success: {
      container: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      icon: <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />,
    },
    danger: {
      container: 'bg-red-50 border-red-200 text-red-900',
      icon: <XCircle className="w-5 h-5 text-red-600 shrink-0" />,
    },
  };

  const style = typeStyles[type];

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border text-sm',
        style.container,
        className
      )}
    >
      {style.icon}
      <div className="flex-1">
        {title && <h4 className="font-semibold mb-0.5">{title}</h4>}
        <div className="text-xs leading-relaxed">{message}</div>
      </div>
      {action && <div className="shrink-0 ml-2">{action}</div>}
    </div>
  );
};
