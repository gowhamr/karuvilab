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
  // Git
  { category: 'Git', cmd: 'git init', desc: 'Initialize a new local repository' },
  { category: 'Git', cmd: 'git clone <url>', desc: 'Clone a repository from a URL' },
  { category: 'Git', cmd: 'git add .', desc: 'Add all current changes to the staging area' },
  { category: 'Git', cmd: 'git commit -m "<message>"', desc: 'Commit staged changes with a message' },
  { category: 'Git', cmd: 'git push origin <branch>', desc: 'Push local commits to a remote branch' },
  { category: 'Git', cmd: 'git pull', desc: 'Fetch and merge changes from remote' },
  { category: 'Git', cmd: 'git stash', desc: 'Stash changes in a dirty working directory' },
  { category: 'Git', cmd: 'git log --oneline', desc: 'View commit history in one line' },

  // Linux
  { category: 'Linux', cmd: 'ls -la', desc: 'List all files with details and hidden files' },
  { category: 'Linux', cmd: 'chmod +x <file>', desc: 'Make a file executable' },
  { category: 'Linux', cmd: 'chown <user>:<group> <file>', desc: 'Change file owner and group' },
  { category: 'Linux', cmd: 'sudo systemctl restart <service>', desc: 'Restart a system service' },
  { category: 'Linux', cmd: 'df -h', desc: 'Show disk space usage in human-readable format' },
  { category: 'Linux', cmd: 'du -sh *', desc: 'Show size of directories in current path' },
  { category: 'Linux', cmd: 'htop', desc: 'Interactive process viewer (advanced top)' },
  { category: 'Linux', cmd: 'lsof -i :<port>', desc: 'Find process running on a specific port' },
  { category: 'Linux', cmd: 'grep -r "<pattern>" .', desc: 'Search for pattern recursively in current directory' },
  { category: 'Linux', cmd: 'tail -f <file>', desc: 'Output appended data as the file grows' },

  // Windows
  { category: 'Windows', cmd: 'ipconfig /all', desc: 'Display full TCP/IP configuration' },
  { category: 'Windows', cmd: 'systeminfo', desc: 'Display operating system configuration' },
  { category: 'Windows', cmd: 'tasklist', desc: 'Display a list of currently running processes' },
  { category: 'Windows', cmd: 'netstat -ano', desc: 'Display active connections and port IDs' },
  { category: 'Windows', cmd: 'sfc /scannow', desc: 'Scan and repair system files' },
  { category: 'Windows', cmd: 'gpupdate /force', desc: 'Force update of Group Policy settings' },
  { category: 'Windows', cmd: 'dir /ah', desc: 'List all files including hidden ones' },

  // SSH
  { category: 'SSH', cmd: 'ssh <user>@<host>', desc: 'Connect to a remote machine via SSH' },
  { category: 'SSH', cmd: 'ssh-keygen -t ed25519', desc: 'Generate a new SSH key (Modern/Secure)' },
  { category: 'SSH', cmd: 'ssh-copy-id <user>@<host>', desc: 'Copy your public key to a remote server' },
  { category: 'SSH', cmd: 'ssh -i <key_path> <user>@<host>', desc: 'Connect using a specific private key' },
  { category: 'SSH', cmd: 'ssh -L <local_port>:localhost:<remote_port> <user>@<host>', desc: 'Setup local port forwarding (tunnel)' },

  // SFTP
  { category: 'SFTP', cmd: 'sftp <user>@<host>', desc: 'Open a secure FTP connection' },
  { category: 'SFTP', cmd: 'put <local_file>', desc: 'Upload a file to the remote server' },
  { category: 'SFTP', cmd: 'get <remote_file>', desc: 'Download a file from the remote server' },
  { category: 'SFTP', cmd: 'lls', desc: 'List files in the local directory' },

  // OpenSSL
  { category: 'OpenSSL', cmd: 'openssl genrsa -out key.pem 2048', desc: 'Generate a 2048-bit RSA private key' },
  { category: 'OpenSSL', cmd: 'openssl req -new -key key.pem -out csr.pem', desc: 'Generate a Certificate Signing Request (CSR)' },
  { category: 'OpenSSL', cmd: 'openssl x509 -text -noout -in cert.pem', desc: 'View full details of a certificate' },
  { category: 'OpenSSL', cmd: 'openssl s_client -connect <host>:443', desc: 'Test and debug SSL/TLS connections' },

  // Hashing
  { category: 'Hashing', cmd: 'sha256sum <file>', desc: 'Calculate SHA256 checksum (Linux)' },
  { category: 'Hashing', cmd: 'md5sum <file>', desc: 'Calculate MD5 checksum (Linux)' },
  { category: 'Hashing', cmd: 'certutil -hashfile <file> SHA256', desc: 'Calculate SHA256 checksum (Windows)' },

  // Docker
  { category: 'Docker', cmd: 'docker ps', desc: 'List running containers' },
  { category: 'Docker', cmd: 'docker images', desc: 'List local images' },
  { category: 'Docker', cmd: 'docker build -t <name> .', desc: 'Build an image from a Dockerfile' },
  { category: 'Docker', cmd: 'docker run -p <host>:<cont> <name>', desc: 'Run a container with port mapping' },
  { category: 'Docker', cmd: 'docker exec -it <id> /bin/bash', desc: 'Open an interactive shell in a container' },
  { category: 'Docker', cmd: 'docker system prune -a', desc: 'Remove all unused images and containers' },

  // Power User (Advanced)
  { category: 'Advanced', cmd: "awk '{print $1}' <file>", desc: 'Extract first column from a text file (Linux/Unix)' },
  { category: 'Advanced', cmd: "sed -i 's/old/new/g' <file>", desc: 'Find and replace text inside a file (Linux/Unix)' },
  { category: 'Advanced', cmd: 'robocopy <src> <dest> /MIR', desc: 'Mirror a directory tree (Robust Copy for Windows)' },
  { category: 'Advanced', cmd: 'find . -type f -name "*.log" -delete', desc: 'Find and delete all log files recursively' },
  { category: 'Advanced', cmd: 'lscpu', desc: 'Display information about the CPU architecture' },
  
  // Legacy / SCO Unix
  { category: 'Unix/SCO', cmd: 'sysadmsh', desc: 'SCO Admin visual shell (Legacy Admin Tool)' },
  { category: 'Unix/SCO', cmd: 'sar -u 1 10', desc: 'System activity reporter (Monitor CPU usage)' },
  { category: 'Unix/SCO', cmd: 'lp -d <printer> <file>', desc: 'Submit print request to a specific printer' },

  // Editors
  { category: 'Editors', cmd: 'vi <file>', desc: 'Open file in Vi/Vim editor' },
  { category: 'Editors', cmd: 'i', desc: 'Vi: Enter Insert mode (Edit text)' },
  { category: 'Editors', cmd: 'Esc', desc: 'Vi: Return to Command mode' },
  { category: 'Editors', cmd: ':wq', desc: 'Vi: Save and Quit' },
  { category: 'Editors', cmd: ':q!', desc: 'Vi: Quit without saving' },
  { category: 'Editors', cmd: 'dd', desc: 'Vi: Delete current line' },
  { category: 'Editors', cmd: 'yy', desc: 'Vi: Yank (Copy) current line' },
  { category: 'Editors', cmd: 'p', desc: 'Vi: Paste after cursor' },
  { category: 'Editors', cmd: 'u', desc: 'Vi: Undo last change' },
  { category: 'Editors', cmd: 'Ctrl + r', desc: 'Vi: Redo last undone change' },
  { category: 'Editors', cmd: '/<pattern>', desc: 'Vi: Search forward for a pattern' },
  { category: 'Editors', cmd: ':%s/old/new/g', desc: 'Vi: Replace all occurrences of old with new' },
  { category: 'Editors', cmd: 'gg', desc: 'Vi: Jump to the beginning of the file' },
  { category: 'Editors', cmd: 'G', desc: 'Vi: Jump to the end of the file' },
  { category: 'Editors', cmd: ':<number>', desc: 'Vi: Jump to a specific line number' },
  { category: 'Editors', cmd: 'v', desc: 'Vi: Enter Visual mode (Highlight text)' },
  { category: 'Editors', cmd: ':vsp', desc: 'Vi: Split screen vertically' },
  { category: 'Editors', cmd: ':bn', desc: 'Vi: Switch to next buffer/file' },
  { category: 'Editors', cmd: 'nano <file>', desc: 'Open file in Nano editor' },
  { category: 'Editors', cmd: 'Ctrl + O', desc: 'Nano: Save (Write Out) changes' },
  { category: 'Editors', cmd: 'Ctrl + X', desc: 'Nano: Exit editor' },
  { category: 'Editors', cmd: 'Ctrl + W', desc: 'Nano: Search for text' },
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
      <div className="flex flex-col lg:flex-row gap-6 items-center">
        <div className="flex-1 w-full">
          <LiveFilterBar 
            value={search} 
            onChange={setSearch} 
            placeholder="Search commands or descriptions..."
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-4 pt-1 px-1 w-full lg:w-auto no-scrollbar snap-x">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-[13px] font-bold transition-all whitespace-nowrap snap-start ${
                activeCategory === cat 
                  ? 'bg-blue text-white shadow-xl shadow-blue/30 scale-105' 
                  : 'bg-surface/80 border border-border text-text-3 hover:text-text hover:bg-hover'
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
