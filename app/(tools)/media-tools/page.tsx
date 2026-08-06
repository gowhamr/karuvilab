import type { Metadata } from 'next';
import { ALL_TOOLS, CATEGORIES } from '@/src/tool-registry';
import { ToolCard } from '@/components/ToolCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { StructuredData } from '@/src/lib/seo';

export const metadata: Metadata = {
  title: 'Media Tools — Video, Audio, and GIF Utilities',
  description: 'Fast, private, browser-native tools for video, audio, and GIF editing. No server uploads.',
  keywords: ["media tools", "video editing", "audio editing", "gif creator"],
  alternates: {
    canonical: "/media-tools/",
  },
};

export default function MediaToolsCategory() {
  const cat = CATEGORIES.find(c => c.id === 'media')!;
  const tools = ALL_TOOLS.filter(t => t.category === 'media');
  const groups = tools.reduce((acc, tool) => {
    const sub = tool.subCategory || 'Other';
    if (!acc[sub]) acc[sub] = [];
    acc[sub].push(tool);
    return acc;
  }, {} as Record<string, typeof tools>);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-8 space-y-12">
      <StructuredData category={cat} />
      <div className="space-y-2">
        <Breadcrumbs category={cat} />
        <h1 className="text-4xl font-black">{cat.label}</h1>
        <p className="text-text-3 text-lg">{cat.description}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {tools.map(tool => <ToolCard key={tool.id} tool={tool} compact hideCategory />)}
      </div>
    </div>
  );
}
