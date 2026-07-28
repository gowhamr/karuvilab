'use client';

import React, { useState, useEffect } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { m, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, Shield, Activity, HardDrive, Database } from 'lucide-react';
import { useNetworkQuality } from '@/src/lib/hooks';
import { ALL_TOOLS, findToolByPath } from '@/src/tool-registry';
import { usePathname } from 'next/navigation';

export function OfflineSyncIndicator() {
  const { isOnline, trueInternet, effectiveType, downlink, rtt } = useNetworkQuality();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [storageUsage, setStorageUsage] = useState<string | null>(null);

  useEffect(() => {
    Promise.resolve().then(() => {
      setMounted(true);
      if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
        navigator.storage.estimate().then(estimate => {
          if (estimate.usage !== undefined) {
            const mb = (estimate.usage / (1024 * 1024)).toFixed(1);
            setStorageUsage(`${mb} MB used`);
          }
        }).catch(() => {});
      }
    });
  }, []);

  const currentTool = findToolByPath(pathname);
  const requiresNetwork = currentTool?.requiresNetwork;
  
  const isFullyOnline = isOnline && trueInternet;

  let status: 'online' | 'degraded' | 'cached' | 'offline' = 'online';
  if (mounted) {
    if (isOnline && !trueInternet) {
      status = 'degraded';
    } else if (!isOnline) {
      if (requiresNetwork) {
        status = 'offline';
      } else {
        status = 'cached';
      }
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
      title: 'Online — Fully Operational',
      desc: 'You have a stable internet connection. All tools and real-time APIs are ready.',
    },
    degraded: {
      dotColor: 'bg-amber-500',
      label: 'Limited',
      icon: WifiOff,
      title: 'Connected, but no Internet',
      desc: 'Your device is connected to a network, but we cannot reach the internet. Only offline tools will work.',
    },
    cached: {
      dotColor: 'bg-amber-500',
      label: 'Cached',
      icon: WifiOff,
      title: 'Offline — Using Local Data',
      desc: 'Operating offline. Core utilities remain fully functional and private on your device.',
    },
    offline: {
      dotColor: 'bg-error',
      label: 'Offline',
      icon: WifiOff,
      title: 'Offline — Degraded Mode',
      desc: 'No connection. The current tool requires a live network and is currently unavailable.',
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
          title={current.title}
          aria-label={`Connection status: ${status}`}
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
          className="z-modal w-[340px] bg-surface border border-border rounded-3xl shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200 outline-none"
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

          {/* Current Tool Context & Cache Status */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-bg border border-border/50 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-success">
                <Database className="w-4 h-4" />
                <span className="text-tiny font-bold uppercase tracking-widest-sm">Local Storage</span>
              </div>
              <p className="text-xs text-text-3">{storageUsage || "Measuring..."}</p>
            </div>
            
            <div className="p-3 bg-bg border border-border/50 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-blue">
                <HardDrive className="w-4 h-4" />
                <span className="text-tiny font-bold uppercase tracking-widest-sm">{currentTool ? "Current Tool" : "Current Page"}</span>
              </div>
              <p className="text-xs text-text-3">
                {currentTool ? (requiresNetwork ? "Requires Network" : "Browser Isolated") : "Browser Isolated"}
              </p>
            </div>
          </div>

          {/* Network Quality Metrics */}
          {isFullyOnline && (effectiveType || downlink !== null || rtt !== null) && (
            <div className="p-3 bg-bg border border-border/50 rounded-xl space-y-2">
               <div className="flex items-center gap-1.5 text-text-2">
                <Activity className="w-4 h-4" />
                <span className="text-tiny font-bold uppercase tracking-widest-sm">Network Quality</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {effectiveType && (
                  <div>
                    <div className="text-[10px] text-text-4 font-bold uppercase tracking-wider mb-0.5">Type</div>
                    <div className="text-xs font-mono text-text">{effectiveType.toUpperCase()}</div>
                  </div>
                )}
                {downlink !== null && (
                  <div>
                    <div className="text-[10px] text-text-4 font-bold uppercase tracking-wider mb-0.5">Speed</div>
                    <div className="text-xs font-mono text-text">{downlink} Mbps</div>
                  </div>
                )}
                {rtt !== null && (
                  <div>
                    <div className="text-[10px] text-text-4 font-bold uppercase tracking-wider mb-0.5">Latency</div>
                    <div className="text-xs font-mono text-text">{rtt} ms</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Privacy Note */}
          <div className="flex items-start gap-3 p-3 bg-bg border border-border/50 rounded-2xl">
            <Shield className="w-4 h-4 text-success shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="text-tiny font-bold uppercase tracking-widest-sm text-text-2">100% Client-Side</h4>
              <p className="text-xs text-text-3 leading-normal">
                KaruviLab processes all sensitive data in-browser. Your inputs are never transmitted to external servers.
              </p>
            </div>
          </div>

        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
