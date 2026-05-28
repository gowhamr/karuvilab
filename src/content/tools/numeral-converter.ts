import { ToolContent } from '../../registry/types';

export const numeralConverter: ToolContent = {
  detailedDescription: "A comprehensive Numeral and Text Converter for Binary, Hexadecimal, Decimal, Octal, and ASCII. This professional-grade utility supports two powerful modes: Single Number mode for precise numeric analysis with an 8-bit visualizer, and Text/Bytes mode for converting entire strings of text into any base. Whether you need to convert Binary to Hex, Hex to ASCII, or Decimal to Binary, our browser-native tool provides instant, private, and secure results.",
  howTo: [
    "Choose your conversion mode: 'Single Number' for individual values or 'Text / Bytes' for full strings.",
    "Input your value into any field (e.g., type into the Binary field to get Decimal and Hex results).",
    "In Text mode, you can paste entire paragraphs to see their Binary or Hex representations instantly.",
    "Use the 8-bit visualizer in Single mode to see exactly how bits are arranged for values between 0 and 255.",
    "Click the copy button on any field to grab the result, or use 'Copy All' for a full summary."
  ],
  faq: [
    { question: "What bases are supported?", answer: "We support Binary (Base 2), Octal (Base 8), Decimal (Base 10), Hexadecimal (Base 16), and ASCII Text." },
    { question: "Can I convert large text files?", answer: "Yes, the 'Text / Bytes' mode is optimized for processing strings of text. It handles UTF-8 encoding natively via the browser's TextEncoder API." },
    { question: "How does the Binary to ASCII conversion work?", answer: "It treats the binary input as a sequence of 8-bit bytes (space-separated) and converts each byte to its corresponding character." },
    { question: "Is my data sent to a server?", answer: "No. Like all KaruviLab tools, the Numeral Converter runs entirely in your browser using local computation. Your data never leaves your device." }
  ],
  useCases: [
    "Converting memory addresses and pointer values",
    "Encoding/Decoding ASCII text to Binary or Hex for debugging",
    "Visualizing 8-bit integer structures",
    "Converting large sequences of numbers between different base formats",
    "Learning and teaching computer science numbering systems"
  ],
  alternatives: ["BinaryHexConverter", "RapidTables", "CyberChef", "Heisig's Base Converter"]
};
