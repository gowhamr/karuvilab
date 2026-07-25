'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface ToolInfoSectionProps {
  toolId?: string; // Kept for backwards compatibility if needed
  id: string;
  title: string;
  preview?: string;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  children: React.ReactNode;
}

export function ToolInfoSection({ id, title, preview, isOpen: controlledIsOpen, onToggle, children }: ToolInfoSectionProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(controlledIsOpen || false);
  
  const isControlled = controlledIsOpen !== undefined && onToggle !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  useEffect(() => {
    if (controlledIsOpen !== undefined) {
      setInternalIsOpen(controlledIsOpen);
    }
  }, [controlledIsOpen]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    const newState = !isOpen;
    
    if (isControlled) {
      onToggle?.(newState);
    } else {
      setInternalIsOpen(newState);
    }
  };

  return (
    <details 
      open={isOpen} 
      className="group bg-surface border border-border shadow-sm rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-300"
    >
      <summary 
        onClick={handleToggle}
        className="flex flex-col p-5 md:p-6 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue/50 select-none list-none [&::-webkit-details-marker]:hidden"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-text group-hover:text-blue transition-colors">
            {title}
          </h2>
          <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center shrink-0 group-hover:bg-blue/10 transition-colors">
            <ChevronDown className={cn("w-4 h-4 text-text-4 transition-transform duration-300", isOpen && "rotate-180")} />
          </div>
        </div>
        {!isOpen && preview && (
          <div className="mt-2 text-sm text-text-4 flex items-center gap-2 animate-in fade-in">
            <span className="truncate flex-1">{preview}</span>
            <span className="text-blue font-bold text-xs shrink-0 flex items-center gap-1">Read more <ChevronDown className="w-3 h-3" /></span>
          </div>
        )}
      </summary>
      
      {isOpen && (
        <div className="px-5 pb-6 md:px-6 md:pb-8 pt-0 border-t border-border/50 animate-in fade-in slide-in-from-top-2 duration-300">
          {children}
        </div>
      )}
    </details>
  );
}
