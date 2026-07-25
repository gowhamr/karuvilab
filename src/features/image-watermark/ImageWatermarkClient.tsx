"use client";
import { useState, useCallback, useRef } from "react";
import { useObjectUrlManager, useAsyncSafeState } from "@/src/lib/hooks";
import { DropZone } from "@/components/ui/DropZone";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
import { formatError } from "@/src/lib/formatError";
import { workerManager } from "@/src/workers/manager";
import { SliderField } from "@/components/ui/SliderField";
import { m, AnimatePresence } from "framer-motion";
import { Download, AlertCircle, FileImage, Type, Image as ImageIcon, CheckCircle, RefreshCw } from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function ImageWatermarkClient() {
  const { createUrl, revokeUrl } = useObjectUrlManager();
  
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useAsyncSafeState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [mode, setMode] = useState<'text' | 'image'>('text');
  const [text, setText] = useState("KaruviLab");
  const [wmFile, setWmFile] = useState<File | null>(null);
  
  const [opacity, setOpacity] = useState(50);
  const [position, setPosition] = useState('bottom-right');
  const [margin, setMargin] = useState(20);
  const [fontSize, setFontSize] = useState(48);
  const [fontColor, setFontColor] = useState("#ffffff");
  const [scale, setScale] = useState(100);

  const [results, setResults] = useState<{name: string, url: string}[]>([]);

  const handleFiles = useCallback((selected: FileList | File[]) => {
    const f = Array.from(selected).filter(file => file.type.startsWith('image/'));
    const validF = f.filter(file => file.size <= 25 * 1024 * 1024);
    
    if (f.length === 0) {
      setErrorMsg('Please upload valid image files.');
      return;
    }
    if (validF.length < f.length) {
      setErrorMsg('Some files were skipped. Maximum size is 25MB.');
    } else {
      setErrorMsg(null);
    }
    
    if (validF.length > 0) {
      setFiles(validF);
      results.forEach(r => revokeUrl(r.url));
      setResults([]);
    }
  }, [revokeUrl, results]);

  const handleWmFile = useCallback((selected: FileList | File[]) => {
    const f = Array.from(selected)[0];
    if (f && f.type.startsWith('image/')) {
      if (f.size > 10 * 1024 * 1024) {
        setErrorMsg("Watermark image must be under 10MB");
        return;
      }
      setWmFile(f);
    }
  }, []);

  const processBatch = async () => {
    setIsProcessing(true);
    setErrorMsg(null);
    results.forEach(r => revokeUrl(r.url));
    setResults([]);
    
    let wmBytes: ArrayBuffer | undefined;
    if (mode === 'image' && wmFile) {
      wmBytes = await wmFile.arrayBuffer();
    } else if (mode === 'image' && !wmFile) {
      setErrorMsg("Please upload a watermark image.");
      setIsProcessing(false);
      return;
    }

    try {
      const out: {name: string, url: string}[] = [];
      for (const f of files) {
        const buffer = await f.arrayBuffer();
        
        const wmBytesCopy = wmBytes ? wmBytes.slice(0) : undefined;
        
        const resultBytes = await workerManager.watermarkImage(
          buffer,
          f.type,
          {
            type: mode,
            text,
            imageBytes: wmBytesCopy,
            imageType: wmFile?.type,
            opacity: opacity / 100,
            position,
            margin,
            fontSize,
            fontColor,
            scale: scale / 100
          }
        );
        
        const blob = new Blob([resultBytes as any], { type: f.type });
        out.push({
          name: f.name.replace(/\.[^.]+$/, '') + '-watermarked.' + f.type.split('/')[1],
          url: createUrl(blob)
        });
      }
      setResults(out);
    } catch (err) {
      setErrorMsg(formatError(err));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadAll = () => {
    results.forEach(r => {
      const a = document.createElement('a');
      a.href = r.url;
      a.download = r.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
            <Type className="w-5 h-5 text-blue" />
            Batch Image Watermark
          </h2>
          <p className="text-xs text-text-4 font-medium">Add text or image overlays offline securely</p>
        </div>
        <PrivacyBadge />
      </div>

      {!files.length ? (
        <DropZone
          onFilesSelected={handleFiles}
          accept="image/*"
          title="Drop images to watermark"
          description="JPEG, PNG, WebP supported. Select multiple files for batch processing."
          icon={<FileImage className="w-10 h-10 text-blue" />}
          className="p-12 border-dashed border-2 border-border hover:border-blue/50"
        />
      ) : (
        <div className="space-y-6">
          <div className="bg-surface-2 p-6 rounded-2xl border border-border shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-text">Options</h3>
              <span className="text-xs font-semibold bg-surface px-2 py-1 border border-border rounded-md text-text-4">
                {files.length} file(s) selected
              </span>
            </div>
            
            <div className="flex gap-2 p-1 bg-surface border border-border rounded-xl w-fit">
              <button 
                onClick={() => setMode('text')} 
                className={cn("px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2", mode === 'text' ? 'bg-blue text-white shadow-sm' : 'text-text-4 hover:text-text')}
              >
                <Type className="w-4 h-4" /> Text
              </button>
              <button 
                onClick={() => setMode('image')} 
                className={cn("px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2", mode === 'image' ? 'bg-blue text-white shadow-sm' : 'text-text-4 hover:text-text')}
              >
                <ImageIcon className="w-4 h-4" /> Image
              </button>
            </div>

            {mode === 'text' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-3">Watermark Text</label>
                  <input 
                    type="text" 
                    value={text} 
                    onChange={e => setText(e.target.value)} 
                    className="w-full bg-surface border border-border px-4 py-2.5 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-3">Color</label>
                  <div className="flex gap-2 items-center">
                    <input 
                      type="color" 
                      value={fontColor} 
                      onChange={e => setFontColor(e.target.value)} 
                      className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                    />
                    <span className="text-sm font-mono text-text-4">{fontColor}</span>
                  </div>
                </div>
                <SliderField id="fontSize" label="Font Size" value={fontSize} onChange={setFontSize} min={10} max={200} step={1} />
              </div>
            ) : (
              <div className="space-y-4">
                <label className="text-sm font-semibold text-text-3">Watermark Image (Logo/PNG)</label>
                <div className="border border-dashed border-border rounded-xl p-4 text-center hover:bg-surface transition-colors cursor-pointer relative">
                  <input type="file" accept="image/png,image/webp" onChange={e => handleWmFile(e.target.files as any)} className="absolute inset-0 opacity-0 cursor-pointer" />
                  {wmFile ? (
                    <div className="flex items-center justify-center gap-2 text-sm font-bold text-green">
                      <CheckCircle className="w-5 h-5" />
                      {wmFile.name}
                    </div>
                  ) : (
                    <div className="text-sm font-semibold text-text-4">Click or drop a transparent PNG here</div>
                  )}
                </div>
                <SliderField id="scaleImage" label="Scale Image" value={scale} onChange={setScale} min={10} max={300} step={5} />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-3">Position</label>
                <select value={position} onChange={e => setPosition(e.target.value)} className="w-full bg-surface border border-border px-4 py-2.5 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue appearance-none">
                  <option value="bottom-right">Bottom Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="top-right">Top Right</option>
                  <option value="top-left">Top Left</option>
                  <option value="center">Center</option>
                  <option value="tiled">Tiled (Repeat)</option>
                </select>
              </div>
              <SliderField id="opacity" label="Opacity" value={opacity} onChange={setOpacity} min={0} max={100} step={5} />
              <SliderField id="margin" label="Margin" value={margin} onChange={setMargin} min={0} max={200} step={5} />
            </div>

            <div className="flex gap-4 pt-4 border-t border-border">
              <button onClick={() => setFiles([])} className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-border hover:bg-surface transition-colors">
                Cancel
              </button>
              <button 
                onClick={processBatch}
                disabled={isProcessing}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-blue text-white shadow-md shadow-blue/20 hover:shadow-blue/40 transition-all ml-auto disabled:opacity-50"
              >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                Apply Watermark
              </button>
            </div>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="bg-surface-2 p-6 rounded-2xl border border-border shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-green flex items-center gap-2">
              <CheckCircle className="w-5 h-5" /> Successfully processed {results.length} file(s)
            </h3>
            <button onClick={handleDownloadAll} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-surface border border-border hover:bg-surface-2 transition-colors">
              <Download className="w-4 h-4" /> Download All
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {results.map((r, i) => (
              <div key={i} className="flex flex-col gap-2 p-2 bg-surface rounded-xl border border-border">
                <img src={r.url} alt={r.name} className="w-full aspect-square object-contain bg-surface-2 rounded-lg pattern-checkered" />
                <span className="text-[10px] font-mono truncate text-text-4 text-center">{r.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <AnimatePresence>
        {errorMsg && (
          <m.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 p-4 bg-error/10 border border-error/20 rounded-2xl text-error text-xs font-semibold"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}