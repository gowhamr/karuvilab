"use client";

import React from 'react';
import { useImageCompressStore } from '../store';
import { formatSize, getReduction } from '../utils';
import { X, CheckCircle2, AlertCircle, Download, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ImageQueue: React.FC = () => {
  const items = useImageCompressStore(state => state.items);
  const removeFile = useImageCompressStore(state => state.removeFile);
  const compressItem = useImageCompressStore(state => state.compressItem);

  if (items.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-text-4">
          Queue • {items.length} Images
        </h2>
      </div>

      <div className="grid gap-3">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group bg-surface border border-border p-4 rounded-2xl flex items-center gap-4 relative overflow-hidden"
            >
              {/* Progress Bar Background */}
              {item.status === 'processing' && (
                <div 
                  className="absolute inset-0 bg-blue/5 transition-all duration-300"
                  style={{ width: `${item.progress}%` }}
                />
              )}

              {/* Thumbnail */}
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-bg border border-border shrink-0 relative z-10 flex items-center justify-center text-text-4">
                {item.previewUrl ? (
                  <img src={item.previewUrl} alt={`Preview of ${item.file.name}`} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={24} aria-hidden="true" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 relative z-10">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black uppercase truncate pr-4">{item.file.name}</span>
                  <button 
                    onClick={() => removeFile(item.id)}
                    aria-label="Remove file"
                    className="text-text-4 hover:text-red-500 transition-colors"
                  >
                    <X size={14} aria-hidden="true" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-[9px] font-bold text-text-4 uppercase">
                  <span>{formatSize(item.originalSize)}</span>
                  {item.compressedSize && (
                    <>
                      <span className="text-text-2">→</span>
                      <span className="text-blue">{formatSize(item.compressedSize)}</span>
                      <span 
                        aria-live="polite" 
                        aria-atomic="true"
                        className="bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded-md"
                      >
                        -{getReduction(item.originalSize, item.compressedSize)}
                      </span>
                    </>
                  )}
                </div>

                {/* Status Indicator */}
                <div className="mt-2">
                  {item.status === 'processing' && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-bg rounded-full overflow-hidden">
                        <div className="h-full bg-blue transition-all duration-300" style={{ width: `${item.progress}%` }} />
                      </div>
                      <span className="text-[8px] font-black text-blue">{item.progress}%</span>
                    </div>
                  )}
                  {item.status === 'completed' && (
                    <div className="flex items-center gap-1 text-green-600 text-[8px] font-black uppercase">
                      <CheckCircle2 size={10} aria-hidden="true" />
                      Ready
                    </div>
                  )}
                  {item.status === 'error' && (
                    <div className="flex items-center gap-1 text-red-500 text-[8px] font-black uppercase">
                      <AlertCircle size={10} aria-hidden="true" />
                      Failed
                    </div>
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="relative z-10">
                {item.status === 'completed' ? (
                  <a 
                    href={item.compressedUrl!} 
                    download={`compressed-${item.file.name}`}
                    aria-label="Download compressed image"
                    className="w-10 h-10 rounded-xl bg-blue/10 text-blue flex items-center justify-center hover:bg-blue hover:text-white transition-all shadow-sm"
                  >
                    <Download size={16} aria-hidden="true" />
                  </a>
                ) : (
                  <button
                    onClick={() => compressItem(item.id)}
                    disabled={item.status === 'processing'}
                    aria-label="Compress image"
                    className="w-10 h-10 rounded-xl bg-surface border border-border text-text-3 flex items-center justify-center hover:border-blue hover:text-blue transition-all"
                  >
                    <RefreshCw size={16} className={item.status === 'processing' ? 'animate-spin' : ''} aria-hidden="true" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
