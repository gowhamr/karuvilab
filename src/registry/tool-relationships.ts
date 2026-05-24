export interface ToolRelationship {
  related: string[];
  workflow_examples: string[];
}

export const toolRelationships: Record<string, ToolRelationship> = {
  // Financial Calculators
  'emi-calculator': {
    related: ['sip-calculator', 'cagr-calculator', 'lumpsum-calculator'],
    workflow_examples: ['emi-calculator → cagr-calculator', 'emi-calculator → lumpsum-calculator']
  },
  'sip-calculator': {
    related: ['emi-calculator', 'cagr-calculator', 'lumpsum-calculator'],
    workflow_examples: ['sip-calculator → cagr-calculator', 'sip-calculator → emi-calculator']
  },
  'cagr-calculator': {
    related: ['emi-calculator', 'sip-calculator', 'lumpsum-calculator', 'swp-calculator'],
    workflow_examples: ['cagr-calculator → sip-calculator', 'cagr-calculator → swp-calculator']
  },
  'lumpsum-calculator': {
    related: ['sip-calculator', 'emi-calculator', 'retirement-calculator'],
    workflow_examples: ['lumpsum-calculator → retirement-calculator', 'lumpsum-calculator → sip-calculator']
  },
  'swp-calculator': {
    related: ['cagr-calculator', 'ppf-calculator', 'retirement-calculator'],
    workflow_examples: ['swp-calculator → retirement-calculator', 'swp-calculator → cagr-calculator']
  },
  'ppf-calculator': {
    related: ['rd-calculator', 'fd-calculator', 'swp-calculator'],
    workflow_examples: ['ppf-calculator → rd-calculator', 'ppf-calculator → fd-calculator']
  },
  'rd-calculator': {
    related: ['ppf-calculator', 'fd-calculator', 'sip-calculator'],
    workflow_examples: ['rd-calculator → ppf-calculator', 'rd-calculator → sip-calculator']
  },
  'fd-calculator': {
    related: ['rd-calculator', 'ppf-calculator', 'compound-interest'],
    workflow_examples: ['fd-calculator → rd-calculator', 'fd-calculator → compound-interest']
  },
  'retirement-calculator': {
    related: ['lumpsum-calculator', 'swp-calculator', 'cagr-calculator'],
    workflow_examples: ['retirement-calculator → lumpsum-calculator', 'retirement-calculator → swp-calculator']
  },
  'age-calculator': {
    related: ['date-calculator', 'calendar', 'work-hours'],
    workflow_examples: ['age-calculator → date-calculator', 'age-calculator → calendar']
  },
  'date-calculator': {
    related: ['age-calculator', 'calendar', 'work-hours'],
    workflow_examples: ['date-calculator → work-hours', 'date-calculator → calendar']
  },
  'work-hours': {
    related: ['date-calculator', 'time-calculator', 'task-reminder'],
    workflow_examples: ['work-hours → time-calculator', 'work-hours → task-reminder']
  },
  'time-calculator': {
    related: ['work-hours', 'world-clock', 'date-calculator'],
    workflow_examples: ['time-calculator → work-hours', 'time-calculator → world-clock']
  },
  'compound-interest': {
    related: ['fd-calculator', 'cagr-calculator', 'sip-calculator'],
    workflow_examples: ['compound-interest → fd-calculator', 'compound-interest → cagr-calculator']
  },
  'gst-calculator': {
    related: ['discount-calculator', 'percentage-calculator', 'salary-calculator'],
    workflow_examples: ['gst-calculator → discount-calculator', 'gst-calculator → percentage-calculator']
  },
  'discount-calculator': {
    related: ['gst-calculator', 'percentage-calculator', 'data-calculator'],
    workflow_examples: ['discount-calculator → percentage-calculator', 'discount-calculator → gst-calculator']
  },
  'percentage-calculator': {
    related: ['gst-calculator', 'discount-calculator', 'data-calculator'],
    workflow_examples: ['percentage-calculator → discount-calculator', 'percentage-calculator → gst-calculator']
  },
  'salary-calculator': {
    related: ['emi-calculator', 'gst-calculator', 'retirement-calculator'],
    workflow_examples: ['salary-calculator → emi-calculator', 'salary-calculator → retirement-calculator']
  },
  'safe-to-spend': {
    related: ['salary-calculator', 'task-reminder', 'notes'],
    workflow_examples: ['safe-to-spend → salary-calculator', 'safe-to-spend → task-reminder']
  },
  'data-calculator': {
    related: ['percentage-calculator', 'unit-converter', 'smart-converter'],
    workflow_examples: ['data-calculator → unit-converter', 'data-calculator → smart-converter']
  },
  'unit-converter': {
    related: ['smart-converter', 'data-calculator', 'numeral-converter'],
    workflow_examples: ['unit-converter → smart-converter', 'unit-converter → data-calculator']
  },
  'smart-converter': {
    related: ['unit-converter', 'data-calculator', 'numeral-converter'],
    workflow_examples: ['smart-converter → unit-converter', 'smart-converter → numeral-converter']
  },
  'numeral-converter': {
    related: ['smart-converter', 'unit-converter', 'data-calculator'],
    workflow_examples: ['numeral-converter → smart-converter', 'numeral-converter → unit-converter']
  },
  'standard-calculator': {
    related: ['percentage-calculator', 'gst-calculator', 'scientific-calculator'],
    workflow_examples: ['standard-calculator → percentage-calculator', 'standard-calculator → scientific-calculator']
  },
  'scientific-calculator': {
    related: ['standard-calculator', 'numeral-converter', 'data-calculator'],
    workflow_examples: ['scientific-calculator → standard-calculator', 'scientific-calculator → numeral-converter']
  },
  'world-clock': {
    related: ['timezone-converter', 'utc-ist-converter', 'calendar'],
    workflow_examples: ['world-clock → timezone-converter', 'world-clock → calendar']
  },
  'timezone-converter': {
    related: ['world-clock', 'utc-ist-converter', 'calendar'],
    workflow_examples: ['timezone-converter → world-clock', 'timezone-converter → utc-ist-converter']
  },
  'utc-ist-converter': {
    related: ['timezone-converter', 'world-clock', 'calendar'],
    workflow_examples: ['utc-ist-converter → world-clock', 'utc-ist-converter → timezone-converter']
  },
  // PDF Tools
  'compress-pdf': {
    related: ['merge-pdf', 'split-pdf', 'image-to-pdf', 'watermark-pdf'],
    workflow_examples: ['compress-pdf → merge-pdf', 'compress-pdf → watermark-pdf']
  },
  'merge-pdf': {
    related: ['compress-pdf', 'split-pdf', 'watermark-pdf', 'image-to-pdf'],
    workflow_examples: ['merge-pdf → compress-pdf', 'merge-pdf → watermark-pdf']
  },
  'split-pdf': {
    related: ['merge-pdf', 'compress-pdf', 'extract-images-pdf'],
    workflow_examples: ['split-pdf → merge-pdf', 'split-pdf → compress-pdf']
  },
  'watermark-pdf': {
    related: ['merge-pdf', 'compress-pdf', 'lock-unlock-pdf'],
    workflow_examples: ['watermark-pdf → compress-pdf', 'watermark-pdf → merge-pdf']
  },
  'rotate-pdf': {
    related: ['merge-pdf', 'split-pdf', 'page-numbering-pdf'],
    workflow_examples: ['rotate-pdf → merge-pdf', 'rotate-pdf → page-numbering-pdf']
  },
  'lock-unlock-pdf': {
    related: ['compress-pdf', 'merge-pdf', 'watermark-pdf'],
    workflow_examples: ['lock-unlock-pdf → merge-pdf', 'lock-unlock-pdf → compress-pdf']
  },
  'page-numbering-pdf': {
    related: ['merge-pdf', 'rotate-pdf', 'watermark-pdf'],
    workflow_examples: ['page-numbering-pdf → merge-pdf', 'page-numbering-pdf → watermark-pdf']
  },
  'image-to-pdf': {
    related: ['merge-pdf', 'compress-pdf', 'extract-images-pdf'],
    workflow_examples: ['image-to-pdf → merge-pdf', 'image-to-pdf → compress-pdf']
  },
  'extract-images-pdf': {
    related: ['image-to-pdf', 'split-pdf', 'compress-pdf'],
    workflow_examples: ['extract-images-pdf → image-to-pdf', 'extract-images-pdf → compress-pdf']
  },
  // Image Tools
  'bg-remover': {
    related: ['image-compress', 'image-resizer', 'bulk-resizer', 'image-converter'],
    workflow_examples: ['bg-remover → image-resizer', 'bg-remover → image-compress']
  },
  'image-compress': {
    related: ['bg-remover', 'image-resizer', 'bulk-resizer', 'image-converter'],
    workflow_examples: ['image-compress → image-resizer', 'image-compress → image-converter']
  },
  'image-resizer': {
    related: ['bg-remover', 'image-compress', 'bulk-resizer', 'image-converter'],
    workflow_examples: ['image-resizer → image-compress', 'image-resizer → image-converter']
  },
  'bulk-resizer': {
    related: ['image-resizer', 'image-compress', 'image-converter'],
    workflow_examples: ['bulk-resizer → image-compress', 'bulk-resizer → image-converter']
  },
  'image-converter': {
    related: ['image-resizer', 'image-compress', 'bg-remover'],
    workflow_examples: ['image-converter → image-compress', 'image-converter → image-resizer']
  },
  'image-crop': {
    related: ['image-resizer', 'bg-remover', 'image-converter'],
    workflow_examples: ['image-crop → image-resizer', 'image-crop → bg-remover']
  },
  'color-palette-extractor': {
    related: ['color-converter', 'image-compress', 'image-converter'],
    workflow_examples: ['color-palette-extractor → color-converter', 'color-palette-extractor → image-converter']
  },
  'phone-mockup-generator': {
    related: ['image-resizer', 'image-crop', 'image-converter'],
    workflow_examples: ['phone-mockup-generator → image-resizer', 'phone-mockup-generator → image-crop']
  },
  'image-to-base64': {
    related: ['image-converter', 'image-compress', 'json-formatter'],
    workflow_examples: ['image-to-base64 → json-formatter', 'image-to-base64 → image-compress']
  },
  // Developer Tools
  'json-formatter': {
    related: ['json-csv-converter', 'yaml-validator', 'diff-checker', 'code-minifier'],
    workflow_examples: ['json-formatter → json-csv-converter', 'json-formatter → yaml-validator']
  },
  'json-csv-converter': {
    related: ['json-formatter', 'diff-checker', 'code-minifier'],
    workflow_examples: ['json-csv-converter → json-formatter', 'json-csv-converter → diff-checker']
  },
  'yaml-validator': {
    related: ['json-formatter', 'diff-checker', 'code-minifier'],
    workflow_examples: ['yaml-validator → json-formatter', 'yaml-validator → diff-checker']
  },
  'code-minifier': {
    related: ['json-formatter', 'diff-checker', 'yaml-validator'],
    workflow_examples: ['code-minifier → json-formatter', 'code-minifier → diff-checker']
  },
  'diff-checker': {
    related: ['json-formatter', 'json-csv-converter', 'yaml-validator'],
    workflow_examples: ['diff-checker → json-formatter', 'diff-checker → yaml-validator']
  },
  'file-viewer-diff': {
    related: ['diff-checker', 'json-formatter', 'html-viewer'],
    workflow_examples: ['file-viewer-diff → diff-checker', 'file-viewer-diff → html-viewer']
  },
  'html-viewer': {
    related: ['html-entities-converter', 'diff-checker', 'json-formatter'],
    workflow_examples: ['html-viewer → html-entities-converter', 'html-viewer → json-formatter']
  },
  'html-entities-converter': {
    related: ['html-viewer', 'diff-checker', 'json-formatter'],
    workflow_examples: ['html-entities-converter → html-viewer', 'html-entities-converter → json-formatter']
  },
  'base64-encoder-decoder': {
    related: ['url-encoder-decoder', 'hash-generator', 'json-formatter'],
    workflow_examples: ['base64-encoder-decoder → hash-generator', 'base64-encoder-decoder → json-formatter']
  },
  'url-encoder-decoder': {
    related: ['base64-encoder-decoder', 'url-cleaner', 'json-formatter'],
    workflow_examples: ['url-encoder-decoder → url-cleaner', 'url-encoder-decoder → base64-encoder-decoder']
  },
  'hash-generator': {
    related: ['base64-encoder-decoder', 'password-generator', 'security'],
    workflow_examples: ['hash-generator → password-generator', 'hash-generator → base64-encoder-decoder']
  },
  'color-converter': {
    related: ['color-palette-extractor', 'json-formatter', 'code-minifier'],
    workflow_examples: ['color-converter → color-palette-extractor', 'color-converter → json-formatter']
  },
  'fake-data-generator': {
    related: ['json-formatter', 'yaml-validator', 'diff-checker'],
    workflow_examples: ['fake-data-generator → json-formatter', 'fake-data-generator → diff-checker']
  },
  // Security
  'password-generator': {
    related: ['hash-generator', 'base64-encoder-decoder', 'security'],
    workflow_examples: ['password-generator → hash-generator', 'password-generator → base64-encoder-decoder']
  },
  // Productivity
  'text-case-converter': {
    related: ['word-counter', 'text-utility', 'markdown'],
    workflow_examples: ['text-case-converter → word-counter', 'text-case-converter → markdown']
  },
  'text-sorter-deduplicator': {
    related: ['word-counter', 'text-utility', 'text-case-converter'],
    workflow_examples: ['text-sorter-deduplicator → word-counter', 'text-sorter-deduplicator → text-utility']
  },
  'word-counter': {
    related: ['text-case-converter', 'text-sorter-deduplicator', 'markdown'],
    workflow_examples: ['word-counter → text-case-converter', 'word-counter → markdown']
  },
  'markdown': {
    related: ['word-counter', 'text-case-converter', 'html-viewer'],
    workflow_examples: ['markdown → word-counter', 'markdown → html-viewer']
  },
  'text-utility': {
    related: ['text-case-converter', 'word-counter', 'split-copy'],
    workflow_examples: ['text-utility → text-case-converter', 'text-utility → word-counter']
  },
  'split-copy': {
    related: ['text-utility', 'word-counter', 'text-sorter-deduplicator'],
    workflow_examples: ['split-copy → text-utility', 'split-copy → word-counter']
  },
  'typing-speed-test': {
    related: ['word-counter', 'text-utility', 'task-reminder'],
    workflow_examples: ['typing-speed-test → word-counter', 'typing-speed-test → task-reminder']
  },
  'chart-graph-generator': {
    related: ['json-formatter', 'json-csv-converter', 'data-calculator'],
    workflow_examples: ['chart-graph-generator → json-formatter', 'chart-graph-generator → data-calculator']
  },
  'wifi-qr-code-generator': {
    related: ['qrcode', 'url-encoder-decoder', 'url-cleaner'],
    workflow_examples: ['wifi-qr-code-generator → qrcode', 'wifi-qr-code-generator → url-cleaner']
  },
  'qrcode': {
    related: ['wifi-qr-code-generator', 'url-encoder-decoder', 'url-cleaner'],
    workflow_examples: ['qrcode → wifi-qr-code-generator', 'qrcode → url-cleaner']
  },
  'task-reminder': {
    related: ['notes', 'calendar', 'work-hours'],
    workflow_examples: ['task-reminder → notes', 'task-reminder → calendar']
  },
  'notes': {
    related: ['task-reminder', 'calendar', 'markdown'],
    workflow_examples: ['notes → task-reminder', 'notes → markdown']
  },
  'calendar': {
    related: ['task-reminder', 'notes', 'date-calculator'],
    workflow_examples: ['calendar → task-reminder', 'calendar → date-calculator']
  },
  // SEO
  'og-preview': {
    related: ['seo-title-tester', 'slug-generator', 'image-seo'],
    workflow_examples: ['og-preview → seo-title-tester', 'og-preview → image-seo']
  },
  'seo-title-tester': {
    related: ['og-preview', 'slug-generator', 'image-seo'],
    workflow_examples: ['seo-title-tester → og-preview', 'seo-title-tester → slug-generator']
  },
  'slug-generator': {
    related: ['og-preview', 'seo-title-tester', 'url-cleaner'],
    workflow_examples: ['slug-generator → og-preview', 'slug-generator → url-cleaner']
  },
  'image-seo': {
    related: ['og-preview', 'image-compress', 'image-resizer'],
    workflow_examples: ['image-seo → image-compress', 'image-seo → og-preview']
  },
  'robots-txt-builder': {
    related: ['sitemap-generator', 'meta-tags', 'seo-title-tester'],
    workflow_examples: ['robots-txt-builder → sitemap-generator', 'robots-txt-builder → meta-tags']
  },
  'sitemap-generator': {
    related: ['robots-txt-builder', 'meta-tags', 'seo-title-tester'],
    workflow_examples: ['sitemap-generator → robots-txt-builder', 'sitemap-generator → meta-tags']
  },
  'meta-tags': {
    related: ['robots-txt-builder', 'sitemap-generator', 'seo-title-tester'],
    workflow_examples: ['meta-tags → robots-txt-builder', 'meta-tags → sitemap-generator']
  },
  // Utilities
  'barcode-scanner': {
    related: ['qrcode', 'url-cleaner', 'unit-converter'],
    workflow_examples: ['barcode-scanner → url-cleaner', 'barcode-scanner → unit-converter']
  },
  'mic-camera-tester': {
    related: ['internet-speed-test', 'file-validator', 'text-utility'],
    workflow_examples: ['mic-camera-tester → internet-speed-test', 'mic-camera-tester → file-validator']
  },
  'url-cleaner': {
    related: ['url-encoder-decoder', 'slug-generator', 'barcode-scanner'],
    workflow_examples: ['url-cleaner → slug-generator', 'url-cleaner → url-encoder-decoder']
  },
  'file-validator': {
    related: ['internet-speed-test', 'mic-camera-tester', 'text-utility'],
    workflow_examples: ['file-validator → internet-speed-test', 'file-validator → text-utility']
  },
  'validate': {
    related: ['file-validator', 'json-formatter', 'yaml-validator'],
    workflow_examples: ['validate → json-formatter', 'validate → yaml-validator']
  },
  'pomodoro-timer': {
    related: ['task-reminder', 'notes', 'work-hours'],
    workflow_examples: ['pomodoro-timer → task-reminder', 'pomodoro-timer → notes']
  },
  'invoice-generator': {
    related: ['compress-pdf', 'image-to-pdf', 'qrcode'],
    workflow_examples: ['invoice-generator → compress-pdf', 'invoice-generator → image-to-pdf']
  },
  'internet-speed-test': {
    related: ['file-validator', 'mic-camera-tester', 'text-utility'],
    workflow_examples: ['internet-speed-test → file-validator', 'internet-speed-test → text-utility']
  },
  'inflation-calculator': {
    related: ['cagr-calculator', 'lumpsum-calculator', 'percentage-calculator'],
    workflow_examples: ['inflation-calculator → cagr-calculator', 'inflation-calculator → percentage-calculator']
  },
  'mutual-fund-returns': {
    related: ['sip-calculator', 'cagr-calculator', 'lumpsum-calculator'],
    workflow_examples: ['mutual-fund-returns → sip-calculator', 'mutual-fund-returns → cagr-calculator']
  }
};
