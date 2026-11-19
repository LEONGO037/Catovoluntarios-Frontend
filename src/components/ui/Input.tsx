import React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      id,
      disabled,
      ...props
    },
    ref,
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-cato-slate uppercase tracking-wider"
          >
            {label}
            {props.required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-cato-muted pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={cn(
              'w-full h-11 px-3.5 border rounded-lg text-sm text-cato-text bg-white placeholder-cato-muted transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-cato-navy/20 focus:border-cato-navy',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-cato-input',
              disabled && 'bg-gray-100 text-gray-500 cursor-not-allowed',
              className,
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 text-cato-muted flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <p className="text-xs text-rose-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-cato-muted">{helperText}</p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = 'Input';
