'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X, Download, QrCode } from 'lucide-react';
import QRCode from 'qrcode';
import { cn } from '@/src/lib/utils';
import { logger } from '@/src/lib/logger';
import { useFocusTrap } from '@/src/lib/a11y/useFocusTrap';

interface QRModalProps {
  url: string;
  isOpen: boolean;
  onClose: () => void;
}

export function QRModal({ url, isOpen, onClose }: QRModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, isOpen);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const effectiveUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const renderQR = useCallback(() => {
    if (!canvasRef.current || !effectiveUrl) return;
    QRCode.toCanvas(
      canvasRef.current,
      effectiveUrl,
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
  }, [effectiveUrl]);

  useEffect(() => {
    if (isOpen) {
      // Small timeout to allow canvas element to be attached to DOM
      const timer = setTimeout(() => {
        renderQR();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setIsLoaded(false);
      setHasError(false);
    }
  }, [isOpen, renderQR]);

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
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-modal-backdrop"
            onClick={onClose}
          />
          
          <m.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label="QR Code"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-modal w-full max-w-sm px-4"
          >
            <div className="bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <QrCode className="w-5 h-5 text-blue" />
                  <h2 className="text-sm font-black uppercase tracking-widest text-text">Share via QR</h2>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close QR modal"
                  className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* QR Canvas */}
              <div className="flex flex-col items-center p-6 sm:p-8 gap-4 sm:gap-6">
                <div className={cn(
                  'p-4 bg-white rounded-2xl shadow-inner transition-opacity',
                  isLoaded ? 'opacity-100' : 'opacity-0 hidden'
                )}>
                  <canvas ref={canvasRef} />
                </div>

                {!isLoaded && !hasError && (
                  <div className="w-64 h-64 bg-surface-2 rounded-2xl flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-blue border-t-transparent rounded-full animate-spin" />
                  </div>
                )}

                {hasError && (
                  <div className="w-full p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs sm:text-sm font-bold text-center">
                    Failed to generate QR code. Please try copying the link instead.
                  </div>
                )}

                <p className="text-xs text-text-muted font-medium text-center leading-relaxed max-w-xs break-all">
                  Scan to open this link on another device
                </p>

                {isLoaded && (
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-blue/10 hover:bg-blue/90 active:scale-95 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue cursor-pointer"
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
