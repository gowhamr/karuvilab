'use client';

import React, { useState, useMemo } from 'react';
import { Lock, ArrowLeftRight, Copy, Play } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { cn } from '@/src/lib/utils';
import { CopyButton } from '@/components/ui/CopyButton';

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
    for (let i = 0; i < text.length; i += 2) {
      inputChars.push(parseInt(text.substring(i, i + 2), 16));
    }
  } else {
    for (let i = 0; i < text.length; i++) inputChars.push(text.charCodeAt(i));
  }

  const result = [];
  for (let i = 0; i < inputChars.length; i++) {
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

export default function CipherToolsClient() {
  const [activeCipher, setActiveCipher] = useState<CipherType>('caesar');
  const [input, setInput] = useState<string>('Hello, KaruviLab!');
  const [isEncode, setIsEncode] = useState<boolean>(true);
  
  // Options
  const [caesarShift, setCaesarShift] = useState<number>(3);
  const [vigenereKey, setVigenereKey] = useState<string>('KEY');
  const [xorKey, setXorKey] = useState<string>('secret');
  
  // Morse Audio State
  const [isPlaying, setIsPlaying] = useState(false);

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

  const swap = () => {
    setInput(output);
    setIsEncode(!isEncode);
  };

  const playMorse = async () => {
    if (isPlaying || !output || activeCipher !== 'morse' || !isEncode) return;
    setIsPlaying(true);
    
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const dotLen = 80; // ms
    let time = audioCtx.currentTime;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.value = 600;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    gain.gain.setValueAtTime(0, time);
    osc.start(time);

    for (const char of output) {
      if (char === '.') {
        gain.gain.setValueAtTime(1, time);
        time += dotLen / 1000;
        gain.gain.setValueAtTime(0, time);
        time += dotLen / 1000;
      } else if (char === '-') {
        gain.gain.setValueAtTime(1, time);
        time += (dotLen * 3) / 1000;
        gain.gain.setValueAtTime(0, time);
        time += dotLen / 1000;
      } else if (char === ' ') {
        time += (dotLen * 3) / 1000;
      } else if (char === '/') {
        time += (dotLen * 7) / 1000;
      }
    }

    osc.stop(time);
    osc.onended = () => setIsPlaying(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex bg-surface border border-border p-2 rounded-2xl overflow-x-auto no-scrollbar snap-x">
        {(['caesar', 'rot13', 'rot47', 'atbash', 'vigenere', 'xor', 'morse'] as CipherType[]).map(c => (
          <button
            key={c}
            onClick={() => setActiveCipher(c)}
            className={cn(
              "flex-shrink-0 px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all snap-start",
              activeCipher === c ? "bg-blue text-white shadow-md shadow-blue/20" : "text-text-4 hover:text-text hover:bg-bg"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="bg-surface border border-border rounded-4xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Specific Options based on Cipher */}
        <AnimatePresence mode="popLayout">
          {activeCipher === 'caesar' && (
            <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-4 bg-bg border border-border p-4 rounded-2xl">
              <label className="text-xs font-bold text-text-3 w-24 shrink-0">Shift: {caesarShift}</label>
              <input type="range" min={1} max={25} value={caesarShift} onChange={e => setCaesarShift(Number(e.target.value))} className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer accent-blue" />
            </m.div>
          )}
          {activeCipher === 'vigenere' && (
            <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-4 bg-bg border border-border p-4 rounded-2xl">
              <label className="text-xs font-bold text-text-3 shrink-0">Vigenère Key:</label>
              <input type="text" value={vigenereKey} onChange={e => setVigenereKey(e.target.value.toUpperCase())} className="w-full bg-surface border border-border rounded-xl px-4 py-2 font-mono text-sm text-text focus:ring-2 focus:ring-blue/20 outline-none" placeholder="KEYWORD" />
            </m.div>
          )}
          {activeCipher === 'xor' && (
            <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-4 bg-bg border border-border p-4 rounded-2xl">
              <label className="text-xs font-bold text-text-3 shrink-0">XOR Key:</label>
              <input type="text" value={xorKey} onChange={e => setXorKey(e.target.value)} className="w-full bg-surface border border-border rounded-xl px-4 py-2 font-mono text-sm text-text focus:ring-2 focus:ring-blue/20 outline-none" placeholder="Secret Key" />
            </m.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue">
                {isEncode ? 'Plaintext Input' : 'Ciphertext Input'}
              </h3>
              <div className="flex items-center gap-2">
                 <button onClick={() => setInput('')} className="text-[10px] font-bold text-red-500 hover:underline">Clear</button>
              </div>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text..."
              className="w-full h-64 bg-bg border border-border rounded-3xl p-6 font-mono text-base text-text focus:ring-4 focus:ring-blue/10 focus:border-blue outline-none transition-all resize-none"
            />
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden lg:block">
            <button 
              onClick={swap}
              className="w-10 h-10 bg-blue text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 shadow-lg shadow-blue/20 transition-all"
              title="Swap Encode/Decode"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between min-h-[20px]">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-4">
                {isEncode ? 'Ciphertext Output' : 'Plaintext Output'}
              </h3>
              <div className="flex items-center gap-2">
                {activeCipher === 'morse' && isEncode && (
                  <button onClick={playMorse} disabled={isPlaying || !output} className="p-1 text-text-4 hover:text-blue disabled:opacity-50 transition-colors" title="Play Audio">
                    <Play className={cn("w-4 h-4", isPlaying && "text-blue fill-blue")} />
                  </button>
                )}
                <CopyButton text={output} />
              </div>
            </div>
            <textarea
              readOnly
              value={output}
              className="w-full h-64 bg-mat-base border border-mat-border rounded-3xl p-6 font-mono text-base text-text-3 outline-none resize-none"
            />
          </div>

        </div>

        <div className="flex justify-center mt-4 lg:hidden">
            <button 
              onClick={swap}
              className="px-6 py-2.5 bg-bg border border-border rounded-full flex items-center gap-2 text-text-3 hover:text-text font-bold text-xs"
            >
              <ArrowLeftRight className="w-4 h-4" /> Swap Mode
            </button>
        </div>

      </div>
    </div>
  );
}
