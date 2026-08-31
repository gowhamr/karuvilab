import { blobManager } from "@/src/lib/blob-manager";
import { useState, useEffect, useRef, useCallback } from 'react';
import { useEditor, EditorContent, Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { workerManager } from '@/src/workers/manager';
import { MetricCard } from '@/components/ui/MetricCard';
import { useGrammarStore } from './store';
import { useToast } from '@/components/ui/Toast';
import { Copy, Download } from 'lucide-react';

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

export default function GrammarCheckerClient() {
  const { toast } = useToast();
  const [text, setText] = useState('');
  const [errors, setErrors] = useState<any[]>([]);
  const [stats, setStats] = useState({ 
    words: 0, 
    characters: 0, 
    sentences: 0, 
    paragraphs: 0, 
    readabilityScore: 0, 
    readabilityGrade: '', 
    readingTimeMs: 0, 
    avgSentenceLength: 0, 
    uniqueWords: 0 
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'spelling' | 'grammar' | 'style' | 'readability'>('all');
  
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
        placeholder: 'Type or paste your text here to check grammar, spelling, and style...',
      }),
      GrammarDecorations
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setText(editor.getText());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] p-4 text-text',
      },
    }
  });

  const checkText = useCallback(async (currentText: string) => {
    if (!currentText.trim()) {
      setErrors([]);
      setStats({ words: 0, characters: 0, sentences: 0, paragraphs: 0, readabilityScore: 0, readabilityGrade: '', readingTimeMs: 0, avgSentenceLength: 0, uniqueWords: 0 });
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
      setErrors(res.errors);
      setStats(res.stats);
      
      if (editor) {
        const decos: Decoration[] = [];
        res.errors.forEach((err: any) => {
          let className = 'border-b-2 border-dotted cursor-pointer ';
          if (err.type === 'spelling') className += 'border-red-500 bg-red-500/10';
          else if (err.type === 'grammar') className += 'border-blue-500 bg-blue-500/10';
          else if (err.type === 'readability') className += 'border-orange-500 bg-orange-500/10';
          else className += 'border-yellow-500 bg-yellow-500/10';

          let resolvedStart = 0;
          let resolvedEnd = 0;
          try {
            resolvedStart = err.offset + 1;
            resolvedEnd = err.offset + err.length + 1;
            
            const docSize = editor.state.doc.content.size;
            if (resolvedStart > 0 && resolvedEnd <= docSize) {
              decos.push(Decoration.inline(resolvedStart, resolvedEnd, { class: className, title: err.message }));
            }
          } catch (e) {}
        });
        
        const decorationSet = DecorationSet.create(editor.state.doc, decos);
        editor.view.dispatch(editor.view.state.tr.setMeta(GrammarPluginKey, { decorations: decorationSet }));
      }
    } catch (e: any) {
      if (e.message !== 'Task cancelled') {
        console.error("Grammar check failed:", e);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [editor, ignoredWords, toast, tone]);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      checkText(text);
    }, 800);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [text, checkText, ignoredWords, tone]);

  const applyFix = (err: any, replacement: string) => {
    if (!editor) return;
    editor.chain().focus()
      .deleteRange({ from: err.offset + 1, to: err.offset + err.length + 1 })
      .insertContent(replacement)
      .run();
    
    setText(editor.getText());
  };

  const applyAllFixes = () => {
    if (!editor || errors.length === 0) return;
    
    const fixableErrors = [...errors]
      .filter(err => err.replacements && err.replacements.length > 0)
      .sort((a, b) => b.offset - a.offset);

    if (fixableErrors.length === 0) return;

    let chain = editor.chain().focus();
    fixableErrors.forEach(err => {
      chain = chain
        .deleteRange({ from: err.offset + 1, to: err.offset + err.length + 1 })
        .insertContent(err.replacements[0]);
    });
    
    chain.run();
    setText(editor.getText());
  };

  const handleCopy = () => {
    if (editor) {
      navigator.clipboard.writeText(editor.getText());
      toast('Copied to clipboard!', 'success');
    }
  };

  const handleDownload = () => {
    if (editor) {
      const blob = new Blob([editor.getText()], { type: 'text/plain' });
      blobManager.download(blob, 'grammar-checked.txt');
    }
  };

  const spellingErrors = errors.filter(e => e.type === 'spelling').length;
  const grammarErrors = errors.filter(e => e.type === 'grammar').length;
  const styleErrors = errors.filter(e => e.type === 'style').length;
  const readabilityErrors = errors.filter(e => e.type === 'readability').length;

  const filteredErrors = activeFilter === 'all' ? errors : errors.filter(e => e.type === activeFilter);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <MetricCard label="Words" value={String(stats.words)} />
          <MetricCard label="Characters" value={String(stats.characters)} />
          <MetricCard label="Sentences" value={String(stats.sentences)} />
          <MetricCard label="Paragraphs" value={String(stats.paragraphs)} />
          <MetricCard label="Unique Words" value={String(stats.uniqueWords)} />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface p-4 rounded-xl border border-border flex flex-col justify-center">
            <span className="text-sm text-text-muted mb-1">Readability Score</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-text">{stats.readabilityScore}</span>
              {stats.readabilityGrade && (
                <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                  stats.readabilityScore >= 60 ? 'bg-green-500/20 text-green-400' :
                  stats.readabilityScore >= 40 ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {stats.readabilityGrade}
                </span>
              )}
            </div>
          </div>
          <MetricCard label="Avg Sentence Length" value={`${Math.round(stats.avgSentenceLength * 10) / 10} words`} />
          <MetricCard label="Reading Time" value={`${Math.ceil(stats.readingTimeMs / 1000 / 60)} min`} />
          <div className="bg-surface p-4 rounded-xl border border-border flex flex-col justify-center">
            <span className="text-sm text-text-muted mb-1">Issues Found</span>
            <span className={`text-2xl font-bold ${errors.length > 0 ? 'text-red-400' : 'text-text'}`}>
              {errors.length}
            </span>
          </div>
        </div>
      </div>
      
      {ignoredWords.length > 0 && (
        <div className="bg-surface-2 border border-border rounded-xl p-4 flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider mr-2">Personal Dictionary:</span>
          {ignoredWords.map(w => (
            <span key={w} className="text-xs bg-bg border border-border px-2 py-1 rounded-md flex items-center gap-2 text-text-2">
              {w}
              <button onClick={() => removeIgnoredWord(w)} className="text-red-400 hover:text-red-300 font-bold">&times;</button>
            </span>
          ))}
        </div>
      )}

      <div className="bg-surface border border-border rounded-2xl overflow-hidden relative">
        <div className="bg-surface-2 px-4 py-2 border-b border-border flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-muted font-medium">Editor (100% Client-Side)</span>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as any)}
              className="bg-bg border border-border text-xs rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-primary cursor-pointer text-text"
            >
              <option value="standard">Standard Tone</option>
              <option value="formal">Formal</option>
              <option value="casual">Casual</option>
              <option value="academic">Academic</option>
            </select>
          </div>
          {isProcessing && <span className="text-xs text-primary animate-pulse">Checking...</span>}
        </div>
        <EditorContent editor={editor} />
      </div>

      <div className="flex justify-between items-center my-4">
        <div className="flex gap-2"></div>
        <div className="flex justify-end gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 bg-surface-2 border border-border rounded-lg px-3 py-1.5 text-xs font-bold text-text-muted hover:text-text"
          >
            <Copy size={14} />
            Copy Text
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-surface-2 border border-border rounded-lg px-3 py-1.5 text-xs font-bold text-text-muted hover:text-text"
          >
            <Download size={14} />
            Download .txt
          </button>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="bg-surface border border-border rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-text">Suggestions</h3>
            {errors.some(err => err.replacements && err.replacements.length > 0) && (
              <button 
                onClick={applyAllFixes}
                className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors active:scale-95"
              >
                Auto Fix All
              </button>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-4 mb-2">
            {[
              { id: 'all', label: 'All', count: errors.length },
              { id: 'spelling', label: 'Spelling', count: spellingErrors },
              { id: 'grammar', label: 'Grammar', count: grammarErrors },
              { id: 'style', label: 'Style', count: styleErrors },
              { id: 'readability', label: 'Readability', count: readabilityErrors }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  activeFilter === tab.id
                    ? 'bg-primary text-white'
                    : 'bg-surface-2 text-text-muted border border-border hover:text-text'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          <div className="flex items-center flex-wrap gap-3 text-xs font-medium text-text-muted mb-4 bg-surface-2 px-4 py-2 rounded-lg border border-border">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div>{spellingErrors} spelling</div>
            <span className="opacity-50">·</span>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div>{grammarErrors} grammar</div>
            <span className="opacity-50">·</span>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-yellow-500"></div>{styleErrors} style</div>
            <span className="opacity-50">·</span>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-500"></div>{readabilityErrors} readability</div>
          </div>

          {filteredErrors.length === 0 ? (
            <div className="text-sm text-text-muted text-center py-6">
              No {activeFilter} suggestions found.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredErrors.map((err, i) => (
                <div key={i} className="p-3 bg-surface-2 rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      err.type === 'spelling' ? 'bg-red-500/20 text-red-400' :
                      err.type === 'grammar' ? 'bg-blue-500/20 text-blue-400' :
                      err.type === 'readability' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {err.type.toUpperCase()}
                    </span>
                    <span className="text-sm font-medium text-text">{err.message}</span>
                  </div>
                  
                  <div className="flex gap-2 mt-2 items-center flex-wrap">
                    {err.replacements?.map((r: string, idx: number) => (
                      <button 
                        key={idx} 
                        onClick={() => applyFix(err, r)}
                        className="text-xs font-medium bg-primary/20 text-primary px-3 py-1.5 rounded-xl hover:bg-primary/30 transition-colors active:scale-95"
                      >
                        Fix: {r}
                      </button>
                    ))}
                    
                    {err.type === 'spelling' && (
                      <button 
                        onClick={() => addIgnoredWord(text.substring(err.offset, err.offset + err.length))}
                        className="text-xs font-medium bg-surface text-text-muted border border-border px-3 py-1.5 rounded-xl hover:text-text hover:border-text-muted transition-colors active:scale-95"
                      >
                        Ignore Word
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
