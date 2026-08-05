import { ALL_TOOLS, CATEGORIES, CategoryEntry } from '@/src/tool-registry';
import { StructuredData } from '@/src/lib/seo';
import { ClientToolShell, ClientToolShellProps } from './ClientToolShell';
import { marked } from 'marked';

interface ToolShellProps {
  title: string;
  description?: string;
  category?: CategoryEntry | undefined;
  children: React.ReactNode;
  toolId?: string;
  content?: ClientToolShellProps['content'];
  fullWidth?: boolean;
  workspaceSize?: 'standard' | 'wide' | 'full';
  visibleExamples?: number;
}

/**
 * ToolShell is now a Server Component to prevent the entire 400KB+ TOOL_CONTENT 
 * registry from being bundled into the client-side JavaScript.
 */
export async function ToolShell({ title, description, category, children, toolId, content, fullWidth, workspaceSize, visibleExamples }: ToolShellProps) {
  // Perform lookups on the server
  const currentTool = ALL_TOOLS.find(t => t.id === toolId || t.name === title);
  
  let reg: any = {};
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

  let relatedTools = content?.relatedTools ?? currentTool?.related ?? undefined;
  
  if ((!relatedTools || relatedTools.length === 0) && currentTool && category) {
    const sameCategoryTools = ALL_TOOLS.filter(t => t.category === category.id && t.id !== currentTool.id);
    relatedTools = sameCategoryTools.slice(0, 4).map(t => t.id);
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
    relatedTools:        relatedTools,
  };

  const parsedContent: ClientToolShellProps['parsedContent'] = {
    detailedDescription: mergedContent.detailedDescription ? await marked.parse(mergedContent.detailedDescription) : '',
    howTo: await Promise.all((mergedContent.howTo || []).map(async step => await marked.parse(step))),
    faq: await Promise.all((mergedContent.faq || []).map(async item => ({
      question: item.question,
      answer: await marked.parse(item.answer)
    })))
  };

  return (
    <>
      <StructuredData tool={currentTool} category={category} content={mergedContent} />
      <ClientToolShell 
        title={currentTool?.name || title}
        description={currentTool?.desc || description}
        category={category || (currentTool?.category ? CATEGORIES.find(c => c.id === currentTool.category) : undefined)}
        toolId={toolId}
        content={mergedContent}
        parsedContent={parsedContent}
        fullWidth={fullWidth}
        workspaceSize={workspaceSize}
        visibleExamples={visibleExamples ?? reg.visibleExamples ?? (currentTool as any)?.visibleExamples}
      >
        {children}
      </ClientToolShell>
    </>
  );
}
