import React from 'react';
import { clsx } from 'clsx';

export function Badge({
  children,
  className,
  variant = 'white',
  ...props
}) {
  const variantClasses = {
    'neo-yellow': 'bg-neo-yellow text-black',
    'neo-green': 'bg-neo-green text-black',
    'neo-pink': 'bg-neo-pink text-black',
    'neo-cyan': 'bg-neo-cyan text-black',
    'neo-orange': 'bg-neo-orange text-white',
    yellow: 'bg-neo-yellow text-black',
    green: 'bg-neo-green text-black',
    pink: 'bg-neo-pink text-black',
    cyan: 'bg-neo-cyan text-black',
    orange: 'bg-neo-orange text-white',
    white: 'bg-white text-black',
    black: 'bg-black text-white',
  };

  const selectedClass = variantClasses[variant] || 'bg-white text-black';

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-1 text-xs font-black uppercase tracking-wider border-2 border-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]',
        selectedClass,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
