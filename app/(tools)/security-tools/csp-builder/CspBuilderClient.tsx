'use client';

import React, { useState, useMemo } from 'react';
import { Shield, Copy, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { cn } from '@/src/lib/utils';
import { CopyButton } from '@/components/ui/CopyButton';

type CSPDirective = 'default-src' | 'script-src' | 'style-src' | 'img-src' | 'font-src' | 'connect-src';

const COMMON_SOURCES = ["'self'", "'none'", "'unsafe-inline'", "'unsafe-eval'", "https:", "data:"];

interface CSPConfig {
  directives: Record<CSPDirective, string[]>;
  reportOnly: boolean;
}

const DEFAULT_CONFIG: CSPConfig = {
  directives: {
    'default-src': ["'self'"],
    'script-src': ["'self'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", "data:", "https:"],
    'font-src': ["'self'"],
    'connect-src': ["'self'"]
  },
  reportOnly: false
};

const PRESETS = {
  Strict: {
    'default-src': ["'none'"],
    'script-src': ["'self'"],
    'style-src': ["'self'"],
    'img-src': ["'self'"],
    'font-src': ["'self'"],
    'connect-src': ["'self'"]
  },
  Standard: {
    'default-src': ["'self'"],
    'script-src': ["'self'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", "data:", "https:"],
    'font-src': ["'self'", "data:"],
    'connect-src': ["'self'"]
  }
};

function buildCSPString(config: CSPConfig): string {
  const parts = [];
  for (const [directive, sources] of Object.entries(config.directives)) {
    if (sources.length > 0) {
      parts.push(`${directive} ${sources.join(' ')}`);
    }
  }
  return parts.join('; ');
}

export default function CspBuilderClient() {
  const [config, setConfig] = useState<CSPConfig>(DEFAULT_CONFIG);
  const [customInputs, setCustomInputs] = useState<Record<CSPDirective, string>>({
    'default-src': '', 'script-src': '', 'style-src': '', 'img-src': '', 'font-src': '', 'connect-src': ''
  });
  const [activeTab, setActiveTab] = useState<'header' | 'meta' | 'nginx'>('header');

  const cspString = useMemo(() => buildCSPString(config), [config]);

  const toggleSource = (dir: CSPDirective, src: string) => {
    const current = config.directives[dir] || [];
    let next;
    if (src === "'none'") {
      next = ["'none'"]; // none overrides all
    } else {
      next = current.filter(s => s !== "'none'"); // remove none if adding something else
      if (next.includes(src)) {
        next = next.filter(s => s !== src);
      } else {
        next = [...next, src];
      }
    }
    setConfig({ ...config, directives: { ...config.directives, [dir]: next } });
  };

  const addCustomSource = (dir: CSPDirective) => {
    const val = customInputs[dir]?.trim();
    if (!val) return;
    const current = (config.directives[dir] || []).filter(s => s !== "'none'");
    if (!current.includes(val)) {
      setConfig({ ...config, directives: { ...config.directives, [dir]: [...current, val] } });
    }
    setCustomInputs({ ...customInputs, [dir]: '' });
  };

  const removeSource = (dir: CSPDirective, src: string) => {
    setConfig({
      ...config,
      directives: {
        ...config.directives,
        [dir]: config.directives[dir]!.filter(s => s !== src)
      }
    });
  };

  // Warnings analysis
  const warnings = useMemo(() => {
    const w = [];
    if (!config.directives['default-src']?.length) w.push('Missing default-src fallback directive.');
    if (config.directives['script-src']?.includes("'unsafe-inline'")) w.push('script-src allows unsafe-inline (XSS vulnerability).');
    if (config.directives['script-src']?.includes("'unsafe-eval'")) w.push('script-src allows unsafe-eval.');
    if (Object.values(config.directives).some(arr => arr.includes('*'))) w.push('Wildcard (*) source detected. Too permissive.');
    return w;
  }, [config]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex bg-bg border border-border p-1 rounded-2xl overflow-x-auto no-scrollbar">
        <button onClick={() => setConfig({ directives: PRESETS.Strict, reportOnly: false })} className="px-6 py-3 rounded-xl text-xs font-bold hover:bg-surface transition-all">Preset: Strict</button>
        <button onClick={() => setConfig({ directives: PRESETS.Standard as any, reportOnly: false })} className="px-6 py-3 rounded-xl text-xs font-bold hover:bg-surface transition-all">Preset: Standard</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Builder */}
        <div className="lg:col-span-7 bg-surface border border-border rounded-4xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue flex items-center gap-2">
              <Shield className="w-3.5 h-3.5" /> Directives Configuration
            </h3>
            <label className="flex items-center gap-2 cursor-pointer bg-bg border border-border px-3 py-1.5 rounded-lg">
              <input type="checkbox" checked={config.reportOnly} onChange={e => setConfig({...config, reportOnly: e.target.checked})} className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500/20" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-3">Report-Only</span>
            </label>
          </div>

          <div className="space-y-6">
            {(Object.keys(DEFAULT_CONFIG.directives) as CSPDirective[]).map(dir => {
              const activeSources = config.directives[dir] || [];
              return (
                <div key={dir} className="bg-bg border border-border rounded-3xl p-5 space-y-4">
                  <h4 className="text-xs font-black text-text uppercase tracking-widest">{dir}</h4>
                  
                  {/* Selected Sources Badges */}
                  <div className="flex flex-wrap gap-2 min-h-[28px]">
                    {activeSources.map(src => (
                      <span key={src} className="flex items-center gap-1.5 pl-3 pr-1 py-1 bg-blue/10 border border-blue/30 text-blue rounded-lg text-xs font-mono font-bold">
                        {src}
                        <button onClick={() => removeSource(dir, src)} className="p-0.5 hover:bg-blue/20 rounded-md transition-colors"><Trash2 className="w-3 h-3" /></button>
                      </span>
                    ))}
                    {activeSources.length === 0 && <span className="text-xs text-text-4 italic py-1">No sources defined (fallback applies)</span>}
                  </div>

                  {/* Common Source Toggles */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
                    {COMMON_SOURCES.map(src => (
                      <button
                        key={src}
                        onClick={() => toggleSource(dir, src)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all border",
                          activeSources.includes(src) ? "bg-surface text-text shadow-sm border-border" : "bg-transparent text-text-4 border-transparent hover:bg-surface/50"
                        )}
                      >
                        {src}
                      </button>
                    ))}
                  </div>

                  {/* Custom Input */}
                  <div className="flex items-center gap-2 pt-2">
                    <input 
                      type="text" 
                      value={customInputs[dir]} 
                      onChange={e => setCustomInputs({...customInputs, [dir]: e.target.value})}
                      onKeyDown={e => e.key === 'Enter' && addCustomSource(dir)}
                      placeholder="e.g. https://api.karuvilab.com"
                      className="flex-1 bg-surface border border-border rounded-xl px-3 py-2 text-xs font-mono text-text focus:border-blue outline-none"
                    />
                    <button onClick={() => addCustomSource(dir)} className="px-3 py-2 bg-blue text-white rounded-xl text-xs font-bold shrink-0">Add</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Output */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-surface border border-border rounded-4xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-4">Export Code</h3>
            
            <div className="flex bg-bg border border-border p-1 rounded-xl">
              {(['header', 'meta', 'nginx'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={cn("flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all", activeTab === t ? "bg-surface text-text shadow-sm" : "text-text-4")}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="relative group">
              <textarea
                readOnly
                value={
                  activeTab === 'header' ? `${config.reportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy'}: ${cspString}` :
                  activeTab === 'meta' ? `<meta http-equiv="${config.reportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy'}" content="${cspString}">` :
                  `add_header ${config.reportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy'} "${cspString}";`
                }
                className="w-full h-48 bg-bg border border-border rounded-2xl p-5 font-mono text-xs text-text-3 outline-none resize-none leading-relaxed break-all"
              />
              <div className="absolute top-4 right-4">
                <CopyButton text={cspString} />
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-4xl p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-4 flex items-center gap-2">
               Security Analysis
            </h3>
            {warnings.length === 0 ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3">
                 <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                 <div>
                   <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Policy Looks Solid</p>
                   <p className="text-[10px] font-medium text-emerald-600/70 mt-1">No obvious insecure directives detected.</p>
                 </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center gap-3 mb-4">
                   <AlertTriangle className="w-5 h-5 text-amber-500" />
                   <div>
                     <p className="text-sm font-bold text-amber-600 dark:text-amber-400">Warnings Detected</p>
                     <p className="text-[10px] font-medium text-amber-600/70 mt-1">Review the following potential issues.</p>
                   </div>
                </div>
                {warnings.map((w, i) => (
                  <div key={i} className="flex gap-2 text-xs text-text-3 font-medium bg-bg p-3 rounded-xl border border-border">
                    <span className="text-amber-500 font-bold shrink-0">!</span> {w}
                  </div>
                ))}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
