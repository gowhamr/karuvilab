import React from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useCalculatorStore } from '../store';
import { useShallow } from 'zustand/react/shallow';

export const CalculatorDisplay = () => {
  const { expression, result, error, memory, angleUnit, mode } = useCalculatorStore(
    useShallow((s) => ({
      expression: s.expression,
      result: s.result,
      error: s.error,
      memory: s.memory,
      angleUnit: s.angleUnit,
      mode: s.mode
    }))
  );

  return (
    <div className="flex flex-col items-end justify-end h-40 p-4 bg-surface-2 rounded-2xl border border-border shadow-inner relative overflow-hidden">
      {/* Top Indicators */}
      <div className="absolute top-4 left-4 flex gap-3 text-xs font-semibold text-text-4 uppercase tracking-wider">
        {memory !== '0' && <span className="text-primary">M</span>}
        {mode === 'scientific' && <span>{angleUnit}</span>}
      </div>

      {/* Expression Area */}
      <div className="w-full text-right text-text-3 text-lg h-8 overflow-x-auto whitespace-nowrap scrollbar-hide font-mono mb-2">
        {expression}
      </div>

      {/* Main Result / Input Area */}
      <AnimatePresence mode="popLayout">
        <m.div
          key={error ? 'error' : (expression.includes('=') ? 'final' : 'typing')}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className="w-full text-right overflow-x-auto whitespace-nowrap scrollbar-hide"
        >
          {error ? (
            <span className="text-4xl font-bold text-danger">{error}</span>
          ) : (
            <span className={`font-bold tracking-tight ${result.length > 12 ? 'text-4xl' : 'text-5xl'} text-text-primary`}>
              {result || '0'}
            </span>
          )}
        </m.div>
      </AnimatePresence>
    </div>
  );
};
