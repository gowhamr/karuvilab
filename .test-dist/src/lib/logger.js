// src/lib/logger.ts
// Structured logger for KaruviLab — replaces all console.log/warn/error in production
const isDev = process.env.NODE_ENV === 'development';
function formatEntry(entry) {
    return `[KV:${entry.level.toUpperCase()}] ${entry.timestamp} ${entry.toolId ? `[${entry.toolId}]` : ''} ${entry.action ? `(${entry.action})` : ''} ${entry.message}`;
}
export const logger = {
    info: (message, ctx) => {
        if (!isDev)
            return;
        const entry = { level: 'info', message, timestamp: new Date().toISOString(), ...ctx };
        console.info(formatEntry(entry));
    },
    warn: (message, ctx) => {
        const entry = { level: 'warn', message, timestamp: new Date().toISOString(), ...ctx };
        console.warn(formatEntry(entry));
    },
    error: (message, ctx) => {
        const entry = { level: 'error', message, timestamp: new Date().toISOString(), ...ctx };
        console.error(formatEntry(entry), ctx?.error ?? '');
    },
};
