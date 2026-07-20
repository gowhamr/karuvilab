import React, { useRef, useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  className?: string;
}

export function FileUpload({ onFileSelect, className }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  return (
    <div 
      className={className}
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      {fileName ? (
        <div className="flex items-center gap-3">
          <ImageIcon className="w-6 h-6 text-blue" />
          <span className="text-xs font-bold text-text truncate">{fileName}</span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setFileName(null);
              onFileSelect(null as any);
            }}
            className="p-1 hover:bg-bg rounded-full text-text-4"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1">
          <Upload className="w-4 h-4 text-text-4 group-hover:text-blue transition-colors" />
          <span className="text-tiny font-bold text-text-4 uppercase tracking-widest">
            Click to upload or drag & drop
          </span>
        </div>
      )}
    </div>
  );
}
