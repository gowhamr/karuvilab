import React from 'react';
import { CalculatorKey } from './CalculatorKey';
import { useCalculatorStore } from '../store';

export const StandardKeypad = () => {
  const append = useCalculatorStore(s => s.append);
  const calculate = useCalculatorStore(s => s.calculate);
  const clear = useCalculatorStore(s => s.clear);
  const deleteLast = useCalculatorStore(s => s.deleteLast);

  const keys: Array<{ label: string | React.ReactNode; action: () => void; variant?: 'default' | 'primary' | 'danger' | 'secondary' | 'ghost'; className?: string; }> = [
    { label: 'AC', action: () => clear(), variant: 'danger' as const },
    { label: 'DEL', action: () => deleteLast(), variant: 'secondary' as const },
    { label: '%', action: () => append('%'), variant: 'secondary' as const },
    { label: '÷', action: () => append('/'), variant: 'secondary' as const },
    
    { label: '7', action: () => append('7') },
    { label: '8', action: () => append('8') },
    { label: '9', action: () => append('9') },
    { label: '×', action: () => append('*'), variant: 'secondary' as const },
    
    { label: '4', action: () => append('4') },
    { label: '5', action: () => append('5') },
    { label: '6', action: () => append('6') },
    { label: '-', action: () => append('-'), variant: 'secondary' as const },
    
    { label: '1', action: () => append('1') },
    { label: '2', action: () => append('2') },
    { label: '3', action: () => append('3') },
    { label: '+', action: () => append('+'), variant: 'secondary' as const },
    
    { label: '0', action: () => append('0'), className: 'col-span-2' },
    { label: '.', action: () => append('.') },
    { label: '=', action: () => calculate(), variant: 'primary' as const },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 w-full h-full">
      {keys.map((k, i) => (
        <CalculatorKey
          key={i}
          label={k.label}
          onClick={k.action}
          variant={k.variant}
          className={k.className}
        />
      ))}
    </div>
  );
};
