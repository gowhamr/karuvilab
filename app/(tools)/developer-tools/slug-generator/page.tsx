import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import SlugClientWrapper from './SlugClientWrapper';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

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

      <LearningHub title="Understanding Semantic URLs and Slugs">
        
        <LearningSection type="architecture" title="Query Parameters vs Slugs">
          <p>A "slug" is the part of a URL that identifies a particular page in an easy-to-read form. The term originated in the newspaper industry, where a short name was given to an article while it was in production.</p>
          <p className="mt-2">In the early days of the web, URLs were driven entirely by database IDs: <code>example.com/article?id=8472</code>. While functional for servers, this tells the user (and Googlebot) absolutely nothing about what is on the page.</p>
          <p className="mt-2">Modern frameworks use routing to support semantic URLs: <code>example.com/blog/how-to-bake-bread</code>. This is vastly superior because the keywords in the URL actively contribute to the page's search ranking.</p>
        </LearningSection>
        
        <LearningSection type="api" title="Slug Formatting Rules">
          <p>To create a valid slug that won't break browsers or servers, the raw title string must be heavily normalized.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Lowercase:</strong> URLs are technically case-sensitive on some servers. Converting everything to lowercase prevents 404 errors.</li>
            <li><strong>Hyphens:</strong> Spaces are replaced with hyphens (<code>-</code>). Note: Google specifically treats hyphens as word separators. Underscores (<code>_</code>) are generally discouraged for SEO.</li>
            <li><strong>Sanitization:</strong> All special characters, emojis, and punctuation (like <code>?</code> or <code>&</code>) must be stripped out, as they have reserved meanings in HTTP requests.</li>
          </ul>
        </LearningSection>

        <LearningSection type="performance" title="Handling Accents (Diacritics)">
          <p>If a user types <code>"Café & Résumé"</code>, a naive regex replace might just strip the accented characters, resulting in <code>"caf-rsum"</code>. This ruins the SEO value.</p>
          <p className="mt-2">Proper slug generators use Unicode normalization (like <code>String.prototype.normalize("NFD")</code>) to decompose accented characters into their base character plus the accent mark. It can then safely strip the floating accent marks, resulting in the perfect slug: <code>"cafe-resume"</code>.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why are hyphens (-) preferred over underscores (_) when generating slugs for SEO?",
                options: [
                  "Underscores cause the browser to crash.",
                  "Google's search algorithm specifically treats hyphens as word separators, but treats words connected by underscores as a single continuous word.",
                  "Hyphens take up less bytes in the HTTP request.",
                  "Underscores are illegal in URLs."
                ],
                correctIndex: 1,
                explanation: "To a search engine, 'my_blog_post' is read as the literal string 'my_blog_post', whereas 'my-blog-post' is correctly tokenized into the keywords 'my', 'blog', and 'post'."
              },
              {
                question: "How do modern slug generators safely handle accented characters like 'é'?",
                options: [
                  "They delete them completely.",
                  "They URL-encode them into %C3%A9.",
                  "They use Unicode Normalization to split the character into a base 'e' and a floating accent, then strip the accent.",
                  "They throw an error and ask the user to type it in English."
                ],
                correctIndex: 2,
                explanation: "Unicode Normalization Form D (NFD) decomposes characters. This allows the generator to keep the readable base letters while safely stripping the complex diacritic marks."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
