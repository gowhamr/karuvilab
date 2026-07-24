import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import ImageMirrorClientWrapper from './ImageMirrorClientWrapper';

const toolId = 'image-mirror';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Image Mirror"
      description="Mirror images with a horizontal reflection"
      category={cat}
      toolId={toolId}

      content={{
        detailedDescription: "The Image Mirror tool generates perfect symmetric reflections of your images. Operating entirely in your browser, it duplicates and mirrors the content either horizontally or vertically to create seamless reflective effects securely.",
        useCases: ["Creating reflection effects","Generating symmetrical background patterns","Enhancing landscape photos","Designing creative avatars","Offline symmetric rendering"],
        howTo: ["Upload the image you want to mirror.","Select the mirror axis (Left-to-Right, Top-to-Bottom, etc.).","Adjust the reflection blending if applicable.","Preview the mirrored canvas.","Download the final combined image."],
        faq: [{"question":"How is mirroring different from flipping?","answer":"Flipping simply reverses the original image, whereas mirroring duplicates the image and attaches the reversed version to create a symmetric whole."},{"question":"Is the processing done locally?","answer":"Yes, 100% of the image processing happens on your device using Web Workers."},{"question":"Will the image dimensions change?","answer":"Yes, mirroring essentially doubles the size of your image along the chosen axis."},{"question":"Does it support transparent backgrounds?","answer":"Yes, if you upload a PNG or WebP with transparency, the mirrored output will preserve it."},{"question":"Can I mirror on both axes simultaneously?","answer":"You can apply horizontal mirror first, save it, and then apply vertical mirror to the result."}],
        relatedTools: ["image-flip","aspect-ratio-converter","image-padding"]
      }}
>
      <ImageMirrorClientWrapper />
    </ToolShell>
  );
}
