'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Minimize2, Clock, AlignLeft, Keyboard,
  ChevronUp, ChevronDown
} from 'lucide-react';
import { useFullscreenContext } from '@/src/contexts/FullscreenContext';
import { useSettingsStore } from '@/src/store/settings/store';

interface FocusModeToolbarProps {
  toolId: string;
  toolName: string;
  wordCount?: number | undefined;
  charCount?: number | undefined;
  lineCount?: number | undefined;
  language?: string | undefined;
  onFontSizeChange?: ((size: number) => void) | undefined;
  onThemeToggle?: (() => void) | undefined;
  onWrapToggle?: (() => void) | undefined;
}

export function FocusModeToolbar({
  toolId,
  toolName,
  wordCount,
  charCount,
  lineCount,
  language,
  onFontSizeChange,
  onWrapToggle,
}: FocusModeToolbarProps) {
  const { isFullscreen, exit } = useFullscreenContext();
  const [isVisible, setIsVisible] = useState(true);
  
  // Settings store selector (Rule P-02: atomic selectors)
  const focusMode = useSettingsStore(s => s.focusMode);
  const updateFocusMode = useSettingsStore(s => s.updateFocusMode);
  
  const autoHide = focusMode.autoHideToolbar;
  const fontSize = focusMode.defaultFontSize;
  const [time, setTime] = useState(new Date());

  // Auto-hide toolbar after 3s of mouse inactivity in fullscreen
  useEffect(() => {
    if (!isFullscreen || !autoHide) {
      Promise.resolve().then(() => {
        setIsVisible(true);
      });
      return;
    }
    let timeout: ReturnType<typeof setTimeout>;
    function onMove() {
      setIsVisible(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsVisible(false), 3000);
    }
    window.addEventListener('mousemove', onMove);
    onMove();
    return () => {
      window.removeEventListener('mousemove', onMove);
      clearTimeout(timeout);
    };
  }, [isFullscreen, autoHide]);

  // Live clock
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync font size to parent tool on mount
  useEffect(() => {
    onFontSizeChange?.(fontSize);
  }, [fontSize, onFontSizeChange]);

  function handleFontIncrease() {
    const next = Math.min(fontSize + 2, 24);
    updateFocusMode({ defaultFontSize: next });
    onFontSizeChange?.(next);
  }

  function handleFontDecrease() {
    const next = Math.max(fontSize - 2, 10);
    updateFocusMode({ defaultFontSize: next });
    onFontSizeChange?.(next);
  }

  // Format time as HH:MM
  const timeStr = time.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <AnimatePresence>
      {(isVisible || !autoHide) && (
        <motion.div
          initial={{ y: -48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -48, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`
            flex items-center justify-between
            px-4
            ${isMobile ? 'h-13' : 'h-12'}
            bg-mat-raised/90 backdrop-blur-md
            border-b border-border
            select-none
          `}
          role="toolbar"
          aria-label="Focus mode toolbar"
        >
          {/* LEFT — Tool identity */}
          <div className="flex items-center gap-3">
            {/* Exit fullscreen button */}
            <button
              onClick={exit}
              aria-label="Exit focus mode (Escape)"
              title="Exit focus mode (Esc)"
              className={`
                flex items-center gap-1.5
                ${isMobile ? 'min-h-11 px-3' : 'px-2.5 py-1.5'}
                rounded-lg
                text-text-3 hover:text-text
                hover:bg-mat-hover
                transition-all text-xs font-medium
              `}
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Exit Focus</span>
            </button>

            {/* Divider */}
            <div className="w-px h-4 bg-border" />

            {/* Tool name */}
            <span className="text-text-3 text-xs font-medium">
              {toolName}
              {language && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded
                  bg-blue/10 text-blue text-xs font-mono uppercase">
                  {language}
                </span>
              )}
            </span>
          </div>

          {/* CENTER — Stats */}
          <div className="flex items-center gap-3 text-xs text-text-4 font-mono">
            {wordCount !== undefined && (
              <span title="Word count">{wordCount.toLocaleString()} words</span>
            )}
            {charCount !== undefined && (
              <span title="Character count" className="hidden sm:inline">
                {charCount.toLocaleString()} chars
              </span>
            )}
            {lineCount !== undefined && (
              <span title="Line count" className="hidden md:inline">
                {lineCount.toLocaleString()} lines
              </span>
            )}
          </div>

          {/* RIGHT — Controls */}
          <div className="flex items-center gap-1">
            {/* Font size controls (hide on mobile) */}
            {onFontSizeChange && !isMobile && (
              <div className="flex items-center gap-0.5
                bg-mat-surface rounded-lg border border-border
                overflow-hidden mr-1">
                <button
                  onClick={handleFontDecrease}
                  aria-label="Decrease font size"
                  disabled={fontSize <= 10}
                  className="px-2 py-1.5 text-text-3 hover:text-text
                    hover:bg-mat-hover disabled:opacity-30
                    transition-all text-xs"
                >
                  A<span className="text-tiny">-</span>
                </button>
                <span className="px-1.5 text-xs text-text-4
                  font-mono border-x border-border">
                  {fontSize}
                </span>
                <button
                  onClick={handleFontIncrease}
                  aria-label="Increase font size"
                  disabled={fontSize >= 24}
                  className="px-2 py-1.5 text-text-3 hover:text-text
                    hover:bg-mat-hover disabled:opacity-30
                    transition-all text-xs"
                >
                  A<span className="text-tiny">+</span>
                </button>
              </div>
            )}

            {/* Word wrap toggle */}
            {onWrapToggle && (
              <button
                onClick={onWrapToggle}
                aria-label="Toggle word wrap"
                title="Toggle word wrap"
                className="p-1.5 rounded-lg text-text-3
                  hover:text-text hover:bg-mat-hover
                  transition-all"
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Auto-hide toggle */}
            <button
              onClick={() => updateFocusMode({ autoHideToolbar: !autoHide })}
              aria-label={autoHide
                ? 'Disable auto-hide toolbar'
                : 'Enable auto-hide toolbar'}
              title={autoHide ? 'Toolbar: auto-hide ON' : 'Toolbar: always visible'}
              className={`p-1.5 rounded-lg transition-all
                ${autoHide
                  ? 'text-blue bg-blue/10'
                  : 'text-text-3 hover:text-text hover:bg-mat-hover'
                }`}
            >
              {autoHide
                ? <ChevronUp className="w-3.5 h-3.5" />
                : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {/* Clock */}
            <div className="flex items-center gap-1
              px-2 py-1 rounded-lg
              text-text-4 text-xs font-mono
              hidden sm:flex">
              <Clock className="w-3 h-3" />
              {timeStr}
            </div>

            {/* Keyboard shortcut hint */}
            {!isMobile && (
              <div className="hidden md:flex items-center gap-1
                px-2 py-1 rounded-lg
                border border-border text-text-4 text-xs font-mono">
                <Keyboard className="w-3 h-3" />
                F11
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
