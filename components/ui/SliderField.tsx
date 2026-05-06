interface SliderFieldProps {
  label: string;
  id: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}

export function SliderField({ label, id, min, max, step = 1, value, onChange, format }: SliderFieldProps) {
  const display = format ? format(value) : String(value);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-bold text-text-2">{label}</label>
        <span className="text-sm font-black text-blue">{display}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-blue"
      />
      <div className="flex justify-between text-[10px] text-text-4">
        <span>{format ? format(min) : min}</span>
        <span>{format ? format(max) : max}</span>
      </div>
    </div>
  );
}
