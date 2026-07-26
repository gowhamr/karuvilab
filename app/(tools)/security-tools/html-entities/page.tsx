import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import HTMLEntitiesClientWrapper from './HTMLEntitiesClientWrapper';

const toolId = 'html-entities';
const cat = CATEGORIES.find(c => c.id === 'security');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="HTML Entities Converter"
      description="Encode special characters to HTML entities or decode HTML entities back to text."
      category={cat}
      toolId={toolId}
    >
      <HTMLEntitiesClientWrapper />

      <LearningHub title="Understanding HTML Entities & Encoding">
        
        <LearningSection type="architecture" title="Escaping Reserved Characters">
          <p>HTML is a markup language built heavily on a few reserved characters, most notably <code>&lt;</code> (less than), <code>&gt;</code> (greater than), and <code>&amp;</code> (ampersand). When a browser parser encounters a <code>&lt;</code>, it immediately assumes you are trying to open an HTML tag.</p>
        </LearningSection>
        
        <LearningSection type="api" title="Displaying Code Visually">
          <p>But what if you are writing a programming tutorial and actually want to show the user the string <code>&lt;div&gt;</code> on the screen? If you put that directly into your raw HTML file, the browser will interpret it as a real, invisible layout container instead of text.</p>
          <p className="mt-2">To fix this, you must "encode" the reserved characters. You replace <code>&lt;</code> with its HTML entity equivalent: <code>&amp;lt;</code>. The browser knows that <code>&amp;lt;</code> is meant to be displayed visually as a less-than sign, not executed as code.</p>
        </LearningSection>

        <LearningSection type="security" title="Preventing XSS (Cross-Site Scripting)">
          <p>Encoding is the absolute primary defense against Cross-Site Scripting (XSS) attacks. If your app allows users to post comments, a malicious user might submit their comment as <code>&lt;script&gt;alert('hacked')&lt;/script&gt;</code>.</p>
          <p className="mt-2">If you render that comment unencoded directly into the DOM, the browser will execute the attacker's script on the machine of every user who views the page. If you encode the comment into <code>&amp;lt;script&amp;gt;...</code>, the browser safely renders it as harmless, visible text.</p>
        </LearningSection>

        <LearningSection type="failures" title="Double Encoding">
          <p>A common UI bug in modern web frameworks is <strong>Double Encoding</strong>. Frameworks like React and Angular automatically HTML-encode all strings passed into JSX/templates by default.</p>
          <p className="mt-2">If your backend database <em>also</em> encodes strings before saving them, the frontend will encode the already-encoded string. For example, <code>&amp;</code> becomes <code>&amp;amp;</code> in the database, and React encodes it again to <code>&amp;amp;amp;</code>. The user then literally sees <code>&amp;amp;</code> printed on their screen instead of an ampersand.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why must user input be HTML encoded before being rendered into the DOM?",
                options: [
                  "To reduce the size of the HTML payload.",
                  "To prevent the browser from executing malicious script tags injected by a user (XSS).",
                  "To encrypt the data so other users cannot read it.",
                  "Because modern browsers do not support ASCII characters."
                ],
                correctIndex: 1,
                explanation: "HTML encoding converts executable characters (like < and >) into safe, visual representations, neutralizing injected scripts."
              },
              {
                question: "If a user inputs the string 'A & B', and it is double-encoded before display, what will the user actually see on their screen?",
                options: [
                  "A & B",
                  "A &amp; B",
                  "A &amp;amp; B",
                  "A + B"
                ],
                correctIndex: 1,
                explanation: "The first encode turns '&' into '&amp;'. The second encode turns the '&' of '&amp;' into '&amp;amp;'. When the browser renders '&amp;amp;', it displays '&amp;'."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
