"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { ToolInput } from "@/components/ui/ToolInput";
import { MetricCard } from "@/components/ui/MetricCard";
import { DropZone } from "@/components/ui/DropZone";
import { FileText, Clock, Type, AlignLeft, Hash, Quote } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { workerOrchestrator } from "@/src/engine/workers/WorkerOrchestrator";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";

export default function WordCounterClient() {
  const [text, setText] = useState("");
  const { toast } = useToast();
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const stats = useMemo(() => {
    const trimmedText = text.trim();
    const words = trimmedText ? trimmedText.split(/\s+/).length : 0;
    const charsWithSpaces = text.length;
    const charsWithoutSpaces = text.replace(/\s/g, "").length;
    const sentences = trimmedText ? (trimmedText.match(/[^\.!\?]+[\.!\?]+/g) || []).length : 0;
    const paragraphs = trimmedText ? trimmedText.split(/\n\s*\n/).filter(p => p.trim().length > 0).length : 0;
    
    // Reading time: 200 words per minute
    const readingTimeMinutes = words / 200;
    const readingTimeSeconds = Math.round(readingTimeMinutes * 60);
    const readingTimeStr = readingTimeSeconds < 60 
      ? `${readingTimeSeconds}s` 
      : `${Math.floor(readingTimeMinutes)}m ${readingTimeSeconds % 60}s`;

    return {
      words,
      charsWithSpaces,
      charsWithoutSpaces,
      sentences,
      paragraphs,
      readingTime: readingTimeStr
    };
  }, [text]);

  const handleFiles = async (files: FileList | File[]) => {
    const file = files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast("File too large. Max 2MB allowed.", "error");
      return;
    }

    if (file.name.endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setText(e.target?.result as string);
      };
      reader.readAsText(file);
    } else if (file.name.endsWith(".docx")) {
      abortControllerRef.current?.abort();
      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      try {
        const arrayBuffer = await file.arrayBuffer();
        const extractedText = await workerOrchestrator.dispatch<string>(
          "extractRawTextFromDocx",
          [arrayBuffer],
          [arrayBuffer],
          undefined,
          abortController.signal
        );
        setText(extractedText);
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.error(err);
        toast("Failed to parse .docx file.", "error");
      }
    } else {
      toast("Only .txt and .docx files are supported.", "error");
    }
  };

  return (
    <ToolWorkspace
      layout="stacked"
      input={
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <label htmlFor="word-counter-input" className="text-sm font-black uppercase tracking-widest text-text-muted">Input Text</label>
            <ToolInput
              id="word-counter-input"
              value={text}
              onChange={setText}
              placeholder="Type, paste, or drop a text or .docx file here..."
              rows={12}
            />
          </div>
          <div className="space-y-4 h-full flex flex-col">
            <label className="text-sm font-black uppercase tracking-widest text-text-muted">Upload File</label>
            <DropZone
              onFilesSelected={handleFiles}
              accept=".txt,.docx"
              title="Drop file (.txt, .docx)"
              description="or click to browse"
              className="flex-1"
            />
          </div>
        </div>
      }
      infoPanel={
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <MetricCard
            label="Words"
            value={stats.words.toString()}
            icon={AlignLeft}
            accent
          />
          <MetricCard
            label="Chars (all)"
            value={stats.charsWithSpaces.toString()}
            icon={Type}
          />
          <MetricCard
            label="Chars (no space)"
            value={stats.charsWithoutSpaces.toString()}
            icon={Hash}
          />
          <MetricCard
            label="Sentences"
            value={stats.sentences.toString()}
            icon={Quote}
          />
          <MetricCard
            label="Paragraphs"
            value={stats.paragraphs.toString()}
            icon={FileText}
          />
          <MetricCard
            label="Reading Time"
            value={stats.readingTime}
            icon={Clock}
          />
        </div>
      }
    />
  );
}
