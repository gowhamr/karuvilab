"use client";

import React, { useRef, useState, useCallback } from "react";
import { Upload, File, X, CircleAlert as AlertCircle } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface DropZoneProps {
  onFilesSelected: (files: FileList | File[]) => void;
  accept?: string;
  multiple?: boolean;
  title?: string;
  description?: string;
  className?: string;
  icon?: React.ReactNode;
  maxSize?: number; // in bytes
}

export function DropZone({
  onFilesSelected,
  accept,
  multiple = false,
  title = "Drop files here",
  description = "or click to upload",
  className,
  icon,
  maxSize,
}: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const errorId = `dropzone-error-${title.toLowerCase().replace(/\s+/g, "-")}`;

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      setError(null);
      
      const fileArray = Array.from(files);
      
      if (maxSize) {
        const oversizedFiles = fileArray.filter(file => file.size > maxSize);
        if (oversizedFiles.length > 0) {
          setError(`Some files exceed the maximum size of ${Math.round(maxSize / 1024 / 1024)}MB`);
          return;
        }
      }

      onFilesSelected(files);
    },
    [onFilesSelected, maxSize]
  );

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const onClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full space-y-2">
      <div
        className={cn(
          "relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300",
          "flex flex-col items-center justify-center p-8 text-center",
          isDragging
            ? "border-blue bg-blue/5 scale-[1.01]"
            : "border-border bg-surface hover:border-blue/50 hover:bg-blue/[0.02]",
          error ? "border-red-500/50 bg-red-500/5" : "",
          className
        )}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
          }
        }}
        aria-label={`${title}. ${description}`}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
      >
        <div
          className={cn(
            "mb-4 rounded-full p-4 transition-transform duration-300 group-hover:scale-110",
            isDragging ? "bg-blue text-white" : "bg-bg text-text-4 group-hover:text-blue"
          )}
          aria-hidden="true"
        >
          {icon || <Upload className="w-8 h-8" />}
        </div>

        <div className="space-y-1">
          <p className="font-bold text-text-2 group-hover:text-blue transition-colors">
            {title}
          </p>
          <p className="text-sm text-text-4 font-medium italic">
            {description}
          </p>
        </div>

        {isDragging && (
          <div className="absolute inset-0 bg-blue/10 pointer-events-none animate-pulse" />
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          tabIndex={-1}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFiles(e.target.files);
            }
          }}
        />
      </div>
      
      {error && (
        <div 
          id={errorId}
          role="alert"
          className="flex items-center gap-2 text-xs font-bold text-red-500 bg-red-500/5 p-3 rounded-xl border border-red-500/20"
        >
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
}
