'use client';

import React, { useState, useMemo } from 'react';
import { LiveFilterBar } from '@/components/ui/LiveFilterBar';
import { CopyButton } from '@/components/ui/CopyButton';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';

interface Command {
  cmd: string;
  desc: string;
  category: string;
}

const COMMANDS: Command[] = [
  { category: 'Git', cmd: 'git init', desc: 'Initialize a new local repository' },
  { category: 'Git', cmd: 'git clone <url>', desc: 'Clone a repository from a URL' },
  { category: 'Git', cmd: 'git add .', desc: 'Add all current changes to the staging area' },
  { category: 'Git', cmd: 'git commit -m "<message>"', desc: 'Commit staged changes with a message' },
  { category: 'Git', cmd: 'git push origin <branch>', desc: 'Push local commits to a remote branch' },
  { category: 'Git', cmd: 'git pull', desc: 'Fetch and merge changes from remote' },
  { category: 'Docker', cmd: 'docker ps', desc: 'List running containers' },
  { category: 'Docker', cmd: 'docker images', desc: 'List local images' },
  { category: 'Docker', cmd: 'docker build -t <name> .', desc: 'Build an image from a Dockerfile' },
  { category: 'Docker', cmd: 'docker run -p <host>:<cont> <name>', desc: 'Run a container with port mapping' },
  { category: 'Linux', cmd: 'ls -la', desc: 'List all files with details and hidden files' },
  { category: 'Linux', cmd: 'chmod +x <file>', desc: 'Make a file executable' },
  { category: 'Linux', cmd: 'sudo systemctl restart <service>', desc: 'Restart a system service' },
  { category: 'Linux', cmd: 'df -h', desc: 'Show disk space usage in human-readable format' },
  { category: 'Networking', cmd: 'curl -I <url>', desc: 'Fetch the HTTP headers of a URL' },
  { category: 'Networking', cmd: 'ping <host>', desc: 'Check network connectivity to a host' },
  { category: 'Networking', cmd: 'ssh <user>@<host>', desc: 'Connect to a remote machine via SSH' },
];

const CATEGORIES = ['All', ...Array.from(new Set(COMMANDS.map(c => c.category)))];

export default function CommandCheatSheet() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredCommands = useMemo(() => {
    return COMMANDS.filter(c => {
      const matchesSearch = c.cmd.toLowerCase().includes(search.toLowerCase()) || 
                            c.desc.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'All' || c.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full">
          <LiveFilterBar 
            value={search} 
            onChange={setSearch} 
            placeholder="Search commands or descriptions..."
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                activeCategory === cat 
                  ? 'bg-blue text-white shadow-lg shadow-blue/20' 
                  : 'bg-surface text-text-3 hover:bg-hover'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((command, i) => (
              <motion.div
                key={command.cmd}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.02 }}
                className="group bg-surface/50 border border-border rounded-xl p-4 hover:border-blue/50 transition-all flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue">
                      {command.category}
                    </span>
                  </div>
                  <code className="text-lg font-mono text-text block group-hover:text-white transition-colors">
                    {command.cmd}
                  </code>
                  <p className="text-sm text-text-4">
                    {command.desc}
                  </p>
                </div>
                <CopyButton text={command.cmd} className="flex-shrink-0" />
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-surface/30 rounded-3xl border border-dashed border-border"
            >
              <div className="bg-surface w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-text-4" />
              </div>
              <h3 className="text-text-3 font-medium">No commands found</h3>
              <p className="text-text-4 text-sm">Try adjusting your search or category filter.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
