import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-5xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-cato-navy/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative w-full bg-white rounded-xl shadow-modal border border-cato-border overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150',
          sizeClasses[size]
        )}
      >
        <div className="flex items-start justify-between px-6 py-4 border-b border-cato-border bg-cato-surface-header">
          <div>
            <h3 className="text-lg font-bold text-cato-navy">{title}</h3>
            {subtitle && <p className="text-xs text-cato-muted mt-0.5">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-cato-muted hover:text-cato-navy p-1 rounded-md hover:bg-slate-200/50 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
