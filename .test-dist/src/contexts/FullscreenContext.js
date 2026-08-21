'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
const FullscreenContext = createContext(null);
export function FullscreenProvider({ children }) {
    const [displayMode, setDisplayMode] = useState('normal');
    const [activeToolId, setActiveToolId] = useState(null);
    const [currentToolId, setCurrentToolId] = useState(null);
    const isFullscreen = displayMode !== 'normal';
    const registerTool = useCallback((toolId) => {
        setCurrentToolId(toolId);
    }, []);
    const unregisterTool = useCallback((toolId) => {
        setCurrentToolId(prev => prev === toolId ? null : prev);
    }, []);
    const exit = useCallback(() => {
        setDisplayMode('normal');
        setActiveToolId(null);
        document.body.style.overflow = '';
        // Exit native fullscreen if active
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => { });
        }
        window.dispatchEvent(new CustomEvent('kv-fullscreen-exit'));
    }, []);
    const enterFocus = useCallback((toolId) => {
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => { });
        }
        setDisplayMode('focus');
        setActiveToolId(toolId);
        document.body.style.overflow = 'hidden';
        window.dispatchEvent(new CustomEvent('kv-fullscreen-enter', {
            detail: { toolId, mode: 'focus' }
        }));
    }, []);
    const enterDashboard = useCallback((toolId) => {
        setDisplayMode('dashboard');
        setActiveToolId(toolId);
        document.body.style.overflow = 'hidden';
        // Try to enter native fullscreen
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.warn(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
            });
        }
        window.dispatchEvent(new CustomEvent('kv-fullscreen-enter', {
            detail: { toolId, mode: 'dashboard' }
        }));
    }, []);
    const toggleFocus = useCallback((toolId) => {
        if (displayMode === 'focus') {
            exit();
        }
        else {
            enterFocus(toolId);
        }
    }, [displayMode, enterFocus, exit]);
    const toggleDashboard = useCallback((toolId) => {
        if (displayMode === 'dashboard') {
            exit();
        }
        else {
            enterDashboard(toolId);
        }
    }, [displayMode, enterDashboard, exit]);
    // Global keyboard handler
    useEffect(() => {
        function handleKeyDown(e) {
            const targetId = activeToolId || currentToolId;
            // Ignore if typing in an input, except for F11 and Escape
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target?.tagName) || e.target?.isContentEditable) {
                if (e.key === 'Escape' && isFullscreen) {
                    exit();
                }
                if (e.key === 'F11' && targetId) {
                    e.preventDefault();
                    toggleDashboard(targetId);
                }
                return;
            }
            if (e.key === 'F11') {
                if (targetId) {
                    e.preventDefault();
                    toggleDashboard(targetId);
                }
            }
            if (e.key === 'f' || e.key === 'F') {
                // Toggle Focus mode with 'F' key
                if (targetId && !e.ctrlKey && !e.metaKey && !e.altKey) {
                    e.preventDefault();
                    toggleFocus(targetId);
                }
            }
            if (e.key === 'Escape' && isFullscreen) {
                exit();
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFullscreen, displayMode, activeToolId, currentToolId, toggleFocus, toggleDashboard, exit]);
    // Sync state if native fullscreen is exited via browser UI (e.g. Esc)
    useEffect(() => {
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement && displayMode === 'dashboard') {
                exit();
            }
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, [displayMode, exit]);
    // Cleanup
    useEffect(() => {
        return () => { document.body.style.overflow = ''; };
    }, []);
    const contextValue = useMemo(() => ({
        displayMode,
        isFullscreen,
        activeToolId,
        currentToolId,
        registerTool,
        unregisterTool,
        enterFocus,
        enterDashboard,
        enter: enterFocus, // Legacy mapping
        exit,
        toggleFocus,
        toggleDashboard,
        toggle: toggleFocus // Legacy mapping
    }), [
        displayMode,
        isFullscreen,
        activeToolId,
        currentToolId,
        registerTool,
        unregisterTool,
        enterFocus,
        enterDashboard,
        exit,
        toggleFocus,
        toggleDashboard
    ]);
    return (_jsx(FullscreenContext.Provider, { value: contextValue, children: children }));
}
export function useFullscreenContext() {
    const ctx = useContext(FullscreenContext);
    if (!ctx)
        throw new Error('useFullscreenContext must be used within FullscreenProvider');
    return ctx;
}
