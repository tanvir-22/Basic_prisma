import React from 'react';
import { clsx } from 'clsx';

export function Card({
  children,
  className,
  bg = 'bg-white',
  hasShadow = true,
  ...props
}) {
  return (
    <div
      className={clsx(
        'border-4 border-black p-6',
        bg,
        hasShadow && 'shadow-neo-md',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
