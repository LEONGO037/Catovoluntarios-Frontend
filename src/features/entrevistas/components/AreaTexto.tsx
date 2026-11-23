import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../../utils/cn';

interface AreaTextoProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  etiqueta?: string;
  ayuda?: string;
}

/** Textarea con el mismo estilo de los inputs de M01 (M01 no incluye un Textarea). */
export const AreaTexto = forwardRef<HTMLTextAreaElement, AreaTextoProps>(
  ({ etiqueta, ayuda, id, className, rows = 4, ...props }, ref) => {
    const campoId = id ?? props.name;
    return (
      <div className="w-full space-y-1.5 text-left">
        {etiqueta && (
          <label htmlFor={campoId} className="block text-xs font-semibold text-cato-slate uppercase tracking-wider">
            {etiqueta}
          </label>
        )}
        <textarea
          id={campoId}
          ref={ref}
          rows={rows}
          className={cn(
            'w-full px-3.5 py-2.5 border border-cato-input rounded-lg text-sm text-cato-text bg-white placeholder-cato-muted resize-y',
            'focus:outline-none focus:ring-2 focus:ring-cato-navy/20 focus:border-cato-navy transition-colors duration-150',
            className,
          )}
          {...props}
        />
        {ayuda && <p className="text-xs text-cato-muted">{ayuda}</p>}
      </div>
    );
  },
);
AreaTexto.displayName = 'AreaTexto';
