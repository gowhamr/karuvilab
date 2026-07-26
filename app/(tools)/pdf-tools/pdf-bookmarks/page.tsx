import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import PdfBookmarksClientWrapper from '@/src/features/pdf-bookmarks/pdf-bookmarksClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

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

      <LearningHub title="Understanding the Document Outline">
        
        <LearningSection type="architecture" title="More Than Just Text">
          <p>In the PDF specification, what users commonly refer to as "Bookmarks" are formally known as the <strong>Document Outline</strong>.</p>
          <p className="mt-2">It is not a static list of text; it is a complex, hierarchical tree structure constructed from Outline Item Dictionaries linked together as a doubly-linked list (each item points to its parent, its next sibling, and its first child).</p>
        </LearningSection>
        
        <LearningSection type="api" title="Actions and Destinations">
          <p>An Outline Item doesn't just store a title string (like "Chapter 1"). Crucially, it stores an <strong>Action</strong> dictionary.</p>
          <p className="mt-2">The most common type of action is a <code>/GoTo</code> action. This action contains a Destination array, which tells the PDF viewer exactly which internal Page Object to jump to when clicked. It can even specify exact <code>(X, Y)</code> coordinate points and a specific zoom magnification level.</p>
        </LearningSection>

        <LearningSection type="algorithm" title="Real-Time Pointer Updates">
          <p>When you edit or rearrange bookmarks using this tool's UI, we aren't just changing a text file.</p>
          <p className="mt-2">Behind the scenes, we are traversing this doubly-linked list of dictionaries and surgically updating their internal pointers (First, Last, Next, Prev) and Action arrays in real-time before re-saving the file structure.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What is the official PDF specification term for a 'Bookmark'?",
                options: [
                  "Navigation Node",
                  "Outline Item",
                  "Chapter Tag",
                  "Index Pointer"
                ],
                correctIndex: 1,
                explanation: "The Table of Contents in a PDF is officially called the Document Outline, made up of Outline Items."
              },
              {
                question: "What does an Outline Item's /GoTo action contain?",
                options: [
                  "A URL to a website.",
                  "A JavaScript function to execute.",
                  "A Destination array pointing to a specific page and zoom coordinate.",
                  "A password to unlock the section."
                ],
                correctIndex: 2,
                explanation: "/GoTo actions tell the PDF viewer exactly what page, X/Y coordinate, and zoom level to display when the user clicks the bookmark."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
