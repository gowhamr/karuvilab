'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface ToolInfoSectionProps {
  toolId: string;
  id: string;
  title: string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}

export function ToolInfoSection({ toolId, id, title, defaultExpanded = false, children }: ToolInfoSectionProps) {
  const storageKey = `kv-section-state-${toolId}`;
  
  // Initialize state from sessionStorage or use default
  const [isOpen, setIsOpen] = useState(defaultExpanded);
  
  // Hydration sync
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (typeof parsed[id] === 'boolean') {
          setIsOpen(parsed[id]);
        }
      }
    } catch (err) {}
  }, [id, storageKey]);

  const handleToggle = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
    const newState = e.currentTarget.open;
    setIsOpen(newState);
    
    try {
      const stored = sessionStorage.getItem(storageKey);
      const parsed = stored ? JSON.parse(stored) : {};
      parsed[id] = newState;
      sessionStorage.setItem(storageKey, JSON.stringify(parsed));
    } catch (err) {}
  };

  return (
    <details 
      open={isOpen} 
      onToggle={handleToggle}
      className="group bg-surface border border-border shadow-sm rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-300"
    >
      <summary className="flex items-center justify-between p-5 md:p-6 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue/50 select-none list-none [&::-webkit-details-marker]:hidden">
        <h2 className="text-xl md:text-2xl font-bold text-text group-hover:text-blue transition-colors">
          {title}
        </h2>
        <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center shrink-0 group-hover:bg-blue/10 transition-colors">
          <ChevronDown className="w-4 h-4 text-text-4 group-open:rotate-180 transition-transform duration-300" />
        </div>
      </summary>
      <div className="px-5 pb-6 md:px-6 md:pb-8 pt-0 border-t border-border/50 animate-in fade-in slide-in-from-top-2 duration-300">
        {children}
      </div>
    </details>
  );
}
