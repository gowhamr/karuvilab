"use client";

import React, { useMemo, useEffect, memo } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { 
  File, 
  Trash2, 
  Play, 
  XCircle, 
  CircleCheckBig as CheckCircle2, 
  CircleAlert as AlertCircle, 
  Download, 
  X,
  Clock,
  Inbox,
  RotateCcw
} from 'lucide-react';
import { BatchItem, useBatchStore } from '@/src/store/useBatchStore';
import { StatusBadge } from '@/components/system/StatusBadge';
import { cn } from '@/src/lib/utils';
import { useContextualActionBar } from '@/src/store/useContextualActionBar';
import { EmptyState } from '@/components/ui/EmptyState';


interface BatchQueueProps {
  toolId: string;
  onDownload: (item: BatchItem) => void;
  onDownloadAll?: (() => void) | undefined;
  onProcess: () => Promise<void>;
  isProcessing: boolean;
  processLabel?: string;
  renderThumbnail?: ((item: BatchItem) => React.ReactNode) | undefined;
}

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const EMPTY_ARRAY: any[] = [];

const BatchQueueItemComponent = memo(({ item, toolId, renderThumbnail, onDownload, removeItem, cancelItem }: any) => {
  return (
    <m.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group bg-surface-2 border rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 transition-all relative",
        item.status === 'completed' ? "border-green-500/10" : "border-border hover:border-blue/30",
        item.status === 'failed' ? "border-red-500/30 border-l-4 border-l-red-500" : ""
      )}
    >
      <div className="flex items-start sm:items-center gap-3 sm:gap-4 w-full flex-1 min-w-0">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-xl flex-shrink-0 bg-bg border border-border shadow-inner overflow-hidden">
          {renderThumbnail ? renderThumbnail(item) : (
            <File className={cn("w-5 h-5 sm:w-6 sm:h-6", 
              item.status === 'completed' ? "text-green-500" : 
              item.status === 'failed' ? "text-red-500" : "text-text-4"
            )} />
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <p className="font-bold truncate text-xs sm:text-sm text-text tracking-tight">{item.file.name}</p>
            <StatusBadge status={item.status as any} />
          </div>
          
          {/* Progress Bar (E-002) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex-1 h-1.5 bg-bg rounded-full overflow-hidden shadow-inner">
              <m.div 
                initial={{ width: 0 }}
                animate={{ width: `${item.progress || (item.status === 'completed' ? 100 : 0)}%` }}
                className={cn(
                  "h-full transition-all duration-300",
                  item.status === 'completed' ? "bg-green-500" :
                  item.status === 'failed' ? "bg-red-500" :
                  "bg-blue"
                )}
                style={{ width: `${item.progress || (item.status === 'completed' ? 100 : 0)}%` }}
              />
            </div>
            <span className="text-[10px] sm:text-xs font-black font-mono text-text-4 w-8 sm:w-10 text-right">
              {item.status === 'completed' ? '100%' : `${Math.round(item.progress)}%`}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[10px] sm:text-xs font-medium text-text-4 uppercase tracking-widest">
            <span className="truncate">{formatBytes(item.file.size)}</span>
            {item.status === 'completed' && item.result && (
              <span className="text-green-500 font-black truncate">
                → {formatBytes(item.result.compressedSize)} <span className="hidden sm:inline">({Math.round((1 - item.result.compressedSize / item.file.size) * 100)}% Small)</span>
              </span>
            )}
            {item.status === 'failed' && (
              <button 
                onClick={() => useBatchStore.getState().updateItem(toolId, item.id, { status: 'pending', progress: 0, error: undefined })}
                className="text-blue font-black hover:underline underline-offset-4"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Context Actions (Fades in on hover) */}
      <div className="flex items-center justify-end gap-1 mt-1 sm:mt-0 w-full sm:w-auto opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100 transition-all duration-200 border-t sm:border-none border-border pt-2 sm:pt-0">
        {item.status === 'completed' && (
          <>
            <button 
              onClick={() => useBatchStore.getState().reprocessItem(toolId, item.id)}
              className="flex-1 sm:flex-none p-2 sm:p-2 flex items-center justify-center text-text hover:text-blue hover:bg-blue/10 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-blue transition-colors bg-surface sm:bg-transparent border sm:border-none border-border"
              aria-label={`Reprocess ${item.file.name}`}
              title="Use output as new input"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onDownload(item)}
              className="flex-1 sm:flex-none p-2 sm:p-2 flex items-center justify-center text-blue hover:bg-blue/10 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-blue transition-colors bg-blue/5 sm:bg-transparent border sm:border-none border-blue/20"
              aria-label={`Download ${item.file.name}`}
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
          </>
        )}
        {(item.status === 'processing' || item.status === 'pending') && (
          <button 
            onClick={() => cancelItem(toolId, item.id)}
            className="flex-1 sm:flex-none p-2 sm:p-2 flex items-center justify-center text-text-4 hover:text-red-500 hover:bg-red-500/5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-red-500 bg-surface sm:bg-transparent border sm:border-none border-border"
            aria-label={`Cancel ${item.file.name}`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button 
          onClick={() => removeItem(toolId, item.id)}
          disabled={item.status === 'processing'}
          className="flex-1 sm:flex-none p-2 sm:p-2 flex items-center justify-center text-text-4 hover:text-red-500 hover:bg-red-500/5 rounded-lg disabled:opacity-10 transition-colors bg-surface sm:bg-transparent border sm:border-none border-border"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </m.div>
  );
});

export function BatchQueue({ toolId, onDownload, onDownloadAll, onProcess, isProcessing, processLabel = 'Execute All', renderThumbnail }: BatchQueueProps) {
  const items = useBatchStore(state => state.items[toolId] || EMPTY_ARRAY);
  const removeItem = useBatchStore(state => state.removeItem);
  const clearItems = useBatchStore(state => state.clearItems);
  const clearCompletedItems = useBatchStore(state => state.clearCompletedItems);
  const cancelItem = useBatchStore(state => state.cancelItem);
  const cancelAll = useBatchStore(state => state.cancelAll);

  const stats = useMemo(() => {
    const total = items.length;
    const completed = items.filter(i => i.status === 'completed').length;
    const failed = items.filter(i => i.status === 'failed').length;
    const processing = items.filter(i => i.status === 'processing').length;
    const pending = items.filter(i => i.status === 'pending').length;
    
    const originalSize = items.reduce((acc, i) => acc + i.file.size, 0);
    const resultSize = items.reduce((acc, i) => acc + (i.result?.compressedSize || 0), 0);
    const saved = originalSize > 0 && resultSize > 0 ? originalSize - resultSize : 0;
    
    return { total, completed, failed, processing, pending, originalSize, resultSize, saved };
  }, [items]);

  const setBarConfig = useContextualActionBar(s => s.setBarConfig);
  const hideBar = useContextualActionBar(s => s.hide);

  const overallProgress = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
  const allCompleted = stats.total > 0 && stats.completed === stats.total;

  useEffect(() => {
    if (items.length === 0) {
      hideBar();
      return;
    }

    if (isProcessing) {
      setBarConfig({
        type: "processing",
        progress: overallProgress,
        label: `Processing ${stats.processing + stats.pending} files...`,
        onCancel: () => cancelAll(toolId),
      });
    } else if (allCompleted) {
      setBarConfig({
        type: "done",
        primaryLabel: onDownloadAll ? "Bundle .ZIP" : "Clear Queue",
        onPrimaryClick: onDownloadAll || (() => clearItems(toolId)),
        secondaryLabel: onDownloadAll ? "Clear" : undefined,
        onSecondaryClick: onDownloadAll ? (() => clearItems(toolId)) : undefined,
      });
    } else {
      setBarConfig({
        type: "idle",
        label: processLabel,
        onClick: onProcess,
      });
    }

    return () => {
      hideBar();
    };
  }, [
    items.length,
    isProcessing,
    overallProgress,
    stats.processing,
    stats.pending,
    allCompleted,
    onDownloadAll,
    onProcess,
    toolId,
    cancelAll,
    clearItems,
    setBarConfig,
    hideBar
  ]);

  if (items.length === 0) return (
    <EmptyState
      icon={Inbox}
      headline="Queue is empty"
      toolType="batch"
      toolId={toolId as any}
      onDrop={() => {}}
      dragState="idle"
      subAction={{ label: "Upload files to begin batch processing", onClick: () => {} }}
    />
  );

  return (
    <div className="space-y-6" role="region" aria-label="Processing Queue">
      {/* Header / Master Stats */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden">
        {/* Master Progress Track (E-002) */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-surface-2 overflow-hidden">
          <m.div 
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={cn(
              "h-full bg-gradient-to-r from-blue to-blue-light transition-all",
              isProcessing && "animate-pulse"
            )}
            style={{ width: `${overallProgress}%` }}
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-1">
          <div className="space-y-1.5">
            <h3 className="font-black text-2xl flex items-center gap-3 tracking-tight">
              Process Queue 
              <span className="text-xs font-black text-blue bg-blue/10 border border-blue/20 px-2.5 py-1 rounded-full uppercase tracking-widest">
                {stats.total} Files
              </span>
            </h3>
            <div className="flex flex-wrap gap-4 text-tiny font-bold uppercase tracking-widest-sm-md text-text-4" role="status" aria-live="polite">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-green-500" /> {stats.completed} Complete</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-blue" /> {stats.pending + stats.processing} Active</span>
              {stats.failed > 0 && <span className="flex items-center gap-1.5 text-red-500"><AlertCircle className="w-3 h-3" /> {stats.failed} Errors</span>}
              {stats.saved > 0 && <span className="text-green-500 font-black">Saved {formatBytes(stats.saved)}</span>}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {!isProcessing ? (
              <>
                <button 
                  onClick={onProcess}
                  disabled={isProcessing || stats.pending + stats.failed === 0}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-blue text-white font-black rounded-xl hover:shadow-md hover:shadow-blue/10 active:scale-95 transition-all text-xs uppercase tracking-widest disabled:opacity-30 outline-none focus-visible:ring-2 focus-visible:ring-blue"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> {processLabel}
                </button>
                {onDownloadAll && stats.completed > 0 && (
                  <button 
                    onClick={onDownloadAll}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-bg border border-border text-text font-black rounded-xl hover:border-blue transition-all text-xs uppercase tracking-widest outline-none focus-visible:ring-2 focus-visible:ring-blue"
                  >
                    <Download className="w-3.5 h-3.5" /> Bundle .ZIP
                  </button>
                )}
                <button 
                  onClick={() => clearItems(toolId)}
                  className="p-3 text-text-4 hover:text-red-500 transition-colors outline-none rounded-xl hover:bg-red-500/5"
                  aria-label="Clear Queue"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button 
                onClick={() => cancelAll(toolId)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-red-500/10 text-red-500 font-black rounded-xl hover:bg-red-500/20 transition-all text-xs uppercase tracking-widest border border-red-500/20 outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                <XCircle className="w-3.5 h-3.5" /> Halt Processing
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Staggered List */}
      <div className="grid gap-3 max-h-full overflow-y-auto pr-2 custom-scrollbar-thin" role="list">
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((item, index) => (
            <BatchQueueItemComponent 
              key={item.id} 
              item={item} 
              toolId={toolId} 
              renderThumbnail={renderThumbnail} 
              onDownload={onDownload} 
              removeItem={removeItem} 
              cancelItem={cancelItem} 
            />
          ))}
        </AnimatePresence>
      </div>



      <style jsx global>{`
        .custom-scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar-thin::-webkit-scrollbar-thumb {
          background: var(--kv-border);
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
