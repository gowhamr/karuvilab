import ColorConverterClientWrapper from "./ColorConverterClientWrapper";
import { generateToolMetadata } from "@/src/lib/seo";
import { ToolShell } from "@/components/ui/ToolShell";
import { ToolInfoSection } from "@/components/ui/ToolInfoSection";
import { CATEGORIES } from "@/src/tool-registry";
import { Metadata } from "next";

const toolId = "color-converter";

export const metadata: Metadata = generateToolMetadata(toolId);

export default function ColorConverterPage() {
  const cat = CATEGORIES.find(c => c.id === 'developer')!;
  
  return (
    <ToolShell
      toolId={toolId}
      title="Color Converter & Picker"
      description="Convert colors between HEX, RGB, HSL, HSV, and CMYK formats. Includes a color picker and live preview."
      category={cat}
    >
      <ColorConverterClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-colors"
          title="How it Works: Additive vs Subtractive Colors"
          preview="Learn the difference between screen colors (RGB) and print colors (CMYK)."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Computers display colors differently than physical printers. This tool bridges the gap by mathematically converting between the two primary color paradigms.
            </p>
            <h3>Additive (RGB, HEX, HSL)</h3>
            <p>
              Monitors are pitch black when turned off. To create colors, they <em>add</em> Light (Red, Green, and Blue). If you add 100% of all three, you get pure White light.
            </p>
            <ul>
              <li><strong>HEX</strong> is just RGB translated into Base-16 math. <code>#FF0000</code> means maximum Red (FF = 255), zero Green, zero Blue.</li>
              <li><strong>HSL</strong> (Hue, Saturation, Lightness) uses the exact same RGB color space, but wraps it around a 360-degree cylinder to make it easier for human brains to pick matching colors.</li>
            </ul>
            <h3>Subtractive (CMYK)</h3>
            <p>
              Printers start with White paper. To create colors, they deposit ink (Cyan, Magenta, Yellow, Key/Black) to <em>subtract</em> light bouncing off the page. If you mix 100% of all colors, you get Black. Converting RGB to CMYK is complex because the printable color gamut is actually physically smaller than what a glowing monitor can display.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
