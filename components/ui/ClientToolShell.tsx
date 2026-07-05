'use client';

import Link from 'next/link';
import { ALL_TOOLS, CategoryEntry, getToolColor } from '@/src/tool-registry';
import { Check, ArrowUpRight, ChevronRight, FileText, PlaySquare, Image as ImageIcon, Wrench } from 'lucide-react';
import { ToolIcon } from '@/components/ui/Icons';
import { ErrorBoundary } from './ErrorBoundary';
import { FavoriteButton } from './FavoriteButton';
import { Breadcrumbs } from './Breadcrumbs';
import { ToolMoreMenu } from './ToolMoreMenu';
import { ToolInfoSection } from './ToolInfoSection';
import { cn } from '@/src/lib/utils';
import { useState, useEffect, useMemo } from 'react';
import { FocusModeWrapper } from './FocusModeWrapper';

import { useWorkflowIntegration } from '@/src/lib/workflow-hook';
import { m } from 'framer-motion';
import { parseAndSanitizeMarkdownSync } from '@/src/lib/security';
import { ToolFeedback } from './ToolFeedback';
import { useIntelligenceStore } from '@/src/store/useIntelligenceStore';

function stripHtmlAndTruncate(html: string | undefined, maxLength: number = 80): string {
  if (!html) return '';
  const text = html.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export interface ClientToolShellProps {
  title: string;
  description?: string | undefined;
  category?: CategoryEntry | undefined;
  children: React.ReactNode;
  toolId?: string | undefined;
  visibleExamples?: number;
  content: {
    detailedDescription?: string | undefined;
    howTo?: string[] | undefined;
    faq?: { question: string; answer: string }[] | undefined;
    useCases?: string[] | undefined;
    examples?: { label?: string; input: string; output: string; description?: string }[] | undefined;
    commonErrors?: { error: string; fix: string }[] | undefined;
    alternatives?: string[] | undefined;
    relatedTools?: string[] | undefined;
  };
  fullWidth?: boolean | undefined;
}

function UseCasesList({ useCases, visibleExamples = 2 }: { useCases: string[], visibleExamples?: number }) {
  const [expanded, setExpanded] = useState(false);
  const showMoreButton = useCases.length > visibleExamples;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {useCases.map((uc, i) => (
          <div 
            key={i} 
            className={cn(
              "items-start gap-3 p-4 bg-surface-2 border border-border rounded-2xl",
              !expanded && i >= visibleExamples ? "hidden" : "flex"
            )}
          >
            <Check className="w-5 h-5 text-success shrink-0" />
            <span className="text-text-2 text-sm">{uc}</span>
          </div>
        ))}
      </div>
      {showMoreButton && (
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-sm font-bold text-blue hover:underline py-2"
        >
          {expanded ? "Show Less ▴" : "Show More ▾"}
        </button>
      )}
    </div>
  );
}

function FAQList({ faq }: { faq: { question: string, answer: string }[] }) {
  const [expanded, setExpanded] = useState(false);
  const visibleCount = 3;
  const showMoreButton = faq.length > visibleCount;

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {faq.map((item, i) => (
          <div 
            key={i} 
            className={cn(
              "p-6 bg-surface-2 border border-border rounded-2xl space-y-3",
              !expanded && i >= visibleCount ? "hidden" : "block"
            )}
          >
            <h3 className="font-bold text-text">{item.question}</h3>
            <div 
              className="text-text-3 text-sm leading-relaxed prose prose-sm prose-slate dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: item.answer }}
            />
          </div>
        ))}
      </div>
      {showMoreButton && (
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-sm font-bold text-blue hover:underline py-2"
        >
          {expanded ? "View Less FAQs ▴" : "View All FAQs ▾"}
        </button>
      )}
    </div>
  );
}

export function ClientToolShell({ title, description, category, children, toolId, content, fullWidth, visibleExamples = 2 }: ClientToolShellProps) {
  const currentTool = ALL_TOOLS.find(t => t.id === toolId || t.name === title);
  const finalToolId = toolId || currentTool?.id || '';
  useWorkflowIntegration(finalToolId);

  const recordTransition = useIntelligenceStore(s => s.recordTransition);
  
  useEffect(() => {
    if (finalToolId) {
      recordTransition(finalToolId);
    }
  }, [finalToolId, recordTransition]);

  const searchParams = useSearchParams();

  const [isEmbed, setIsEmbed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setIsEmbed(params.get("embed") === "true");
    }
  }, []);

  const storageKey = `kv-accordion-state-${finalToolId}`;
  const [openSectionId, setOpenSectionId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        setOpenSectionId(stored);
      }
    } catch (e) {}
  }, [storageKey]);

  const handleSectionToggle = (id: string, isOpen: boolean) => {
    const newId = isOpen ? id : null;
    setOpenSectionId(newId);
    try {
      if (newId) {
        sessionStorage.setItem(storageKey, newId);
      } else {
        sessionStorage.removeItem(storageKey);
      }
    } catch (e) {}
  };

  const parsedContent = useMemo(() => ({
    detailedDescription: content.detailedDescription ? parseAndSanitizeMarkdownSync(content.detailedDescription) : '',
    howTo: (content.howTo || []).map(step => parseAndSanitizeMarkdownSync(step)),
    faq: (content.faq || []).map(item => ({
      question: item.question,
      answer: parseAndSanitizeMarkdownSync(item.answer)
    }))
  }), [content.detailedDescription, content.howTo, content.faq]);

  const relatedIds = content.relatedTools ?? currentTool?.related ?? [];
  const related = ALL_TOOLS.filter(t => relatedIds.includes(t.id));

  const getSuggestions = useIntelligenceStore(s => s.getSuggestions);
  const suggestionIds = useMemo(() => getSuggestions(finalToolId), [finalToolId, getSuggestions]);
  // Filter out the current tool and any explicitly related tools, so we only show ML discovered workflows.
  const suggestions = useMemo(() => 
    ALL_TOOLS.filter(t => suggestionIds.includes(t.id) && t.id !== finalToolId && !relatedIds.includes(t.id))
  , [suggestionIds, finalToolId, relatedIds]);

  return (
    <m.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        isEmbed ? "w-full max-w-none px-2 py-4" : fullWidth ? "w-full max-w-none px-4 md:px-8" : "max-w-6xl px-4",
        "mx-auto space-y-8 sm:space-y-10 lg:space-y-12",
        !isEmbed && "pb-24"
      )}
    >
      {!isEmbed && (
        <header className="space-y-3 md:space-y-4 relative z-above">
        <Breadcrumbs category={category} title={title} />
        
        <div className="flex flex-col gap-3 md:gap-4">
          <div className="flex flex-row items-start gap-3">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              {title}
            </h1>
            <div className="flex items-center gap-2 shrink-0 mt-0.5 md:mt-1">
              {currentTool && <FavoriteButton toolId={currentTool.id} />}
              <ToolMoreMenu toolId={finalToolId} toolName={title} />
            </div>
          </div>
          {description && (
            <p className="text-sm md:text-base text-text-4 font-medium leading-relaxed max-w-3xl">
              {description}
            </p>
          )}
        </div>
      </header>
      )}

      <section className="mb-12">
        <ErrorBoundary>
          <FocusModeWrapper toolId={finalToolId} toolName={title}>
            {children}
          </FocusModeWrapper>
        </ErrorBoundary>
      </section>

      {!isEmbed && (
        <>
          <div className="max-w-4xl mx-auto space-y-6">
            {parsedContent.detailedDescription && (
              <ToolInfoSection 
            toolId={finalToolId} 
            id="deep-dive" 
            title="Deep Dive"
            preview={stripHtmlAndTruncate(parsedContent.detailedDescription)}
            isOpen={openSectionId === 'deep-dive'}
            onToggle={(isOpen) => handleSectionToggle('deep-dive', isOpen)}
          >
            <div 
              className="prose prose-slate dark:prose-invert max-w-none text-text-3"
              dangerouslySetInnerHTML={{ __html: parsedContent.detailedDescription }}
            />
          </ToolInfoSection>
        )}

        {parsedContent.howTo && parsedContent.howTo.length > 0 && (
          <ToolInfoSection 
            toolId={finalToolId} 
            id="quick-guide" 
            title="Quick Guide"
            preview={stripHtmlAndTruncate(parsedContent.howTo.join(' → '))}
            isOpen={openSectionId === 'quick-guide'}
            onToggle={(isOpen) => handleSectionToggle('quick-guide', isOpen)}
          >
            <ol className="space-y-4">
              {parsedContent.howTo.map((step, i) => (
                <li key={i} className="flex gap-4 group">
                  <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-blue/10 text-blue flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <div 
                    className="text-text-2 text-sm leading-snug pt-0.5 prose prose-sm prose-slate dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: step }}
                  />
                </li>
              ))}
            </ol>
          </ToolInfoSection>
        )}

        {content.useCases && content.useCases.length > 0 && (
          <ToolInfoSection 
            toolId={finalToolId} 
            id="use-cases" 
            title="Use Cases"
            preview={stripHtmlAndTruncate(content.useCases.join(', '))}
            isOpen={openSectionId === 'use-cases'}
            onToggle={(isOpen) => handleSectionToggle('use-cases', isOpen)}
          >
            <UseCasesList useCases={content.useCases} visibleExamples={visibleExamples} />
          </ToolInfoSection>
        )}

        {parsedContent.faq && parsedContent.faq.length > 0 && (
          <ToolInfoSection 
            toolId={finalToolId} 
            id="faq" 
            title="Frequently Asked Questions"
            preview={stripHtmlAndTruncate(parsedContent.faq.map(f => f.question).join(' '))}
            isOpen={openSectionId === 'faq'}
            onToggle={(isOpen) => handleSectionToggle('faq', isOpen)}
          >
            <FAQList faq={parsedContent.faq} />
          </ToolInfoSection>
        )}

        <ToolInfoSection 
          toolId={finalToolId} 
          id="help-docs" 
          title="Help & Documentation"
          preview="Read the manual, watch tutorials, see examples, or troubleshoot issues."
          isOpen={openSectionId === 'help-docs'}
          onToggle={(isOpen) => handleSectionToggle('help-docs', isOpen)}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/help" className="flex items-center gap-3 p-4 bg-surface-2 border border-border rounded-xl hover:border-blue transition-colors group">
              <div className="w-8 h-8 rounded-lg bg-blue/10 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-blue group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-text">Documentation</h4>
                <p className="text-xs text-text-4">Read the full manual</p>
              </div>
            </Link>
            
            <Link href="/help" className="flex items-center gap-3 p-4 bg-surface-2 border border-border rounded-xl hover:border-brand-primary transition-colors group">
              <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0">
                <PlaySquare className="w-4 h-4 text-brand-primary group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-text">Tutorials</h4>
                <p className="text-xs text-text-4">Step-by-step guides</p>
              </div>
            </Link>

            <Link href="/help" className="flex items-center gap-3 p-4 bg-surface-2 border border-border rounded-xl hover:border-success transition-colors group">
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                <ImageIcon className="w-4 h-4 text-success group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-text">Examples</h4>
                <p className="text-xs text-text-4">See it in action</p>
              </div>
            </Link>

            <Link href="/help" className="flex items-center gap-3 p-4 bg-surface-2 border border-border rounded-xl hover:border-error transition-colors group">
              <div className="w-8 h-8 rounded-lg bg-error/10 flex items-center justify-center shrink-0">
                <Wrench className="w-4 h-4 text-error group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-text">Troubleshooting</h4>
                <p className="text-xs text-text-4">Fix common issues</p>
              </div>
            </Link>
          </div>
        </ToolInfoSection>
        
        <div className="pt-4">
          <ToolFeedback toolId={finalToolId} toolName={title} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="pt-12 border-t border-border space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Related Tools</h2>
            <Link href="/all-tools" className="text-xs font-bold uppercase tracking-widest text-blue hover:underline">
              Browse all <ChevronRight className="inline w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {related.map(tool => (
              <Link
                key={tool.id}
                href={`/${tool.href}`}
                className="flex items-center gap-4 p-4 bg-surface-2 border border-border shadow-sm rounded-2xl hover:border-brand-primary/50 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center shrink-0">
                  <ToolIcon toolId={tool.id} category={tool.category} className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm truncate group-hover:text-brand-primary transition-colors">{tool.name}</h3>
                  <p className="text-xs text-text-4 truncate">{tool.desc}</p>
                </div>
              </Link>
            ))}
            </div>
          </section>
        )}
        
        {suggestions.length > 0 && (
          <section className="pt-12 border-t border-border space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue/10 flex items-center justify-center">
                  ✨
                </span>
                Suggested Next Steps
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestions.map(tool => (
                <Link
                  key={tool.id}
                  href={`/${tool.href}`}
                  className="flex items-center gap-4 p-4 bg-surface-2 border border-border shadow-sm rounded-2xl hover:border-blue/50 hover:bg-blue/5 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue"
                >
                  <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center shrink-0">
                    <ToolIcon toolId={tool.id} category={tool.category} className="w-5 h-5 text-blue" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm truncate group-hover:text-blue transition-colors">{tool.name}</h3>
                    <p className="text-xs text-text-4 truncate">Based on your workflow</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
        </>
      )}
    </m.div>
  );
}
