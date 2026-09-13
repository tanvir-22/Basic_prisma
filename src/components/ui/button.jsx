import React from 'react';
import { clsx } from 'clsx';

export function Button({
  children,
  className,
  variant = 'yellow',
  size = 'md',
  loading = false,
  disabled,
  type = 'button',
  ...props
}) {
  const variantClasses = {
    yellow: 'bg-neo-yellow text-black hover:bg-yellow-300',
    green: 'bg-neo-green text-black hover:bg-emerald-400',
    pink: 'bg-neo-pink text-black hover:bg-pink-400',
    cyan: 'bg-neo-cyan text-black hover:bg-cyan-300',
    orange: 'bg-neo-orange text-white hover:bg-orange-600',
    white: 'bg-white text-black hover:bg-slate-100',
    black: 'bg-black text-white hover:bg-zinc-800',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base font-bold',
    lg: 'px-8 py-4 text-lg font-black',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={clsx(
        'border-4 border-black font-bold uppercase transition-all duration-75 cursor-pointer',
        'active:translate-x-[3px] active:translate-y-[3px] active:shadow-none',
        'focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-2',
        'disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none',
        variantClasses[variant],
        sizeClasses[size],
        variant === 'black' ? 'shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]' : 'shadow-neo-md',
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-5 w-5 text-current"
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
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
