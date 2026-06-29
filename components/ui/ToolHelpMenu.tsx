'use client';

import * as Popover from '@radix-ui/react-popover';
import { HelpCircle, MessageSquare, Bug, Lightbulb, Keyboard, Info } from 'lucide-react';
import Link from 'next/link';

interface ToolHelpMenuProps {
  toolId: string;
  toolName: string;
}

export function ToolHelpMenu({ toolId, toolName }: ToolHelpMenuProps) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button 
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface border border-border text-text-muted hover:text-text hover:bg-surface-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/50"
          aria-label="Help & Resources"
          title="Help & Resources"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </Popover.Trigger>
      
      <Popover.Portal>
        <Popover.Content 
          align="end" 
          sideOffset={8}
          className="z-popover w-56 bg-surface-2 border border-border shadow-2xl rounded-2xl p-1.5 animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="px-3 py-2 border-b border-border mb-1.5">
            <span className="text-xs font-bold uppercase tracking-widest text-text-4">Help & Support</span>
          </div>

          <div className="flex flex-col">
            <Link 
              href={`/contact?topic=support&tool=${toolId}`}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-2 hover:text-text hover:bg-blue/10 cursor-pointer outline-none transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-text-4" />
              Contact Support
            </Link>

            <Link 
              href={`/contact?topic=bug&tool=${toolId}`}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-error/80 hover:text-error hover:bg-error/10 cursor-pointer outline-none transition-colors"
            >
              <Bug className="w-4 h-4" />
              Report Bug
            </Link>

            <Link 
              href={`/contact?topic=feature&tool=${toolId}`}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-success/80 hover:text-success hover:bg-success/10 cursor-pointer outline-none transition-colors"
            >
              <Lightbulb className="w-4 h-4" />
              Request Feature
            </Link>
          </div>

          <div className="h-px bg-border my-1.5" />

          <div className="flex flex-col">
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-2 hover:text-text hover:bg-surface cursor-pointer outline-none transition-colors text-left w-full">
              <Keyboard className="w-4 h-4 text-text-4" />
              Keyboard Shortcuts
            </button>

            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-2 hover:text-text hover:bg-surface cursor-pointer outline-none transition-colors text-left w-full">
              <Info className="w-4 h-4 text-text-4" />
              About This Tool
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
