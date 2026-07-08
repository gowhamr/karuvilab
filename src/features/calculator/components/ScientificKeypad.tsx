import React from 'react';
import { CalculatorKey } from './CalculatorKey';
import { useCalculatorStore } from '../store';

export const ScientificKeypad = () => {
  const append = useCalculatorStore(s => s.append);
  const angleUnit = useCalculatorStore(s => s.angleUnit);
  const setAngleUnit = useCalculatorStore(s => s.setAngleUnit);

  const toggleAngleUnit = () => {
    setAngleUnit(angleUnit === 'deg' ? 'rad' : 'deg');
  };

  const keys: Array<{ label: string | React.ReactNode; action: () => void; variant?: 'default' | 'primary' | 'danger' | 'secondary' | 'ghost'; className?: string; }> = [
    { label: '(', action: () => append('(') },
    { label: ')', action: () => append(')') },
    { label: 'mc', action: () => useCalculatorStore.getState().setMemory('MC'), variant: 'ghost' as const },
    { label: 'm+', action: () => useCalculatorStore.getState().setMemory('M+'), variant: 'ghost' as const },
    { label: 'm-', action: () => useCalculatorStore.getState().setMemory('M-'), variant: 'ghost' as const },
    { label: 'mr', action: () => useCalculatorStore.getState().setMemory('MR'), variant: 'ghost' as const },
    
    { label: angleUnit === 'deg' ? 'Rad' : 'Deg', action: toggleAngleUnit, variant: 'ghost' as const },
    { label: 'sin', action: () => append('sin(') },
    { label: 'cos', action: () => append('cos(') },
    { label: 'tan', action: () => append('tan(') },
    
    { label: 'x²', action: () => append('^2') },
    { label: 'x³', action: () => append('^3') },
    { label: 'xʸ', action: () => append('^') },
    { label: 'eˣ', action: () => append('e^') },
    
    { label: '√x', action: () => append('sqrt(') },
    { label: 'log', action: () => append('log(') },
    { label: 'ln', action: () => append('ln(') },
    { label: 'abs', action: () => append('abs(') },
    
    { label: 'π', action: () => append('pi') },
    { label: 'e', action: () => append('e') },
    { label: 'ceil', action: () => append('ceil(') },
    { label: 'floor', action: () => append('floor(') },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 w-full h-full">
      {keys.map((k, i) => (
        <CalculatorKey
          key={i}
          label={k.label}
          onClick={k.action}
          variant={k.variant || 'default'}
          className={k.className || 'text-sm'}
        />
      ))}
    </div>
  );
};
