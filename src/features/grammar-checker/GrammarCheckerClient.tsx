"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useEditor, EditorContent, Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { workerManager } from '@/src/workers/manager';
import { blobManager } from '@/src/lib/blob-manager';
import { useGrammarStore, ToneSetting } from './store';
import { useToast } from '@/components/ui/Toast';
import { 
  Copy, Download, Sparkles, Trash2, CheckCircle2, 
  AlertCircle, BookOpen, RefreshCw, X, Check, 
  SlidersHorizontal, ArrowRight, ShieldCheck, Zap
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { logger } from '@/src/lib/logger';

const GrammarPluginKey = new PluginKey('grammarChecker');

const GrammarDecorations = Extension.create({
  name: 'grammarDecorations',
  
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: GrammarPluginKey,
        state: {
          init() {
            return DecorationSet.empty;
          },
          apply(tr, oldState) {
            const meta = tr.getMeta(GrammarPluginKey);
            if (meta && meta.decorations) {
              return meta.decorations;
            }
            return oldState.map(tr.mapping, tr.doc);
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
      }),
    ];
  },
});

const SAMPLE_TEXT = `In order to understand the results, a very big experiment was conducted by our team. She are going to the store to buy an book yesterday, but the the traffic was literally terrible. It is important to note that good research has the ability to help many people on a daily basis.`;

function textOffsetToPos(doc: any, offset: number): number {
  let currentOffset = 0;
  let targetPos = 1;
  let found = false;

  doc.descendants((node: any, pos: number) => {
    if (found) return false;
    if (node.isText) {
      const nodeLength = node.text?.length || 0;
      if (currentOffset + nodeLength >= offset) {
        targetPos = pos + (offset - currentOffset);
        found = true;
        return false;
      }
      currentOffset += nodeLength;
    } else if (node.isBlock && currentOffset > 0) {
      currentOffset += 1;
    }
    return true;
  });

  return Math.min(Math.max(1, targetPos), doc.content.size);
}

export default function GrammarCheckerClient() {
  const { toast } = useToast();
  const [text, setText] = useState('');
  const [errors, setErrors] = useState<any[]>([]);
  const [selectedErrorId, setSelectedErrorId] = useState<string | null>(null);
  const [stats, setStats] = useState({ 
    words: 0, 
    characters: 0, 
    sentences: 0, 
    paragraphs: 0, 
    readabilityScore: 0, 
    readabilityGrade: 'Easy (Grade 5-6)', 
    readingTimeMs: 0, 
    avgSentenceLength: 0, 
    uniqueWords: 0 
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'spelling' | 'grammar' | 'style' | 'readability'>('all');
  const [showDictionary, setShowDictionary] = useState(false);
  
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const abortController = useRef<AbortController | null>(null);
  
  const ignoredWords = useGrammarStore(s => s.ignoredWords);
  const addIgnoredWord = useGrammarStore(s => s.addIgnoredWord);
  const removeIgnoredWord = useGrammarStore(s => s.removeIgnoredWord);
  const tone = useGrammarStore(s => s.tone);
  const setTone = useGrammarStore(s => s.setTone);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Type or paste your text here to check grammar, spelling, style, and readability...',
      }),
      GrammarDecorations
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setText(editor.getText());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-slate dark:prose-invert max-w-none focus:outline-none min-h-[380px] md:min-h-[480px] p-4 sm:p-6 text-text text-sm sm:text-base leading-relaxed',
      },
    }
  });

  const checkText = useCallback(async (currentText: string) => {
    if (!currentText.trim()) {
      setErrors([]);
      setStats({ 
        words: 0, 
        characters: 0, 
        sentences: 0, 
        paragraphs: 0, 
        readabilityScore: 0, 
        readabilityGrade: 'Easy (Grade 5-6)', 
        readingTimeMs: 0, 
        avgSentenceLength: 0, 
        uniqueWords: 0 
      });
      if (editor) {
        editor.view.dispatch(editor.view.state.tr.setMeta(GrammarPluginKey, { decorations: DecorationSet.empty }));
      }
      return;
    }

    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();

    if (currentText.length > 500000) {
      toast("Text exceeds 500KB limit for grammar checking", "error");
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);
    try {
      const res = await workerManager.checkGrammar(currentText, ignoredWords, tone, undefined, abortController.current.signal);
      setErrors(res.errors || []);
      setStats(res.stats || {});
      
      if (editor) {
        const decos: Decoration[] = [];
        (res.errors || []).forEach((err: any) => {
          let className = 'border-b-2 border-dotted cursor-pointer transition-colors ';
          if (err.type === 'spelling') className += 'border-red-500 bg-red-500/10 text-red-400';
          else if (err.type === 'grammar') className += 'border-blue-500 bg-blue-500/10 text-blue-400';
          else if (err.type === 'readability') className += 'border-amber-500 bg-amber-500/10 text-amber-400';
          else className += 'border-purple-500 bg-purple-500/10 text-purple-400';

          try {
            const startPos = textOffsetToPos(editor.state.doc, err.offset);
            const endPos = textOffsetToPos(editor.state.doc, err.offset + err.length);
            const docSize = editor.state.doc.content.size;
            if (startPos > 0 && endPos <= docSize && startPos < endPos) {
              decos.push(Decoration.inline(startPos, endPos, { 
                class: className, 
                title: err.message,
                'data-error-id': err.id 
              }));
            }
          } catch (e) {
            // Ignore position calculation race conditions
          }
        });
        
        const decorationSet = DecorationSet.create(editor.state.doc, decos);
        editor.view.dispatch(editor.view.state.tr.setMeta(GrammarPluginKey, { decorations: decorationSet }));
      }
    } catch (e: any) {
      if (e.message !== 'Task cancelled') {
        logger.error("Grammar check failed", e);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [editor, ignoredWords, toast, tone]);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      checkText(text);
    }, 600);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [text, checkText, ignoredWords, tone]);

  const applyFix = useCallback((err: any, replacement: string) => {
    if (!editor) return;
    try {
      const fromPos = textOffsetToPos(editor.state.doc, err.offset);
      const toPos = textOffsetToPos(editor.state.doc, err.offset + err.length);
      editor.chain().focus()
        .deleteRange({ from: fromPos, to: toPos })
        .insertContent(replacement)
        .run();
      
      const newText = editor.getText();
      setText(newText);
      toast(`Applied fix: "${replacement}"`, 'success');
    } catch (e) {
      toast("Could not apply fix automatically", "error");
    }
  }, [editor, toast]);

  const applyAllFixes = useCallback(() => {
    if (!editor || errors.length === 0) return;
    
    const fixableErrors = [...errors]
      .filter(err => err.replacements && err.replacements.length > 0)
      .sort((a, b) => b.offset - a.offset); // Apply from end to start

    if (fixableErrors.length === 0) {
      toast("No automatic replacements available", "info");
      return;
    }

    try {
      let chain = editor.chain().focus();
      fixableErrors.forEach(err => {
        const fromPos = textOffsetToPos(editor.state.doc, err.offset);
        const toPos = textOffsetToPos(editor.state.doc, err.offset + err.length);
        chain = chain
          .deleteRange({ from: fromPos, to: toPos })
          .insertContent(err.replacements[0]);
      });
      chain.run();
      const newText = editor.getText();
      setText(newText);
      toast(`Auto-fixed ${fixableErrors.length} issues!`, 'success');
    } catch (e) {
      toast("Failed to apply all fixes", "error");
    }
  }, [editor, errors, toast]);

  const handleCopy = useCallback(() => {
    if (editor) {
      const content = editor.getText();
      if (!content.trim()) {
        toast("No text to copy", "info");
        return;
      }
      navigator.clipboard.writeText(content);
      toast('Copied text to clipboard!', 'success');
    }
  }, [editor, toast]);

  const handleDownload = useCallback(() => {
    if (editor) {
      const content = editor.getText();
      if (!content.trim()) {
        toast("No text to download", "info");
        return;
      }
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      blobManager.download(blob, 'grammar-checked.txt');
      toast("Document downloaded!", "success");
    }
  }, [editor, toast]);

  const handleLoadSample = useCallback(() => {
    if (editor) {
      editor.commands.setContent(SAMPLE_TEXT);
      setText(SAMPLE_TEXT);
      toast("Sample text loaded!", "success");
    }
  }, [editor, toast]);

  const handleClear = useCallback(() => {
    if (editor) {
      editor.commands.setContent('');
      setText('');
      setErrors([]);
      toast("Editor cleared", "info");
    }
  }, [editor, toast]);

  const spellingErrors = useMemo(() => errors.filter(e => e.type === 'spelling').length, [errors]);
  const grammarErrors = useMemo(() => errors.filter(e => e.type === 'grammar').length, [errors]);
  const styleErrors = useMemo(() => errors.filter(e => e.type === 'style').length, [errors]);
  const readabilityErrors = useMemo(() => errors.filter(e => e.type === 'readability').length, [errors]);

  const filteredErrors = useMemo(() => {
    if (activeFilter === 'all') return errors;
    return errors.filter(e => e.type === activeFilter);
  }, [activeFilter, errors]);

  const fixableCount = useMemo(() => {
    return errors.filter(e => e.replacements && e.replacements.length > 0).length;
  }, [errors]);

  return (
    <div className="w-full space-y-6">
      {/* Main Responsive Grid: Primary Editor (Left 7 cols) + Secondary Suggestions & Intelligence (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* PRIMARY WORKSPACE: Rich Grammar Editor */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col space-y-4">
          
          {/* Top Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-surface border border-border rounded-2xl p-3 sm:px-4 shadow-xs">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {/* Tone Selection Pill */}
              <div className="flex items-center gap-1.5 bg-surface-2 border border-border rounded-xl px-2.5 py-1.5 text-xs font-semibold text-text">
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue" />
                <span className="text-text-muted hidden sm:inline">Tone:</span>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as ToneSetting)}
                  className="bg-transparent border-none text-xs font-bold text-text outline-none cursor-pointer pr-1"
                  aria-label="Writing Tone"
                >
                  <option value="standard" className="bg-surface text-text">Standard</option>
                  <option value="formal" className="bg-surface text-text">Formal</option>
                  <option value="casual" className="bg-surface text-text">Casual</option>
                  <option value="academic" className="bg-surface text-text">Academic</option>
                </select>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-xl bg-surface-2 border border-border text-text-muted">
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 text-blue animate-spin" />
                    <span className="text-blue font-bold">Checking...</span>
                  </>
                ) : errors.length > 0 ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span>{errors.length} {errors.length === 1 ? 'issue' : 'issues'}</span>
                  </>
                ) : text.trim() ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                    <span className="text-success font-bold">Clear</span>
                  </>
                ) : (
                  <span>Ready</span>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 ml-auto flex-wrap">
              {!text.trim() && (
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue/10 hover:bg-blue/20 text-blue border border-blue/20 text-xs font-bold transition-all cursor-pointer"
                  title="Load sample text with test mistakes"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Sample Text</span>
                </button>
              )}

              {text.trim() && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1.5 rounded-xl hover:bg-surface-2 text-text-muted hover:text-text border border-transparent hover:border-border transition-all cursor-pointer"
                  title="Clear editor"
                  aria-label="Clear editor text"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-surface-2 border border-border hover:border-blue/40 rounded-xl text-xs font-bold text-text-muted hover:text-text transition-all cursor-pointer"
                title="Copy text to clipboard"
                aria-label="Copy text to clipboard"
              >
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copy</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-surface-2 border border-border hover:border-blue/40 rounded-xl text-xs font-bold text-text-muted hover:text-text transition-all cursor-pointer"
                title="Download as text file"
                aria-label="Download document"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>

          {/* Primary Editor Surface */}
          <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-sm flex flex-col focus-within:border-blue/50 focus-within:ring-2 focus-within:ring-blue/10 transition-all">
            <div className="flex-1 min-h-[380px] md:min-h-[480px] overflow-y-auto bg-bg/40">
              <EditorContent editor={editor} />
            </div>

            {/* Bottom Editor Statistics Bar */}
            <div className="px-4 py-3 bg-surface-2 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs text-text-muted font-medium">
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                <span><strong className="text-text font-bold">{stats.words}</strong> words</span>
                <span><strong className="text-text font-bold">{stats.characters}</strong> chars</span>
                <span><strong className="text-text font-bold">{stats.sentences}</strong> sentences</span>
                <span><strong className="text-text font-bold">{Math.ceil(stats.readingTimeMs / 1000 / 60) || 1}</strong> min read</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-tiny font-bold uppercase tracking-wider text-text-muted">Grade:</span>
                <span className="px-2 py-0.5 rounded-md font-bold text-tiny bg-blue/10 text-blue border border-blue/20">
                  {stats.readabilityGrade || 'Standard'}
                </span>
              </div>
            </div>
          </div>

          {/* Personal Dictionary Drawer */}
          {ignoredWords.length > 0 && (
            <div className="bg-surface border border-border rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue" />
                  Personal Dictionary ({ignoredWords.length})
                </span>
                <button
                  type="button"
                  onClick={() => setShowDictionary(!showDictionary)}
                  className="text-xs text-blue hover:underline font-bold cursor-pointer"
                >
                  {showDictionary ? 'Hide' : 'Show All'}
                </button>
              </div>

              {showDictionary && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {ignoredWords.map((word) => (
                    <span 
                      key={word} 
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-2 border border-border text-xs font-mono text-text"
                    >
                      {word}
                      <button
                        type="button"
                        onClick={() => removeIgnoredWord(word)}
                        className="text-red-400 hover:text-red-300 font-bold p-0.5 rounded hover:bg-red-500/10 cursor-pointer"
                        title={`Remove "${word}" from dictionary`}
                        aria-label={`Remove "${word}" from dictionary`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* SECONDARY PANEL: Real-Time Suggestions & Intelligence */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          
          {/* Header Card with Auto Fix & Filter Tabs */}
          <div className="bg-surface border border-border rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-text tracking-tight flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue" />
                  Suggestions
                </h2>
                <p className="text-xs text-text-muted">
                  {errors.length === 0 ? 'No errors detected' : `${errors.length} actionable suggestions`}
                </p>
              </div>

              {fixableCount > 0 && (
                <button
                  type="button"
                  onClick={applyAllFixes}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue hover:bg-blue/90 text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Fix All ({fixableCount})</span>
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: 'all', label: 'All', count: errors.length },
                { id: 'spelling', label: 'Spelling', count: spellingErrors },
                { id: 'grammar', label: 'Grammar', count: grammarErrors },
                { id: 'style', label: 'Style', count: styleErrors },
                { id: 'readability', label: 'Clarity', count: readabilityErrors }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={cn(
                    "px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5",
                    activeFilter === tab.id
                      ? "bg-blue text-white shadow-xs"
                      : "bg-surface-2 text-text-muted hover:text-text border border-border"
                  )}
                >
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={cn(
                      "text-tiny px-1.5 py-0.2 rounded-full font-mono",
                      activeFilter === tab.id ? "bg-white/20 text-white" : "bg-bg text-text-muted"
                    )}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Readability & Quality Meter */}
            {text.trim() && (
              <div className="p-3 bg-surface-2 border border-border rounded-2xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-text-muted">Readability Score</span>
                  <span className="font-bold text-text font-mono">{stats.readabilityScore}/100</span>
                </div>
                <div className="w-full h-2 bg-bg border border-border/50 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-300",
                      stats.readabilityScore >= 60 ? "bg-success" :
                      stats.readabilityScore >= 40 ? "bg-amber-500" : "bg-error"
                    )}
                    style={{ width: `${Math.max(5, stats.readabilityScore)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Suggestions List */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredErrors.length === 0 ? (
              <div className="bg-surface border border-border rounded-3xl p-8 text-center space-y-3 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-success/10 text-success flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-text">
                    {text.trim() ? "Your writing looks clean!" : "Waiting for text input"}
                  </h3>
                  <p className="text-xs text-text-muted max-w-xs mx-auto leading-relaxed">
                    {text.trim() 
                      ? (activeFilter === 'all' ? "No grammar, spelling, or style issues found." : `No ${activeFilter} issues found.`)
                      : "Type, paste, or click 'Sample Text' to analyze grammar and readability in real-time."
                    }
                  </p>
                </div>
              </div>
            ) : (
              filteredErrors.map((err, i) => {
                const errorSnippet = text.substring(err.offset, err.offset + err.length);
                const isSelected = selectedErrorId === err.id;

                return (
                  <div 
                    key={err.id || i}
                    onClick={() => setSelectedErrorId(err.id)}
                    className={cn(
                      "p-4 bg-surface border rounded-2xl transition-all shadow-xs space-y-3",
                      isSelected ? "border-blue ring-2 ring-blue/20 bg-blue/[0.02]" : "border-border hover:border-blue/40"
                    )}
                  >
                    {/* Error Header Badge + Context */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md",
                        err.type === 'spelling' ? "bg-red-500/15 text-red-500 border border-red-500/20" :
                        err.type === 'grammar' ? "bg-blue/15 text-blue border border-blue/20" :
                        err.type === 'readability' ? "bg-amber-500/15 text-amber-500 border border-amber-500/20" :
                        "bg-purple-500/15 text-purple-500 border border-purple-500/20"
                      )}>
                        {err.type}
                      </span>

                      {errorSnippet && (
                        <span className="text-xs font-mono font-bold text-text-muted line-through opacity-75 truncate max-w-[150px]">
                          {errorSnippet}
                        </span>
                      )}
                    </div>

                    {/* Explanation Message */}
                    <p className="text-xs text-text leading-relaxed font-medium">
                      {err.message}
                    </p>

                    {/* 1-Click Fix Suggestions & Ignore Option */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {err.replacements && err.replacements.length > 0 ? (
                        err.replacements.map((replacement: string, rIdx: number) => (
                          <button
                            key={rIdx}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              applyFix(err, replacement);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue/10 hover:bg-blue text-blue hover:text-white border border-blue/20 text-xs font-bold transition-all active:scale-95 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Fix: <strong>{replacement}</strong></span>
                          </button>
                        ))
                      ) : null}

                      {err.type === 'spelling' && errorSnippet && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            addIgnoredWord(errorSnippet);
                            toast(`Added "${errorSnippet}" to personal dictionary`, 'info');
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-surface-2 hover:bg-surface border border-border text-xs font-medium text-text-muted hover:text-text transition-all cursor-pointer"
                        >
                          Ignore
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
