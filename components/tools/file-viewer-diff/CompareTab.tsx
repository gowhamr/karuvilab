"use client";

import React, { useState, useCallback } from 'react';
import { useFileViewerStore } from '@/src/store/useFileViewerStore';
import { readFileAsText, detectLanguage, isBinaryFile, EXTENSION_TO_LANG } from '@/src/lib/file-utils';
import { workerManager } from '@/src/workers/manager';
import { DropZone } from '@/components/ui/DropZone';
import { DiffViewer } from './DiffViewer';
import { DiffLine } from '@/src/workers/types';
import { Zap, LoaderCircle as Loader2, ArrowRight, Trash2, Plus, Minus, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { beautify } from '@/src/lib/formatter-utils';

const LANG_OPTIONS = Array.from(new Set(Object.values(EXTENSION_TO_LANG))).sort();

export function CompareTab() {
  const fileA = useFileViewerStore(state => state.fileA);
  const fileB = useFileViewerStore(state => state.fileB);
  const setFileA = useFileViewerStore(state => state.setFileA);
  const setFileB = useFileViewerStore(state => state.setFileB);
  const updateFileAContent = useFileViewerStore(state => state.updateFileAContent);
  const updateFileBContent = useFileViewerStore(state => state.updateFileBContent);
  const setFileALanguage = useFileViewerStore(state => state.setFileALanguage);
  const setFileBLanguage = useFileViewerStore(state => state.setFileBLanguage);

  const { toast } = useToast();
  
  const [diff, setDiff] = useState<DiffLine[] | null>(null);
  const [isComputing, setIsComputing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleBeautifyA = () => {
    if (!fileA) return;
    const formatted = beautify(fileA.content, fileA.language);
    updateFileAContent(formatted);
    toast("Original file beautified", "success");
  };

  const handleBeautifyB = () => {
    if (!fileB) return;
    const formatted = beautify(fileB.content, fileB.language);
    updateFileBContent(formatted);
    toast("Modified file beautified", "success");
  };

  const handleFileA = useCallback(async (files: File[] | FileList) => {
    const file = files instanceof FileList ? files[0] : files[0];
    if (file) {
      if (await isBinaryFile(file)) {
        toast("Binary files not supported", "error");
        return;
      }
      const content = await readFileAsText(file);
      setFileA({ content, name: file.name, language: detectLanguage(file.name), size: file.size });
    }
  }, [setFileA, toast]);

  const handleFileB = useCallback(async (files: File[] | FileList) => {
    const file = files instanceof FileList ? files[0] : files[0];
    if (file) {
      if (await isBinaryFile(file)) {
        toast("Binary files not supported", "error");
        return;
      }
      const content = await readFileAsText(file);
      setFileB({ content, name: file.name, language: detectLanguage(file.name), size: file.size });
    }
  }, [setFileB, toast]);

  const computeDiff = async () => {
    if (!fileA || !fileB) return;
    
    setIsComputing(true);
    setProgress(0);
    setDiff(null);

    try {
      const result = await workerManager.computeDiff(
        fileA.content,
        fileB.content,
        (p) => setProgress(p.percent)
      );
      setDiff(result);
    } catch (err) {
      toast("Diff calculation failed", "error");
    } finally {
      setIsComputing(false);
    }
  };

  const stats = React.useMemo(() => {
    if (!diff) return null;
    return {
      added: diff.filter(d => d.type === 'added').length,
      removed: diff.filter(d => d.type === 'removed').length,
    };
  }, [diff]);

  return (
    <div className="space-y-8">
      {!diff ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <div className="space-y-4">
            <h3 className="text-tiny font-bold uppercase tracking-widest-sm text-text-4 px-2">Original File</h3>
            {!fileA ? (
              <DropZone onFilesSelected={handleFileA} accept="*" title="Upload Original" className="h-48" />
            ) : (
              <div className="bg-surface border border-border p-4 rounded-2xl flex items-center justify-between">
                <div className="truncate flex-1 mr-4">
                  <p className="text-xs font-bold text-text truncate">{fileA.name}</p>
                  <select
                    value={fileA.language}
                    onChange={(e) => setFileALanguage(e.target.value)}
                    aria-label={`Language for ${fileA.name}`}
                    className="text-xs text-text-4 uppercase bg-transparent border-none p-0 focus:ring-0 cursor-pointer hover:text-blue"
                  >
                    {LANG_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  {['json', 'html', 'xml', 'css', 'sql', 'markdown'].includes(fileA.language.toLowerCase()) && (
                    <button onClick={handleBeautifyA} title="Beautify" className="p-2 hover:bg-blue/5 text-blue rounded-lg">
                      <Sparkles className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => setFileA(null)} className="p-2 hover:bg-red-500/5 text-red-500 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-tiny font-bold uppercase tracking-widest-sm text-text-4 px-2">Modified File</h3>
            {!fileB ? (
              <DropZone onFilesSelected={handleFileB} accept="*" title="Upload Modified" className="h-48" />
            ) : (
              <div className="bg-surface border border-border p-4 rounded-2xl flex items-center justify-between">
                <div className="truncate flex-1 mr-4">
                  <p className="text-xs font-bold text-text truncate">{fileB.name}</p>
                  <select
                    value={fileB.language}
                    onChange={(e) => setFileBLanguage(e.target.value)}
                    aria-label={`Language for ${fileB.name}`}
                    className="text-xs text-text-4 uppercase bg-transparent border-none p-0 focus:ring-0 cursor-pointer hover:text-blue"
                  >
                    {LANG_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  {['json', 'html', 'xml', 'css', 'sql', 'markdown'].includes(fileB.language.toLowerCase()) && (
                    <button onClick={handleBeautifyB} title="Beautify" className="p-2 hover:bg-blue/5 text-blue rounded-lg">
                      <Sparkles className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => setFileB(null)} className="p-2 hover:bg-red-500/5 text-red-500 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 flex justify-center py-4">
            <button
              onClick={computeDiff}
              disabled={!fileA || !fileB || isComputing}
              className="px-12 py-5 bg-blue text-white font-black uppercase tracking-widest-lg rounded-2xl shadow-xl shadow-blue/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale flex items-center gap-3"
            >
              {isComputing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Computing... {Math.round(progress)}%</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 fill-current" />
                  Compare Files
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/5 border border-green-500/10 rounded-full">
                <Plus className="w-3.5 h-3.5 text-green-500" />
                <span className="text-xs font-black text-green-600">{stats?.added} Additions</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-red-500/5 border border-red-500/10 rounded-full">
                <Minus className="w-3.5 h-3.5 text-red-500" />
                <span className="text-xs font-black text-red-600">{stats?.removed} Deletions</span>
              </div>
            </div>
            
            <button 
              onClick={() => setDiff(null)}
              className="text-tiny font-bold uppercase tracking-widest-sm text-blue hover:underline"
            >
              Start New Comparison
            </button>
          </div>

          <DiffViewer diff={diff} />
        </div>
      )}
    </div>
  );
}
