import type { Metadata } from "next";
import { ALL_TOOLS, CATEGORIES, ToolEntry } from "@/src/tool-registry";
import { ToolCard } from "@/components/ToolCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ToolIcon } from "@/components/ui/Icons";

const THIN_TOOLS = [
  'command-cheat-sheet', 'hash-map-visualizer', 'color-palette-extractor', 
  'fake-data-generator', 'mic-camera-tester', 'phone-mockup-generator',
  'text-sorter-deduper', 'typing-speed-test', 'wifi-qr-code', 'color-converter',
  'audio-converter', 'gif-creator', 'video-metadata-viewer'
];

export const metadata: Metadata = {
  title: "All Tools — Professional Browser-Side Toolkit",
  description: "Browse 100+ free, private online tools — calculators, image processors, PDF editors, developer tools, and more. 100% local processing.",
  keywords: ["online tools", "free tools", "private tools", "calculators", "image editor", "pdf editor"],
  alternates: {
    canonical: "/all-tools/",
  },
};

export default function AllToolsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-16 px-4 md:px-8 pt-6 pb-12 md:pb-8">
      <div className="space-y-4">
        <Breadcrumbs title="All Tools" />
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">Universal Toolkit</h1>
        <p className="text-text-3 text-lg md:text-xl max-w-3xl leading-relaxed">
          Explore our complete collection of privacy-first tools. No uploads, no accounts, just pure browser-side power.
        </p>
      </div>

      <div className="space-y-16">
        {CATEGORIES.map((cat) => {
          const tools = (ALL_TOOLS as ToolEntry[]).filter(t => t.category === cat.id && !THIN_TOOLS.includes(t.id));
          if (tools.length === 0) return null;

          return (
            <section key={cat.id} className="space-y-8">
              <div className="flex items-center gap-4">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
                  style={{ backgroundColor: cat.color }}
                >
                  <ToolIcon category={cat.id} className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight">{cat.label}</h2>
                  <p className="text-text-4 text-xs font-bold uppercase tracking-widest">{tools.length} Tools Available</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                {tools.map(tool => (
                  <ToolCard key={tool.id} tool={tool} compact />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
