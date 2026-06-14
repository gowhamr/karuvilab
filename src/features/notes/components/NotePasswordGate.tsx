'use client';

import React from 'react';
import { Lock, Key } from 'lucide-react';

interface NotePasswordGateProps {
  isEncrypted: boolean;
  isEncrypting: boolean;
  unlockPassword: string;
  setUnlockPassword: (val: string) => void;
  unlockError: string;
  onUnlockSubmit: (e: React.FormEvent) => void;
  onCancelUnlock: () => void;
  encryptionPassword: string;
  setEncryptionPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  encryptionError: string;
  onEncryptSubmit: (e: React.FormEvent) => void;
  onCancelEncrypt: () => void;
}

export function NotePasswordGate({
  isEncrypted,
  isEncrypting,
  unlockPassword,
  setUnlockPassword,
  unlockError,
  onUnlockSubmit,
  onCancelUnlock,
  encryptionPassword,
  setEncryptionPassword,
  confirmPassword,
  setConfirmPassword,
  encryptionError,
  onEncryptSubmit,
  onCancelEncrypt
}: NotePasswordGateProps) {
  if (isEncrypted && !isEncrypting) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-error/10 text-error flex items-center justify-center shadow-lg shadow-error/10">
          <Lock size={32} />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-text">Secure Encrypted Note</h3>
          <p className="text-sm text-text-3">
            This note is locked with AES-256 encryption. Enter the password to decrypt it.
          </p>
        </div>
        <form onSubmit={onUnlockSubmit} className="w-full space-y-4">
          <input
            type="password"
            value={unlockPassword}
            onChange={(e) => setUnlockPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-bg border border-border rounded-2xl py-3 px-4 text-center text-sm focus:outline-none focus:border-blue/50 focus:ring-4 focus:ring-blue/5 transition-all"
            autoFocus
          />
          {unlockError && (
            <p className="text-xs text-error font-semibold animate-pulse">{unlockError}</p>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancelUnlock}
              className="flex-1 py-3 px-4 bg-surface hover:bg-bg border border-border rounded-xl text-xs font-black uppercase tracking-widest text-text-3 hover:text-text transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-blue hover:bg-blue/90 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue/20"
            >
              Unlock
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (isEncrypting) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-blue/10 text-blue flex items-center justify-center shadow-lg shadow-blue/10">
          <Key size={32} />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-text">Encrypt Note</h3>
          <p className="text-sm text-text-3">
            Set a password to encrypt this note. Make sure to remember it, as it cannot be recovered.
          </p>
        </div>
        <form onSubmit={onEncryptSubmit} className="w-full space-y-4">
          <input
            type="password"
            value={encryptionPassword}
            onChange={(e) => setEncryptionPassword(e.target.value)}
            placeholder="Enter Password"
            className="w-full bg-bg border border-border rounded-2xl py-3 px-4 text-center text-sm focus:outline-none focus:border-blue/50 focus:ring-4 focus:ring-blue/5 transition-all"
            autoFocus
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="w-full bg-bg border border-border rounded-2xl py-3 px-4 text-center text-sm focus:outline-none focus:border-blue/50 focus:ring-4 focus:ring-blue/5 transition-all"
          />
          {encryptionError && (
            <p className="text-xs text-error font-semibold">{encryptionError}</p>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancelEncrypt}
              className="flex-1 py-3 px-4 bg-surface hover:bg-bg border border-border rounded-xl text-xs font-black uppercase tracking-widest text-text-3 hover:text-text transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-blue hover:bg-blue/90 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue/20"
            >
              Encrypt
            </button>
          </div>
        </form>
      </div>
    );
  }

  return null;
}
