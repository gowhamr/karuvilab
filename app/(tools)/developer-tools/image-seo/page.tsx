import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
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

      <LearningHub title="Understanding Image SEO Architecture">
        
        <LearningSection type="architecture" title="The Crawler Limitation">
          <p>When a search engine crawler like Googlebot visits your website, it cannot "see" the beautiful photo you uploaded. It can only read the underlying HTML markup.</p>
          <p className="mt-2">To understand what an image depicts, crawlers rely heavily on two specific text-based signals: the <strong>Alt Text</strong> and the <strong>Filename</strong>.</p>
        </LearningSection>
        
        <LearningSection type="performance" title="Filenames Matter">
          <p>Most developers know to add an <code>alt="description"</code> tag for accessibility. However, many lazily upload images directly from their phone with terrible, auto-generated filenames like <code>IMG_9438_FINAL.jpg</code>.</p>
          <p className="mt-2">Search engines use the actual filename as a strong contextual ranking signal. An image named <code>red-sports-car-front-bumper.jpg</code> will organically rank significantly higher in Google Image Search than <code>DSC0099.jpg</code>, even if both images have the exact same Alt Text.</p>
        </LearningSection>

        <LearningSection type="standards" title="URL-Friendly Slugs">
          <p>Filenames on the web must be URL-safe. Using spaces or special characters in filenames results in them being URL-encoded (e.g., a space becomes <code>%20</code>), which makes them harder for search engines to parse cleanly.</p>
          <p className="mt-2">This tool enforces SEO best practices by automatically converting your descriptive text into a URL-friendly "slug": converting everything to lowercase, replacing spaces with hyphens, and stripping out special characters.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why is uploading an image named 'DSC_0045.jpg' bad for SEO?",
                options: [
                  "The file size is usually too large.",
                  "Search engines use the filename as a contextual clue, and 'DSC_0045' provides zero descriptive information about the image content.",
                  "The .jpg format is not supported by modern browsers.",
                  "It causes the image to load slower."
                ],
                correctIndex: 1,
                explanation: "Google looks at the filename to understand the image. A descriptive filename like 'golden-retriever-puppy.jpg' gives strong context, whereas 'DSC_0045' gives none."
              },
              {
                question: "Why should you use hyphens instead of spaces in image filenames for the web?",
                options: [
                  "Because spaces are converted to '%20' in URLs, making them harder to read and parse.",
                  "Because HTML does not support spaces in attributes.",
                  "To reduce the overall file size of the image.",
                  "Because hyphens act as a cryptographic salt."
                ],
                correctIndex: 0,
                explanation: "Spaces in URLs must be encoded as '%20'. Hyphens are the web-standard word separator and are easily parsed by both humans and search engine crawlers."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
