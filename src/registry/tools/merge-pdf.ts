import { ToolEntry } from '../types';

export const mergePdf: ToolEntry = {
  "id": "merge-pdf",
  "name": "Merge PDF",
  "desc": "Combine multiple PDFs into one",
  "href": "pdf-tools/merge-pdf/",
  "category": "pdf",
  "input": "pdf",
  "output": "pdf",
  "keywords": [
    "pdf",
    "merge",
    "combine",
    "join"
  ],
  "sampleAssetKey": "pdfMerger",
  "popular": true,
  "priority": 0.8,
  "status": "stable",
  "lastUpdated": "2024-05-18",
  "related": ["split-pdf", "compress-pdf", "page-numbering"]
};
