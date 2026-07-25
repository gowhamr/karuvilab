const fs = require('fs');
const path = 'app/(tools)/productivity/timezone-converter/TimeZoneConverterClient.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add import for SliderField
content = content.replace(
  'import { CopyButton } from "@/components/ui/CopyButton";',
  'import { CopyButton } from "@/components/ui/CopyButton";\nimport { SliderField } from "@/components/ui/SliderField";'
);

// We need a helper to get minutes from sourceDate and set minutes
const minutesLogic = `
  const timeInMinutes = useMemo(() => {
    if (!sourceDate) return 0;
    const tPart = sourceDate.split('T')[1];
    if (!tPart) return 0;
    const [h, m] = tPart.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  }, [sourceDate]);

  const handleTimeScrub = (mins: number) => {
    if (!sourceDate) return;
    const dPart = sourceDate.split('T')[0];
    const h = Math.floor(mins / 60).toString().padStart(2, '0');
    const m = (mins % 60).toString().padStart(2, '0');
    setSourceDate(\`\${dPart}T\${h}:\${m}\`);
  };
`;

content = content.replace(
  'const allZones = useMemo(() => getAllTimezones(), []);',
  minutesLogic + '\n  const allZones = useMemo(() => getAllTimezones(), []);'
);

// Add the slider to the UI
const sliderUI = `
                <ToolInput
                  label="Select Date & Time"
                  type={"datetime-local" as any}
                  value={sourceDate}
                  onChange={setSourceDate}
                />
                
                <div className="pt-2">
                  <SliderField
                    id="time-scrubber"
                    label="Scrub Time (Hours)"
                    min={0}
                    max={1439}
                    step={15}
                    value={timeInMinutes}
                    onChange={handleTimeScrub}
                    format={(v) => {
                      const h = Math.floor(v / 60);
                      const m = v % 60;
                      const ampm = h >= 12 ? 'PM' : 'AM';
                      const h12 = h % 12 || 12;
                      return \`\${h12}:\${m.toString().padStart(2, '0')} \${ampm}\`;
                    }}
                  />
                </div>
`;

content = content.replace(
  '<ToolInput\n                  label="Select Date & Time"\n                  type={"datetime-local" as any}\n                  value={sourceDate}\n                  onChange={setSourceDate}\n                />',
  sliderUI
);

fs.writeFileSync(path, content);
console.log("Patched TimeZoneConverterClient");
