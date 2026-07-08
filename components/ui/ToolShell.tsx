import { ALL_TOOLS, CategoryEntry } from '@/src/tool-registry';
import { StructuredData } from '@/src/lib/seo';
import { ClientToolShell, ClientToolShellProps } from './ClientToolShell';

interface ToolShellProps {
  title: string;
  description?: string;
  category?: CategoryEntry | undefined;
  children: React.ReactNode;
  toolId?: string;
  content?: ClientToolShellProps['content'];
  fullWidth?: boolean;
  visibleExamples?: number;
}

/**
 * ToolShell is now a Server Component to prevent the entire 400KB+ TOOL_CONTENT 
 * registry from being bundled into the client-side JavaScript.
 */
export async function ToolShell({ title, description, category, children, toolId, content, fullWidth, visibleExamples }: ToolShellProps) {
  // Perform lookups on the server
  const currentTool = ALL_TOOLS.find(t => t.id === toolId || t.name === title);
  
  let reg: Record<string, unknown> = {};
  if (currentTool) {
    try {
      // Load tool SEO content dynamically on demand on the server
      const contentModule = await import(`@/src/content/tools/${currentTool.id}`);
      // Fallback matching for named export vs default export
      reg = contentModule[currentTool.id + "Content"] || 
            contentModule[Object.keys(contentModule)[0] || ""] || 
            contentModule.default || 
            {};
    } catch (err) {
      // Content modules are optional, silently ignore missing ones
    }
  }

  // Merge registry content with props content on the server
  const mergedContent: ClientToolShellProps['content'] = {
    detailedDescription: content?.detailedDescription ?? reg.detailedDescription,
    howTo:               content?.howTo               ?? reg.howTo,
    faq:                 content?.faq                 ?? reg.faq,
    useCases:            content?.useCases            ?? reg.useCases,
    examples:            content?.examples            ?? reg.examples,
    commonErrors:        content?.commonErrors        ?? reg.commonErrors,
    alternatives:        content?.alternatives        ?? reg.alternatives,
    relatedTools:        content?.relatedTools        ?? currentTool?.related ?? undefined,
  };

  return (
    <>
      <StructuredData tool={currentTool} category={category} content={mergedContent} />
      <ClientToolShell 
        title={title}
        description={description}
        category={category}
        toolId={toolId}
        content={mergedContent}
        fullWidth={fullWidth}
        visibleExamples={visibleExamples ?? reg.visibleExamples ?? (currentTool as any)?.visibleExamples}
      >
        {children}
      </ClientToolShell>
    </>
  );
}
