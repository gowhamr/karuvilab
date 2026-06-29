'use client';

import React, { ReactNode, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2 } from 'lucide-react';
import { useFullscreenContext } from '@/src/contexts/FullscreenContext';
import { useSettingsStore } from '@/src/store/settings/store';
import { FocusModeToolbar } from './FocusModeToolbar';

interface FocusModeWrapperProps {
  toolId: string;
  toolName: string;
  children: ReactNode;
  wordCount?: number;
  charCount?: number;
  lineCount?: number;
  language?: string;
  onFontSizeChange?: (size: number) => void;
  onWrapToggle?: () => void;
  showTrigger?: boolean;       // default true
  triggerPosition?: 'top-right' | 'bottom-right';  // default top-right
}

export function FocusModeWrapper({
  toolId,
  toolName,
  children,
  wordCount,
  charCount,
  lineCount,
  language,
  onFontSizeChange,
  onWrapToggle,
  showTrigger = true,
  triggerPosition = 'top-right',
}: FocusModeWrapperProps) {
  const { displayMode, isFullscreen, enterFocus, enterDashboard, activeToolId, registerTool, unregisterTool } = useFullscreenContext();
  const isThisToolFullscreen = isFullscreen && activeToolId === toolId;
  const isDashboard = displayMode === 'dashboard' && activeToolId === toolId;

  const triggerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Register tool when wrapper mounts so global key listeners know the active tool
  useEffect(() => {
    registerTool(toolId);
    return () => unregisterTool(toolId);
  }, [toolId, registerTool, unregisterTool]);

  // Persist last used tool
  useEffect(() => {
    if (isThisToolFullscreen) {
      useSettingsStore.getState().updateFocusMode({ lastUsedToolId: toolId });
    }
  }, [isThisToolFullscreen, toolId]);

  // Return focus on exit
  useEffect(() => {
    if (!isThisToolFullscreen && triggerRef.current) {
      triggerRef.current.focus();
    }
  }, [isThisToolFullscreen]);

  // Announce fullscreen entry to screen readers
  useEffect(() => {
    if (isThisToolFullscreen) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.className = 'sr-only';
      announcement.textContent = `${toolName} is now in focus mode. Press Escape to exit.`;
      document.body.appendChild(announcement);
      const timer = setTimeout(() => {
        if (document.body.contains(announcement)) {
          document.body.removeChild(announcement);
        }
      }, 3000);
      return () => {
        clearTimeout(timer);
        if (document.body.contains(announcement)) {
          document.body.removeChild(announcement);
        }
      };
    }
  }, [isThisToolFullscreen, toolName]);

  // Focus trap inside the fullscreen overlay
  useEffect(() => {
    if (!isThisToolFullscreen) return;

    function handleTab(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;
      const el = overlayRef.current;
      if (!el) return;

      const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const focusables = Array.from(el.querySelectorAll<HTMLElement>(focusableSelectors))
        .filter(i => !i.hasAttribute('disabled') && i.offsetParent !== null);
        
      if (focusables.length === 0) return;

      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          last.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    }

    window.addEventListener('keydown', handleTab);
    return () => window.removeEventListener('keydown', handleTab);
  }, [isThisToolFullscreen]);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <>
      {/* Normal mode — show enter buttons */}
      {!isThisToolFullscreen && showTrigger && (
        <div className="relative group/focus">
          <div className={`
              absolute z-content
              ${triggerPosition === 'top-right' ? 'top-3 right-3' : 'bottom-3 right-3'}
              flex items-center gap-1.5 opacity-0 group-hover/focus:opacity-100 focus-within:opacity-100 transition-all duration-150
          `}>
            <button
              onClick={() => enterFocus(toolId)}
              aria-label="Enter focus mode (f)"
              title="Focus mode (f)"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-2/80 backdrop-blur-sm border border-border text-text-3 hover:text-text hover:bg-surface text-xs font-medium"
            >
              <span className="hidden sm:inline">Focus</span>
              {!isMobile && (
                <kbd className="hidden md:inline text-tiny px-1 py-0.5 bg-surface border border-border rounded font-mono">F</kbd>
              )}
            </button>
            <button
              onClick={() => enterDashboard(toolId)}
              aria-label="Enter dashboard mode (F11)"
              title="Dashboard mode (F11)"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-2/80 backdrop-blur-sm border border-border text-text-3 hover:text-text hover:bg-surface text-xs font-medium"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dashboard</span>
              {!isMobile && (
                <kbd className="hidden md:inline text-tiny px-1 py-0.5 bg-surface border border-border rounded font-mono">F11</kbd>
              )}
            </button>
          </div>
          {children}
        </div>
      )}

      {/* Fullscreen mode — Portal overlay */}
      <AnimatePresence>
        {isThisToolFullscreen && (
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="
              fixed inset-0 z-modal
              bg-bg
              flex flex-col
            "
            role="dialog"
            aria-modal="true"
            aria-label={`${toolName} — Focus Mode`}
          >
            {/* Minimal toolbar - hidden in dashboard mode */}
            {!isDashboard && (
              <FocusModeToolbar
                toolId={toolId}
                toolName={toolName}
                wordCount={wordCount}
                charCount={charCount}
                lineCount={lineCount}
                language={language}
                onFontSizeChange={onFontSizeChange}
                onWrapToggle={onWrapToggle}
              />
            )}

            {/* Tool content — fills remaining height */}
            <div className="flex-1 overflow-auto bg-bg p-4 md:p-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Normal mode (not fullscreen, no trigger button shown) */}
      {!isThisToolFullscreen && !showTrigger && children}
    </>
  );
}
