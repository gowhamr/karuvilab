'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X, Download, QrCode } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { logger } from '@/src/lib/logger';

interface QRModalProps {
  url: string;
  isOpen: boolean;
  onClose: () => void;
}

const OVERLAY_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const MODAL_VARIANTS = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9, y: 20 },
};

const SPRING = { type: 'spring' as const, stiffness: 300, damping: 30 };

export function QRModal({ url, isOpen, onClose }: QRModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  const renderQR = useCallback(() => {
    if (!canvasRef.current || !window.QRCode) return;
    window.QRCode.toCanvas(
      canvasRef.current,
      url,
      {
        width: 256,
        margin: 2,
        errorCorrectionLevel: 'M',
        color: { dark: '#0F172A', light: '#F8FAFC' },
      },
      (err) => {
        if (err) {
          logger.error('QRModal: QR render failed', { action: 'renderQR', error: err });
          setHasError(true);
        } else {
          setIsLoaded(true);
          setHasError(false);
        }
      }
    );
  }, [url]);

  useEffect(() => {
    if (!isOpen) return;

    if (window.QRCode) {
      renderQR();
      return;
    }

    // Load QRCode from CDN
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/qrcode@1.5.3/build/qrcode.min.js';
    script.async = true;
    script.onload = () => renderQR();
    script.onerror = () => {
      logger.error('QRModal: failed to load QRCode script from CDN', { action: 'loadScript' });
      setHasError(true);
    };
    document.head.appendChild(script);
    scriptRef.current = script;
  }, [isOpen, renderQR]);

  // Re-render if URL changes while open
  useEffect(() => {
    if (isOpen && window.QRCode) {
      renderQR();
    }
  }, [url, isOpen, renderQR]);

  // Cleanup script on unmount
  useEffect(() => {
    return () => {
      if (scriptRef.current && !window.QRCode) {
        document.head.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
    };
  }, []);

  const handleDownload = useCallback(() => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'karuvilab-qr.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  }, []);

  // Trap focus and close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          {/* NOTE: z-50 shared across modal overlays (SearchOverlay, QRModal, TimezoneSearchModal, SessionRestoredBanner). Safe because only one modal renders at a time. */}
          <m.div
            variants={OVERLAY_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          {/* NOTE: z-50 shared across modal overlays (SearchOverlay, QRModal, TimezoneSearchModal, SessionRestoredBanner). Safe because only one modal renders at a time. */}
          <m.div
            role="dialog"
            aria-modal="true"
            aria-label="QR Code for sharing"
            variants={MODAL_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={SPRING}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm"
          >
            <div className="bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <QrCode className="w-5 h-5 text-blue" />
                  <h2 className="text-sm font-black uppercase tracking-widest">Share via QR</h2>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close QR modal"
                  className="p-2 rounded-lg text-text-4 hover:text-text hover:bg-bg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* QR Canvas */}
              <div className="flex flex-col items-center p-8 gap-6">
                <div className={cn(
                  'p-4 bg-white rounded-2xl shadow-inner transition-opacity',
                  isLoaded ? 'opacity-100' : 'opacity-0'
                )}>
                  <canvas ref={canvasRef} />
                </div>

                {!isLoaded && !hasError && (
                  <div className="w-[256px] h-[256px] bg-bg rounded-2xl flex items-center justify-center">
                    <div className="w-8 h-8 border border-blue border-t-transparent rounded-full animate-spin" />
                  </div>
                )}

                {hasError && (
                  <div className="w-full p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-bold text-center">
                    Failed to generate QR code. Please try copying the link instead.
                  </div>
                )}

                <p className="text-[10px] text-text-4 font-medium text-center leading-relaxed max-w-xs">
                  Scan to open this shared result on any device
                </p>

                {isLoaded && (
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue text-white text-xs font-black uppercase tracking-widest shadow-md shadow-blue/10 hover:bg-blue/90 active:scale-95 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download PNG
                  </button>
                )}
              </div>
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
}
