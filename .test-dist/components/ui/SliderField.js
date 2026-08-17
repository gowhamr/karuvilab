"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as Slider from '@radix-ui/react-slider';
import { cn } from "@/src/lib/utils";
import { useState, useEffect } from "react";
export function SliderField({ label, id, min, max, step = 1, value, onChange, format, error }) {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(String(value));
    // Sync local input state if value changes externally while not editing
    useEffect(() => {
        if (!isEditing) {
            setInputValue(String(value));
        }
    }, [value, isEditing]);
    const handleBlur = () => {
        setIsEditing(false);
        // Remove any formatting like commas before parsing
        const parsed = parseFloat(inputValue.replace(/,/g, ''));
        if (!isNaN(parsed)) {
            onChange(Math.max(min, Math.min(max, parsed)));
        }
        else {
            setInputValue(String(value));
        }
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter')
            handleBlur();
        if (e.key === 'Escape') {
            setIsEditing(false);
            setInputValue(String(value));
        }
    };
    const display = format ? format(value) : String(value);
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("label", { htmlFor: id, className: cn("text-sm font-bold", error ? "text-error" : "text-text-2"), children: label }), isEditing ? (_jsx("input", { id: id, type: "text", inputMode: "decimal", autoFocus: true, className: cn("w-32 bg-surface border rounded-lg px-2 py-1 text-sm font-black text-text text-right focus:outline-none focus:ring-1", error ? "border-error/50 focus:ring-error" : "border-border hover:border-blue/50 focus:border-blue/50 focus:ring-blue"), value: inputValue, onChange: (e) => setInputValue(e.target.value), onBlur: handleBlur, onKeyDown: handleKeyDown })) : (_jsx("div", { className: "flex items-center gap-2", children: _jsx("input", { id: id, type: "text", inputMode: "decimal", className: cn("w-28 bg-surface border rounded-lg px-2 py-1 text-sm font-black text-text text-right focus:outline-none focus:ring-1 hover:bg-surface-2 transition-colors", error ? "border-error/50 focus:ring-error" : "border-border hover:border-blue/50 focus:border-blue/50 focus:ring-blue"), value: isEditing ? inputValue : display, onFocus: () => {
                                setInputValue(String(value));
                                setIsEditing(true);
                            }, onChange: (e) => setInputValue(e.target.value), onBlur: handleBlur, onKeyDown: handleKeyDown, "aria-label": `Edit ${label}` }) }))] }), _jsxs(Slider.Root, { className: "relative flex items-center select-none touch-none w-full h-11", value: [value], onValueChange: (v) => onChange(v[0]), max: max, min: min, step: step, children: [_jsx(Slider.Track, { className: cn("relative grow rounded-full h-2", error ? "bg-error/20" : "bg-blue/20"), children: _jsx(Slider.Range, { className: cn("absolute rounded-full h-full", error ? "bg-error" : "bg-brand-primary") }) }), _jsx(Slider.Thumb, { id: isEditing ? `${id}-thumb` : id, className: cn("block w-6 h-6 bg-text border rounded-full shadow-md cursor-pointer hover:scale-110 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-mat-base focus:outline-none transition-all active:scale-95", error ? "border-error focus-visible:ring-error" : "border-brand-primary focus-visible:ring-brand-primary"), "aria-label": label, "aria-valuetext": display, "aria-valuemin": min, "aria-valuemax": max, "aria-valuenow": value })] }), _jsxs("div", { className: "flex justify-between text-xs text-text-4 font-black uppercase tracking-widest-sm", "aria-hidden": "true", children: [_jsx("span", { children: format ? format(min) : min }), _jsx("span", { children: format ? format(max) : max })] })] }));
}
