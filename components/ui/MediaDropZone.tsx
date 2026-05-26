"use client";

import React, { useState } from "react";
import { DropZone } from "./DropZone";
import { FileVideo, FileAudio, Image as ImageIcon, Film } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";

interface MediaDropZoneProps {
  onFileSelect: (file: File) => void;
  accept: string;
  type: "video" | "audio" | "image" | "media";
  title?: string;
  description?: string;
  maxSize?: number;
}

export function MediaDropZone({
  onFileSelect,
  accept,
  type,
  title,
  description,
  maxSize,
}: MediaDropZoneProps) {
  const getIcon = () => {
    switch (type) {
      case "video": return <FileVideo className="w-10 h-10" />;
      case "audio": return <FileAudio className="w-10 h-10" />;
      case "image": return <ImageIcon className="w-10 h-10" />;
      default: return <Film className="w-10 h-10" />;
    }
  };

  const getDefaultTitle = () => {
    switch (type) {
      case "video": return "Drop video here";
      case "audio": return "Drop audio here";
      case "image": return "Drop images here";
      default: return "Drop media here";
    }
  };

  const dropZoneProps: any = {
    onFilesSelected: (files: FileList | File[]) => {
      const file = files instanceof FileList ? files[0] : files[0];
      if (file) onFileSelect(file);
    },
    accept,
    title: title || getDefaultTitle(),
    description: description || "or click to browse",
    icon: getIcon(),
  };

  if (maxSize) dropZoneProps.maxSize = maxSize;

  return <DropZone {...dropZoneProps} />;
}
