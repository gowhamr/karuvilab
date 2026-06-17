"use client";

import React, { useCallback } from 'react';
import { useFileViewerStore } from '@/src/store/useFileViewerStore';
import { readFileAsText, detectLanguage, formatFileSize, isBinaryFile, EXTENSION_TO_LANG } from '@/src/lib/file-utils';
import { DropZone } from '@/components/ui/DropZone';
import { SyntaxEditor } from './SyntaxEditor';
import { Download, FileText, Trash2, Copy, Sparkles, Hash } from 'lucide-react';

const LANG_OPTIONS = Array.from(new Set(Object.values(EXTENSION_TO_LANG))).sort();
import { MetricCard } from '@/components/ui/MetricCard';
import { useToast } from '@/components/ui/Toast';
import { useObjectUrlManager } from '@/src/lib/hooks';
import { SliderField } from '@/components/ui/SliderField';
import { beautify } from '@/src/lib/formatter-utils';

export function ViewEditTab() {
  const fileA = useFileViewerStore(state => state.fileA);
  const setFileA = useFileViewerStore(state => state.setFileA);
  const updateFileAContent = useFileViewerStore(state => state.updateFileAContent);
  const setFileALanguage = useFileViewerStore(state => state.setFileALanguage);
  const settings = useFileViewerStore(state => state.settings);
  const updateSettings = useFileViewerStore(state => state.updateSettings);
  const { toast } = useToast();
  const { createUrl, revokeUrl } = useObjectUrlManager();

  const handleBeautify = () => {
    if (!fileA) return;
    const formatted = beautify(fileA.content, fileA.language);
    if (formatted === fileA.content) {
      toast("Already formatted or language not supported", "info");
      return;
    }
    updateFileAContent(formatted);
    toast("Content beautified", "success");
  };

  const handleFileSelect = useCallback(async (files: File[] | FileList) => {
    const file = files instanceof FileList ? files[0] : files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast("File too large (max 10MB)", "error");
      return;
    }

    const binary = await isBinaryFile(file);
    if (binary) {
      toast("Binary or image files are not supported for viewing/editing.", "error");
      return;
    }

    try {
      const content = await readFileAsText(file);
      setFileA({
        content,
        name: file.name,
        language: detectLanguage(file.name),
        size: file.size
      });
    } catch (err) {
      toast("Failed to read file", "error");
    }
  }, [setFileA, toast]);

  const handleDownload = () => {
    if (!fileA) return;
    const blob = new Blob([fileA.content], { type: 'text/plain' });
    const url = createUrl(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileA.name;
    a.click();
    revokeUrl(url);
  };

  const handleCopy = () => {
    if (!fileA) return;
    navigator.clipboard.writeText(fileA.content);
    toast("Copied to clipboard", "success");
  };

  return (
    <div className="space-y-6">
      {!fileA ? (
        <DropZone
          onFilesSelected={handleFileSelect}
          accept="*"
          title="Drop any text or code file here"
          description="Supports JSON, JS, TS, HTML, CSS, MD, and more. Max 10MB."
          className="aspect-video"
        />
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center text-blue">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text truncate max-w-52">{fileA.name}</h3>
                <p className="text-tiny font-bold uppercase tracking-widest-sm text-text-4">
                  {fileA.language} • {formatFileSize(fileA.size)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {['json', 'html', 'xml', 'css', 'sql', 'markdown'].includes(fileA.language.toLowerCase()) && (
                <button
                  onClick={handleBeautify}
                  className="px-4 py-2.5 bg-blue/10 text-blue border border-blue/20 rounded-xl text-tiny font-bold uppercase tracking-widest-sm hover:bg-blue hover:text-white transition-all flex items-center gap-2"
                  title="Beautify / Format"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Beautify</span>
                </button>
              )}
              <button
                onClick={handleCopy}
                className="p-2.5 bg-surface border border-border rounded-xl text-text-3 hover:text-blue transition-all"
                title="Copy Content"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={handleDownload}
                className="p-2.5 bg-blue text-white rounded-xl hover:scale-105 transition-all shadow-md shadow-blue/10"
                title="Download File"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={() => setFileA(null)}
                className="p-2.5 bg-surface border border-border rounded-xl text-red-500 hover:bg-red-500/5 transition-all"
                title="Clear File"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 bg-surface border border-border p-4 rounded-2xl">
             <div className="flex-1 min-w-52">
                <SliderField
                  label="Font Size"
                  id="font-size"
                  min={12}
                  max={24}
                  value={settings.fontSize}
                  onChange={(v) => updateSettings({ fontSize: v })}
                  format={(v) => `${v}px`}
                />
             </div>
             
             <div className="flex flex-wrap items-center gap-6">
               <div className="space-y-1">
                 <label htmlFor="viewer-language-select" className="text-tiny font-bold uppercase tracking-widest-sm text-text-4">Language</label>
                 <select
                   id="viewer-language-select"
                   value={fileA.language}
                   onChange={(e) => setFileALanguage(e.target.value)}
                   className="block w-32 px-3 py-1.5 bg-bg border border-border rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue"
                 >
                   {LANG_OPTIONS.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
                 </select>
               </div>

               <label className="flex items-center gap-2 cursor-pointer pt-4">
                  <input 
                    type="checkbox" checked={settings.wordWrap} 
                    onChange={(e) => updateSettings({ wordWrap: e.target.checked })}
                    className="accent-blue"
                  />
                  <span className="text-tiny font-bold uppercase tracking-widest-sm text-text-4">Word Wrap</span>
               </label>

               <label className="flex items-center gap-2 cursor-pointer pt-4">
                  <input 
                    type="checkbox" checked={settings.showLineNumbers} 
                    onChange={(e) => updateSettings({ showLineNumbers: e.target.checked })}
                    className="accent-blue"
                  />
                  <span className="text-tiny font-bold uppercase tracking-widest-sm text-text-4">Lines</span>
               </label>
             </div>
          </div>

          <SyntaxEditor
            value={fileA.content}
            onChange={updateFileAContent}
            language={fileA.language}
            fontSize={settings.fontSize}
            wordWrap={settings.wordWrap}
            showLineNumbers={settings.showLineNumbers}
            className="h-full"
          />
        </div>
      )}
    </div>
  );
}
