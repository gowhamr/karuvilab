import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import ToolClientWrapper from './ToolClientWrapper';

const toolId = 'face-blur';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="AI Face Blur & Privacy Shield"
      description="Automatically detect and blur faces in photos using local YOLOv8 AI object detection"
      category={cat}
      toolId={toolId}
    >
      <ToolClientWrapper />
    </ToolShell>
  );
}
