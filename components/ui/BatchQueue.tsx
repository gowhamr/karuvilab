"use client";

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  File, 
  Trash2, 
  Play, 
  XCircle, 
  CircleCheckBig as CheckCircle2, 
  CircleAlert as AlertCircle, 
  Download, 
  Archive, 
  LoaderCircle as Loader2,
  X,
  RefreshCw,
  Clock
} from 'lucide-react';
import { BatchItem, useBatchStore } from '@/src/store/useBatchStore';
import { useWorkflowStore, WorkflowItem } from '@/src/store/useWorkflowStore';
import { findToolById, DataType } from '@/src/tool-registry';
import { WorkflowSuggestions } from './WorkflowSuggestions';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BatchQueueProps {
  toolId: string;
  onDownload: (item: BatchItem) => void;
  onDownloadAll?: () => void;
  onProcess: () => Promise<void>;
  isProcessing: boolean;
}

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function BatchQueue({ toolId, onDownload, onDownloadAll, onProcess, isProcessing }: BatchQueueProps) {
  const allItems = useBatchStore(state => state.items);
  const removeItem = useBatchStore(state => state.removeItem);
  const clearItems = useBatchStore(state => state.clearItems);
  const clearCompletedItems = useBatchStore(state => state.clearCompletedItems);
  const cancelItem = useBatchStore(state => state.cancelItem);
  const cancelAll = useBatchStore(state => state.cancelAll);

  const setActiveItems = useWorkflowStore(state => state.setActiveItems);
  const addToChain = useWorkflowStore(state => state.addToChain);
  
  const items = allItems[toolId] || [];

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

  // Sync with workflow store when processing finishes
  useEffect(() => {
    if (stats.completed > 0 && !isProcessing) {
      const tool = findToolById(toolId);
      const outputType = (Array.isArray(tool?.output) ? tool?.output[0] : tool?.output) || 'any-file';
      
      const workflowItems: WorkflowItem[] = items
        .filter(i => i.status === 'completed' && i.result)
        .map(i => ({
          blob: i.result!.blob,
          name: i.result!.name,
          type: outputType as DataType
        }));
      
      if (workflowItems.length > 0) {
        setActiveItems(workflowItems);
        addToChain(toolId);
      }
    }
  }, [stats.completed, isProcessing, toolId, items, setActiveItems, addToChain]);

  if (items.length === 0) return null;

  return (
    <div className="space-y-6" role="region" aria-label="Processing Queue">
      {/* Header / Stats */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 left-0 h-1 bg-blue transition-all duration-500" 
             style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
             role="progressbar"
             aria-valuenow={stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}
             aria-valuemin={0}
             aria-valuemax={100}
             aria-label="Overall batch progress" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h3 className="font-black text-xl flex items-center gap-2">
              Queue <span className="text-sm font-medium text-text-4 bg-bg px-2 py-0.5 rounded-full">{stats.total} files</span>
            </h3>
            <div className="flex flex-wrap gap-4 text-xs font-medium text-text-3" aria-label="Queue statistics">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-green-500" aria-hidden="true" /> {stats.completed} Done</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-blue" aria-hidden="true" /> {stats.pending + stats.processing} Pending</span>
              {stats.failed > 0 && <span className="flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5 text-red-500" aria-hidden="true" /> {stats.failed} Failed</span>}
              {stats.saved > 0 && <span className="text-green-500 font-bold">Saved {formatBytes(stats.saved)}</span>}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto" role="toolbar" aria-label="Queue actions">
            {!isProcessing ? (
              <>
                <button 
                  onClick={onProcess}
                  disabled={stats.pending + stats.failed === 0}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-blue text-white font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-blue/20 outline-none"
                  aria-label="Process all files in queue"
                >
                  <Play className="w-4 h-4 fill-current" aria-hidden="true" /> Process All
                </button>
                {onDownloadAll && stats.completed > 0 && (
                  <button 
                    onClick={onDownloadAll}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-bg border border-border text-text font-bold rounded-xl hover:border-blue transition-all text-sm focus-visible:ring-2 focus-visible:ring-blue/20 outline-none"
                    aria-label="Download all completed files as ZIP"
                  >
                    <Download className="w-4 h-4" aria-hidden="true" /> Download ZIP
                  </button>
                )}
                {stats.completed > 0 && (
                  <button 
                    onClick={() => clearCompletedItems(toolId)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-bg border border-border text-text-4 font-bold rounded-xl hover:text-text hover:border-border/80 transition-all text-sm focus-visible:ring-2 focus-visible:ring-border/50 outline-none"
                    aria-label="Clear completed files from queue"
                  >
                    Clear Done
                  </button>
                )}
                <button 
                  onClick={() => clearItems(toolId)}
                  className="p-2.5 text-text-4 hover:text-red-500 transition-colors focus-visible:ring-2 focus-visible:ring-red-500/20 outline-none rounded-lg"
                  title="Clear Queue"
                  aria-label="Clear entire queue"
                >
                  <Trash2 className="w-5 h-5" aria-hidden="true" />
                </button>
              </>
            ) : (
              <button 
                onClick={() => cancelAll(toolId)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-red-500/10 text-red-500 font-bold rounded-xl hover:bg-red-500/20 transition-all text-sm border border-red-500/20 focus-visible:ring-2 focus-visible:ring-red-500/20 outline-none"
                aria-label="Cancel all processing"
              >
                <XCircle className="w-4 h-4" aria-hidden="true" /> Cancel All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="grid gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar" role="list" aria-label="Queue items">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.div
              key={item.id}
              role="listitem"
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "group bg-surface border rounded-2xl p-4 flex items-center gap-4 transition-all",
                item.status === 'completed' ? "border-green-500/20 bg-green-500/[0.02]" : "border-border",
                item.status === 'failed' ? "border-red-500/20 bg-red-500/[0.02]" : "",
                item.status === 'processing' ? "border-blue/20 ring-1 ring-blue/10" : ""
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0",
                item.status === 'completed' ? "bg-green-500/10 text-green-500" : 
                item.status === 'failed' ? "bg-red-500/10 text-red-500" : "bg-bg text-text-4"
              )} aria-hidden="true">
                {item.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> :
                 item.status === 'failed' ? <AlertCircle className="w-6 h-6" /> :
                 item.status === 'processing' ? <Loader2 className="w-6 h-6 animate-spin text-blue" /> :
                 <File className="w-6 h-6" />}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold truncate text-sm">{item.file.name}</p>
                  <span className="text-[10px] font-black uppercase tracking-wider text-text-4 whitespace-nowrap">
                    {formatBytes(item.file.size)}
                  </span>
                </div>
                
                {/* Progress / Info */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-bg rounded-full overflow-hidden">
                    <motion.div 
                      role="progressbar"
                      aria-valuenow={item.progress || (item.status === 'completed' ? 100 : 0)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Processing progress for ${item.file.name}`}
                      className={cn(
                        "h-full transition-all duration-300",
                        item.status === 'completed' ? "bg-green-500" :
                        item.status === 'failed' ? "bg-red-500" :
                        item.status === 'cancelled' ? "bg-text-4" : "bg-blue"
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress || (item.status === 'completed' ? 100 : 0)}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-text-3 w-8 text-right" aria-hidden="true">
                    {item.status === 'completed' ? '100%' : 
                     item.status === 'processing' ? `${Math.round(item.progress)}%` : 
                     item.status === 'pending' ? '0%' : '-'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <p className={cn(
                    "text-[10px] font-medium truncate",
                    item.status === 'failed' ? "text-red-500" : "text-text-4"
                  )}>
                    {item.message || (item.status === 'pending' ? 'Waiting...' : '')}
                    {item.status === 'completed' && item.result && (
                      <span className="text-green-500 font-bold ml-2">
                        → {formatBytes(item.result.compressedSize)} ({Math.round((1 - item.result.compressedSize / item.file.size) * 100)}% smaller)
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.status === 'completed' && (
                  <button 
                    onClick={() => onDownload(item)}
                    className="p-2 text-blue hover:bg-blue/10 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-blue/20 outline-none"
                    title="Download"
                    aria-label={`Download ${item.file.name}`}
                  >
                    <Download className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
                {item.status === 'failed' && (
                  <button 
                    onClick={() => useBatchStore.getState().updateItem(toolId, item.id, { status: 'pending', progress: 0, error: undefined })}
                    className="p-2 text-blue hover:bg-blue/10 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-blue/20 outline-none"
                    title="Retry"
                    aria-label={`Retry ${item.file.name}`}
                  >
                    <RefreshCw className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
                {(item.status === 'processing' || item.status === 'pending') && (
                  <button 
                    onClick={() => cancelItem(toolId, item.id)}
                    className="p-2 text-text-4 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-red-500/20 outline-none"
                    title="Cancel"
                    aria-label={`Cancel processing for ${item.file.name}`}
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
                <button 
                  onClick={() => removeItem(toolId, item.id)}
                  disabled={item.status === 'processing'}
                  className="p-2 text-text-4 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-20 focus-visible:ring-2 focus-visible:ring-red-500/20 outline-none"
                  title="Remove"
                  aria-label={`Remove ${item.file.name} from queue`}
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {stats.completed > 0 && !isProcessing && (
        <WorkflowSuggestions />
      )}
    </div>
  );
}
