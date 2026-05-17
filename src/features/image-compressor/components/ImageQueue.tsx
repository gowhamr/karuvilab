import React from 'react';
import { useImageCompressStore, ImageItem } from '../hooks/useImageCompressStore';
import { formatSize, getReduction } from '../utils/image-compression-utils';
import { X, CircleCheck, CircleAlert, Loader2, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ImageQueue: React.FC = () => {
  const { items, removeFile } = useImageCompressStore();

  if (items.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xs font-black uppercase tracking-widest text-text-4">
          Queue • {items.length} Images
        </h3>
      </div>

      <div className="grid gap-3">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-surface border border-border p-4 rounded-2xl flex items-center gap-4 relative overflow-hidden"
            >
              {/* Progress Background */}
              {item.status === 'processing' && (
                <div 
                  className="absolute inset-0 bg-blue/5 transition-all duration-300"
                  style={{ width: `${item.progress}%` }}
                />
              )}

              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-bg border border-border flex-shrink-0 relative z-10">
                <img src={item.previewUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 relative z-10">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-[10px] font-black uppercase truncate pr-4">{item.file.name}</h4>
                  <button 
                    onClick={() => removeFile(item.id)}
                    className="text-text-4 hover:text-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="flex items-center gap-3 text-[9px] font-bold text-text-4 uppercase">
                  <span>{formatSize(item.originalSize)}</span>
                  {item.compressedSize && (
                    <>
                      <span className="text-text-2">→</span>
                      <span className="text-blue">{formatSize(item.compressedSize)}</span>
                      <span className="bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded-md">
                        -{getReduction(item.originalSize, item.compressedSize)}
                      </span>
                    </>
                  )}
                </div>

                {/* Status/Progress */}
                <div className="mt-2 flex items-center gap-2">
                  {item.status === 'processing' && (
                    <div className="flex-1 h-1 bg-bg rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}
                  {item.status === 'completed' && (
                    <div className="flex items-center gap-1 text-green-600 text-[9px] font-black uppercase">
                      <CircleCheck size={10} />
                      Completed
                    </div>
                  )}
                  {item.status === 'error' && (
                    <div className="flex items-center gap-1 text-red-500 text-[9px] font-black uppercase">
                      <CircleAlert size={10} />
                      Error
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              {item.status === 'completed' && item.compressedUrl && (
                <a 
                  href={item.compressedUrl} 
                  download={`compressed-${item.file.name}`}
                  className="w-10 h-10 rounded-xl bg-blue/10 text-blue flex items-center justify-center hover:bg-blue hover:text-white transition-all relative z-10"
                >
                  <Download size={16} />
                </a>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
