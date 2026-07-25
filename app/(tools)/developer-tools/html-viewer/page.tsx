import { Metadata } from "next";
import { generateToolMetadata } from "@/src/lib/seo";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { ToolInfoSection } from "@/components/ui/ToolInfoSection";
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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-iframe"
          title="How it Works: Safe Rendering with iframes"
          preview="Learn how we securely render user-provided code without XSS vulnerabilities."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Allowing users to write arbitrary HTML and JavaScript and executing it in the browser is the textbook definition of a <strong>Cross-Site Scripting (XSS)</strong> vulnerability. If we just injected your code into our DOM, it could steal cookies and hijack the application.
            </p>
            <h3>The Sandbox Attribute</h3>
            <p>
              To prevent this, the preview window uses an <code>&lt;iframe&gt;</code> with a strict <code>sandbox</code> attribute. By default, a sandboxed iframe blocks <em>everything</em>—it cannot run scripts, submit forms, or access the parent window's local storage.
            </p>
            <p>
              We selectively re-enable features using flags like <code>allow-scripts</code> (so your JavaScript runs) but we deliberately omit <code>allow-same-origin</code>. This forces the browser to treat the iframe as if it came from a completely different domain, ensuring the code you write has absolutely zero access to KaruviLab's internal state or cookies.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
