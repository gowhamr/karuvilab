import { ToolSkeleton } from '@/components/ui/ToolSkeleton';
import dynamic from 'next/dynamic';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

const Client = dynamic(() => import("@/src/features/command-cheat-sheet"), { ssr: false, loading: () => <ToolSkeleton /> });
export const metadata = generateToolMetadata('command-cheat-sheet');
export default function page() {
  return <ToolShell title='Command Cheat Sheet' category={CATEGORIES.find(c => c.id === 'developer')!}><Client /></ToolShell>;
}
