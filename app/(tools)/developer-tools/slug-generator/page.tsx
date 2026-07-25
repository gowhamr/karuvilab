import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';
import SlugClientWrapper from './SlugClientWrapper';

const toolId = 'slug-generator';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="URL Slug Generator"
      description="Convert title strings into clean, SEO-friendly URL slugs."
      category={cat}
      toolId={toolId}
    >
      <SlugClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-slugs"
          title="How it Works: Semantic URLs"
          preview="Learn why clean URLs are critical for both SEO and human readability."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              A "slug" is the part of a URL that identifies a particular page on a website in an easy-to-read form. The term originated in the newspaper industry, where a short name was given to an article while it was in production.
            </p>
            <h3>Query Parameters vs Slugs</h3>
            <p>
              In the early days of the web, URLs were often driven by database IDs: <code>example.com/article.php?id=8472</code>. While functional, this tells the user (and Google) nothing about what is on the page.
            </p>
            <p>
              Modern web frameworks use routing to support semantic URLs: <code>example.com/blog/how-to-bake-bread</code>. This is vastly superior because the keywords in the URL actively contribute to the page's search ranking, and users can instantly understand the context of the link before clicking it.
            </p>
            <h3>Formatting Rules</h3>
            <p>
              To create a valid slug, the text must be normalized. This typically involves:
            </p>
            <ul>
              <li>Converting all characters to lowercase.</li>
              <li>Replacing spaces with hyphens (Google treats hyphens as word separators; underscores are generally discouraged).</li>
              <li>Removing all special characters, emojis, and punctuation.</li>
              <li>Replacing accented characters (like <code>é</code>) with their non-accented equivalents (<code>e</code>).</li>
            </ul>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
