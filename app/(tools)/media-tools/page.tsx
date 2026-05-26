import { Metadata } from 'next';
import { CATEGORIES, ALL_TOOLS } from '@/src/tool-registry';
import { ToolCard } from '@/components/ToolCard';
import { KVLogo } from '@/components/ui/KVLogo';

export const metadata: Metadata = {
  title: 'Media Tools — KaruviLab',
  description: 'Fast, private, browser-native tools for video, audio, and GIF editing. No server uploads.',
};

export default function MediaToolsCategory() {
  const category = CATEGORIES.find(c => c.id === 'media')!;
  const tools = ALL_TOOLS.filter(t => t.category === 'media');

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <header className="space-y-6 text-center pt-10">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-indigo-500/10 rounded-[32px] text-indigo-500 neon-glow flex items-center justify-center text-4xl">
             {category.emoji}
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-text sm:text-5xl uppercase italic italic-gradient">
            {category.label}
          </h1>
          <p className="text-lg text-text-4 font-bold uppercase tracking-widest max-w-2xl mx-auto">
            {category.description}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
