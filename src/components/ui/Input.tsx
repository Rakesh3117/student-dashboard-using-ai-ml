import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  className,
  label,
  helperText,
  error,
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  id,
  ...props
}, ref) => {
  const inputId = id || Math.random().toString(36).substring(2, 9);
  
  return (
    <div className={cn(
      'flex flex-col',
      fullWidth ? 'w-full' : '',
      className
    )}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-2 text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={cn(
            'block w-full px-4 py-2 rounded-md border text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            disabled && 'opacity-60 cursor-not-allowed bg-gray-100',
            error ? 'border-red-500' : 'border-gray-300',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
          )}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
            {rightIcon}
          </div>
        )}
      </div>
      
      {(helperText || error) && (
        <p className={cn(
          'mt-1 text-sm',
          error ? 'text-red-500' : 'text-gray-500'
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;