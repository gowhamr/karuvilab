import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { ALL_TOOLS, CATEGORIES } from '@/src/tool-registry';
import { StructuredData } from '@/src/lib/seo';
import { ClientToolShell } from './ClientToolShell';
import { parseAndSanitizeMarkdown } from '@/src/lib/security';
/**
 * ToolShell is now a Server Component to prevent the entire 400KB+ TOOL_CONTENT
 * registry from being bundled into the client-side JavaScript.
 */
export async function ToolShell({ title, description, category, children, toolId, content, fullWidth, workspaceSize, visibleExamples }) {
    // Perform lookups on the server
    const currentTool = ALL_TOOLS.find(t => t.id === toolId || t.name === title);
    let reg = {};
    if (currentTool) {
        try {
            // Load tool SEO content dynamically on demand on the server
            const contentModule = await import(`@/src/content/tools/${currentTool.id}`);
            // Fallback matching for named export vs default export
            reg = contentModule[currentTool.id + "Content"] ||
                contentModule[Object.keys(contentModule)[0] || ""] ||
                contentModule.default ||
                {};
        }
        catch (err) {
            // Content modules are optional, silently ignore missing ones
        }
    }
    let relatedTools = content?.relatedTools ?? currentTool?.related ?? undefined;
    if ((!relatedTools || relatedTools.length === 0) && currentTool && category) {
        const sameCategoryTools = ALL_TOOLS.filter(t => t.category === category.id && t.id !== currentTool.id);
        relatedTools = sameCategoryTools.slice(0, 4).map(t => t.id);
    }
    // Merge registry content with props content on the server
    const mergedContent = {
        detailedDescription: content?.detailedDescription ?? reg.detailedDescription,
        howTo: content?.howTo ?? reg.howTo,
        faq: content?.faq ?? reg.faq,
        useCases: content?.useCases ?? reg.useCases,
        examples: content?.examples ?? reg.examples,
        commonErrors: content?.commonErrors ?? reg.commonErrors,
        alternatives: content?.alternatives ?? reg.alternatives,
        relatedTools: relatedTools ?? [],
    };
    const parsedContent = {
        detailedDescription: mergedContent.detailedDescription ? await parseAndSanitizeMarkdown(mergedContent.detailedDescription) : '',
        howTo: await Promise.all((mergedContent.howTo || []).map(async (step) => await parseAndSanitizeMarkdown(step))),
        faq: await Promise.all((mergedContent.faq || []).map(async (item) => ({
            question: item.question,
            answer: await parseAndSanitizeMarkdown(item.answer)
        })))
    };
    return (_jsxs(_Fragment, { children: [_jsx(StructuredData, { tool: currentTool, category: category, content: mergedContent }), _jsx(ClientToolShell, { title: currentTool?.name || title, description: currentTool?.desc || description, category: category || (currentTool?.category ? CATEGORIES.find(c => c.id === currentTool.category) : undefined), toolId: toolId, content: mergedContent, parsedContent: parsedContent, fullWidth: fullWidth, workspaceSize: workspaceSize, visibleExamples: visibleExamples ?? reg.visibleExamples ?? currentTool?.visibleExamples, children: children })] }));
}
