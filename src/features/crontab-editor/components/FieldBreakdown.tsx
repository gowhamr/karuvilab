import React from 'react';
import { m } from 'framer-motion';
import { cn } from '@/src/lib/utils';
import { CronField } from '../types';

interface FieldBreakdownProps {
  fields: CronField[];
  localExpression: string;
  fontSize: number;
  onFieldChange: (index: number, val: string) => void;
}

export const FieldBreakdown = ({ fields, localExpression, fontSize, onFieldChange }: FieldBreakdownProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {fields.map((field, i) => (
        <m.div
          key={field.label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.03 }}
          className={cn(
            "group rounded-3xl p-5 space-y-3 border transition-all hover:shadow-xl hover:-translate-y-1",
            field.value === '*' 
              ? "bg-surface border-border" 
              : "bg-blue/5 border-blue/20 shadow-sm"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-text-4 group-hover:text-blue transition-colors">
              {field.label}
            </span>
            <span className="text-tiny font-bold text-text-4 bg-bg px-2 py-0.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
              {field.min}-{field.max}
            </span>
          </div>
          <input
            type="text"
            value={field.value}
            onChange={(e) => onFieldChange(i, e.target.value)}
            className="w-full bg-transparent font-mono text-2xl font-black text-text focus:outline-none focus:text-blue transition-colors"
            style={{ fontSize: (fontSize + 8) + 'px' }}
          />
          <p className="text-tiny text-text-3 font-bold leading-tight group-hover:text-text transition-colors min-h-8 line-clamp-2">
            {field.description}
          </p>
        </m.div>
      ))}
    </div>
  );
};
