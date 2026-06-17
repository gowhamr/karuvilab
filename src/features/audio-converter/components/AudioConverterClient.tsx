"use client";

import React, { useState, useMemo, useCallback } from "react";
import { MediaDropZone } from "@/components/ui/MediaDropZone";
import { MediaPreviewPlayer } from "@/components/ui/MediaPreviewPlayer";
import { MediaStatusBadge } from "@/components/system/MediaStatusBadge";
import { MediaErrorBanner } from "@/components/system/MediaErrorBanner";
import { MetricCard } from "@/components/ui/MetricCard";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { workerManager } from "@/src/workers/manager";
import { Music, Download, Settings, Loader2 } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";

type Format = "mp3" | "wav" | "aac" | "opus";

export default function AudioConverterClient() {
  const { createUrl } = useObjectUrlManager();
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<Format>("mp3");
  const [status, setStatus] = useState<"idle" | "processing" | "complete" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ url: string; size: number; name: string } | null>(null);
  const [error, setError] = useState<{ code: string; title: string; description: string } | null>(null);

  const handleFileSelect = (f: File) => {
    if (!f.type.startsWith("audio/")) {
      setError({
        code: "UNSUPPORTED_FORMAT",
        title: "Unsupported Format",
        description: "Please select a valid audio file."
      });
      return;
    }
    setFile(f);
    setAudioUrl(createUrl(f));
    setStatus("idle");
    setResult(null);
    setError(null);
  };

  const convertToWav = (audioBuffer: AudioBuffer): Blob => {
    const numOfChan = audioBuffer.numberOfChannels;
    const length = audioBuffer.length * numOfChan * 2 + 44;
    const buffer = new ArrayBuffer(length);
    const view = new DataView(buffer);
    const channels = [];
    let offset = 0;
    let pos = 0;

    const setUint16 = (data: number) => {
        view.setUint16(pos, data, true);
        pos += 2;
    };

    const setUint32 = (data: number) => {
        view.setUint32(pos, data, true);
        pos += 4;
    };

    setUint32(0x46464952);                         
    setUint32(length - 8);                         
    setUint32(0x45564157);                         
    setUint32(0x20746d66);                         
    setUint32(16);                                 
    setUint16(1);                                  
    setUint16(numOfChan);
    setUint32(audioBuffer.sampleRate);
    setUint32(audioBuffer.sampleRate * 2 * numOfChan); 
    setUint16(numOfChan * 2);                      
    setUint16(16);                                 
    setUint32(0x61746164);                         
    setUint32(length - pos - 4);                   

    for(let i=0; i<numOfChan; i++)
        channels.push(audioBuffer.getChannelData(i));

    while(pos < length) {
        for(let i=0; i<numOfChan; i++) {             
            let sample = Math.max(-1, Math.min(1, channels[i]![offset] || 0)); 
            sample = (sample < 0 ? sample * 0x8000 : sample * 0x7FFF);      
            view.setInt16(pos, sample, true);          
            pos += 2;
        }
        offset++;                                     
    }

    return new Blob([buffer], {type: "audio/wav"});
  };

  const handleConvert = async () => {
    if (!file) return;
    setStatus("processing");
    setProgress(5);

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const arrayBuffer = await file.arrayBuffer();
      setProgress(20);
      
      const decodedAudio = await audioCtx.decodeAudioData(arrayBuffer);
      if (!decodedAudio) throw new Error("Failed to decode audio data.");
      setProgress(40);

      let resultBlob: Blob;

      if (targetFormat === "wav") {
        resultBlob = convertToWav(decodedAudio);
      } else if (targetFormat === "mp3") {
        const left = decodedAudio.getChannelData(0);
        const right = decodedAudio.numberOfChannels > 1 ? decodedAudio.getChannelData(1) : null;
        
        const convertBuffer = (buffer: Float32Array) => {
          const int16 = new Int16Array(buffer.length);
          for (let i = 0; i < buffer.length; i++) {
            const s = Math.max(-1, Math.min(1, buffer[i]!));
            int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
          }
          return int16;
        };

        const leftInt = convertBuffer(left);
        const rightInt = right ? convertBuffer(right) : null;

        const mp3Bytes = await workerManager.encodeMp3(
          leftInt,
          rightInt,
          decodedAudio.sampleRate,
          (p) => setProgress(40 + p.percent * 0.6)
        );
        resultBlob = new Blob([mp3Bytes.buffer as ArrayBuffer], { type: "audio/mp3" });
      } else {
        throw new Error("Format not supported.");
      }

      const url = createUrl(resultBlob);
      setResult({
        url,
        size: resultBlob.size,
        name: (file?.name || "audio").replace(/\.[^.]+$/, "") + "." + targetFormat
      });
      setStatus("complete");
      setProgress(100);

    } catch (err: any) {
      console.error(err);
      setError({
        code: "PROCESSING_FAILED",
        title: "Conversion Failed",
        description: err.message || "Failed to process audio file."
      });
      setStatus("error");
    }
  };

  return (
    <div className="space-y-8">
      {!file ? (
        <MediaDropZone
          type="audio"
          accept="audio/*"
          onFileSelect={handleFileSelect}
          description="Convert audio between WAV and MP3 locally"
        />
      ) : (
        <m.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="bg-surface border border-border rounded-4xl p-8 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-3 text-blue">
                  <Music className="w-5 h-5" />
                  <h3 className="font-black text-sm uppercase tracking-widest">Source Audio</h3>
                </div>
                {audioUrl && <MediaPreviewPlayer type="audio" url={audioUrl} className="bg-bg border-none" />}
              </div>

              <div className="w-full md:w-80 space-y-6">
                <div className="flex items-center gap-3 text-blue">
                  <Settings className="w-5 h-5" />
                  <h3 className="font-black text-sm uppercase tracking-widest">Target Format</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {(["mp3", "wav"] as Format[]).map(f => (
                    <button
                      key={f}
                      onClick={() => setTargetFormat(f)}
                      className={`py-4 rounded-2xl text-tiny font-bold uppercase tracking-widest-sm transition-all ${
                        targetFormat === f 
                          ? "bg-blue text-white shadow-lg shadow-blue/20" 
                          : "bg-bg border border-border text-text-4 hover:border-blue/30"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleConvert}
              disabled={status === "processing"}
              className="w-full py-4 bg-blue text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {status === "processing" ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Converting {Math.round(progress)}%
                </>
              ) : (
                <>
                  <Download size={18} />
                  Convert to {targetFormat.toUpperCase()}
                </>
              )}
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <MediaErrorBanner
                title={error.title}
                description={error.description}
                errorCode={error.code}
                retryAction={handleConvert}
                changeFileAction={() => setFile(null)}
              />
            )}

            {result && (
              <m.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 bg-success/5 border border-success/20 rounded-4xl flex flex-col md:flex-row items-center justify-between gap-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-success/10 rounded-2xl flex items-center justify-center text-success text-sm font-black">
                    {targetFormat.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-widest text-text">Conversion Ready</h3>
                    <p className="text-xs font-bold text-text-4 uppercase">
                      {result.name} • {(result.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                </div>
                <a
                  href={result.url}
                  download={result.name}
                  className="w-full md:w-auto px-10 py-4 bg-success text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-success/20 hover:opacity-90 active:scale-95 transition-all text-center"
                >
                  Download Result
                </a>
              </m.div>
            )}
          </AnimatePresence>
        </m.div>
      )}
    </div>
  );
}
