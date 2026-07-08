import React from 'react';
import { m } from 'framer-motion';

interface CalculatorKeyProps {
  label: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'danger' | 'secondary' | 'ghost';
  className?: string;
  gridArea?: string;
}

export const CalculatorKey: React.FC<CalculatorKeyProps> = React.memo(({
  label,
  onClick,
  variant = 'default',
  className = '',
  gridArea
}) => {
  const baseClasses = "flex items-center justify-center rounded-2xl text-xl font-medium transition-colors select-none outline-none focus-visible:ring-2 focus-visible:ring-primary";
  
  const variants = {
    default: "bg-surface hover:bg-surface-2 text-text-primary border border-border",
    primary: "bg-primary hover:brightness-110 text-white shadow-lg",
    danger: "bg-danger/10 hover:bg-danger/20 text-danger",
    secondary: "bg-surface-2 hover:bg-surface text-primary border border-border",
    ghost: "bg-transparent hover:bg-surface text-text-3"
  };

  return (
    <m.button
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      style={{ gridArea }}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      aria-label={typeof label === 'string' ? label : undefined}
    >
      {label}
    </m.button>
  );
});

CalculatorKey.displayName = 'CalculatorKey';
