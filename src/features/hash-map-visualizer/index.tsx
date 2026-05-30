"use client";

import React, { useState } from 'react';
import { ToolInput } from '@/components/ui/ToolInput';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Info, ChevronRight, BookOpen } from 'lucide-react';

interface Entry {
  key: string;
  value: string;
  hash: number;
}

const BUCKET_COUNT = 8;

export default function HashMapVisualizer() {
  const [buckets, setBuckets] = useState<Entry[][]>(Array.from({ length: BUCKET_COUNT }, () => []));
  const [keyInput, setKeyInput] = useState('');
  const [valInput, setValInput] = useState('');
  const [lastAction, setLastAction] = useState<{ type: string; key: string; bucket: number; hash: number } | null>(null);

  const simpleHash = (s: string) => {
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
      hash = (hash << 5) - hash + s.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  };

  const handleInsert = () => {
    if (!keyInput) return;
    const hash = simpleHash(keyInput);
    const bucketIdx = hash % BUCKET_COUNT;
    
    setBuckets(prev => {
      const newBuckets = [...prev];
      const bucket = newBuckets[bucketIdx];
      if (!bucket) return prev;
      
      const existingIdx = bucket.findIndex(e => e.key === keyInput);
      if (existingIdx >= 0) {
        bucket[existingIdx] = { key: keyInput, value: valInput, hash };
      } else {
        newBuckets[bucketIdx] = [...bucket, { key: keyInput, value: valInput, hash }];
      }
      return newBuckets;
    });

    setLastAction({ type: 'insert', key: keyInput, bucket: bucketIdx, hash });
    setKeyInput('');
    setValInput('');
  };

  const handleDelete = (key: string) => {
    const hash = simpleHash(key);
    const bucketIdx = hash % BUCKET_COUNT;
    
    setBuckets(prev => {
      const newBuckets = [...prev];
      const bucket = newBuckets[bucketIdx];
      if (bucket) {
        newBuckets[bucketIdx] = bucket.filter(e => e.key !== key);
      }
      return newBuckets;
    });
    setLastAction({ type: 'delete', key, bucket: bucketIdx, hash });
  };

  return (
    <div className="space-y-8">
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <ToolInput
            label="Key"
            value={keyInput}
            onChange={setKeyInput}
            placeholder="e.g. username"
          />
          <ToolInput
            label="Value"
            value={valInput}
            onChange={setValInput}
            placeholder="e.g. jdoe123"
          />
          <button
            onClick={handleInsert}
            disabled={!keyInput}
            className="h-12 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Insert
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {lastAction && (
          <motion.div
            key={`${lastAction.type}-${lastAction.key}-${Date.now()}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex items-center gap-3 text-sm bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 p-4 rounded-2xl"
          >
            <Info className="w-4 h-4 flex-shrink-0" />
            <span>
              {lastAction.type === 'insert' ? 'Inserted' : 'Deleted'} 
              <strong> "{lastAction.key}"</strong>. 
              Hash: <code className="bg-indigo-500/20 px-1 rounded">{lastAction.hash}</code> → 
              Bucket: <code className="bg-indigo-500/20 px-1 rounded">{lastAction.bucket}</code> 
              (Hash % {BUCKET_COUNT})
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {buckets.map((bucket, i) => (
          <div 
            key={i} 
            className={`flex flex-col border-2 rounded-2xl min-h-[160px] transition-colors ${
              lastAction?.bucket === i ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-800 bg-slate-900/30'
            }`}
          >
            <div className="p-3 border-b border-slate-800 flex justify-between items-center bg-slate-800/50 rounded-t-[14px]">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">Bucket {i}</span>
              <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded-full">{bucket?.length || 0}</span>
            </div>
            <div className="p-2 space-y-2 flex-grow">
              <AnimatePresence>
                {bucket && bucket.length > 0 ? (
                  bucket.map((entry) => (
                    <motion.div
                      key={entry.key}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="bg-slate-800 border border-slate-700 p-2 rounded-xl group relative overflow-hidden"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-mono text-indigo-400 truncate">{entry.key}</p>
                          <p className="text-sm text-slate-200 truncate">{entry.value}</p>
                        </div>
                        <button 
                          onClick={() => handleDelete(entry.key)}
                          className="text-slate-500 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center py-8 opacity-20 italic text-xs text-slate-500">
                    Empty
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-slate-900/30 border border-slate-800 rounded-3xl">
        <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          How it works
        </h4>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-400">
          <li className="flex gap-2">
            <ChevronRight className="w-3 h-3 text-indigo-500 flex-shrink-0 mt-0.5" />
            <span><strong>Hashing:</strong> The key is passed through a hash function to generate a large integer.</span>
          </li>
          <li className="flex gap-2">
            <ChevronRight className="w-3 h-3 text-indigo-500 flex-shrink-0 mt-0.5" />
            <span><strong>Bucketing:</strong> We take <code>hash % bucket_count</code> to find where to store the entry.</span>
          </li>
          <li className="flex gap-2">
            <ChevronRight className="w-3 h-3 text-indigo-500 flex-shrink-0 mt-0.5" />
            <span><strong>Collision:</strong> When two keys end up in the same bucket, we use "Separate Chaining" (adding to a list).</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
