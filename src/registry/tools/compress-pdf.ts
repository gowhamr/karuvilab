import { ToolEntry } from '../types';

export const compressPdf: ToolEntry = {
  "id": "compress-pdf",
  "name": "Compress PDF",
  "desc": "Reduce PDF file size",
  "href": "pdf-tools/compress-pdf/",
  "category": "pdf",
  "input": "pdf",
  "output": "pdf",
  "keywords": [
    "pdf",
    "compress",
    "reduce",
    "size"
  ],
  "popular": true,
  "priority": 0.8,
  "related": ["merge-pdf", "split-pdf", "lock-unlock-pdf", "watermark-pdf"]
};
