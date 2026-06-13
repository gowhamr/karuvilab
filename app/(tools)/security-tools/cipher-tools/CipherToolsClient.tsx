'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Lock, ArrowLeftRight, Play, Square, Info, ShieldAlert, Sparkles } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { cn } from '@/src/lib/utils';
import { CopyButton } from '@/components/ui/CopyButton';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { useCiphers, CipherType } from './useCiphers';

const CIPHER_METADATA: Record<CipherType, { name: string; type: string; security: string; desc: string; history: string }> = {
  caesar: {
    name: "Caesar Cipher",
    type: "Monoalphabetic Substitution",
    security: "None (Easily cracked via frequency analysis)",
    desc: "Shifts letters by a fixed number of positions in the alphabet.",
    history: "Used by Julius Caesar in 50 BC to protect military correspondence."
  },
  rot13: {
    name: "ROT13",
    type: "Monoalphabetic Substitution (Caesar Shift 13)",
    security: "None (Reciprocal cipher, running it twice returns plaintext)",
    desc: "Shifts letters by exactly 13 places. Same algorithm encodes and decodes.",
    history: "Commonly used on internet forums to hide spoilers and punchlines."
  },
  rot47: {
    name: "ROT47",
    type: "Extended ASCII Substitution",
    security: "None (Obfuscation only)",
    desc: "Shifts letters and common symbols by 47 places in ASCII range 33-126.",
    history: "A variation of ROT13 that can scramble numbers, spaces, and punctuation."
  },
  atbash: {
    name: "Atbash Cipher",
    type: "Monoalphabetic Substitution",
    security: "None (Constant mapping, easily deciphered)",
    desc: "Reverses the alphabet (A becomes Z, B becomes Y, etc.).",
    history: "Originally used in the Hebrew Bible and ancient Jewish texts."
  },
  vigenere: {
    name: "Vigenère Cipher",
    type: "Polyalphabetic Substitution",
    security: "Low (Broken via Kasiski examination/index of coincidence)",
    desc: "Encrypts alphabetic text using a keyword to shift letters repeatedly.",
    history: "Invented in 1553. Described as 'le chiffre indéchiffrable' (the indecipherable cipher) for centuries."
  },
  xor: {
    name: "XOR Cipher",
    type: "Symmetric Bitwise Stream Cipher",
    security: "Medium-Low (Vulnerable to known-plaintext attacks)",
    desc: "Performs bitwise XOR operations between characters and a key. Outputs hexadecimal.",
    history: "Fundamental operation used in modern cryptography (AES, One-Time Pad)."
  },
  morse: {
    name: "Morse Code",
    type: "Variable-Length Character Encoding",
    security: "None (Not encryption, just encoding)",
    desc: "Represents alphabetic letters, numbers, and symbols as sequences of dots and dashes.",
    history: "Developed in 1837 for the electrical telegraph system by Samuel Morse."
  }
};

export default function CipherToolsClient() {
  const [activeCipher, setActiveCipher] = useState<CipherType>('caesar');
  const [input, setInput] = useState<string>('Hello, KaruviLab!');
  const [isEncode, setIsEncode] = useState<boolean>(true);
  
  // Options
  const [caesarShift, setCaesarShift] = useState<number>(3);
  const [vigenereKey, setVigenereKey] = useState<string>('KEY');
  const [xorKey, setXorKey] = useState<string>('secret');
  
  // Morse Audio & Blink State
  const [isPlaying, setIsPlaying] = useState(false);
  const [blinkState, setBlinkState] = useState<'off' | 'dot' | 'dash'>('off');

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const timeoutIdsRef = useRef<number[]>([]);

  const { output, letterStats } = useCiphers({
    input, 
    activeCipher, 
    isEncode, 
    options: { caesarShift, vigenereKey, xorKey }
  });

  const swap = () => {
    setInput(output);
    setIsEncode(!isEncode);
  };

  const stopMorse = useCallback(() => {
    timeoutIdsRef.current.forEach(clearTimeout);
    timeoutIdsRef.current = [];
    try {
      if (oscRef.current) { oscRef.current.stop(); oscRef.current = null; }
      if (audioCtxRef.current) { audioCtxRef.current.close(); audioCtxRef.current = null; }
    } catch (e) {}
    setIsPlaying(false);
    setBlinkState('off');
  }, []);

  const playMorse = async () => {
    if (isPlaying) { stopMorse(); return; }
    if (!output || activeCipher !== 'morse' || !isEncode) return;
    setIsPlaying(true);
    timeoutIdsRef.current.forEach(clearTimeout);
    timeoutIdsRef.current = [];
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const audioCtx = new AudioContextClass();
    audioCtxRef.current = audioCtx;
    const dotLen = 80; 
    let time = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    oscRef.current = osc;
    osc.type = 'sine'; osc.frequency.value = 600;
    osc.connect(gain); gain.connect(audioCtx.destination);
    gain.gain.setValueAtTime(0, time);
    osc.start(time);
    let delay = 0;
    const timeouts: number[] = [];
    for (const char of output) {
      if (char === '.') {
        gain.gain.setValueAtTime(1, time); time += dotLen / 1000;
        gain.gain.setValueAtTime(0, time); time += dotLen / 1000;
        const currentDelay = delay;
        timeouts.push(window.setTimeout(() => setBlinkState('dot'), currentDelay));
        timeouts.push(window.setTimeout(() => setBlinkState('off'), currentDelay + dotLen));
        delay += dotLen * 2;
      } else if (char === '-') {
        gain.gain.setValueAtTime(1, time); time += (dotLen * 3) / 1000;
        gain.gain.setValueAtTime(0, time); time += dotLen / 1000;
        const currentDelay = delay;
        timeouts.push(window.setTimeout(() => setBlinkState('dash'), currentDelay));
        timeouts.push(window.setTimeout(() => setBlinkState('off'), currentDelay + dotLen * 3));
        delay += dotLen * 4;
      } else if (char === ' ') { time += (dotLen * 3) / 1000; delay += dotLen * 3; }
      else if (char === '/') { time += (dotLen * 7) / 1000; delay += dotLen * 7; }
    }
    osc.stop(time);
    timeoutIdsRef.current = timeouts;
    osc.onended = () => { setIsPlaying(false); setBlinkState('off'); audioCtxRef.current = null; oscRef.current = null; };
  };

  useEffect(() => { return () => stopMorse(); }, [stopMorse]);
  useEffect(() => { stopMorse(); }, [activeCipher, stopMorse]);

  const activeMeta = CIPHER_METADATA[activeCipher];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex bg-surface border border-border p-2 rounded-2xl overflow-x-auto no-scrollbar snap-x">
        {(['caesar', 'rot13', 'rot47', 'atbash', 'vigenere', 'xor', 'morse'] as CipherType[]).map(c => (
          <button key={c} onClick={() => setActiveCipher(c)}
            className={cn("flex-shrink-0 px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all snap-start outline-none",
              activeCipher === c ? "bg-blue text-white shadow-md shadow-blue/20" : "text-text-4 hover:text-text hover:bg-bg")}>
            {c}
          </button>
        ))}
      </div>

      <div className="bg-surface border border-border rounded-4xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <SegmentedControl options={[{ id: 'encode', label: 'Encode' }, { id: 'decode', label: 'Decode' }]}
            activeId={isEncode ? 'encode' : 'decode'} onChange={(id) => setIsEncode(id === 'encode')} />
          
          <div className="w-full md:w-auto">
            <AnimatePresence mode="popLayout">
              {activeCipher === 'caesar' && (
                <m.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-center gap-4 bg-bg border border-border px-6 py-3 rounded-2xl w-full md:w-80 shadow-premium">
                  <label className="text-xs font-black uppercase tracking-widest text-text-3 w-20 shrink-0 text-micro">Shift: {caesarShift}</label>
                  <input type="range" min={1} max={25} value={caesarShift} onChange={e => setCaesarShift(Number(e.target.value))} className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer accent-blue outline-none" />
                </m.div>
              )}
              {activeCipher === 'vigenere' && (
                <m.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-center gap-3 bg-bg border border-border px-4 py-2 rounded-2xl w-full md:w-80 shadow-premium">
                  <label className="text-xs font-black uppercase tracking-widest text-text-3 shrink-0 text-micro">Key:</label>
                  <input type="text" value={vigenereKey} onChange={e => setVigenereKey(e.target.value.toUpperCase())} className="w-full bg-surface border border-border rounded-xl px-3 py-1.5 font-mono text-xs text-text focus:ring-2 focus:ring-blue/20 outline-none" placeholder="KEYWORD" />
                </m.div>
              )}
              {activeCipher === 'xor' && (
                <m.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-center gap-3 bg-bg border border-border px-4 py-2 rounded-2xl w-full md:w-80 shadow-premium">
                  <label className="text-xs font-black uppercase tracking-widest text-text-3 shrink-0 text-micro">XOR Key:</label>
                  <input type="text" value={xorKey} onChange={e => setXorKey(e.target.value)} className="w-full bg-surface border border-border rounded-xl px-3 py-1.5 font-mono text-xs text-text focus:ring-2 focus:ring-blue/20 outline-none" placeholder="Secret Key" />
                </m.div>
              )}
              {activeCipher === 'morse' && isEncode && (
                <m.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-center gap-4 bg-bg border border-border px-5 py-2.5 rounded-2xl shadow-premium">
                  <button onClick={playMorse} disabled={!output} className={cn("flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all", isPlaying ? "bg-error text-white" : "bg-blue text-white active:scale-95 disabled:opacity-50")}>
                    {isPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>{isPlaying ? 'Stop' : 'Play'}</span>
                  </button>
                  <div className="flex items-center gap-2.5">
                    <div className={cn("w-4 h-4 rounded-full transition-all duration-75", blinkState === 'off' && "bg-border/60 shadow-none", blinkState === 'dot' && "bg-yellow-400 shadow-lg scale-110", blinkState === 'dash' && "bg-yellow-400 shadow-xl scale-125 w-7 h-4 rounded-md")} />
                    <span className="text-micro font-black uppercase tracking-widest text-text-4 w-12">{blinkState === 'off' ? 'Idle' : blinkState.toUpperCase()}</span>
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue">{isEncode ? 'Plaintext' : 'Ciphertext'}</h3>
              <button onClick={() => setInput('')} className="text-xs font-black uppercase tracking-widest text-error hover:underline">Clear</button>
            </div>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text..." className="w-full h-64 bg-bg border border-border rounded-3xl p-6 font-mono text-sm text-text focus:ring-4 focus:ring-blue/10 outline-none transition-all resize-none" />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden lg:block">
            <button onClick={swap} className="w-10 h-10 bg-blue text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 shadow-md shadow-blue/10 transition-all border border-border"><ArrowLeftRight className="w-4 h-4" /></button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between min-h-[20px]"><h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-4">{isEncode ? 'Ciphertext' : 'Plaintext'}</h3><CopyButton text={output} /></div>
            <textarea readOnly value={output} placeholder="Output..." className="w-full h-64 bg-mat-base border border-mat-border rounded-3xl p-6 font-mono text-sm text-text-2 outline-none resize-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-border/60">
          <div className="md:col-span-2 bg-bg border border-border rounded-2xl p-5 md:p-6 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-text-3">Frequency Analysis</h4>
            <div className="flex items-end justify-between gap-1 h-32 pt-2 border-b border-border">
              {Array.from({ length: 26 }).map((_, i) => {
                const char = String.fromCharCode(65 + i);
                const inPct = (letterStats.inputCounts[i] / letterStats.inputMax) * 100;
                const outPct = (letterStats.outputCounts[i] / letterStats.outputMax) * 100;
                return (
                  <div key={char} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <div className="w-full flex items-end gap-[1.5px] h-24">
                      <div style={{ height: `${inPct}%` }} className="flex-1 bg-blue/40 rounded-t-sm" />
                      <div style={{ height: `${outPct}%` }} className="flex-1 bg-brand-primary/40 rounded-t-sm" />
                    </div>
                    <span className="text-micro font-black text-text-4">{char}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-bg border border-border rounded-2xl p-5 md:p-6 space-y-4">
            <div className="flex items-center gap-2 text-blue"><Info className="w-4 h-4" /><h4 className="text-xs font-black uppercase tracking-widest text-text">Insight</h4></div>
            <div className="space-y-3 text-xs leading-relaxed text-text-2 font-medium">
              <div><p className="text-tiny font-black uppercase tracking-widest text-text-4 mb-0.5">Algorithm</p><p className="font-bold text-text">{activeMeta.name}</p></div>
              <div><p className="text-tiny font-black uppercase tracking-widest text-text-4 mb-0.5">Security</p><p className="font-bold text-text-2">{activeMeta.security}</p></div>
              <div><p className="text-tiny font-black uppercase tracking-widest text-text-4 mb-0.5">Summary</p><p className="text-text-3 text-xs leading-normal">{activeMeta.desc}</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
