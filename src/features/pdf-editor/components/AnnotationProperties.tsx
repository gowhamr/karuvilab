"use client";
import React from "react";
import { useEditorStore, TextAnnotation, DrawAnnotation, ShapeAnnotation } from "../store";

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

  if (!selectedAnnotation) return null;

  const handleColorChange = (color: string) => {
    updateAnnotation(selectedAnnotation.id, { color });
  };

  const handleFillChange = (fill: string) => {
    if (selectedAnnotation.type === 'shape') {
      updateAnnotation(selectedAnnotation.id, { fill });
    }
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (selectedAnnotation.type === 'text') {
      updateAnnotation(selectedAnnotation.id, { fontSize: val });
    } else if (selectedAnnotation.type === 'draw' || selectedAnnotation.type === 'shape') {
      updateAnnotation(selectedAnnotation.id, { strokeWidth: val });
    }
  };

  return (
    <div className="absolute top-16 right-4 sm:top-20 sm:right-6 bg-surface shadow-xl border border-border rounded-xl p-4 z-modal flex flex-col gap-4 w-64">
      <h3 className="font-bold text-sm text-text border-b border-border pb-2">
        {selectedAnnotation.type.charAt(0).toUpperCase() + selectedAnnotation.type.slice(1)} Properties
      </h3>

      {/* Color Picker (for Text, Draw, Shape Border) */}
      {(selectedAnnotation.type === 'text' || selectedAnnotation.type === 'draw' || selectedAnnotation.type === 'shape') && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-text-muted">Color</label>
          <div className="flex flex-wrap gap-2">
            {COLORS.filter(c => c.value !== 'transparent').map(color => (
              <button
                key={color.value}
                onClick={() => handleColorChange(color.value)}
                className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${(selectedAnnotation as TextAnnotation).color === color.value ? 'border-blue scale-110 shadow-sm' : 'border-transparent shadow-sm'}`}
                style={{ backgroundColor: color.value }}
                title={color.label}
                aria-label={`Set color to ${color.label}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Fill Color Picker (for Shape) */}
      {selectedAnnotation.type === 'shape' && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-text-muted">Fill Color</label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map(color => (
              <button
                key={color.value}
                onClick={() => handleFillChange(color.value)}
                className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${((selectedAnnotation as ShapeAnnotation).fill || 'transparent') === color.value ? 'border-blue scale-110 shadow-sm' : 'border-transparent shadow-sm'} ${color.value === 'transparent' ? 'bg-[url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhYWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==")]' : ''}`}
                style={color.value !== 'transparent' ? { backgroundColor: color.value } : {}}
                title={color.label}
                aria-label={`Set fill to ${color.label}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size Slider (Text fontSize or Draw/Shape strokeWidth) */}
      {(selectedAnnotation.type === 'text' || selectedAnnotation.type === 'draw' || selectedAnnotation.type === 'shape') && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-text-muted flex justify-between">
            <span>{selectedAnnotation.type === 'text' ? 'Font Size' : 'Stroke Width'}</span>
            <span>
              {selectedAnnotation.type === 'text' 
                ? (selectedAnnotation as TextAnnotation).fontSize 
                : (selectedAnnotation as DrawAnnotation).strokeWidth}
            </span>
          </label>
          <input
            type="range"
            min="1"
            max="10"
            step="0.5"
            value={
              selectedAnnotation.type === 'text'
                ? (selectedAnnotation as TextAnnotation).fontSize
                : (selectedAnnotation as DrawAnnotation).strokeWidth
            }
            onChange={handleSizeChange}
            className="w-full accent-blue"
            aria-label={selectedAnnotation.type === 'text' ? 'Adjust Font Size' : 'Adjust Stroke Width'}
          />
        </div>
      )}
    </div>
  );
}
