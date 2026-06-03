import { ToolSkeleton } from '@/components/ui/ToolSkeleton';
import dynamic from 'next/dynamic';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

const Client = dynamic(() => import("@/src/features/hash-map-visualizer"), { ssr: false, loading: () => <ToolSkeleton /> });
export const metadata = generateToolMetadata('hash-map-visualizer');
export default function page() {
  return <ToolShell title='Hash Map Visualizer' category={CATEGORIES.find(c => c.id === 'developer')!}><Client /></ToolShell>;
}
