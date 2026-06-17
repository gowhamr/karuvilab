'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Share2, Copy, Check, MessageCircle, QrCode, X, ChevronDown, Lock } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { logger } from '@/src/lib/logger';

interface ShareButtonProps {
  url: string;
  title?: string;
  className?: string;
  onQrClick?: () => void;
}

const MENU_VARIANTS = {
  hidden: { opacity: 0, scale: 0.95, y: -8 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: -8 },
};

const SPRING = { type: 'spring' as const, stiffness: 300, damping: 30 };

export function ShareButton({ url, title = 'Check out this result on KaruviLab', className, onQrClick }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const hasNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      logger.error('ShareButton: clipboard write failed', { action: 'copy', error: err });
    }
    setIsOpen(false);
  }, [url]);

  const handleNativeShare = useCallback(async () => {
    try {
      await navigator.share({ title, url });
    } catch (err) {
      // User cancelled or share failed — not an error we surface
      logger.info('ShareButton: native share dismissed or failed', { action: 'nativeShare', error: err });
    }
    setIsOpen(false);
  }, [url, title]);

  const handleWhatsApp = useCallback(() => {
    const text = encodeURIComponent(`${title}\n${url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  }, [url, title]);

  const handleTwitter = useCallback(() => {
    const text = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(url);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  }, [url, title]);

  const handleQr = useCallback(() => {
    onQrClick?.();
    setIsOpen(false);
  }, [onQrClick]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen]);

  return (
    <div className={cn('relative inline-block', className)}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(v => !v)}
        aria-label="Share this result"
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={cn(
          'flex items-center gap-2 px-4 py-2.5 rounded-xl text-tiny font-bold uppercase tracking-widest-sm',
          'bg-blue text-white shadow-md shadow-blue/10 hover:bg-blue/90 active:scale-95',
          'transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue'
        )}
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
        Share
        <ChevronDown className={cn('w-3 h-3 transition-transform duration-200', isOpen && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <m.div
            ref={menuRef}
            role="menu"
            aria-label="Share options"
            variants={MENU_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={SPRING}
            className="absolute right-0 top-full mt-2 w-56 bg-surface border border-border rounded-2xl shadow-2xl shadow-black/30 overflow-hidden z-50"
          >
            {/* Copy link */}
            <button
              role="menuitem"
              onClick={handleCopy}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-text hover:bg-bg transition-colors"
             aria-label="Check">
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-text-4" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>

            {/* Native Share (mobile) */}
            {hasNativeShare && (
              <button
                role="menuitem"
                onClick={handleNativeShare}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-text hover:bg-bg transition-colors"
              >
                <Share2 className="w-4 h-4 text-text-4" />
                Share via…
              </button>
            )}

            <div className="border-t border-border/50 mx-4" />

            {/* WhatsApp */}
            <button
              role="menuitem"
              onClick={handleWhatsApp}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-text hover:bg-bg transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-green-500" />
              WhatsApp
            </button>

            {/* Twitter / X */}
            <button
              role="menuitem"
              onClick={handleTwitter}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-text hover:bg-bg transition-colors"
            >
              <svg className="w-4 h-4 text-text-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
              Twitter / X
            </button>

            {/* QR Code */}
            {onQrClick && (
              <>
                <div className="border-t border-border/50 mx-4" />
                <button
                  role="menuitem"
                  onClick={handleQr}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-text hover:bg-bg transition-colors"
                >
                  <QrCode className="w-4 h-4 text-text-4" />
                  QR Code
                </button>
              </>
            )}

            {/* Privacy note */}
            <div className="border-t border-border/50 mx-4" />
            <div className="px-4 py-3 flex items-start gap-2">
              <Lock className="w-3 h-3 text-text-4 mt-0.5 shrink-0" />
              <p className="text-tiny text-text-4 font-medium leading-relaxed">
                The shared link encodes only your calculator inputs — never personal data.
              </p>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
