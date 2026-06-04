// src/lib/logger.ts
// Structured logger for KaruviLab — replaces all console.log/warn/error in production

type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  toolId?: string;
  action?: string;
  timestamp: string;
  error?: unknown;
}

const isDev = process.env.NODE_ENV === 'development';

function formatEntry(entry: LogEntry): string {
  return `[KV:${entry.level.toUpperCase()}] ${entry.timestamp} ${
    entry.toolId ? `[${entry.toolId}]` : ''
  } ${entry.action ? `(${entry.action})` : ''} ${entry.message}`;
}

export const logger = {
  info: (message: string, ctx?: Partial<Omit<LogEntry, 'level' | 'message' | 'timestamp'>>) => {
    if (!isDev) return;
    const entry: LogEntry = { level: 'info', message, timestamp: new Date().toISOString(), ...ctx };
    console.info(formatEntry(entry));
  },
  warn: (message: string, ctx?: Partial<Omit<LogEntry, 'level' | 'message' | 'timestamp'>>) => {
    const entry: LogEntry = { level: 'warn', message, timestamp: new Date().toISOString(), ...ctx };
    console.warn(formatEntry(entry));
  },
  error: (message: string, ctx?: Partial<Omit<LogEntry, 'level' | 'message' | 'timestamp'>>) => {
    const entry: LogEntry = { level: 'error', message, timestamp: new Date().toISOString(), ...ctx };
    console.error(formatEntry(entry), ctx?.error ?? '');
  },
};
