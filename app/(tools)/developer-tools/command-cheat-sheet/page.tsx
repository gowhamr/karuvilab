import ClientWrapper from "./ClientWrapper";
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';


export const metadata = generateToolMetadata('command-cheat-sheet');
export default function page() {
  return <ToolShell title='Command Cheat Sheet' category={CATEGORIES.find(c => c.id === 'developer')!}><ClientWrapper /></ToolShell>;
}
