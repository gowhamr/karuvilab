'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/src/lib/utils';
export function ToolInfoSection({ id, title, preview, isOpen: controlledIsOpen, onToggle, children }) {
    const [internalIsOpen, setInternalIsOpen] = useState(controlledIsOpen || false);
    const isControlled = controlledIsOpen !== undefined && onToggle !== undefined;
    const isOpen = isControlled ? controlledIsOpen : internalIsOpen;
    useEffect(() => {
        if (controlledIsOpen !== undefined) {
            setInternalIsOpen(controlledIsOpen);
        }
    }, [controlledIsOpen]);
    return (_jsxs("details", { open: isOpen, onToggle: (e) => {
            const newState = e.target.open;
            if (isControlled) {
                if (newState !== controlledIsOpen) {
                    onToggle?.(newState);
                }
            }
            else {
                setInternalIsOpen(newState);
            }
        }, className: "group bg-surface border border-border shadow-sm rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-300", children: [_jsxs("summary", { className: "flex flex-col p-5 md:p-6 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue/50 select-none list-none [&::-webkit-details-marker]:hidden", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-xl md:text-2xl font-bold text-text group-hover:text-blue transition-colors", children: title }), _jsx("div", { className: "w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center shrink-0 group-hover:bg-blue/10 transition-colors", children: _jsx(ChevronDown, { className: cn("w-4 h-4 text-text-4 transition-transform duration-300", isOpen && "rotate-180") }) })] }), !isOpen && preview && (_jsxs("div", { className: "mt-2 text-sm text-text-4 flex items-center gap-2 animate-in fade-in", children: [_jsx("span", { className: "truncate flex-1", children: preview }), _jsxs("span", { className: "text-blue font-bold text-xs shrink-0 flex items-center gap-1", children: ["Read more ", _jsx(ChevronDown, { className: "w-3 h-3" })] })] }))] }), isOpen && (_jsx("div", { className: "px-5 pt-5 pb-6 md:px-6 md:pt-6 md:pb-8 border-t border-border/50 animate-in fade-in slide-in-from-top-2 duration-300", children: children }))] }));
}
