"use client";

import React, { useState, useMemo } from "react";
import { ToolInput } from "@/components/ui/ToolInput";
import { MetricCard } from "@/components/ui/MetricCard";
import { DropZone } from "@/components/ui/DropZone";
import { FileText, Clock, Type, AlignLeft, Hash, Quote } from "lucide-react";

export default function WordCounterClient() {
  const [text, setText] = useState("");

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

    if (file.name.endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setText(e.target?.result as string);
      };
      reader.readAsText(file);
    } else if (file.name.endsWith(".docx")) {
      try {
        // @ts-ignore - dynamic import from URL
        const mammoth = await import(/* webpackIgnore: true */ "https://esm.sh/mammoth");
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setText(result.value);
      } catch (err) {
        console.error(err);
        alert("Failed to parse .docx file.");
      }
    } else {
      alert("Only .txt and .docx files are supported.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 space-y-4">
          <label className="text-sm font-black uppercase tracking-widest text-text-4">Input Text</label>
          <ToolInput
            value={text}
            onChange={setText}
            placeholder="Type, paste, or drop a text or .docx file here..."
            rows={12}
          />
        </div>
        <div className="space-y-4">
          <label className="text-sm font-black uppercase tracking-widest text-text-4">Upload File</label>
          <DropZone
            onFilesSelected={handleFiles}
            accept=".txt,.docx"
            title="Drop file (.txt, .docx)"
            description="or click to browse"
            className="h-[300px]"
          />
        </div>
      </div>

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
    </div>
  );
}
