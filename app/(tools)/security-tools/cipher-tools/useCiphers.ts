"use client";

import { useMemo } from "react";

export type CipherType = 'caesar' | 'rot13' | 'rot47' | 'atbash' | 'xor' | 'vigenere' | 'morse';

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
  
  const inputChars: number[] = [];
  if (isDecrypt) {
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

interface UseCiphersProps {
  input: string;
  activeCipher: CipherType;
  isEncode: boolean;
  options: {
    caesarShift: number;
    vigenereKey: string;
    xorKey: string;
  }
}

export function useCiphers({ input, activeCipher, isEncode, options }: UseCiphersProps) {
  const output = useMemo(() => {
    if (!input) return '';
    try {
      switch (activeCipher) {
        case 'caesar': return caesar(input, isEncode ? options.caesarShift : -options.caesarShift);
        case 'rot13': return caesar(input, 13);
        case 'rot47': return rot47(input);
        case 'atbash': return atbash(input);
        case 'vigenere': return vigenere(input, options.vigenereKey, !isEncode);
        case 'xor': return xorConvert(input, options.xorKey, !isEncode);
        case 'morse': return isEncode ? textToMorse(input) : morseToText(input);
        default: return input;
      }
    } catch {
      return 'Error processing cipher.';
    }
  }, [input, activeCipher, isEncode, options]);

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
    return {
      inputCounts, outputCounts,
      inputMax: Math.max(...inputCounts, 1),
      outputMax: Math.max(...outputCounts, 1),
      inputTotal: cleanInput.length,
      outputTotal: cleanOutput.length
    };
  }, [input, output]);

  return { output, letterStats };
}
