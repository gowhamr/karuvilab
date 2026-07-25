import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';
import ImageSeoClientWrapper from './ImageSeoClientWrapper';

const toolId = 'image-seo';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="Image SEO & File Renamer"
      description="Generate SEO alt text and optimized filenames for images, PDF, and documents."
      category={cat}
      toolId={toolId}
    >
      <ImageSeoClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-seo"
          title="How it Works: The SEO Crawler"
          preview="Learn why filenames matter just as much as Alt Text for Google Images."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When a search engine crawler like Googlebot visits your website, it cannot "see" the beautiful photo you uploaded. It can only read the underlying HTML. 
            </p>
            <h3>Alt Text vs Filename</h3>
            <p>
              Most developers know to add an <code>alt="description"</code> tag to their images for accessibility and SEO. However, many developers upload images directly from their phone with terrible filenames like <code>IMG_9438_FINAL.jpg</code>.
            </p>
            <p>
              Search engines use the actual filename as a strong contextual ranking signal. An image named <code>red-sports-car-front-bumper.jpg</code> will organically rank significantly higher in Google Image Search than <code>DSC0099.jpg</code>, even if they have the exact same Alt Text.
            </p>
            <p>
              This tool enforces SEO best practices by automatically converting your descriptive text into a URL-friendly slug (lowercase, hyphen-separated, stripping special characters), ensuring maximum search visibility.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
