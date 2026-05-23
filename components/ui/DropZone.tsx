"use client";

import React, { useRef, useState, useCallback } from "react";
import { Upload, File, X, CircleAlert as AlertCircle } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { m, AnimatePresence } from "framer-motion";

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
      <m.div
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
        animate={{ 
          scale: isDragging ? 1.02 : 1,
          borderColor: isDragging ? "var(--blue)" : error ? "rgb(239, 68, 68)" : "var(--border)",
          backgroundColor: isDragging ? "var(--blue-glow)" : error ? "rgba(239, 68, 68, 0.05)" : "var(--surface)"
        }}
        className={cn(
          "relative group cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed transition-colors duration-300",
          "flex flex-col items-center justify-center p-10 text-center",
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
        <m.div
          animate={{ 
            scale: isDragging ? 1.2 : 1,
            y: isDragging ? [0, -10, 0] : 0
          }}
          transition={{ 
            y: isDragging ? { repeat: Infinity, duration: 0.6, ease: "easeInOut" } : { duration: 0.3 }
          }}
          className={cn(
            "mb-4 rounded-2xl p-4 transition-all duration-300",
            isDragging ? "bg-blue text-white shadow-lg shadow-blue/20" : "bg-bg text-text-4 group-hover:text-blue group-hover:bg-blue/5"
          )}
          aria-hidden="true"
        >
          {icon || <Upload className="w-8 h-8" />}
        </m.div>

        <div className="space-y-1">
          <p className="font-bold text-lg text-text-2 group-hover:text-blue transition-colors">
            {title}
          </p>
          <p className="text-sm text-text-4 font-medium italic opacity-70">
            {description}
          </p>
        </div>

        <AnimatePresence>
          {isDragging && (
            <m.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-blue/5 pointer-events-none"
            >
              <m.div 
                animate={{ 
                  opacity: [0.1, 0.2, 0.1],
                  scale: [1, 1.05, 1]
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 border-4 border-blue/20 rounded-3xl"
              />
            </m.div>
          )}
        </AnimatePresence>

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
      </m.div>
      
      <AnimatePresence>
        {error && (
          <m.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            id={errorId}
            role="alert"
            className="flex items-center gap-2 text-xs font-bold text-red-500 bg-red-500/5 p-3 rounded-xl border border-red-500/20 overflow-hidden"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
