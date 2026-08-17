'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Minimize2, Clock, AlignLeft, Keyboard, ChevronUp, ChevronDown } from 'lucide-react';
import { useFullscreenContext } from '@/src/contexts/FullscreenContext';
import { useSettingsStore } from '@/src/store/settings/store';
export const FocusModeToolbar = React.memo(function FocusModeToolbar({ toolId, toolName, wordCount, charCount, lineCount, language, onFontSizeChange, onWrapToggle, }) {
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
        let timeout;
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
    return (_jsx(AnimatePresence, { children: (isVisible || !autoHide) && (_jsxs(m.div, { initial: { y: -48, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: -48, opacity: 0 }, transition: { type: 'spring', stiffness: 300, damping: 30 }, className: `
            flex items-center justify-between
            px-4
            ${isMobile ? 'h-13' : 'h-12'}
            bg-mat-raised/90 backdrop-blur-md
            border-b border-border
            select-none
          `, role: "toolbar", "aria-label": "Focus mode toolbar", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("button", { onClick: exit, "aria-label": "Exit focus mode (Escape)", title: "Exit focus mode (Esc)", className: `
                flex items-center gap-1.5
                ${isMobile ? 'min-h-11 px-3' : 'px-2.5 py-1.5'}
                rounded-lg
                text-text-3 hover:text-text
                hover:bg-mat-hover
                transition-all text-xs font-medium
              `, children: [_jsx(Minimize2, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Exit Focus" })] }), _jsx("div", { className: "w-px h-4 bg-border" }), _jsxs("span", { className: "text-text-3 text-xs font-medium", children: [toolName, language && (_jsx("span", { className: "ml-1.5 px-1.5 py-0.5 rounded\n                  bg-blue/10 text-blue text-xs font-mono uppercase", children: language }))] })] }), _jsxs("div", { className: "flex items-center gap-3 text-xs text-text-4 font-mono", children: [wordCount !== undefined && (_jsxs("span", { title: "Word count", children: [wordCount.toLocaleString(), " words"] })), charCount !== undefined && (_jsxs("span", { title: "Character count", className: "hidden sm:inline", children: [charCount.toLocaleString(), " chars"] })), lineCount !== undefined && (_jsxs("span", { title: "Line count", className: "hidden md:inline", children: [lineCount.toLocaleString(), " lines"] }))] }), _jsxs("div", { className: "flex items-center gap-1", children: [onFontSizeChange && !isMobile && (_jsxs("div", { className: "flex items-center gap-0.5\n                bg-mat-surface rounded-lg border border-border\n                overflow-hidden mr-1", children: [_jsxs("button", { onClick: handleFontDecrease, "aria-label": "Decrease font size", disabled: fontSize <= 10, className: "px-2 py-1.5 text-text-3 hover:text-text\n                    hover:bg-mat-hover disabled:opacity-30\n                    transition-all text-xs", children: ["A", _jsx("span", { className: "text-tiny", children: "-" })] }), _jsx("span", { className: "px-1.5 text-xs text-text-4\n                  font-mono border-x border-border", children: fontSize }), _jsxs("button", { onClick: handleFontIncrease, "aria-label": "Increase font size", disabled: fontSize >= 24, className: "px-2 py-1.5 text-text-3 hover:text-text\n                    hover:bg-mat-hover disabled:opacity-30\n                    transition-all text-xs", children: ["A", _jsx("span", { className: "text-tiny", children: "+" })] })] })), onWrapToggle && (_jsx("button", { onClick: onWrapToggle, "aria-label": "Toggle word wrap", title: "Toggle word wrap", className: "p-1.5 rounded-lg text-text-3\n                  hover:text-text hover:bg-mat-hover\n                  transition-all", children: _jsx(AlignLeft, { className: "w-3.5 h-3.5" }) })), _jsx("button", { onClick: () => updateFocusMode({ autoHideToolbar: !autoHide }), "aria-label": autoHide
                                ? 'Disable auto-hide toolbar'
                                : 'Enable auto-hide toolbar', title: autoHide ? 'Toolbar: auto-hide ON' : 'Toolbar: always visible', className: `p-1.5 rounded-lg transition-all
                ${autoHide
                                ? 'text-blue bg-blue/10'
                                : 'text-text-3 hover:text-text hover:bg-mat-hover'}`, children: autoHide
                                ? _jsx(ChevronUp, { className: "w-3.5 h-3.5" })
                                : _jsx(ChevronDown, { className: "w-3.5 h-3.5" }) }), _jsxs("div", { className: "flex items-center gap-1\n              px-2 py-1 rounded-lg\n              text-text-4 text-xs font-mono\n              hidden sm:flex", children: [_jsx(Clock, { className: "w-3 h-3" }), timeStr] }), !isMobile && (_jsxs("div", { className: "hidden md:flex items-center gap-1\n                px-2 py-1 rounded-lg\n                border border-border text-text-4 text-xs font-mono", children: [_jsx(Keyboard, { className: "w-3 h-3" }), "F11"] }))] })] })) }));
});
