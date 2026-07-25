'use client';

import Link from 'next/link';
import { ALL_TOOLS, CategoryEntry } from '@/src/tool-registry';
import { Check, ArrowUpRight, ChevronRight, FileText, Share2 } from 'lucide-react';
import { ToolIcon } from '@/components/ui/Icons';
import { ErrorBoundary } from './ErrorBoundary';
import { FavoriteButton } from './FavoriteButton';
import { Breadcrumbs } from './Breadcrumbs';
import { ToolMoreMenu } from './ToolMoreMenu';
import { ToolInfoSection } from './ToolInfoSection';
import { ProgressOverlay, ProgressToast } from '@/components/ui/Progress';
import { cn } from '@/src/lib/utils';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { FocusModeWrapper } from './FocusModeWrapper';
import { ProgressProvider } from '@/src/contexts/ProgressContext';

import { useWorkflowIntegration } from '@/src/lib/workflow-hook';
import { m } from 'framer-motion';

import { useIntelligenceStore } from '@/src/store/useIntelligenceStore';

import { ToolCard } from '@/components/ToolCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'sonner';
import DOMPurify from 'isomorphic-dompurify';

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
  parsedContent?: {
    detailedDescription: string;
    howTo: string[];
    faq: { question: string; answer: string }[];
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
              "items-start gap-3 p-4 bg-surface-elevated border border-border rounded-2xl",
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
          className="text-sm font-bold text-blue hover:underline py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue rounded-sm"
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
              "p-6 bg-surface-elevated border border-border rounded-2xl space-y-3",
              !expanded && i >= visibleCount ? "hidden" : "block"
            )}
          >
            <h4 className="font-bold text-text">{item.question}</h4>
            <div 
              className="text-text-3 text-sm leading-relaxed prose prose-sm prose-slate dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.answer) }}
            />
          </div>
        ))}
      </div>
      {showMoreButton && (
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-sm font-bold text-blue hover:underline py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue rounded-sm"
        >
          {expanded ? "View Less FAQs ▴" : "View All FAQs ▾"}
        </button>
      )}
    </div>
  );
}

export function ClientToolShell({ title, description, category, children, toolId, content, parsedContent, fullWidth, visibleExamples = 2 }: ClientToolShellProps) {
  const currentTool = ALL_TOOLS.find(t => t.id === toolId || t.name === title);
  const finalToolId = toolId || currentTool?.id || '';
  useWorkflowIntegration(finalToolId);

  const recordTransition = useIntelligenceStore(s => s.recordTransition);
  
  useEffect(() => {
    if (finalToolId) {
      recordTransition(finalToolId);
    }
  }, [finalToolId, recordTransition]);



  const [isEmbed, setIsEmbed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      Promise.resolve().then(() => {
        setIsEmbed(params.get("embed") === "true");
      });
    }
  }, []);

  const storageKey = `kv-accordion-state-${finalToolId}`;
  const [openSectionId, setOpenSectionId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        Promise.resolve().then(() => {
          setOpenSectionId(stored);
        });
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

  const fallbackParsedContent = useMemo(() => ({
    detailedDescription: '',
    howTo: [],
    faq: []
  }), []);

  const finalParsedContent = parsedContent || fallbackParsedContent;

  const [activeTab, setActiveTab] = useState<'tool' | 'related'>('tool');

  const related = useMemo(() => {
    if (!category?.id) return [];
    return ALL_TOOLS.filter(t => t.category === category.id && t.id !== finalToolId);
  }, [category, finalToolId]);

  const relatedIds = useMemo(() => {
    return related.map(t => t.id);
  }, [related]);

  const handleShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `KV - ${title}`,
          url: window.location.href,
        });
      } else {
        throw new Error("Share API not available");
      }
    } catch {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  }, [title]);

  const getSuggestions = useIntelligenceStore(s => s.getSuggestions);
  const suggestionIds = useMemo(() => getSuggestions(finalToolId), [finalToolId, getSuggestions]);
  // Filter out the current tool and any explicitly related tools, so we only show ML discovered workflows.
  const suggestions = useMemo(() => 
    ALL_TOOLS.filter(t => suggestionIds.includes(t.id) && t.id !== finalToolId && !relatedIds.includes(t.id))
  , [suggestionIds, finalToolId, relatedIds]);

  return (
    <m.div 
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        isEmbed ? "w-full max-w-none px-2 py-4" : fullWidth ? "w-full max-w-none px-4 md:px-8" : "max-w-6xl px-4",
        "mx-auto space-y-8 sm:space-y-10 lg:space-y-12",
        !isEmbed && "pb-24"
      )}
    >
      {!isEmbed && (
        <header className="space-y-4 relative z-above">
          <Breadcrumbs category={category} title={title} />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-divider pb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shrink-0">
                <ToolIcon toolId={finalToolId} category={category?.id} className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-none text-text-primary">
                    {title}
                  </h1>
                  {category && (
                    <Badge variant="primary" size="sm" className="bg-primary/10 text-primary border border-primary/20">
                      {category.label}
                    </Badge>
                  )}
                  {currentTool?.difficulty && (
                    <Badge 
                      variant={
                        currentTool.difficulty === 'beginner' ? 'success' :
                        currentTool.difficulty === 'intermediate' ? 'warning' : 'danger'
                      } 
                      size="sm"
                    >
                      {currentTool.difficulty}
                    </Badge>
                  )}
                </div>
                {description && (
                  <p className="text-sm text-text-muted max-w-2xl leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleShare}
                className="h-10 px-3 flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-primary font-bold"
                aria-label="Share this tool"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </Button>
              {currentTool && <FavoriteButton toolId={currentTool.id} />}
              <ToolMoreMenu toolId={finalToolId} toolName={title} />
            </div>
          </div>
        </header>
      )}

      {!isEmbed && related.length > 0 && (
        <div className="flex border-b border-divider gap-6" role="tablist" aria-label="Tool views">
          <button
            onClick={() => setActiveTab('tool')}
            className={cn(
              "pb-3 font-bold text-sm border-b-2 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xs relative px-1 cursor-pointer",
              activeTab === 'tool'
                ? "border-primary text-text-primary font-black"
                : "border-transparent text-text-secondary hover:text-text-primary"
            )}
            role="tab"
            aria-selected={activeTab === 'tool'}
            aria-controls="tabpanel-tool"
            id="tab-tool"
          >
            Tool
          </button>
          <button
            onClick={() => setActiveTab('related')}
            className={cn(
              "pb-3 font-bold text-sm border-b-2 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xs relative px-1 cursor-pointer",
              activeTab === 'related'
                ? "border-primary text-text-primary font-black"
                : "border-transparent text-text-secondary hover:text-text-primary"
            )}
            role="tab"
            aria-selected={activeTab === 'related'}
            aria-controls="tabpanel-related"
            id="tab-related"
          >
            Related Tools ({related.length})
          </button>
        </div>
      )}

      <div className="space-y-10">
        {activeTab === 'tool' ? (
          <div role="tabpanel" id="tabpanel-tool" aria-labelledby="tab-tool">
            <section className="mb-12" aria-live="polite" aria-atomic="false">
              <ErrorBoundary>
                <FocusModeWrapper toolId={finalToolId} toolName={title}>
                  <ProgressProvider>
                    <ProgressOverlay />
                    <ProgressToast />
                    {children}
                  </ProgressProvider>
                </FocusModeWrapper>
              </ErrorBoundary>
            </section>

            {!isEmbed && (
              <>
                {((finalParsedContent?.howTo && finalParsedContent.howTo.length > 0) || 
                  (content?.useCases && content.useCases.length > 0) || 
                  (finalParsedContent?.faq && finalParsedContent.faq.length > 0) || 
                  !!finalParsedContent?.detailedDescription) && (
                <div className="max-w-4xl mx-auto space-y-8">
                  <ToolInfoSection 
                    toolId={finalToolId} 
                    id="learn-more" 
                    title="📚 Learn More"
                    preview="Quick guide, tips, FAQ, deep dive, and documentation."
                    isOpen={openSectionId === 'learn-more'}
                    onToggle={(isOpen) => handleSectionToggle('learn-more', isOpen)}
                  >
                    <div className="space-y-10">
                      {finalParsedContent.howTo && finalParsedContent.howTo.length > 0 && (
                        <div className="space-y-4">
                          <h2 className="text-xl font-black text-text tracking-tight">How to use</h2>
                          <div className="space-y-3">
                            {finalParsedContent.howTo.map((step, i) => (
                              <li key={i} className="flex gap-4 group">
                                <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-blue/10 text-blue flex items-center justify-center text-xs font-bold">
                                  {i + 1}
                                </span>
                                <div 
                                  className="text-text-2 text-sm leading-snug pt-0.5 prose prose-sm prose-slate dark:prose-invert max-w-none"
                                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(step) }}
                                />
                              </li>
                            ))}
                          </div>
                        </div>
                      )}

                      {content?.useCases && content.useCases.length > 0 && (
                        <section>
                          <h2 className="text-lg font-bold text-text mb-4">Tips & Use Cases</h2>
                          <UseCasesList useCases={content.useCases} visibleExamples={visibleExamples} />
                        </section>
                      )}

                      {finalParsedContent.faq && finalParsedContent.faq.length > 0 && (
                        <div className="space-y-4">
                          <h2 className="text-xl font-black text-text tracking-tight">Frequently Asked Questions</h2>
                          <FAQList faq={finalParsedContent.faq} />
                        </div>
                      )}

                      {finalParsedContent.detailedDescription && (
                        <div className="space-y-4">
                          <h2 className="text-xl font-black text-text tracking-tight">About this tool</h2>
                          <div 
                            className="prose prose-sm prose-slate dark:prose-invert max-w-none text-text-3 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(finalParsedContent.detailedDescription) }}
                          />
                        </div>
                      )}

                      <section>
                        <h2 className="text-lg font-bold text-text mb-4">Documentation & Help</h2>
                        <div className="grid grid-cols-1 gap-4">
                          <Link href="/help" className="flex items-center gap-3 p-4 bg-surface-elevated border border-border rounded-xl hover:border-blue transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue">
                            <div className="w-8 h-8 rounded-lg bg-blue/10 flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4 text-blue group-hover:scale-110 transition-transform" />
                            </div>
                            <div>
                              <h3 className="font-bold text-sm text-text">Documentation & Help</h3>
                              <p className="text-xs text-text-4">Read the full manual and troubleshooting guides</p>
                            </div>
                          </Link>
                        </div>
                      </section>
                    </div>
                  </ToolInfoSection>
                </div>
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
                          href={tool.href}
                          className="flex items-center gap-4 p-4 bg-surface-elevated border border-border shadow-sm rounded-2xl hover:border-blue/50 hover:bg-blue/5 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue"
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
          </div>
        ) : (
          related.length > 0 && (
            <section className="space-y-6 pt-2" aria-live="polite" role="tabpanel" id="tabpanel-related" aria-labelledby="tab-related">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-text-primary">Related Tools in {category?.label}</h2>
                <Link href="/all-tools" className="text-xs font-bold uppercase tracking-widest text-blue hover:underline">
                  Browse all <ChevronRight className="inline w-3 h-3" />
                </Link>
              </div>
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 -mx-4 px-4 snap-x">
                {related.map(tool => (
                  <div key={tool.id} className="w-[280px] shrink-0 snap-start h-full">
                    <ToolCard tool={tool} compact />
                  </div>
                ))}
              </div>
            </section>
          )
        )}
      </div>
    </m.div>
  );
}
