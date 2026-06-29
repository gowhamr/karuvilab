import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import ImageCropClientWrapper from './ImageCropClientWrapper';

const toolId = 'image-crop';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Image Crop"
      description="Crop images to exact dimensions or preset aspect ratios."
      category={cat}
      toolId={toolId}
    >
      <ImageCropClientWrapper />
    </ToolShell>
  );
}
