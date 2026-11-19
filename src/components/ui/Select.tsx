import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface Option {
  value: string | number;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
  helperText?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, helperText, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold text-cato-slate uppercase tracking-wider"
          >
            {label}
            {props.required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'w-full h-11 px-3.5 pr-10 border rounded-lg text-sm text-cato-text bg-white appearance-none cursor-pointer transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-cato-navy/20 focus:border-cato-navy',
              error
                ? 'border-rose-400 focus:border-rose-500'
                : 'border-cato-input',
              className,
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-cato-muted">
            <ChevronDown className="w-4 h-4" />
          </div>
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

Select.displayName = 'Select';
