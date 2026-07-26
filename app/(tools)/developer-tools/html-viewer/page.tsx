import { Metadata } from "next";
import { generateToolMetadata } from "@/src/lib/seo";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
import HtmlViewerClientWrapper from "./HtmlViewerClientWrapper";

const toolId = "html-viewer";
const cat = CATEGORIES.find(c => c.id === "developer")!;

export const metadata: Metadata = generateToolMetadata(toolId);

export default function HtmlViewerPage() {
  return (
    <ToolShell
      title="HTML Online Viewer"
      description="Professional developer playground with multi-pane editor and secure real-time preview."
      category={cat}
      toolId={toolId}
    >
      <HtmlViewerClientWrapper />

      <LearningHub title="Understanding Secure HTML Rendering">
        
        <LearningSection type="architecture" title="The XSS Danger">
          <p>Allowing users to write arbitrary HTML and JavaScript and executing it in the browser is the textbook definition of a <strong>Cross-Site Scripting (XSS)</strong> vulnerability.</p>
          <p className="mt-2">If we simply injected your provided code directly into our application's DOM, any malicious JavaScript you wrote could access KaruviLab's local storage, steal cookies, or hijack the entire application.</p>
        </LearningSection>
        
        <LearningSection type="security" title="The Sandbox Attribute">
          <p>To prevent this, the preview window uses an <code>&lt;iframe&gt;</code> with a strict <code>sandbox</code> attribute. By default, a sandboxed iframe blocks <em>everything</em>—it cannot run scripts, submit forms, or access the parent window's data.</p>
          <p className="mt-2">We selectively re-enable features using flags like <code>allow-scripts</code> (so your JavaScript runs) but we deliberately omit <code>allow-same-origin</code>. This forces the browser to treat the iframe as if it came from a completely different domain (a unique origin), ensuring the code you write has absolutely zero access to our application state.</p>
        </LearningSection>

        <LearningSection type="api" title="Data URIs vs Blob URLs">
          <p>How do we pass your code into the iframe without sending it to a server? We generate a Blob URL.</p>
          <p className="mt-2">Using <code>URL.createObjectURL(new Blob([html], {"{"} type: 'text/html' {"}"}))</code> creates a temporary, local URL that points directly to the browser's memory. This is significantly faster and more memory-efficient than using a massive Base64 Data URI, especially for large blocks of code.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why must the preview window for an HTML editor use an iframe with the 'sandbox' attribute?",
                options: [
                  "To make the code render faster using WebGL.",
                  "To prevent Cross-Site Scripting (XSS) by isolating the user's code from the main application.",
                  "Because React cannot render raw HTML strings.",
                  "To enable dark mode in the preview."
                ],
                correctIndex: 1,
                explanation: "The sandbox attribute restricts what the iframe can do. Without it, user-provided JavaScript would execute in the same context as the parent app, leading to XSS."
              },
              {
                question: "When configuring a sandboxed iframe for a code playground, which flag should you generally AVOID adding to ensure maximum security?",
                options: [
                  "allow-scripts",
                  "allow-forms",
                  "allow-same-origin",
                  "allow-popups"
                ],
                correctIndex: 2,
                explanation: "Omitting 'allow-same-origin' forces the browser to treat the iframe as a unique origin. If you combine 'allow-scripts' AND 'allow-same-origin', the sandboxed script can easily reach into the parent window and remove the sandbox entirely."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
