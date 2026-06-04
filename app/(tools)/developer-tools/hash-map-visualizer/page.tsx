import ClientWrapper from "./ClientWrapper";
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';


export const metadata = generateToolMetadata('hash-map-visualizer');
export default function page() {
  return <ToolShell title='Hash Map Visualizer' category={CATEGORIES.find(c => c.id === 'developer')!}><ClientWrapper /></ToolShell>;
}
