'use client';

import React, { useState, useMemo } from 'react';
import { Shield, Copy, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { cn } from '@/src/lib/utils';
import { CopyButton } from '@/components/ui/CopyButton';

type CSPDirective = 
  | 'default-src' 
  | 'script-src' 
  | 'style-src' 
  | 'img-src' 
  | 'font-src' 
  | 'connect-src'
  | 'frame-src'
  | 'media-src'
  | 'object-src'
  | 'worker-src'
  | 'manifest-src';

const COMMON_SOURCES = ["'self'", "'none'", "'unsafe-inline'", "'unsafe-eval'", "https:", "data:", "blob:"];

interface CSPConfig {
  directives: Record<string, string[]>;
  reportOnly: boolean;
}

const DEFAULT_CONFIG: CSPConfig = {
  directives: {
    'default-src': ["'self'"],
    'script-src': ["'self'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", "data:", "https:"],
    'font-src': ["'self'"],
    'connect-src': ["'self'"],
    'frame-src': ["'self'"],
    'object-src': ["'none'"],
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
    'connect-src': ["'self'"],
    'frame-src': ["'none'"],
    'object-src': ["'none'"],
    'worker-src': ["'self'"],
    'base-uri': ["'none'"],
    'form-action': ["'self'"]
  },
  Standard: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "https:"],
    'style-src': ["'self'", "'unsafe-inline'", "https:"],
    'img-src': ["'self'", "data:", "https:"],
    'font-src': ["'self'", "data:", "https:"],
    'connect-src': ["'self'", "https:"],
    'frame-src': ["'self'"],
    'object-src': ["'none'"]
  },
  'Local Dev': {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", "data:", "blob:"],
    'connect-src': ["*"],
    'object-src': ["'none'"]
  }
};

function buildCSPString(config: CSPConfig): string {
  const parts = [];
  // Sort directives to keep output consistent
  const sortedKeys = Object.keys(config.directives).sort();
  for (const directive of sortedKeys) {
    const sources = config.directives[directive];
    if (sources && sources.length > 0) {
      parts.push(`${directive} ${sources.join(' ')}`);
    }
  }
  return parts.join('; ');
}

export default function CspBuilderClient() {
  const [config, setConfig] = useState<CSPConfig>(DEFAULT_CONFIG);
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'header' | 'meta' | 'nginx' | 'apache'>('header');

  const cspString = useMemo(() => buildCSPString(config), [config]);

  const toggleSource = (dir: string, src: string) => {
    const current = config.directives[dir] || [];
    let next;
    if (src === "'none'") {
      next = ["'none'"];
    } else {
      next = current.filter(s => s !== "'none'");
      if (next.includes(src)) {
        next = next.filter(s => s !== src);
      } else {
        next = [...next, src];
      }
    }
    setConfig({ ...config, directives: { ...config.directives, [dir]: next } });
  };

  const addCustomSource = (dir: string) => {
    const val = customInputs[dir]?.trim();
    if (!val) return;
    const current = (config.directives[dir] || []).filter(s => s !== "'none'");
    if (!current.includes(val)) {
      setConfig({ ...config, directives: { ...config.directives, [dir]: [...current, val] } });
    }
    setCustomInputs({ ...customInputs, [dir]: '' });
  };

  const removeSource = (dir: string, src: string) => {
    setConfig({
      ...config,
      directives: {
        ...config.directives,
        [dir]: config.directives[dir]!.filter(s => s !== src)
      }
    });
  };

  const addDirective = (dir: string) => {
    if (config.directives[dir]) return;
    setConfig({
      ...config,
      directives: { ...config.directives, [dir]: ["'self'"] }
    });
  };

  const removeDirective = (dir: string) => {
    const next = { ...config.directives };
    delete next[dir];
    setConfig({ ...config, directives: next });
  };

  // Warnings analysis
  const securityScore = useMemo(() => {
    let score = 100;
    const w = [];
    
    if (!config.directives['default-src']?.length) {
      w.push({ level: 'error', msg: 'Missing default-src. This is a massive fallback hole.' });
      score -= 30;
    }
    
    if (config.directives['script-src']?.includes("'unsafe-inline'")) {
      w.push({ level: 'error', msg: 'script-src allows unsafe-inline (XSS vulnerability).' });
      score -= 25;
    }
    
    if (config.directives['script-src']?.includes("'unsafe-eval'")) {
      w.push({ level: 'warn', msg: 'script-src allows unsafe-eval. Dangerous but sometimes needed.' });
      score -= 15;
    }

    if (config.directives['style-src']?.includes("'unsafe-inline'")) {
      w.push({ level: 'info', msg: 'style-src allows unsafe-inline. Common but technically a risk.' });
      score -= 5;
    }

    if (Object.values(config.directives).some(arr => arr.includes('*'))) {
      w.push({ level: 'error', msg: 'Wildcard (*) detected. Too permissive for production.' });
      score -= 20;
    }

    if (config.directives['object-src'] && !config.directives['object-src'].includes("'none'")) {
      w.push({ level: 'warn', msg: 'object-src should ideally be "none" to block plugins.' });
      score -= 10;
    }

    return { score: Math.max(0, score), warnings: w };
  }, [config]);

  const availableDirectives = [
    'default-src', 'script-src', 'style-src', 'img-src', 'font-src', 
    'connect-src', 'frame-src', 'media-src', 'object-src', 'worker-src', 
    'manifest-src', 'base-uri', 'form-action', 'frame-ancestors'
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex bg-bg border border-border p-1.5 rounded-2xl overflow-x-auto no-scrollbar gap-1 shadow-sm">
        {Object.entries(PRESETS).map(([name, directives]) => (
          <button 
            key={name}
            onClick={() => setConfig({ directives: JSON.parse(JSON.stringify(directives)), reportOnly: false })} 
            className="px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-surface transition-all whitespace-nowrap"
          >
            {name}
          </button>
        ))}
      </div>

      {/* Import Section */}
      <div className="bg-surface border border-border rounded-4xl p-6 shadow-sm space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-4 flex items-center gap-2">
           Import & Analyze Existing Policy
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text"
            value={importValue}
            onChange={(e) => setImportValue(e.target.value)}
            placeholder="Paste your CSP header or meta tag here..."
            className="flex-1 bg-bg border border-border rounded-xl px-4 py-3 text-xs font-mono text-text focus:border-blue outline-none shadow-inner"
          />
          <button 
            onClick={handleImport}
            className="px-8 py-3 bg-blue text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-md hover:shadow-lg active:scale-95 transition-all"
          >
            Analyze
          </button>
        </div>
        {importError && <p className="text-[10px] text-red-500 font-bold px-1">{importError}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Builder */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-surface border border-border rounded-4xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue flex items-center gap-2">
                <Shield className="w-3.5 h-3.5" /> Directives Configuration
              </h3>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer bg-bg border border-border px-3 py-1.5 rounded-lg shadow-sm hover:border-blue/30 transition-colors">
                  <input type="checkbox" checked={config.reportOnly} onChange={e => setConfig({...config, reportOnly: e.target.checked})} className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500/20" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-text-3">Report-Only</span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              {Object.keys(config.directives).map(dir => {
                const activeSources = config.directives[dir] || [];
                return (
                  <m.div 
                    layout
                    key={dir} 
                    className="bg-bg border border-border rounded-3xl p-5 space-y-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-text uppercase tracking-widest">{dir}</h4>
                      <button 
                        onClick={() => removeDirective(dir)}
                        className="p-1.5 text-text-4 hover:text-red-500 transition-colors"
                        title="Remove directive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    
                    {/* Selected Sources Badges */}
                    <div className="flex flex-wrap gap-1.5 min-h-[28px]">
                      {activeSources.map(src => (
                        <span key={src} className="flex items-center gap-1 pl-2.5 pr-1 py-1 bg-blue/5 border border-blue/10 text-blue rounded-lg text-[10px] font-mono font-bold group">
                          {src}
                          <button onClick={() => removeSource(dir, src)} className="p-0.5 opacity-0 group-hover:opacity-100 hover:bg-blue/10 rounded transition-all"><Trash2 className="w-2.5 h-2.5" /></button>
                        </span>
                      ))}
                      {activeSources.length === 0 && <span className="text-[10px] text-text-4 italic py-1">No sources (fallback applies)</span>}
                    </div>

                    {/* Common Source Toggles */}
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border/50">
                      {COMMON_SOURCES.map(src => (
                        <button
                          key={src}
                          onClick={() => toggleSource(dir, src)}
                          className={cn(
                            "px-2.5 py-1.5 rounded-lg text-[9px] font-mono font-bold transition-all border",
                            activeSources.includes(src) ? "bg-blue text-white border-blue shadow-md shadow-blue/20" : "bg-transparent text-text-4 border-transparent hover:bg-surface/50"
                          )}
                        >
                          {src}
                        </button>
                      ))}
                    </div>

                    {/* Custom Input */}
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        value={customInputs[dir] || ''} 
                        onChange={e => setCustomInputs({...customInputs, [dir]: e.target.value})}
                        onKeyDown={e => e.key === 'Enter' && addCustomSource(dir)}
                        placeholder="e.g. *.google.com"
                        className="flex-1 bg-surface border border-border rounded-xl px-3 py-2 text-[10px] font-mono text-text focus:border-blue outline-none transition-colors"
                      />
                      <button onClick={() => addCustomSource(dir)} className="px-4 py-2 bg-blue text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shrink-0 shadow-sm active:scale-95 transition-all">Add</button>
                    </div>
                  </m.div>
                );
              })}
            </div>

            {/* Add New Directive Dropdown */}
            <div className="pt-4 border-t border-border/50">
               <div className="flex items-center gap-3">
                 <select 
                   onChange={(e) => { if(e.target.value) addDirective(e.target.value); e.target.value = ''; }}
                   className="flex-1 bg-bg border border-border rounded-xl px-4 py-3 text-xs font-bold text-text-2 focus:border-blue outline-none"
                   value=""
                 >
                   <option value="" disabled>Add more directives...</option>
                   {availableDirectives.filter(d => !config.directives[d]).map(d => (
                     <option key={d} value={d}>{d}</option>
                   ))}
                 </select>
               </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Output */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          
          <div className="bg-surface border border-border rounded-4xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-4">Export Policy</h3>
              <div className="flex items-center gap-2">
                <div className={cn(
                  "px-2 py-0.5 rounded-full text-[9px] font-black uppercase",
                  securityScore.score > 80 ? "bg-emerald-500/10 text-emerald-500" :
                  securityScore.score > 50 ? "bg-amber-500/10 text-amber-500" : "bg-red-500/10 text-red-500"
                )}>
                  Score: {securityScore.score}
                </div>
                <CopyButton text={
                  activeTab === 'header' ? `${config.reportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy'}: ${cspString}` :
                  activeTab === 'meta' ? `<meta http-equiv="${config.reportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy'}" content="${cspString}">` :
                  activeTab === 'nginx' ? `add_header ${config.reportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy'} "${cspString}";` :
                  `Header set ${config.reportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy'} "${cspString}"`
                } />
              </div>
            </div>
            
            <div className="flex bg-bg border border-border p-1 rounded-xl shadow-inner">
              {(['header', 'meta', 'nginx', 'apache'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={cn("flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", activeTab === t ? "bg-surface text-text shadow-sm" : "text-text-4")}
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
                  activeTab === 'nginx' ? `add_header ${config.reportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy'} "${cspString}";` :
                  `Header set ${config.reportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy'} "${cspString}"`
                }
                className="w-full h-56 bg-bg border border-border rounded-2xl p-5 font-mono text-[11px] text-text-3 outline-none resize-none leading-relaxed break-all shadow-inner"
              />
            </div>
          </div>

          <div className="bg-surface border border-border rounded-4xl p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-4 flex items-center gap-2">
               Security Analysis
            </h3>
            {securityScore.warnings.length === 0 ? (
              <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                   <CheckCircle2 className="w-6 h-6" />
                 </div>
                 <div>
                   <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Secure Policy</p>
                   <p className="text-[11px] font-bold text-emerald-600/70 mt-0.5 leading-tight">Your CSP follows modern security best practices.</p>
                 </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-5 bg-amber-500/10 border border-amber-500/30 rounded-3xl flex items-center gap-4 mb-2">
                   <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                     <AlertTriangle className="w-6 h-6" />
                   </div>
                   <div>
                     <p className="text-sm font-black text-amber-600 dark:text-amber-400 uppercase tracking-wide">Optimization Needed</p>
                     <p className="text-[11px] font-bold text-amber-600/70 mt-0.5 leading-tight">{securityScore.warnings.length} issues identified for review.</p>
                   </div>
                </div>
                <div className="space-y-2">
                  {securityScore.warnings.map((w, i) => (
                    <div key={i} className="flex gap-3 text-[11px] text-text-3 font-bold bg-bg p-3.5 rounded-2xl border border-border leading-relaxed">
                      <span className={cn(
                        "font-black shrink-0",
                        w.level === 'error' ? 'text-red-500' : w.level === 'warn' ? 'text-amber-500' : 'text-blue'
                      )}>
                        {w.level.toUpperCase()}
                      </span> 
                      {w.msg}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}

