'use client';

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Lock, ArrowLeftRight, Play, Square, Info, ShieldAlert, Sparkles } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { cn } from '@/src/lib/utils';
import { CopyButton } from '@/components/ui/CopyButton';
import { SegmentedControl } from '@/components/ui/SegmentedControl';

type CipherType = 'caesar' | 'rot13' | 'rot47' | 'atbash' | 'xor' | 'vigenere' | 'morse';

// Pure Functions
function caesar(text: string, shift: number): string {
  return text.replace(/[a-zA-Z]/g, (char) => {
    const base = char <= 'Z' ? 65 : 97;
    return String.fromCharCode(((char.charCodeAt(0) - base + (shift % 26) + 26) % 26) + base);
  });
}

function rot47(text: string): string {
  const result = [];
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    if (charCode >= 33 && charCode <= 126) {
      result.push(String.fromCharCode(33 + ((charCode + 14) % 94)));
    } else {
      result.push(text.charAt(i));
    }
  }
  return result.join('');
}

function atbash(text: string): string {
  return text.replace(/[a-zA-Z]/g, (char) => {
    const base = char <= 'Z' ? 65 : 97;
    return String.fromCharCode(base + 25 - (char.charCodeAt(0) - base));
  });
}

function vigenere(text: string, key: string, decrypt: boolean = false): string {
  if (!key) return text;
  let keyIndex = 0;
  key = key.toUpperCase().replace(/[^A-Z]/g, '');
  if (!key) return text;

  return text.replace(/[a-zA-Z]/g, (char) => {
    const base = char <= 'Z' ? 65 : 97;
    const shift = key.charCodeAt(keyIndex % key.length)! - 65;
    keyIndex++;
    return String.fromCharCode(((char.charCodeAt(0) - base + (decrypt ? -shift : shift) + 26) % 26) + base);
  });
}

function xorConvert(text: string, key: string, isDecrypt: boolean = false): string {
  if (!key) return text;
  
  let inputChars: number[] = [];
  if (isDecrypt) {
    // hex to chars
    const hex = text.replace(/\s+/g, '');
    for (let i = 0; i < hex.length; i += 2) {
      inputChars.push(parseInt(hex.substring(i, i + 2), 16));
    }
  } else {
    for (let i = 0; i < text.length; i++) inputChars.push(text.charCodeAt(i));
  }

  const result = [];
  for (let i = 0; i < inputChars.length; i++) {
    if (isNaN(inputChars[i]!)) continue;
    const charCode = inputChars[i]! ^ key.charCodeAt(i % key.length)!;
    if (isDecrypt) {
      result.push(String.fromCharCode(charCode));
    } else {
      result.push(charCode.toString(16).padStart(2, '0'));
    }
  }
  return result.join(isDecrypt ? '' : ' ');
}

const MORSE_MAP: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....',
  'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.',
  'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
  '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', ' ': '/',
};
const REVERSE_MORSE = Object.fromEntries(Object.entries(MORSE_MAP).map(([k, v]) => [v, k]));

function textToMorse(text: string): string {
  return text.toUpperCase().split('').map(c => MORSE_MAP[c] || c).join(' ');
}
function morseToText(morse: string): string {
  return morse.split(' ').map(c => REVERSE_MORSE[c] || (c === '/' ? ' ' : c)).join('');
}

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

  const output = useMemo(() => {
    if (!input) return '';
    try {
      switch (activeCipher) {
        case 'caesar': return caesar(input, isEncode ? caesarShift : -caesarShift);
        case 'rot13': return caesar(input, 13);
        case 'rot47': return rot47(input);
        case 'atbash': return atbash(input);
        case 'vigenere': return vigenere(input, vigenereKey, !isEncode);
        case 'xor': return xorConvert(input, xorKey, !isEncode);
        case 'morse': return isEncode ? textToMorse(input) : morseToText(input);
        default: return input;
      }
    } catch {
      return 'Error processing cipher.';
    }
  }, [input, activeCipher, isEncode, caesarShift, vigenereKey, xorKey]);

  // Frequency analysis calculation
  const letterStats = useMemo(() => {
    const inputCounts = new Array(26).fill(0);
    const outputCounts = new Array(26).fill(0);

    const cleanInput = input.toUpperCase().replace(/[^A-Z]/g, '');
    const cleanOutput = output.toUpperCase().replace(/[^A-Z]/g, '');

    for (let i = 0; i < cleanInput.length; i++) {
      const code = cleanInput.charCodeAt(i) - 65;
      if (code >= 0 && code < 26) inputCounts[code]++;
    }

    for (let i = 0; i < cleanOutput.length; i++) {
      const code = cleanOutput.charCodeAt(i) - 65;
      if (code >= 0 && code < 26) outputCounts[code]++;
    }

    const inputMax = Math.max(...inputCounts, 1);
    const outputMax = Math.max(...outputCounts, 1);

    return {
      inputCounts,
      outputCounts,
      inputMax,
      outputMax,
      inputTotal: cleanInput.length,
      outputTotal: cleanOutput.length
    };
  }, [input, output]);

  const swap = () => {
    setInput(output);
    setIsEncode(!isEncode);
  };

  const stopMorse = useCallback(() => {
    // Clear blink timeouts
    timeoutIdsRef.current.forEach(clearTimeout);
    timeoutIdsRef.current = [];

    // Stop audio context
    try {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    } catch (e) {
      // ignore
    }

    setIsPlaying(false);
    setBlinkState('off');
  }, []);

  const playMorse = async () => {
    if (isPlaying) {
      stopMorse();
      return;
    }
    if (!output || activeCipher !== 'morse' || !isEncode) return;
    setIsPlaying(true);
    
    timeoutIdsRef.current.forEach(clearTimeout);
    timeoutIdsRef.current = [];

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const audioCtx = new AudioContextClass();
    audioCtxRef.current = audioCtx;

    const dotLen = 80; // ms
    let time = audioCtx.currentTime;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    oscRef.current = osc;
    
    osc.type = 'sine';
    osc.frequency.value = 600;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    gain.gain.setValueAtTime(0, time);
    osc.start(time);

    let delay = 0;
    const timeouts: number[] = [];

    for (const char of output) {
      if (char === '.') {
        gain.gain.setValueAtTime(1, time);
        time += dotLen / 1000;
        gain.gain.setValueAtTime(0, time);
        time += dotLen / 1000;

        const currentDelay = delay;
        const t1 = window.setTimeout(() => setBlinkState('dot'), currentDelay);
        const t2 = window.setTimeout(() => setBlinkState('off'), currentDelay + dotLen);
        timeouts.push(t1, t2);

        delay += dotLen * 2;
      } else if (char === '-') {
        gain.gain.setValueAtTime(1, time);
        time += (dotLen * 3) / 1000;
        gain.gain.setValueAtTime(0, time);
        time += dotLen / 1000;

        const currentDelay = delay;
        const t1 = window.setTimeout(() => setBlinkState('dash'), currentDelay);
        const t2 = window.setTimeout(() => setBlinkState('off'), currentDelay + dotLen * 3);
        timeouts.push(t1, t2);

        delay += dotLen * 4;
      } else if (char === ' ') {
        time += (dotLen * 3) / 1000;
        delay += dotLen * 3;
      } else if (char === '/') {
        time += (dotLen * 7) / 1000;
        delay += dotLen * 7;
      }
    }

    osc.stop(time);
    timeoutIdsRef.current = timeouts;

    osc.onended = () => {
      setIsPlaying(false);
      setBlinkState('off');
      audioCtxRef.current = null;
      oscRef.current = null;
    };
  };

  // Stop morse on unmount or cipher change
  useEffect(() => {
    return () => stopMorse();
  }, [stopMorse]);

  useEffect(() => {
    stopMorse();
  }, [activeCipher, stopMorse]);

  const activeMeta = CIPHER_METADATA[activeCipher];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Category Selection Bar */}
      <div className="flex bg-surface border border-border p-2 rounded-2xl overflow-x-auto no-scrollbar snap-x">
        {(['caesar', 'rot13', 'rot47', 'atbash', 'vigenere', 'xor', 'morse'] as CipherType[]).map(c => (
          <button
            key={c}
            onClick={() => setActiveCipher(c)}
            className={cn(
              "flex-shrink-0 px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all snap-start outline-none",
              activeCipher === c ? "bg-blue text-white shadow-md shadow-blue/20" : "text-text-4 hover:text-text hover:bg-bg"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="bg-surface border border-border rounded-4xl p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Mode Selector & Option Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <SegmentedControl
            options={[
              { id: 'encode', label: 'Encode / Encrypt' },
              { id: 'decode', label: 'Decode / Decrypt' }
            ]}
            activeId={isEncode ? 'encode' : 'decode'}
            onChange={(id) => setIsEncode(id === 'encode')}
          />
          
          <div className="w-full md:w-auto">
            <AnimatePresence mode="popLayout">
              {activeCipher === 'caesar' && (
                <m.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-center gap-4 bg-bg border border-border px-6 py-3 rounded-2xl w-full md:w-80 shadow-premium">
                  <label className="text-[11px] font-black uppercase tracking-widest text-text-3 w-20 shrink-0">Shift: {caesarShift}</label>
                  <input type="range" min={1} max={25} value={caesarShift} onChange={e => setCaesarShift(Number(e.target.value))} className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer accent-blue outline-none" />
                </m.div>
              )}
              {activeCipher === 'vigenere' && (
                <m.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-center gap-3 bg-bg border border-border px-4 py-2 rounded-2xl w-full md:w-80 shadow-premium">
                  <label className="text-[11px] font-black uppercase tracking-widest text-text-3 shrink-0">Key:</label>
                  <input type="text" value={vigenereKey} onChange={e => setVigenereKey(e.target.value.toUpperCase())} className="w-full bg-surface border border-border rounded-xl px-3 py-1.5 font-mono text-xs text-text focus:ring-2 focus:ring-blue/20 outline-none" placeholder="KEYWORD" />
                </m.div>
              )}
              {activeCipher === 'xor' && (
                <m.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-center gap-3 bg-bg border border-border px-4 py-2 rounded-2xl w-full md:w-80 shadow-premium">
                  <label className="text-[11px] font-black uppercase tracking-widest text-text-3 shrink-0">XOR Key:</label>
                  <input type="text" value={xorKey} onChange={e => setXorKey(e.target.value)} className="w-full bg-surface border border-border rounded-xl px-3 py-1.5 font-mono text-xs text-text focus:ring-2 focus:ring-blue/20 outline-none" placeholder="Secret Key" />
                </m.div>
              )}
              {activeCipher === 'morse' && isEncode && (
                <m.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-center gap-4 bg-bg border border-border px-5 py-2.5 rounded-2xl shadow-premium">
                  <button 
                    onClick={playMorse} 
                    disabled={!output} 
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                      isPlaying 
                        ? "bg-error text-white hover:bg-error/90 active:scale-95" 
                        : "bg-blue text-white hover:bg-blue/90 active:scale-95 disabled:opacity-50"
                    )}
                  >
                    {isPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>{isPlaying ? 'Stop Morse' : 'Play Sound'}</span>
                  </button>
                  <div className="flex items-center gap-2.5">
                    <div className={cn(
                      "w-4 h-4 rounded-full transition-all duration-75",
                      blinkState === 'off' && "bg-border/60 shadow-none",
                      blinkState === 'dot' && "bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.6)] scale-110",
                      blinkState === 'dash' && "bg-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.8)] scale-125 w-7 h-4 rounded-md"
                    )} />
                    <span className="text-[9px] font-black uppercase tracking-widest text-text-4 w-12">
                      {blinkState === 'off' && 'Idle'}
                      {blinkState === 'dot' && 'Dit (.)'}
                      {blinkState === 'dash' && 'Dah (-)'}
                    </span>
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Text Areas Input/Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue">
                {isEncode ? 'Plaintext Input' : 'Ciphertext Input'}
              </h3>
              <button onClick={() => setInput('')} className="text-[10px] font-black uppercase tracking-widest text-error hover:underline">Clear</button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text here..."
              className="w-full h-64 bg-bg border border-border rounded-3xl p-6 font-mono text-sm text-text focus:ring-4 focus:ring-blue/10 focus:border-blue outline-none transition-all resize-none"
            />
          </div>

          {/* Center Swap Button */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden lg:block">
            <button 
              onClick={swap}
              className="w-10 h-10 bg-blue text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 shadow-md shadow-blue/10 transition-all border border-border"
              title="Swap Input/Output"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between min-h-[20px]">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-4">
                {isEncode ? 'Ciphertext Output' : 'Plaintext Output'}
              </h3>
              <CopyButton text={output} />
            </div>
            <textarea
              readOnly
              value={output}
              placeholder="Output will appear here..."
              className="w-full h-64 bg-mat-base border border-mat-border rounded-3xl p-6 font-mono text-sm text-text-2 outline-none resize-none"
            />
          </div>

        </div>

        {/* Mobile Mode Swap Button */}
        <div className="flex justify-center mt-4 lg:hidden">
          <button 
            onClick={swap}
            className="px-6 py-2.5 bg-bg border border-border rounded-full flex items-center gap-2 text-text-3 hover:text-text font-bold text-xs"
          >
            <ArrowLeftRight className="w-4 h-4" /> Swap Input & Output
          </button>
        </div>

        {/* Dynamic Analytics & Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-border/60">
          
          {/* Letter Frequency Analysis (Spans 2 columns) */}
          <div className="md:col-span-2 bg-bg border border-border rounded-2xl p-5 md:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-text-3">Character Frequency Analysis</h4>
              <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-text-4">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-blue/50 rounded-sm" /> Input ({letterStats.inputTotal} chars)</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-brand-primary/50 rounded-sm" /> Output ({letterStats.outputTotal} chars)</div>
              </div>
            </div>
            
            {/* Frequency Bars */}
            <div className="flex items-end justify-between gap-1 h-32 pt-2 border-b border-border">
              {Array.from({ length: 26 }).map((_, i) => {
                const char = String.fromCharCode(65 + i);
                const inCount = letterStats.inputCounts[i];
                const outCount = letterStats.outputCounts[i];
                
                const inPct = letterStats.inputTotal > 0 ? (inCount / letterStats.inputMax) * 100 : 0;
                const outPct = letterStats.outputTotal > 0 ? (outCount / letterStats.outputMax) * 100 : 0;
                
                return (
                  <div key={char} className="flex-1 flex flex-col items-center gap-1 group relative">
                    {/* Tooltip */}
                    <div className="absolute bottom-24 hidden group-hover:flex flex-col items-center z-30 pointer-events-none">
                      <div className="bg-surface border border-border text-[9px] font-bold py-1.5 px-2.5 rounded-lg shadow-lg whitespace-nowrap text-text-2 space-y-0.5">
                        <p className="font-black border-b border-border pb-0.5 mb-0.5 text-center text-text">{char}</p>
                        <p><span className="text-blue">In:</span> {inCount}</p>
                        <p><span className="text-brand-primary">Out:</span> {outCount}</p>
                      </div>
                      <div className="w-1.5 h-1.5 bg-surface border-r border-b border-border rotate-45 -mt-1" />
                    </div>

                    <div className="w-full flex items-end gap-[1.5px] h-24">
                      <div 
                        style={{ height: `${inPct}%` }} 
                        className="flex-1 bg-blue/40 group-hover:bg-blue/60 transition-all rounded-t-sm" 
                      />
                      <div 
                        style={{ height: `${outPct}%` }} 
                        className="flex-1 bg-brand-primary/40 group-hover:bg-brand-primary/60 transition-all rounded-t-sm" 
                      />
                    </div>
                    <span className="text-[8px] font-black text-text-4 group-hover:text-text">{char}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cipher Insight Metadata (Spans 1 column) */}
          <div className="bg-bg border border-border rounded-2xl p-5 md:p-6 space-y-4">
            <div className="flex items-center gap-2 text-blue">
              <Info className="w-4 h-4" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-text">Cipher Insight</h4>
            </div>
            
            <div className="space-y-3 text-xs leading-relaxed text-text-2 font-medium">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-text-4 mb-0.5">Algorithm Name</p>
                <p className="font-bold text-text">{activeMeta.name}</p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-text-4 mb-0.5">Cipher Type</p>
                <p className="font-bold text-text-3">{activeMeta.type}</p>
              </div>
              <div className="flex gap-2 items-start bg-surface/50 border border-border p-2 rounded-xl">
                <ShieldAlert className="w-4 h-4 text-warn shrink-0 mt-0.5" />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-text-4 mb-0.5">Security Level</p>
                  <p className="font-bold text-text-2 leading-tight">{activeMeta.security}</p>
                </div>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-text-4 mb-0.5">How It Works</p>
                <p className="text-text-3 text-[11px] leading-normal">{activeMeta.desc}</p>
              </div>
              {activeMeta.history && (
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-text-4 mb-0.5">Historical Fact</p>
                  <p className="text-text-4 text-[10px] italic leading-normal">{activeMeta.history}</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

