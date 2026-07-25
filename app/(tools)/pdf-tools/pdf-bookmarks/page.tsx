import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import PdfBookmarksClientWrapper from '@/src/features/pdf-bookmarks/pdf-bookmarksClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';

const toolId = "pdf-bookmarks";
const cat = CATEGORIES.find(c => c.id === 'pdf');

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(toolId);
}

export default function Page() {
  return (
    <ToolShell 
      toolId={toolId} 
      title="PDF Bookmarks"
      description="View, edit, or remove the table of contents (bookmarks) in your PDF."
      category={cat}
    >
      <PdfBookmarksClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-outline"
          title="How it Works: The Document Outline"
          preview="Learn how a PDF creates a hierarchical table of contents."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              In the PDF specification, what we call "Bookmarks" are formally known as the <strong>Document Outline</strong>. It is a tree structure made of Outline Item Dictionaries.
            </p>
            <h3>GoTo Actions</h3>
            <p>
              An Outline Item doesn't just store a title (like "Chapter 1"). It stores an <strong>Action</strong>. The most common action is a <code>/GoTo</code> action, which contains a Destination array. This array tells the PDF viewer exactly which Page Object to jump to, and even the exact <code>(X, Y)</code> coordinates and zoom level to display on the screen when the bookmark is clicked.
            </p>
            <p>
              When you edit bookmarks with this tool, we are modifying this linked list of Outline dictionaries and updating their Action pointers in real-time.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
