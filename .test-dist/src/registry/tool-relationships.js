export const toolRelationships = {
    'scientific-calculator': {
        related: ["standard-calculator", "numeral-converter", "data-calculator", "smart-converter"],
        workflow_examples: []
    },
    'emi-calculator': {
        related: ["sip-calculator", "fd-calculator", "rd-calculator", "retirement-calculator", "lumpsum-calculator"],
        workflow_examples: []
    },
    'sip-calculator': {
        related: ["emi-calculator", "lumpsum-calculator", "cagr-calculator", "swp-calculator", "compound-interest"],
        workflow_examples: []
    },
    'age-calculator': {
        related: ["time-calculator", "world-clock", "retirement-calculator", "work-hours"],
        workflow_examples: []
    },
    'compound-interest': {
        related: ["fd-calculator", "rd-calculator", "lumpsum-calculator", "cagr-calculator"],
        workflow_examples: []
    },
    'gst-calculator': {
        related: ["discount-calculator", "invoice-generator", "salary-calculator"],
        workflow_examples: []
    },
    'currency-converter': {
        related: ["unit-converter", "smart-converter", "world-clock", "utc-ist-converter", "data-calculator"],
        workflow_examples: []
    },
    'discount-calculator': {
        related: ["gst-calculator", "standard-calculator", "invoice-generator"],
        workflow_examples: []
    },
    'world-clock': {
        related: ["utc-ist-converter", "timezone-converter", "time-calculator", "calendar"],
        workflow_examples: []
    },
    'cagr-calculator': {
        related: ["sip-calculator", "lumpsum-calculator", "stock-average-calculator", "compound-interest"],
        workflow_examples: []
    },
    'fd-calculator': {
        related: ["rd-calculator", "ppf-calculator", "compound-interest", "lumpsum-calculator"],
        workflow_examples: []
    },
    'rd-calculator': {
        related: ["fd-calculator", "ppf-calculator", "compound-interest"],
        workflow_examples: []
    },
    'ppf-calculator': {
        related: ["fd-calculator", "rd-calculator", "retirement-calculator", "lumpsum-calculator"],
        workflow_examples: []
    },
    'swp-calculator': {
        related: ["retirement-calculator", "sip-calculator", "lumpsum-calculator"],
        workflow_examples: []
    },
    'lumpsum-calculator': {
        related: ["sip-calculator", "cagr-calculator", "fd-calculator", "compound-interest"],
        workflow_examples: []
    },
    'salary-calculator': {
        related: ["gst-calculator", "work-hours", "invoice-generator"],
        workflow_examples: []
    },
    'retirement-calculator': {
        related: ["swp-calculator", "ppf-calculator", "sip-calculator", "lumpsum-calculator", "safe-to-spend"],
        workflow_examples: []
    },
    'safe-to-spend': {
        related: ["work-hours", "salary-calculator", "invoice-generator"],
        workflow_examples: []
    },
    'work-hours': {
        related: ["time-calculator", "safe-to-spend", "invoice-generator", "pomodoro-timer"],
        workflow_examples: []
    },
    'time-calculator': {
        related: ["age-calculator", "world-clock", "utc-ist-converter", "work-hours"],
        workflow_examples: []
    },
    'unit-converter': {
        related: ["currency-converter", "smart-converter", "data-calculator"],
        workflow_examples: []
    },
    'utc-ist-converter': {
        related: ["world-clock", "timezone-converter", "time-calculator"],
        workflow_examples: []
    },
    'stock-average-calculator': {
        related: ["cagr-calculator", "sip-calculator", "lumpsum-calculator"],
        workflow_examples: []
    },
    'data-calculator': {
        related: ["unit-converter", "smart-converter", "internet-speed-test", "validate"],
        workflow_examples: []
    },
    'smart-converter': {
        related: ["unit-converter", "currency-converter", "data-calculator"],
        workflow_examples: []
    },
    'standard-calculator': {
        related: ["scientific-calculator", "discount-calculator"],
        workflow_examples: []
    },
    'image-compress': {
        related: ["bulk-resizer", "image-converter", "image-resizer", "bg-remover", "color-palette-extractor"],
        workflow_examples: []
    },
    'bulk-resizer': {
        related: ["image-compress", "image-converter", "image-resizer", "image-crop"],
        workflow_examples: []
    },
    'image-converter': {
        related: ["image-compress", "bulk-resizer", "image-resizer", "image-base64", "color-palette-extractor"],
        workflow_examples: []
    },
    'image-resizer': {
        related: ["image-crop", "bulk-resizer", "image-converter", "image-compress"],
        workflow_examples: []
    },
    'image-crop': {
        related: ["image-resizer", "bulk-resizer", "bg-remover", "phone-mockup-generator"],
        workflow_examples: []
    },
    'bg-remover': {
        related: ["image-crop", "image-resizer", "image-compress", "phone-mockup-generator", "color-palette-extractor"],
        workflow_examples: []
    },
    'image-base64': {
        related: ["image-converter", "color-converter", "html-viewer", "base64"],
        workflow_examples: []
    },
    'color-palette-extractor': {
        related: ["image-compress", "image-converter", "color-converter", "bg-remover"],
        workflow_examples: []
    },
    'phone-mockup-generator': {
        related: ["image-crop", "bg-remover", "image-resizer"],
        workflow_examples: []
    },
    'compress-pdf': {
        related: ["merge-pdf", "split-pdf", "image-to-pdf", "watermark-pdf"],
        workflow_examples: []
    },
    'merge-pdf': {
        related: ["compress-pdf", "split-pdf", "image-to-pdf", "extract-images"],
        workflow_examples: []
    },
    'split-pdf': {
        related: ["merge-pdf", "compress-pdf", "extract-images"],
        workflow_examples: []
    },
    'extract-images': {
        related: ["image-to-pdf", "split-pdf", "merge-pdf", "image-converter"],
        workflow_examples: []
    },
    'pdf-to-word': {
        related: ["merge-pdf", "split-pdf", "compress-pdf", "text-utility"],
        workflow_examples: []
    },
    'watermark-pdf': {
        related: ["lock-unlock-pdf", "merge-pdf", "page-numbering"],
        workflow_examples: []
    },
    'rotate-pdf': {
        related: ["merge-pdf", "split-pdf", "page-numbering"],
        workflow_examples: []
    },
    'lock-unlock-pdf': {
        related: ["watermark-pdf", "compress-pdf", "merge-pdf"],
        workflow_examples: []
    },
    'page-numbering': {
        related: ["merge-pdf", "watermark-pdf", "rotate-pdf"],
        workflow_examples: []
    },
    'image-to-pdf': {
        related: ["compress-pdf", "merge-pdf", "extract-images"],
        workflow_examples: []
    },
    'html-viewer': {
        related: ["file-viewer-diff", "json-formatter", "code-minifier", "url-encoder", "base64"],
        workflow_examples: []
    },
    'json-formatter': {
        related: ["json-csv", "yaml-validator", "diff-checker", "code-minifier", "fake-data-generator"],
        workflow_examples: []
    },
    'json-csv': {
        related: ["json-formatter", "fake-data-generator", "yaml-validator", "text-sorter-deduper"],
        workflow_examples: []
    },
    'regex-tester': {
        related: ["diff-checker", "json-formatter", "code-minifier", "text-utility"],
        workflow_examples: []
    },
    'code-minifier': {
        related: ["diff-checker", "file-viewer-diff", "json-formatter", "html-viewer"],
        workflow_examples: []
    },
    'diff-checker': {
        related: ["file-viewer-diff", "json-formatter", "regex-tester", "text-utility"],
        workflow_examples: []
    },
    'file-viewer-diff': {
        related: ["diff-checker", "html-viewer", "json-formatter", "code-minifier"],
        workflow_examples: []
    },
    'base64': {
        related: ["url-encoder", "html-entities", "jwt-decoder", "image-base64"],
        workflow_examples: []
    },
    'url-encoder': {
        related: ["base64", "html-entities", "slug-generator", "url-cleaner"],
        workflow_examples: []
    },
    'html-entities': {
        related: ["base64", "url-encoder", "jwt-decoder", "text-utility"],
        workflow_examples: []
    },
    'fake-data-generator': {
        related: ["json-formatter", "json-csv", "yaml-validator", "text-sorter-deduper"],
        workflow_examples: []
    },
    'jwt-decoder': {
        related: ["base64", "hash-generator", "password-generator", "url-encoder"],
        workflow_examples: []
    },
    'yaml-validator': {
        related: ["json-formatter", "json-csv", "fake-data-generator"],
        workflow_examples: []
    },
    'color-converter': {
        related: ["color-palette-extractor", "image-base64", "phone-mockup-generator"],
        workflow_examples: []
    },
    'password-generator': {
        related: ["hash-generator", "base64", "jwt-decoder", "url-encoder"],
        workflow_examples: []
    },
    'hash-generator': {
        related: ["password-generator", "jwt-decoder", "base64", "validate"],
        workflow_examples: []
    },
    'notes': {
        related: ["calendar", "task-reminder", "text-utility", "word-counter", "markdown"],
        workflow_examples: []
    },
    'calendar': {
        related: ["notes", "task-reminder", "timezone-converter", "pomodoro-timer", "world-clock"],
        workflow_examples: []
    },
    'pomodoro-timer': {
        related: ["task-reminder", "calendar", "work-hours", "typing-speed-test"],
        workflow_examples: []
    },
    'word-counter': {
        related: ["text-case-converter", "text-utility", "text-sorter-deduper", "notes"],
        workflow_examples: []
    },
    'text-case-converter': {
        related: ["word-counter", "text-utility", "text-sorter-deduper", "slug-generator"],
        workflow_examples: []
    },
    'text-sorter-deduper': {
        related: ["word-counter", "text-case-converter", "text-utility", "fake-data-generator"],
        workflow_examples: []
    },
    'timezone-converter': {
        related: ["world-clock", "utc-ist-converter", "calendar"],
        workflow_examples: []
    },
    'typing-speed-test': {
        related: ["word-counter", "text-utility", "pomodoro-timer"],
        workflow_examples: []
    },
    'chart-generator': {
        related: ["fake-data-generator", "json-csv", "text-sorter-deduper", "invoice-generator"],
        workflow_examples: []
    },
    'wifi-qr-code': {
        related: ["qrcode", "barcode-scanner", "url-cleaner", "password-generator"],
        workflow_examples: []
    },
    'meta-tags': {
        related: ["og-preview", "seo-title", "slug-generator", "image-seo"],
        workflow_examples: []
    },
    'og-preview': {
        related: ["meta-tags", "seo-title", "slug-generator", "phone-mockup-generator"],
        workflow_examples: []
    },
    'sitemap-generator': {
        related: ["robots-txt", "url-cleaner", "meta-tags"],
        workflow_examples: []
    },
    'robots-txt': {
        related: ["sitemap-generator", "url-cleaner", "seo-title"],
        workflow_examples: []
    },
    'seo-title': {
        related: ["meta-tags", "og-preview", "slug-generator"],
        workflow_examples: []
    },
    'slug-generator': {
        related: ["url-cleaner", "seo-title", "meta-tags", "text-case-converter"],
        workflow_examples: []
    },
    'image-seo': {
        related: ["image-compress", "image-converter", "meta-tags", "color-palette-extractor"],
        workflow_examples: []
    },
    'barcode-scanner': {
        related: ["qrcode", "wifi-qr-code", "validate"],
        workflow_examples: []
    },
    'qrcode': {
        related: ["barcode-scanner", "wifi-qr-code", "url-cleaner", "text-utility"],
        workflow_examples: []
    },
    'mic-camera-tester': {
        related: ["internet-speed-test", "validate", "bg-remover"],
        workflow_examples: []
    },
    'internet-speed-test': {
        related: ["mic-camera-tester", "data-calculator", "validate"],
        workflow_examples: []
    },
    'task-reminder': {
        related: ["notes", "calendar", "pomodoro-timer", "work-hours"],
        workflow_examples: []
    },
    'text-utility': {
        related: ["word-counter", "text-case-converter", "text-sorter-deduper", "split-copy"],
        workflow_examples: []
    },
    'url-cleaner': {
        related: ["slug-generator", "qrcode", "text-utility", "validate"],
        workflow_examples: []
    },
    'validate': {
        related: ["internet-speed-test", "data-calculator", "mic-camera-tester", "image-compress"],
        workflow_examples: []
    },
};
