'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { FileText, Copy, RefreshCw, Download, Layers, Text as TextIcon, AlignLeft } from 'lucide-react';
import { m } from 'framer-motion';
import { cn } from '@/src/lib/utils';
import { CopyButton } from '@/components/ui/CopyButton';
import { blobManager } from '@/src/lib/blob-manager';

type LoremUnit = 'words' | 'sentences' | 'paragraphs';
type LoremVariant = 'classic' | 'cicero' | 'random' | 'hipster' | 'tech';

interface LoremOptions {
  unit: LoremUnit;
  count: number;
  variant: LoremVariant;
  startWithLorem: boolean;
  includeHTML: boolean;
  minSentences: number;
  maxSentences: number;
}

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor',
  'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis',
  'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis',
  'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur',
  'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt',
  'mollit', 'anim', 'id', 'est', 'laborum'
];

const TECH_WORDS = [
  'api', 'async', 'boolean', 'cache', 'callback', 'class', 'cloud', 'commit', 'component', 'config', 'const', 'cors',
  'data', 'debug', 'deploy', 'docker', 'endpoint', 'error', 'event', 'fetch', 'function', 'git', 'hook', 'http',
  'index', 'interface', 'json', 'kernel', 'lambda', 'lint', 'middleware', 'module', 'network', 'node', 'object',
  'package', 'pipeline', 'query', 'react', 'redux', 'repository', 'request', 'response', 'router', 'schema',
  'server', 'state', 'stream', 'syntax', 'token', 'type', 'variable', 'webhook', 'worker', 'yield'
];

const HIPSTER_WORDS = [
  'artisan', 'authentic', 'beard', 'brooklyn', 'chia', 'craft', 'distillery', 'ethical', 'fixie', 'flannel',
  'gastropub', 'gluten', 'hashtag', 'helvetica', 'hoodie', 'irony', 'kombucha', 'locavore', 'lumbersexual',
  'meditation', 'microdosing', 'mustache', 'organic', 'paleo', 'plaid', 'quinoa', 'retro', 'sartorial', 'scenester',
  'shabby', 'sriracha', 'stumptown', 'synth', 'tattoo', 'taxidermy', 'tofu', 'typewriter', 'vegan', 'viral',
  'wayfarers', 'williamsburg', 'yolo'
];

const LOREM_START = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';

function getRandomWord(variant: LoremVariant): string {
  let pool = LOREM_WORDS;
  if (variant === 'tech') pool = TECH_WORDS;
  if (variant === 'hipster') pool = HIPSTER_WORDS;
  
  if (variant === 'random') {
    const all = [...LOREM_WORDS, ...TECH_WORDS, ...HIPSTER_WORDS];
    return all[Math.floor(Math.random() * all.length)]!;
  }
  
  return pool[Math.floor(Math.random() * pool.length)]!;
}

function generateWords(count: number, variant: LoremVariant): string {
  const words = [];
  for (let i = 0; i < count; i++) {
    words.push(getRandomWord(variant));
  }
  return words.join(' ');
}

function generateSentences(count: number, variant: LoremVariant, startWithLorem: boolean = false): string {
  const sentences = [];
  for (let i = 0; i < count; i++) {
    if (i === 0 && startWithLorem) {
      sentences.push(LOREM_START + '.');
      continue;
    }
    const wordCount = Math.floor(Math.random() * 10) + 5; // 5 to 15 words
    let sentence = generateWords(wordCount, variant);
    sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
    sentences.push(sentence);
  }
  return sentences.join(' ');
}

function generateParagraphs(options: LoremOptions): string {
  const paragraphs = [];
  for (let i = 0; i < options.count; i++) {
    const sentenceCount = Math.floor(Math.random() * (options.maxSentences - options.minSentences + 1)) + options.minSentences;
    const p = generateSentences(sentenceCount, options.variant, i === 0 && options.startWithLorem);
    paragraphs.push(options.includeHTML ? `<p>${p}</p>` : p);
  }
  return paragraphs.join(options.includeHTML ? '\\n\\n' : '\\n\\n');
}

function generateLorem(options: LoremOptions): string {
  if (options.unit === 'words') {
    let w = generateWords(options.count, options.variant);
    if (options.startWithLorem) w = LOREM_START.split(' ').slice(0, options.count).join(' ') + (options.count > 8 ? ' ' + generateWords(options.count - 8, options.variant) : '');
    return options.includeHTML ? `<p>${w}</p>` : w;
  }
  if (options.unit === 'sentences') {
    const s = generateSentences(options.count, options.variant, options.startWithLorem);
    return options.includeHTML ? `<p>${s}</p>` : s;
  }
  return generateParagraphs(options);
}

export default function LoremIpsumClient() {
  const [options, setOptions] = useState<LoremOptions>({
    unit: 'paragraphs',
    count: 3,
    variant: 'classic',
    startWithLorem: true,
    includeHTML: false,
    minSentences: 4,
    maxSentences: 8,
  });
  const [output, setOutput] = useState<string>('');
  const [seed, setSeed] = useState<number>(0);

  useEffect(() => {
    setOutput(generateLorem(options));
  }, [options, seed]);

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lorem-ipsum.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const wordCount = output.split(/\\s+/).filter(w => w.length > 0).length;
  const charCount = output.length;
  const sentenceCount = output.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const paragraphCount = output.split(/\\n\\n/).filter(p => p.trim().length > 0).length;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="bg-surface border border-border p-6 sm:p-8 rounded-4xl shadow-sm space-y-8">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-blue flex items-center gap-3">
          <FileText className="w-4 h-4" />
          Lorem Ipsum Generator
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-text-4">Unit</label>
              <div className="flex bg-bg border border-border rounded-xl p-1">
                {(['words', 'sentences', 'paragraphs'] as LoremUnit[]).map(u => (
                  <button
                    key={u}
                    onClick={() => setOptions({ ...options, unit: u })}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-xs font-bold transition-all capitalize",
                      options.unit === u ? "bg-surface text-text shadow-sm" : "text-text-4 hover:text-text-3"
                    )}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-text-4">Count</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={options.count}
                  onChange={(e) => setOptions({ ...options, count: Number(e.target.value) })}
                  className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer accent-blue"
                />
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={options.count}
                  onChange={(e) => setOptions({ ...options, count: Number(e.target.value) })}
                  className="w-20 bg-bg border border-border rounded-xl p-2 text-center text-sm font-bold text-text focus:ring-2 focus:ring-blue/20 outline-none"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-text-4">Variant</label>
              <div className="grid grid-cols-2 gap-2">
                {(['classic', 'tech', 'hipster', 'random'] as LoremVariant[]).map(v => (
                  <button
                    key={v}
                    onClick={() => setOptions({ ...options, variant: v })}
                    className={cn(
                      "px-4 py-2.5 rounded-xl text-xs font-bold transition-all capitalize border",
                      options.variant === v ? "bg-blue/10 border-blue text-blue" : "bg-bg border-border text-text-4 hover:text-text hover:border-blue/50"
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4 bg-bg border border-border rounded-2xl p-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={options.startWithLorem}
                  onChange={(e) => setOptions({ ...options, startWithLorem: e.target.checked })}
                  className="w-4 h-4 rounded text-blue focus:ring-blue/20 border-border"
                />
                <span className="text-sm font-medium text-text-2 group-hover:text-text">Start with "Lorem ipsum..."</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={options.includeHTML}
                  onChange={(e) => setOptions({ ...options, includeHTML: e.target.checked })}
                  className="w-4 h-4 rounded text-blue focus:ring-blue/20 border-border"
                />
                <span className="text-sm font-medium text-text-2 group-hover:text-text">Include &lt;p&gt; tags</span>
              </label>
            </div>

            {options.unit === 'paragraphs' && (
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-text-4">Sentences per Paragraph</label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={options.minSentences}
                    onChange={(e) => setOptions({ ...options, minSentences: Number(e.target.value) })}
                    className="w-full bg-bg border border-border rounded-xl p-2 text-center text-sm font-bold text-text focus:ring-2 focus:ring-blue/20 outline-none"
                    placeholder="Min"
                  />
                  <span className="text-text-4 font-bold">to</span>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={options.maxSentences}
                    onChange={(e) => setOptions({ ...options, maxSentences: Number(e.target.value) })}
                    className="w-full bg-bg border border-border rounded-xl p-2 text-center text-sm font-bold text-text focus:ring-2 focus:ring-blue/20 outline-none"
                    placeholder="Max"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border p-6 sm:p-8 rounded-4xl shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-text-4">
            <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> {paragraphCount} Paragraphs</span>
            <span className="flex items-center gap-1.5"><AlignLeft className="w-3.5 h-3.5" /> {sentenceCount} Sentences</span>
            <span className="flex items-center gap-1.5"><TextIcon className="w-3.5 h-3.5" /> {wordCount} Words</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSeed(s => s + 1)}
              className="p-2.5 bg-bg border border-border text-text-3 hover:text-blue hover:border-blue/30 rounded-xl transition-all"
              title="Regenerate"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2.5 bg-bg border border-border text-text-3 hover:text-blue hover:border-blue/30 rounded-xl transition-all"
              title="Download .txt"
            >
              <Download className="w-4 h-4" />
            </button>
            <CopyButton text={output} />
          </div>
        </div>

        <textarea
          readOnly
          value={output}
          className="w-full h-96 bg-bg border border-border rounded-2xl p-6 font-mono text-sm text-text outline-none resize-y leading-relaxed"
        />
      </div>
    </div>
  );
}
