'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { LiveFilterBar } from '@/components/ui/LiveFilterBar';
import { CopyButton } from '@/components/ui/CopyButton';
import { m, AnimatePresence } from 'framer-motion';
import { Search, X, Terminal, ShieldAlert, Cpu, Monitor, Apple, Command as CmdIcon, Check, Copy, ExternalLink, HelpCircle, Sparkles, ChevronRight } from 'lucide-react';
import { useDragScroll } from '@/src/hooks/useDragScroll';
import { COMMANDS_DATA, COMMAND_CATEGORIES, CommandEntry } from './commandsData';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function CommandCheatSheet() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedCommand, setSelectedCommand] = useState<CommandEntry | null>(null);
  const { containerRef, events, dragged } = useDragScroll<HTMLDivElement>();

  // Filter commands based on search and category
  const filteredCommands = useMemo(() => {
    return COMMANDS_DATA.filter(c => {
      const query = search.toLowerCase().trim();
      const matchesSearch = 
        c.cmd.toLowerCase().includes(query) || 
        c.desc.toLowerCase().includes(query) ||
        (c.details && c.details.toLowerCase().includes(query)) ||
        (c.syntax && c.syntax.toLowerCase().includes(query)) ||
        (c.linux && c.linux.toLowerCase().includes(query)) ||
        (c.windows && c.windows.toLowerCase().includes(query)) ||
        (c.mac && c.mac.toLowerCase().includes(query));
      const matchesCategory = activeCategory === 'All' || c.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  // Compute 4 related commands for the selected modal command
  const relatedCommands = useMemo(() => {
    if (!selectedCommand) return [];
    const currentCmdLower = selectedCommand.cmd.toLowerCase();
    const currentCategory = selectedCommand.category;
    const baseKeyword = currentCmdLower.split(' ')[0] || '';

    return COMMANDS_DATA.filter(c => {
      if (c.cmd === selectedCommand.cmd || c.id === selectedCommand.id) return false;
      const cCmdLower = c.cmd.toLowerCase();
      const sharesKeyword = baseKeyword.length >= 3 && cCmdLower.startsWith(baseKeyword);
      const sharesCategory = c.category === currentCategory;
      return sharesKeyword || sharesCategory;
    }).slice(0, 4);
  }, [selectedCommand]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedCommand(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="space-y-6">
      {/* ── Search Bar & Category Filter Pills ── */}
      <div className="flex flex-col lg:flex-row gap-6 items-center">
        <div className="flex-1 w-full">
          <LiveFilterBar 
            value={search} 
            onChange={setSearch} 
            placeholder="Search commands, flags, SSH, nano, permissions, OpenSSL, or OS alternatives..."
          />
        </div>
        <div 
          ref={containerRef}
          {...events}
          className="flex gap-2 overflow-x-auto pb-3 pt-1 px-1 w-full lg:w-auto no-scrollbar snap-x select-none"
        >
          {COMMAND_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={(e) => {
                if (dragged) {
                  e.preventDefault();
                  return;
                }
                setActiveCategory(cat);
              }}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap snap-start ${
                activeCategory === cat 
                  ? 'bg-blue text-white shadow-lg shadow-blue/30 scale-105' 
                  : 'bg-surface/80 border border-border text-text-3 hover:text-text hover:bg-hover'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Command Grid ── */}
      <div>
        <AnimatePresence mode="popLayout">
          {filteredCommands.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 items-stretch">
              {filteredCommands.map((command, i) => (
                <m.div
                  key={command.id || command.cmd}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: Math.min(i, 20) * 0.015 }}
                  onClick={() => setSelectedCommand(command)}
                  className="group bg-surface/60 border border-border/80 rounded-2xl p-5 hover:border-blue/50 hover:shadow-md transition-all flex flex-col justify-between gap-4 h-full cursor-pointer relative"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-blue/10 text-[10px] font-bold uppercase tracking-wider text-blue">
                        {command.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-text-4 text-xs group-hover:text-blue transition-colors">
                        <span>Details</span>
                        <CmdIcon className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <code className="text-sm sm:text-base font-mono text-text block group-hover:text-blue transition-colors break-words font-semibold">
                      {command.cmd}
                    </code>
                  </div>

                  <div className="flex items-end justify-between gap-3 mt-auto pt-3 border-t border-border/50">
                    <p className="text-xs sm:text-sm text-text-3 leading-snug line-clamp-2">
                      {command.desc}
                    </p>
                    <div onClick={(e) => e.stopPropagation()}>
                      <CopyButton text={command.cmd} className="flex-shrink-0" />
                    </div>
                  </div>
                </m.div>
              ))}
            </div>
          ) : (
            <m.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-surface/30 rounded-3xl border border-dashed border-border"
            >
              <div className="bg-surface w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-text-4" />
              </div>
              <h3 className="text-text-3 font-medium">No commands found</h3>
              <p className="text-text-4 text-sm">Try searching for "nano", "ssh", "chmod", "openssl", or choose a category.</p>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Interactive Command Detail Modal ── */}
      <AnimatePresence>
        {selectedCommand && (
          <div className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <m.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-surface border border-border shadow-2xl rounded-3xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-border/60 bg-surface-elevated/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue/10 border border-blue/20 flex items-center justify-center text-blue">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue bg-blue/10 px-2 py-0.5 rounded-md">
                      {selectedCommand.category}
                    </span>
                    <h3 className="text-lg font-bold text-text mt-0.5">{selectedCommand.desc}</h3>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCommand(null)}
                  className="w-9 h-9 rounded-full bg-surface-2 hover:bg-hover text-text-4 hover:text-text flex items-center justify-center transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content Scroll Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-text-2">
                {/* Primary Command Snippet Box */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-4">Command</label>
                  <div className="flex items-center justify-between gap-3 p-4 bg-bg border border-border/80 rounded-2xl font-mono text-sm sm:text-base text-text font-bold">
                    <span className="break-all">{selectedCommand.cmd}</span>
                    <CopyButton text={selectedCommand.cmd} />
                  </div>
                </div>

                {/* Extended Details */}
                {selectedCommand.details && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-4">Explanation & Usage</label>
                    <p className="text-sm text-text-3 leading-relaxed bg-surface-2/40 p-4 rounded-xl border border-border/40">
                      {selectedCommand.details}
                    </p>
                  </div>
                )}

                {/* Syntax & Flags */}
                {selectedCommand.syntax && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-4">Syntax Pattern</label>
                    <div className="p-3 bg-bg border border-border/60 rounded-xl font-mono text-xs text-text-3">
                      {selectedCommand.syntax}
                    </div>
                  </div>
                )}

                {/* Cross-Platform Equivalents Section */}
                {(selectedCommand.linux || selectedCommand.mac || selectedCommand.windows) && (
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-4">Cross-Platform Alternatives</label>
                    <div className="space-y-2">
                      {selectedCommand.linux && (
                        <div className="flex items-start gap-3 p-3 bg-surface-2/40 rounded-xl border border-border/50 text-xs">
                          <span className="font-bold text-text shrink-0 w-24 flex items-center gap-1.5">
                            🐧 Linux
                          </span>
                          <code className="font-mono text-text-2 break-all flex-1">{selectedCommand.linux}</code>
                        </div>
                      )}
                      {selectedCommand.mac && (
                        <div className="flex items-start gap-3 p-3 bg-surface-2/40 rounded-xl border border-border/50 text-xs">
                          <span className="font-bold text-text shrink-0 w-24 flex items-center gap-1.5">
                            🍎 macOS
                          </span>
                          <code className="font-mono text-text-2 break-all flex-1">{selectedCommand.mac}</code>
                        </div>
                      )}
                      {selectedCommand.windows && (
                        <div className="flex items-start gap-3 p-3 bg-surface-2/40 rounded-xl border border-border/50 text-xs">
                          <span className="font-bold text-text shrink-0 w-24 flex items-center gap-1.5">
                            🪟 Windows
                          </span>
                          <code className="font-mono text-text-2 break-all flex-1">{selectedCommand.windows}</code>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Real World Example */}
                {selectedCommand.example && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-4">Practical Example</label>
                    <div className="flex items-center justify-between gap-3 p-3.5 bg-bg border border-border/60 rounded-xl font-mono text-xs text-text">
                      <span className="break-all">{selectedCommand.example}</span>
                      <CopyButton text={selectedCommand.example} />
                    </div>
                  </div>
                )}

                {/* Security / Safety Warning */}
                {selectedCommand.warning && (
                  <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-300 rounded-2xl text-xs font-medium">
                    <ShieldAlert className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
                    <div>
                      <span className="font-bold block mb-0.5">Safety Warning</span>
                      {selectedCommand.warning}
                    </div>
                  </div>
                )}

                {/* ── Related Commands Grid ── */}
                {relatedCommands.length > 0 && (
                  <div className="space-y-3 pt-2 border-t border-border/40">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-4 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue" /> Related Commands
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {relatedCommands.map(rel => (
                        <button
                          key={rel.id || rel.cmd}
                          onClick={() => setSelectedCommand(rel)}
                          className="text-left p-3 rounded-xl bg-surface-2/40 border border-border/50 hover:border-blue/50 hover:bg-blue/5 transition-all group"
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue bg-blue/10 px-1.5 py-0.5 rounded">
                              {rel.category}
                            </span>
                            <span className="text-[10px] text-text-4 group-hover:text-blue transition-colors flex items-center gap-0.5">
                              View <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                          <code className="text-xs font-mono text-text block truncate group-hover:text-blue font-semibold">
                            {rel.cmd}
                          </code>
                          <p className="text-[11px] text-text-4 truncate mt-0.5">{rel.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-border/60 bg-surface-elevated/40 flex justify-end">
                <Button variant="secondary" onClick={() => setSelectedCommand(null)}>
                  Close (Esc)
                </Button>
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
