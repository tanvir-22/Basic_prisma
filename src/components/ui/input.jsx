import React from 'react';
import { clsx } from 'clsx';

export const Input = React.forwardRef(
  ({ className, type = 'text', label, error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-2">
        {label && (
          <label className="text-sm font-black uppercase tracking-wide text-black">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={clsx(
            'w-full border-4 border-black bg-white p-3 font-bold text-black outline-none transition-all duration-75',
            'shadow-neo-sm focus:shadow-neo-md focus:translate-x-[-2px] focus:translate-y-[-2px]',
            'placeholder:text-zinc-500 placeholder:font-medium',
            'disabled:opacity-60 disabled:cursor-not-allowed',
            error && 'border-red-500 shadow-[2px_2px_0px_0px_rgba(239,68,68,1)]',
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-xs font-black uppercase text-red-600 bg-red-100 border border-red-500 px-2 py-0.5 self-start shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
