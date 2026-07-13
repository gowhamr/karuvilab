'use client';

import React, { useState, useEffect } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { m, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, Shield } from 'lucide-react';
import { useOnlineStatus } from '@/src/lib/hooks';
import { ALL_TOOLS, findToolByPath } from '@/src/tool-registry';
import { usePathname } from 'next/navigation';

export function OfflineSyncIndicator() {
  const isOnline = useOnlineStatus();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    Promise.resolve().then(() => {
      setMounted(true);
    });
  }, []);

  const currentTool = findToolByPath(pathname);
  const requiresNetwork = currentTool?.requiresNetwork;

  let status: 'online' | 'cached' | 'offline' = 'online';
  if (mounted && !isOnline) {
    if (requiresNetwork) {
      status = 'offline';
    } else {
      status = 'cached';
    }
  }

  const networkTools = ALL_TOOLS.filter(t => t.requiresNetwork);

  if (!mounted) {
    return (
      <div className="w-11 h-11 md:w-10 md:h-10 rounded-xl bg-surface border border-border shimmer-wrapper opacity-50" />
    );
  }

  const statusConfig = {
    online: {
      dotColor: 'bg-success',
      label: 'Online',
      icon: Wifi,
      title: 'Online — All Tools Available',
      desc: 'You are connected to the network. All tools, real-time APIs, and integrations are fully operational.',
    },
    cached: {
      dotColor: 'bg-warn',
      label: 'Cached',
      icon: WifiOff,
      title: 'Cached — Using Local Data',
      desc: 'Operating offline with local data. All cached core utilities remain 100% functional, secure, and private on your device.',
    },
    offline: {
      dotColor: 'bg-error',
      label: 'Offline',
      icon: WifiOff,
      title: 'Offline — Local Tools Only',
      desc: 'No connection. Tools that require a live network connection are currently unavailable.',
    },
  };

  const current = statusConfig[status];
  const Icon = current.icon;

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className={`
            w-11 h-11 md:w-auto md:h-10
            flex items-center justify-center gap-2 
            px-0 md:px-3 rounded-xl 
            bg-surface border border-border 
            hover:bg-mat-hover hover:text-blue transition-colors
            relative overflow-hidden group outline-none
            ${status === 'online' ? 'text-text hover:border-success/30' : 'text-amber-500 hover:border-warn/30'}
          `}
          title={status === 'online' ? "Online — all tools ready" : "Offline — tools still work locally"}
          aria-label={status === 'online' ? "Connection status: online" : "Connection status: offline"}
        >
          <span className="relative flex h-2 w-2">
            {status !== 'online' && (
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.dotColor}`} />
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${current.dotColor}`} />
          </span>
          <Icon className="w-4 h-4" />
          <span className="hidden md:inline text-tiny font-bold uppercase tracking-widest-sm">{current.label}</span>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className="z-modal w-80 bg-surface border border-border rounded-3xl shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200 outline-none"
        >
          {/* Header Status */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-tiny font-bold uppercase tracking-widest-sm text-text-4">
              <span className={`w-2 h-2 rounded-full ${current.dotColor}`} />
              Sync Status
            </div>
            <h3 className="text-sm font-black text-text tracking-tight">{current.title}</h3>
            <p className="text-xs text-text-3 leading-relaxed">{current.desc}</p>
          </div>

          <div className="h-px bg-border/50" />

          {/* Privacy Note */}
          <div className="flex items-start gap-3 p-3 bg-bg border border-border/50 rounded-2xl">
            <Shield className="w-4 h-4 text-success shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="text-tiny font-bold uppercase tracking-widest-sm text-text-2">100% Client-Side</h4>
              <p className="text-xs text-text-3 leading-normal">
                KaruviLab processes all sensitive data in-browser. Your inputs are never transmitted to any external servers.
              </p>
            </div>
          </div>

          {/* Network-dependent Tools List */}
          <div className="space-y-2.5">
            <h4 className="text-tiny font-bold uppercase tracking-widest-sm text-text-4">
              Network Requirements
            </h4>
            <div className="space-y-1.5">
              {networkTools.map(t => {
                const isToolAvailable = isOnline;
                return (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-bg/50 border border-border/40 text-xs"
                  >
                    <span className="font-bold text-text-2">{t.name}</span>
                    <span
                      className={`
                        px-2 py-0.5 rounded-full text-tiny font-black uppercase tracking-wider border
                        ${
                          isToolAvailable
                            ? 'bg-success/5 border-success/15 text-success'
                            : 'bg-error/5 border-error/15 text-error'
                        }
                      `}
                    >
                      {isToolAvailable ? 'Available' : 'Offline'}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-tiny text-text-4 leading-normal italic">
              All other 100+ tools are offline-capable and serve directly from local cache storage.
            </p>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
