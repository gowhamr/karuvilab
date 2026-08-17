"use client";
import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEditorStore } from "../store";
const COLORS = [
    { label: 'Black', value: '#000000' },
    { label: 'White', value: '#FFFFFF' },
    { label: 'Red', value: '#EF4444' },
    { label: 'Blue', value: '#3B82F6' },
    { label: 'Indigo', value: '#4F46E5' },
    { label: 'Green', value: '#10B981' },
    { label: 'Yellow', value: '#F59E0B' },
    { label: 'Transparent', value: 'transparent' },
];
export default function AnnotationProperties() {
    const selectedAnnotationId = useEditorStore(state => state.selectedAnnotationId);
    const annotations = useEditorStore(state => state.annotations);
    const updateAnnotation = useEditorStore(state => state.updateAnnotation);
    const selectedAnnotation = annotations.find(a => a.id === selectedAnnotationId);
    if (!selectedAnnotation)
        return null;
    const handleColorChange = (color) => {
        updateAnnotation(selectedAnnotation.id, { color });
    };
    const handleFillChange = (fill) => {
        if (selectedAnnotation.type === 'shape') {
            updateAnnotation(selectedAnnotation.id, { fill });
        }
    };
    const handleSizeChange = (e) => {
        const val = parseFloat(e.target.value);
        if (selectedAnnotation.type === 'text') {
            updateAnnotation(selectedAnnotation.id, { fontSize: val });
        }
        else if (selectedAnnotation.type === 'draw' || selectedAnnotation.type === 'shape' || selectedAnnotation.type === 'arrow') {
            updateAnnotation(selectedAnnotation.id, { strokeWidth: val });
        }
    };
    const hasColor = selectedAnnotation.type === 'text' || selectedAnnotation.type === 'draw' || selectedAnnotation.type === 'shape' || selectedAnnotation.type === 'arrow' || selectedAnnotation.type === 'highlight';
    const hasSize = selectedAnnotation.type === 'text' || selectedAnnotation.type === 'draw' || selectedAnnotation.type === 'shape' || selectedAnnotation.type === 'arrow';
    return (_jsxs("div", { className: "absolute top-16 right-4 sm:top-20 sm:right-6 bg-surface shadow-xl border border-border rounded-xl p-4 z-modal flex flex-col gap-4 w-64", children: [_jsxs("h3", { className: "font-bold text-sm text-text border-b border-border pb-2", children: [selectedAnnotation.type.charAt(0).toUpperCase() + selectedAnnotation.type.slice(1), " Properties"] }), hasColor && (_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-bold text-text-muted", children: "Color" }), _jsx("div", { className: "flex flex-wrap gap-2", children: COLORS.filter(c => c.value !== 'transparent').map(color => (_jsx("button", { onClick: () => handleColorChange(color.value), className: `w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${selectedAnnotation.color === color.value ? 'border-blue scale-110 shadow-sm' : 'border-transparent shadow-sm'}`, style: { backgroundColor: color.value }, title: color.label, "aria-label": `Set color to ${color.label}` }, color.value))) })] })), selectedAnnotation.type === 'shape' && (_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-bold text-text-muted", children: "Fill Color" }), _jsx("div", { className: "flex flex-wrap gap-2", children: COLORS.map(color => (_jsx("button", { onClick: () => handleFillChange(color.value), className: `w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${(selectedAnnotation.fill || 'transparent') === color.value ? 'border-blue scale-110 shadow-sm' : 'border-transparent shadow-sm'} ${color.value === 'transparent' ? 'bg-[url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhYWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==")]' : ''}`, style: color.value !== 'transparent' ? { backgroundColor: color.value } : {}, title: color.label, "aria-label": `Set fill to ${color.label}` }, color.value))) })] })), hasSize && (_jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "text-xs font-bold text-text-muted flex justify-between", children: [_jsx("span", { children: selectedAnnotation.type === 'text' ? 'Font Size' : 'Stroke Width' }), _jsx("span", { children: selectedAnnotation.type === 'text'
                                    ? selectedAnnotation.fontSize
                                    : selectedAnnotation.strokeWidth })] }), _jsx("input", { type: "range", min: "1", max: selectedAnnotation.type === 'text' ? "120" : "20", step: selectedAnnotation.type === 'text' ? "1" : "0.5", value: selectedAnnotation.type === 'text'
                            ? selectedAnnotation.fontSize
                            : selectedAnnotation.strokeWidth, onChange: handleSizeChange, className: "w-full accent-blue", "aria-label": selectedAnnotation.type === 'text' ? 'Adjust Font Size' : 'Adjust Stroke Width' })] }))] }));
}
