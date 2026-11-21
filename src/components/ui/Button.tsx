import React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'cta' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      primary: 'bg-cato-navy hover:bg-cato-navy-dark text-white',
      cta: 'bg-cato-gold hover:bg-cato-gold-dark text-cato-navy font-bold shadow-sm',
      outline: 'border border-cato-border bg-white hover:bg-cato-canvas text-cato-slate font-medium',
      danger: 'bg-role-catolider-primary hover:bg-red-700 text-white font-medium',
      ghost: 'bg-transparent hover:bg-cato-canvas text-cato-slate font-medium',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-xs rounded-md',
      md: 'px-4 py-2 text-sm rounded-lg',
      lg: 'px-5 py-2.5 text-base rounded-lg',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-cato-navy focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
