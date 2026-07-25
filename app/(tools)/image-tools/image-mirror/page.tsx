import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-mirror"
          title="How it Works: Duplicating Canvas Space"
          preview="Learn how mirroring differs from flipping."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              While "Flipping" an image just reverses it, "Mirroring" involves keeping the original image and attaching a reversed copy to it. This means the resulting image has to be exactly <strong>twice as large</strong> along the mirrored axis.
            </p>
            <h3>Double Canvas Rendering</h3>
            <p>
              If you upload a 1000px wide image and select "Mirror Right", the tool creates a new HTML5 Canvas that is exactly 2000px wide. 
            </p>
            <ul>
              <li>First, it uses <code>drawImage()</code> to paint the original image on the left side (from pixel 0 to 1000).</li>
              <li>Then, it applies a <code>scale(-1, 1)</code> transformation to flip the context horizontally.</li>
              <li>Finally, it uses <code>drawImage()</code> again to paint the image on the right side (from pixel 1000 to 2000), effectively drawing it backwards.</li>
            </ul>
            <p>
              This creates a perfectly symmetrical reflection with no loss of original pixel data.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
