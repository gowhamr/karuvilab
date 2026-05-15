"use client";

import React, { useCallback } from 'react';
import { useFileViewerStore } from '@/src/store/useFileViewerStore';
import { readFileAsText, detectLanguage, formatFileSize } from '@/src/lib/file-utils';
import { DropZone } from '@/components/ui/DropZone';
import { SyntaxEditor } from './SyntaxEditor';
import { Download, FileText, Trash2, Copy } from 'lucide-react';
import { MetricCard } from '@/components/ui/MetricCard';
import { useToast } from '@/components/ui/Toast';
import { useObjectUrlManager } from '@/src/lib/hooks';
import { SliderField } from '@/components/ui/SliderField';

export function ViewEditTab() {
  const { fileA, setFileA, updateFileAContent, settings, updateSettings } = useFileViewerStore();
  const { toast } = useToast();
  const { createUrl, revokeUrl } = useObjectUrlManager();

  const handleFileSelect = useCallback(async (files: File[] | FileList) => {
    const file = files instanceof FileList ? files[0] : files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast("File too large (max 10MB)", "error");
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
                <h3 className="text-sm font-bold text-text truncate max-w-[200px]">{fileA.name}</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-text-4">
                  {fileA.language} • {formatFileSize(fileA.size)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="p-2.5 bg-surface border border-border rounded-xl text-text-3 hover:text-blue transition-all"
                title="Copy Content"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={handleDownload}
                className="p-2.5 bg-blue text-white rounded-xl hover:scale-105 transition-all shadow-lg shadow-blue/20"
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
             <div className="flex-1 min-w-[200px]">
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
             <div className="hidden md:block w-px h-8 bg-border mx-2" />
             <label className="flex items-center gap-2 cursor-pointer md:pt-6">
                <input 
                  type="checkbox" checked={settings.wordWrap} 
                  onChange={(e) => updateSettings({ wordWrap: e.target.checked })}
                  className="accent-blue"
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-text-4">Word Wrap</span>
             </label>
          </div>

          <SyntaxEditor
            value={fileA.content}
            onChange={updateFileAContent}
            language={fileA.language}
            fontSize={settings.fontSize}
            wordWrap={settings.wordWrap}
            className="h-[600px]"
          />
        </div>
      )}
    </div>
  );
}
