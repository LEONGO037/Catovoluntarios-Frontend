import React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-cato-slate">
            {label}
            {props.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'w-full h-10 px-3 py-2 border rounded-md text-sm text-cato-text placeholder-cato-muted bg-white transition-colors duration-150',
            'focus:outline-none focus:border-cato-navy focus:ring-1 focus:ring-cato-navy',
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-cato-input',
            'disabled:bg-slate-100 disabled:cursor-not-allowed',
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs text-red-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-cato-muted">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
