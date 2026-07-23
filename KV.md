# KaruviLab (KV) Complete Tool Reference
> **Generation Note**: Auto-generated from single source of truth. **Total Tools**: 189


Welcome to the comprehensive, evidence-based technical reference guide for the KaruviLab platform. KaruviLab (KV) is an elite, browser-native suite of local-first utilities designed for maximal performance, absolute privacy, and offline capability.

## Platform Architectural Overview

KaruviLab is built on a zero-upload server-less philosophy. Key architectural tenets include:
- **Zero-Server-Upload:** All data calculations, cryptographic signing, compression, and text manipulation happen locally in the user's browser context.
- **Privacy-First:** Strictly zero tracking, telemetry, or analytics beacons.
- **Local-First Processing:** Computation uses Web Workers, WebAssembly (WASM), Web Crypto API, Canvas API, and Web Audio.
- **Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, Zustand 5, Comlink 4.4, DOMPurify, and pdf-lib.

---

## Table of Contents
1. [Alphabetical Tool Index](#alphabetical-tool-index)
2. [Category Index](#category-index)
3. [Route Index](#route-index)
4. [Tool Reference Details By Category](#tool-reference-details-by-category)
5. [Global Cross-Reference Maps](#global-cross-reference-maps)

---

## Alphabetical Tool Index
- [2048](#game-2048)
- [Aes Encrypt Decrypt](#aes-encrypt-decrypt)
- [Age Calculator](#age-calculator)
- [Audio Converter](#audio-converter)
- [Background Remover](#bg-remover)
- [Banking Tools](#banking-tools)
- [Barcode & QR Scanner](#barcode-scanner)
- [Base64 Encode/Decode](#base64)
- [Base64url Converter](#base64url-converter)
- [Bmi Calculator](#bmi-calculator)
- [Box Shadow Generator](#box-shadow-generator)
- [Bulk Image Resize](#bulk-resizer)
- [CAGR Calculator](#cagr-calculator)
- [Calculator](#calculator)
- [Calendar](#calendar)
- [Card Masker](#card-masker)
- [Chart & Graph Generator](#chart-generator)
- [Cipher Tools](#cipher-tools)
- [Code Formatter](#format)
- [Code Minifier](#code-minifier)
- [Color Converter](#color-converter)
- [Color Match](#color-match)
- [Color Palette Extractor](#color-palette-extractor)
- [Command Cheat Sheet](#command-cheat-sheet)
- [Compound Interest Calculator](#compound-interest)
- [Compress](#compress)
- [Compress PDF](#compress-pdf)
- [Contrast Checker](#contrast-checker)
- [Convert to A4](#convert-to-a4)
- [Convert to Legal](#convert-to-legal)
- [Convert to Letter](#convert-to-letter)
- [Core Banking Parser](#core-banking-parser)
- [Countdown Timer](#countdown-timer)
- [Crontab Editor](#crontab-editor)
- [Crop PDF](#crop-pdf)
- [Csp Builder](#csp-builder)
- [Csr Generator](#csr-generator)
- [Csv To Json](#csv-to-json)
- [Currency Converter](#currency-converter)
- [Data Calculator](#data-calculator)
- [Date Calculator](#date-calculator)
- [Delete Blank Pages](#delete-blank-pages)
- [Diff Checker](#diff-checker)
- [Directory Manifest](#directory-manifest)
- [Discount Calculator](#discount-calculator)
- [Duplicate PDF Pages](#duplicate-pages)
- [Ecdh Key Exchange](#ecdh-key-exchange)
- [Ecdsa Sign](#ecdsa-sign)
- [Edit PDF Metadata](#edit-metadata)
- [EMI Calculator](#emi-calculator)
- [Emv Tlv Tree](#emv-tlv-tree)
- [Even Pages Extractor](#even-pages-extractor)
- [Extract Images](#extract-images)
- [Extract PDF Pages](#extract-pages)
- [Fake Data Generator](#fake-data-generator)
- [File Validator](#validate)
- [File Viewer & Diff](#file-viewer-diff)
- [Financial Freedom Calculator](#financial-freedom-calculator)
- [Fixed Deposit (FD)](#fd-calculator)
- [Gif Creator](#gif-creator)
- [Glassmorphism Generator](#glassmorphism-generator)
- [Gradient Generator](#gradient-generator)
- [Grammar & Spell Checker](#grammar-checker)
- [Gratuity Calculator](#gratuity-calculator)
- [GST Calculator](#gst-calculator)
- [Hash Generator](#hash-generator)
- [Hash Map Visualizer](#hash-map-visualizer)
- [Hkdf Generator](#hkdf-generator)
- [Hmac Generator](#hmac-generator)
- [Hra Calculator](#hra-calculator)
- [HTML Entities](#html-entities)
- [HTML Online Viewer](#html-viewer)
- [Iban Validator](#iban-validator)
- [Image Compressor](#image-compress)
- [Image Converter](#image-converter)
- [Image Crop](#image-crop)
- [Image Resizer](#image-resizer)
- [Image Seo](#image-seo)
- [Image to Base64](#image-base64)
- [Image to PDF](#image-to-pdf)
- [Income Tax](#income-tax)
- [Inflation Calculator](#inflation-calculator)
- [Invoice Generator](#invoice-generator)
- [Iso8583 Bitmap Decoder](#iso8583-bitmap-decoder)
- [Iso8583 Message Parser](#iso8583-message-parser)
- [JSON ↔ CSV](#json-csv)
- [JSON Formatter](#json-formatter)
- [JSON to TypeScript](#json-to-ts)
- [JWT Decoder](#jwt-decoder)
- [Lock / Unlock PDF](#lock-unlock-pdf)
- [Log Analyzer](#log-analyzer)
- [Lorem Ipsum](#lorem-ipsum)
- [Luhn Validator](#luhn-validator)
- [Lumpsum Calculator](#lumpsum-calculator)
- [Margin Adjustment](#margin-adjustment)
- [Markdown Editor](#markdown)
- [Memory Match](#memory-match)
- [Merge PDF](#merge-pdf)
- [Meta Tags](#meta-tags)
- [Mic & Camera Tester](#mic-camera-tester)
- [Minesweeper](#minesweeper)
- [Move PDF Pages](#move-pages)
- [Mutual Fund Returns](#mutual-fund-returns)
- [Nanoid Generator](#nanoid-generator)
- [Notes](#notes)
- [Nps Calculator](#nps-calculator)
- [Numeral & Encoding Converter](#numeral-converter)
- [Oauth Token Decoder](#oauth-token-decoder)
- [Odd Pages Extractor](#odd-pages-extractor)
- [Og Preview](#og-preview)
- [Organize PDF](#organize-pdf)
- [Page Numbering](#page-numbering)
- [Page Size Converter](#page-size-converter)
- [Password Generator](#password-generator)
- [Pbkdf2 Generator](#pbkdf2-generator)
- [PDF Editor](#pdf-editor)
- [PDF to Image](#pdf-to-image)
- [PDF to Word](#pdf-to-word)
- [Pem Viewer](#pem-viewer)
- [Percentage Calculator](#percentage-calculator)
- [Phone Mockup Generator](#phone-mockup-generator)
- [Pomodoro Timer](#pomodoro-timer)
- [PPF Calculator](#ppf-calculator)
- [Private Key Checker](#private-key-checker)
- [Public Key Inspector](#public-key-inspector)
- [QR Code Generator](#qrcode)
- [Reaction Time Test](#reaction-time)
- [Recurring Deposit (RD)](#rd-calculator)
- [Regex Tester](#regex-tester)
- [Remove PDF Metadata](#remove-metadata)
- [Remove PDF Pages](#remove-pages)
- [Reorder PDF Pages](#reorder-pages)
- [Retirement Planner](#retirement-calculator)
- [Reverse PDF Pages](#reverse-pages)
- [Robots Txt](#robots-txt)
- [Rotate PDF](#rotate-pdf)
- [Rotate Selected Pages](#rotate-selected-pages)
- [Rsa Encrypt Decrypt](#rsa-encrypt-decrypt)
- [Rsa Key Generator](#rsa-key-generator)
- [Rsa Sign Verify](#rsa-sign-verify)
- [Safe-to-Spend](#safe-to-spend)
- [Salary Calculator](#salary-calculator)
- [Saml Decoder](#saml-decoder)
- [Seo Title](#seo-title)
- [Seo Tools](#seo-tools)
- [SIP Calculator](#sip-calculator)
- [Sitemap Generator](#sitemap-generator)
- [Slug Generator](#slug-generator)
- [Smart Unit Converter](#smart-converter)
- [Snake Game](#snake-game)
- [Speed Tester](#internet-speed-test)
- [Split & Copy](#split-copy)
- [Split PDF](#split-pdf)
- [Sql Formatter](#sql-formatter)
- [Stock Average](#stock-average-calculator)
- [Stopwatch](#stopwatch)
- [Sudoku](#sudoku)
- [Swift Mt Mx](#swift-mt-mx)
- [SWP Calculator](#swp-calculator)
- [Task Reminder](#task-reminder)
- [Tds Calculator](#tds-calculator)
- [Text Case Converter](#text-case-converter)
- [Text Sorter & Deduplicator](#text-sorter-deduper)
- [Text Utility](#text-utility)
- [Tic-Tac-Toe](#tic-tac-toe)
- [Time Calculator](#time-calculator)
- [Time Zone Converter](#timezone-converter)
- [Tlv Parser](#tlv-parser)
- [Track 2 Parser](#track-2-parser)
- [Typing Speed Test](#typing-speed-test)
- [Unit Converter](#unit-converter)
- [Unix Timestamp](#unix-timestamp)
- [URL Cleaner](#url-cleaner)
- [URL Encoder](#url-encoder)
- [UTC ↔ IST](#utc-ist-converter)
- [Uuid Generator](#uuid-generator)
- [Video Metadata Viewer](#video-metadata-viewer)
- [Video Trim](#video-trim)
- [Watermark PDF](#watermark-pdf)
- [WiFi QR Code Generator](#wifi-qr-code)
- [Word Counter](#word-counter)
- [Word Guess](#word-guess)
- [Word To Pdf](#word-to-pdf)
- [Work Hours](#work-hours)
- [World Clock](#world-clock)
- [X509 Viewer](#x509-viewer)
- [Xml Formatter](#xml-formatter)
- [Yaml Json Converter](#yaml-json-converter)
- [Yaml Validator](#yaml-validator)

---

## Category Index
### Break Time
- [2048](#game-2048)
- [Color Match](#color-match)
- [Memory Match](#memory-match)
- [Minesweeper](#minesweeper)
- [Reaction Time Test](#reaction-time)
- [Snake Game](#snake-game)
- [Sudoku](#sudoku)
- [Tic-Tac-Toe](#tic-tac-toe)
- [Word Guess](#word-guess)

### Calculators
- [Age Calculator](#age-calculator)
- [Bmi Calculator](#bmi-calculator)
- [CAGR Calculator](#cagr-calculator)
- [Calculator](#calculator)
- [Compound Interest Calculator](#compound-interest)
- [Currency Converter](#currency-converter)
- [Data Calculator](#data-calculator)
- [Date Calculator](#date-calculator)
- [Discount Calculator](#discount-calculator)
- [EMI Calculator](#emi-calculator)
- [Financial Freedom Calculator](#financial-freedom-calculator)
- [Fixed Deposit (FD)](#fd-calculator)
- [Gratuity Calculator](#gratuity-calculator)
- [GST Calculator](#gst-calculator)
- [Hra Calculator](#hra-calculator)
- [Income Tax](#income-tax)
- [Inflation Calculator](#inflation-calculator)
- [Invoice Generator](#invoice-generator)
- [Lumpsum Calculator](#lumpsum-calculator)
- [Mutual Fund Returns](#mutual-fund-returns)
- [Nps Calculator](#nps-calculator)
- [Numeral & Encoding Converter](#numeral-converter)
- [Percentage Calculator](#percentage-calculator)
- [PPF Calculator](#ppf-calculator)
- [Recurring Deposit (RD)](#rd-calculator)
- [Retirement Planner](#retirement-calculator)
- [Safe-to-Spend](#safe-to-spend)
- [Salary Calculator](#salary-calculator)
- [SIP Calculator](#sip-calculator)
- [Smart Unit Converter](#smart-converter)
- [Stock Average](#stock-average-calculator)
- [SWP Calculator](#swp-calculator)
- [Tds Calculator](#tds-calculator)
- [Time Calculator](#time-calculator)
- [Unit Converter](#unit-converter)
- [UTC ↔ IST](#utc-ist-converter)
- [Work Hours](#work-hours)
- [World Clock](#world-clock)

### Daily Utilities
- [Barcode & QR Scanner](#barcode-scanner)
- [File Validator](#validate)
- [Grammar & Spell Checker](#grammar-checker)
- [Markdown Editor](#markdown)
- [Mic & Camera Tester](#mic-camera-tester)
- [QR Code Generator](#qrcode)
- [Speed Tester](#internet-speed-test)
- [Split & Copy](#split-copy)
- [Task Reminder](#task-reminder)
- [Text Utility](#text-utility)
- [URL Cleaner](#url-cleaner)

### Developer Tools
- [Banking Tools](#banking-tools)
- [Base64 Encode/Decode](#base64)
- [Box Shadow Generator](#box-shadow-generator)
- [Code Formatter](#format)
- [Code Minifier](#code-minifier)
- [Color Converter](#color-converter)
- [Command Cheat Sheet](#command-cheat-sheet)
- [Contrast Checker](#contrast-checker)
- [Core Banking Parser](#core-banking-parser)
- [Crontab Editor](#crontab-editor)
- [Csv To Json](#csv-to-json)
- [Diff Checker](#diff-checker)
- [Emv Tlv Tree](#emv-tlv-tree)
- [Fake Data Generator](#fake-data-generator)
- [File Viewer & Diff](#file-viewer-diff)
- [Glassmorphism Generator](#glassmorphism-generator)
- [Gradient Generator](#gradient-generator)
- [Hash Map Visualizer](#hash-map-visualizer)
- [HTML Online Viewer](#html-viewer)
- [Image Seo](#image-seo)
- [JSON ↔ CSV](#json-csv)
- [JSON Formatter](#json-formatter)
- [JSON to TypeScript](#json-to-ts)
- [Log Analyzer](#log-analyzer)
- [Lorem Ipsum](#lorem-ipsum)
- [Luhn Validator](#luhn-validator)
- [Meta Tags](#meta-tags)
- [Nanoid Generator](#nanoid-generator)
- [Og Preview](#og-preview)
- [Regex Tester](#regex-tester)
- [Robots Txt](#robots-txt)
- [Seo Title](#seo-title)
- [Seo Tools](#seo-tools)
- [Sitemap Generator](#sitemap-generator)
- [Slug Generator](#slug-generator)
- [Sql Formatter](#sql-formatter)
- [Swift Mt Mx](#swift-mt-mx)
- [Track 2 Parser](#track-2-parser)
- [Unix Timestamp](#unix-timestamp)
- [URL Encoder](#url-encoder)
- [Uuid Generator](#uuid-generator)
- [Xml Formatter](#xml-formatter)
- [Yaml Json Converter](#yaml-json-converter)
- [Yaml Validator](#yaml-validator)

### Image Tools
- [Background Remover](#bg-remover)
- [Bulk Image Resize](#bulk-resizer)
- [Color Palette Extractor](#color-palette-extractor)
- [Compress](#compress)
- [Image Compressor](#image-compress)
- [Image Converter](#image-converter)
- [Image Crop](#image-crop)
- [Image Resizer](#image-resizer)
- [Image to Base64](#image-base64)
- [Phone Mockup Generator](#phone-mockup-generator)

### Media Tools
- [Audio Converter](#audio-converter)
- [Gif Creator](#gif-creator)
- [Video Metadata Viewer](#video-metadata-viewer)
- [Video Trim](#video-trim)

### PDF Tools
- [Compress PDF](#compress-pdf)
- [Convert to A4](#convert-to-a4)
- [Convert to Legal](#convert-to-legal)
- [Convert to Letter](#convert-to-letter)
- [Crop PDF](#crop-pdf)
- [Delete Blank Pages](#delete-blank-pages)
- [Duplicate PDF Pages](#duplicate-pages)
- [Edit PDF Metadata](#edit-metadata)
- [Even Pages Extractor](#even-pages-extractor)
- [Extract Images](#extract-images)
- [Extract PDF Pages](#extract-pages)
- [Image to PDF](#image-to-pdf)
- [Lock / Unlock PDF](#lock-unlock-pdf)
- [Margin Adjustment](#margin-adjustment)
- [Merge PDF](#merge-pdf)
- [Move PDF Pages](#move-pages)
- [Odd Pages Extractor](#odd-pages-extractor)
- [Organize PDF](#organize-pdf)
- [Page Numbering](#page-numbering)
- [Page Size Converter](#page-size-converter)
- [PDF Editor](#pdf-editor)
- [PDF to Image](#pdf-to-image)
- [PDF to Word](#pdf-to-word)
- [Remove PDF Metadata](#remove-metadata)
- [Remove PDF Pages](#remove-pages)
- [Reorder PDF Pages](#reorder-pages)
- [Reverse PDF Pages](#reverse-pages)
- [Rotate PDF](#rotate-pdf)
- [Rotate Selected Pages](#rotate-selected-pages)
- [Split PDF](#split-pdf)
- [Watermark PDF](#watermark-pdf)
- [Word To Pdf](#word-to-pdf)

### Productivity
- [Calendar](#calendar)
- [Chart & Graph Generator](#chart-generator)
- [Countdown Timer](#countdown-timer)
- [Notes](#notes)
- [Pomodoro Timer](#pomodoro-timer)
- [Stopwatch](#stopwatch)
- [Text Case Converter](#text-case-converter)
- [Text Sorter & Deduplicator](#text-sorter-deduper)
- [Time Zone Converter](#timezone-converter)
- [Typing Speed Test](#typing-speed-test)
- [WiFi QR Code Generator](#wifi-qr-code)
- [Word Counter](#word-counter)

### Security
- [Aes Encrypt Decrypt](#aes-encrypt-decrypt)
- [Base64url Converter](#base64url-converter)
- [Card Masker](#card-masker)
- [Cipher Tools](#cipher-tools)
- [Csp Builder](#csp-builder)
- [Csr Generator](#csr-generator)
- [Directory Manifest](#directory-manifest)
- [Ecdh Key Exchange](#ecdh-key-exchange)
- [Ecdsa Sign](#ecdsa-sign)
- [Hash Generator](#hash-generator)
- [Hkdf Generator](#hkdf-generator)
- [Hmac Generator](#hmac-generator)
- [HTML Entities](#html-entities)
- [Iban Validator](#iban-validator)
- [Iso8583 Bitmap Decoder](#iso8583-bitmap-decoder)
- [Iso8583 Message Parser](#iso8583-message-parser)
- [JWT Decoder](#jwt-decoder)
- [Oauth Token Decoder](#oauth-token-decoder)
- [Password Generator](#password-generator)
- [Pbkdf2 Generator](#pbkdf2-generator)
- [Pem Viewer](#pem-viewer)
- [Private Key Checker](#private-key-checker)
- [Public Key Inspector](#public-key-inspector)
- [Rsa Encrypt Decrypt](#rsa-encrypt-decrypt)
- [Rsa Key Generator](#rsa-key-generator)
- [Rsa Sign Verify](#rsa-sign-verify)
- [Saml Decoder](#saml-decoder)
- [Tlv Parser](#tlv-parser)
- [X509 Viewer](#x509-viewer)


---

## Route Index
- `//pdf-tools/convert-to-a4` → [Convert to A4](#convert-to-a4)
- `//pdf-tools/convert-to-legal` → [Convert to Legal](#convert-to-legal)
- `//pdf-tools/convert-to-letter` → [Convert to Letter](#convert-to-letter)
- `//pdf-tools/crop-pdf` → [Crop PDF](#crop-pdf)
- `//pdf-tools/edit-metadata` → [Edit PDF Metadata](#edit-metadata)
- `//pdf-tools/margin-adjustment` → [Margin Adjustment](#margin-adjustment)
- `//pdf-tools/page-size-converter` → [Page Size Converter](#page-size-converter)
- `//pdf-tools/remove-metadata` → [Remove PDF Metadata](#remove-metadata)
- `//pdf-tools/split-pdf` → [Split PDF](#split-pdf)
- `/banking-tools/core-banking-parser` → [Core Banking Parser](#core-banking-parser)
- `/banking-tools/emv-tlv-tree` → [Emv Tlv Tree](#emv-tlv-tree)
- `/banking-tools/swift-mt-mx` → [Swift Mt Mx](#swift-mt-mx)
- `/banking-tools/track-2-parser` → [Track 2 Parser](#track-2-parser)
- `/break-time-tools/color-match` → [Color Match](#color-match)
- `/break-time-tools/game-2048` → [2048](#game-2048)
- `/break-time-tools/memory-match` → [Memory Match](#memory-match)
- `/break-time-tools/minesweeper` → [Minesweeper](#minesweeper)
- `/break-time-tools/reaction-time` → [Reaction Time Test](#reaction-time)
- `/break-time-tools/snake-game` → [Snake Game](#snake-game)
- `/break-time-tools/sudoku` → [Sudoku](#sudoku)
- `/break-time-tools/tic-tac-toe` → [Tic-Tac-Toe](#tic-tac-toe)
- `/break-time-tools/word-guess` → [Word Guess](#word-guess)
- `/calculators/age-calculator` → [Age Calculator](#age-calculator)
- `/calculators/bmi-calculator` → [Bmi Calculator](#bmi-calculator)
- `/calculators/cagr-calculator` → [CAGR Calculator](#cagr-calculator)
- `/calculators/calculator` → [Calculator](#calculator)
- `/calculators/compound-interest` → [Compound Interest Calculator](#compound-interest)
- `/calculators/currency-converter` → [Currency Converter](#currency-converter)
- `/calculators/data-calculator` → [Data Calculator](#data-calculator)
- `/calculators/date-calculator` → [Date Calculator](#date-calculator)
- `/calculators/discount-calculator` → [Discount Calculator](#discount-calculator)
- `/calculators/emi-calculator` → [EMI Calculator](#emi-calculator)
- `/calculators/fd-calculator` → [Fixed Deposit (FD)](#fd-calculator)
- `/calculators/financial-freedom-calculator` → [Financial Freedom Calculator](#financial-freedom-calculator)
- `/calculators/gratuity-calculator` → [Gratuity Calculator](#gratuity-calculator)
- `/calculators/gst-calculator` → [GST Calculator](#gst-calculator)
- `/calculators/hra-calculator` → [Hra Calculator](#hra-calculator)
- `/calculators/income-tax` → [Income Tax](#income-tax)
- `/calculators/inflation-calculator` → [Inflation Calculator](#inflation-calculator)
- `/calculators/invoice-generator` → [Invoice Generator](#invoice-generator)
- `/calculators/lumpsum-calculator` → [Lumpsum Calculator](#lumpsum-calculator)
- `/calculators/mutual-fund-returns` → [Mutual Fund Returns](#mutual-fund-returns)
- `/calculators/nps-calculator` → [Nps Calculator](#nps-calculator)
- `/calculators/numeral-converter` → [Numeral & Encoding Converter](#numeral-converter)
- `/calculators/percentage-calculator` → [Percentage Calculator](#percentage-calculator)
- `/calculators/ppf-calculator` → [PPF Calculator](#ppf-calculator)
- `/calculators/rd-calculator` → [Recurring Deposit (RD)](#rd-calculator)
- `/calculators/retirement-calculator` → [Retirement Planner](#retirement-calculator)
- `/calculators/safe-to-spend` → [Safe-to-Spend](#safe-to-spend)
- `/calculators/salary-calculator` → [Salary Calculator](#salary-calculator)
- `/calculators/sip-calculator` → [SIP Calculator](#sip-calculator)
- `/calculators/smart-converter` → [Smart Unit Converter](#smart-converter)
- `/calculators/stock-average-calculator` → [Stock Average](#stock-average-calculator)
- `/calculators/swp-calculator` → [SWP Calculator](#swp-calculator)
- `/calculators/tds-calculator` → [Tds Calculator](#tds-calculator)
- `/calculators/time-calculator` → [Time Calculator](#time-calculator)
- `/calculators/unit-converter` → [Unit Converter](#unit-converter)
- `/calculators/utc-ist-converter` → [UTC ↔ IST](#utc-ist-converter)
- `/calculators/work-hours` → [Work Hours](#work-hours)
- `/calculators/world-clock` → [World Clock](#world-clock)
- `/developer-tools/banking-tools` → [Banking Tools](#banking-tools)
- `/developer-tools/base64` → [Base64 Encode/Decode](#base64)
- `/developer-tools/box-shadow-generator` → [Box Shadow Generator](#box-shadow-generator)
- `/developer-tools/code-minifier` → [Code Minifier](#code-minifier)
- `/developer-tools/color-converter` → [Color Converter](#color-converter)
- `/developer-tools/command-cheat-sheet` → [Command Cheat Sheet](#command-cheat-sheet)
- `/developer-tools/contrast-checker` → [Contrast Checker](#contrast-checker)
- `/developer-tools/crontab-editor` → [Crontab Editor](#crontab-editor)
- `/developer-tools/csv-to-json` → [Csv To Json](#csv-to-json)
- `/developer-tools/diff-checker` → [Diff Checker](#diff-checker)
- `/developer-tools/fake-data-generator` → [Fake Data Generator](#fake-data-generator)
- `/developer-tools/format` → [Code Formatter](#format)
- `/developer-tools/glassmorphism-generator` → [Glassmorphism Generator](#glassmorphism-generator)
- `/developer-tools/gradient-generator` → [Gradient Generator](#gradient-generator)
- `/developer-tools/hash-map-visualizer` → [Hash Map Visualizer](#hash-map-visualizer)
- `/developer-tools/html-viewer` → [HTML Online Viewer](#html-viewer)
- `/developer-tools/json-csv` → [JSON ↔ CSV](#json-csv)
- `/developer-tools/json-formatter` → [JSON Formatter](#json-formatter)
- `/developer-tools/json-to-ts` → [JSON to TypeScript](#json-to-ts)
- `/developer-tools/log-analyzer` → [Log Analyzer](#log-analyzer)
- `/developer-tools/lorem-ipsum` → [Lorem Ipsum](#lorem-ipsum)
- `/developer-tools/luhn-validator` → [Luhn Validator](#luhn-validator)
- `/developer-tools/nanoid-generator` → [Nanoid Generator](#nanoid-generator)
- `/developer-tools/regex` → [Regex Tester](#regex-tester)
- `/developer-tools/seo-tools` → [Seo Tools](#seo-tools)
- `/developer-tools/sql-formatter` → [Sql Formatter](#sql-formatter)
- `/developer-tools/unix-timestamp` → [Unix Timestamp](#unix-timestamp)
- `/developer-tools/url-encoder` → [URL Encoder](#url-encoder)
- `/developer-tools/uuid-generator` → [Uuid Generator](#uuid-generator)
- `/developer-tools/xml-formatter` → [Xml Formatter](#xml-formatter)
- `/developer-tools/yaml-json-converter` → [Yaml Json Converter](#yaml-json-converter)
- `/developer-tools/yaml-validator` → [Yaml Validator](#yaml-validator)
- `/file-tools/file-viewer-diff` → [File Viewer & Diff](#file-viewer-diff)
- `/image-tools/bg-remover` → [Background Remover](#bg-remover)
- `/image-tools/bulk-resizer` → [Bulk Image Resize](#bulk-resizer)
- `/image-tools/color-palette-extractor` → [Color Palette Extractor](#color-palette-extractor)
- `/image-tools/compress` → [Compress](#compress)
- `/image-tools/image-base64` → [Image to Base64](#image-base64)
- `/image-tools/image-compressor` → [Image Compressor](#image-compress)
- `/image-tools/image-converter` → [Image Converter](#image-converter)
- `/image-tools/image-crop` → [Image Crop](#image-crop)
- `/image-tools/image-resizer` → [Image Resizer](#image-resizer)
- `/image-tools/phone-mockup-generator` → [Phone Mockup Generator](#phone-mockup-generator)
- `/media-tools/audio-converter` → [Audio Converter](#audio-converter)
- `/media-tools/gif-creator` → [Gif Creator](#gif-creator)
- `/media-tools/video-metadata-viewer` → [Video Metadata Viewer](#video-metadata-viewer)
- `/media-tools/video-trim` → [Video Trim](#video-trim)
- `/pdf-tools/compress-pdf` → [Compress PDF](#compress-pdf)
- `/pdf-tools/delete-blank-pages` → [Delete Blank Pages](#delete-blank-pages)
- `/pdf-tools/duplicate-pages` → [Duplicate PDF Pages](#duplicate-pages)
- `/pdf-tools/even-pages-extractor` → [Even Pages Extractor](#even-pages-extractor)
- `/pdf-tools/extract-images` → [Extract Images](#extract-images)
- `/pdf-tools/extract-pages` → [Extract PDF Pages](#extract-pages)
- `/pdf-tools/image-to-pdf` → [Image to PDF](#image-to-pdf)
- `/pdf-tools/lock-unlock` → [Lock / Unlock PDF](#lock-unlock-pdf)
- `/pdf-tools/merge-pdf` → [Merge PDF](#merge-pdf)
- `/pdf-tools/move-pages` → [Move PDF Pages](#move-pages)
- `/pdf-tools/odd-pages-extractor` → [Odd Pages Extractor](#odd-pages-extractor)
- `/pdf-tools/organize-pdf` → [Organize PDF](#organize-pdf)
- `/pdf-tools/page-numbering` → [Page Numbering](#page-numbering)
- `/pdf-tools/pdf-editor` → [PDF Editor](#pdf-editor)
- `/pdf-tools/pdf-to-image` → [PDF to Image](#pdf-to-image)
- `/pdf-tools/pdf-to-word` → [PDF to Word](#pdf-to-word)
- `/pdf-tools/remove-pages` → [Remove PDF Pages](#remove-pages)
- `/pdf-tools/reorder-pages` → [Reorder PDF Pages](#reorder-pages)
- `/pdf-tools/reverse-pages` → [Reverse PDF Pages](#reverse-pages)
- `/pdf-tools/rotate-pdf` → [Rotate PDF](#rotate-pdf)
- `/pdf-tools/rotate-selected-pages` → [Rotate Selected Pages](#rotate-selected-pages)
- `/pdf-tools/watermark-pdf` → [Watermark PDF](#watermark-pdf)
- `/pdf-tools/word-to-pdf` → [Word To Pdf](#word-to-pdf)
- `/productivity/calendar` → [Calendar](#calendar)
- `/productivity/chart-generator` → [Chart & Graph Generator](#chart-generator)
- `/productivity/countdown-timer` → [Countdown Timer](#countdown-timer)
- `/productivity/notes` → [Notes](#notes)
- `/productivity/pomodoro-timer` → [Pomodoro Timer](#pomodoro-timer)
- `/productivity/stopwatch` → [Stopwatch](#stopwatch)
- `/productivity/text-case-converter` → [Text Case Converter](#text-case-converter)
- `/productivity/text-sorter-deduper` → [Text Sorter & Deduplicator](#text-sorter-deduper)
- `/productivity/timezone-converter` → [Time Zone Converter](#timezone-converter)
- `/productivity/typing-speed-test` → [Typing Speed Test](#typing-speed-test)
- `/productivity/wifi-qr-code` → [WiFi QR Code Generator](#wifi-qr-code)
- `/productivity/word-counter` → [Word Counter](#word-counter)
- `/security-tools/aes-encrypt-decrypt` → [Aes Encrypt Decrypt](#aes-encrypt-decrypt)
- `/security-tools/base64url-converter` → [Base64url Converter](#base64url-converter)
- `/security-tools/card-masker` → [Card Masker](#card-masker)
- `/security-tools/cipher-tools` → [Cipher Tools](#cipher-tools)
- `/security-tools/csp-builder` → [Csp Builder](#csp-builder)
- `/security-tools/csr-generator` → [Csr Generator](#csr-generator)
- `/security-tools/directory-manifest` → [Directory Manifest](#directory-manifest)
- `/security-tools/ecdh-key-exchange` → [Ecdh Key Exchange](#ecdh-key-exchange)
- `/security-tools/ecdsa-sign` → [Ecdsa Sign](#ecdsa-sign)
- `/security-tools/hash-generator` → [Hash Generator](#hash-generator)
- `/security-tools/hkdf-generator` → [Hkdf Generator](#hkdf-generator)
- `/security-tools/hmac-generator` → [Hmac Generator](#hmac-generator)
- `/security-tools/html-entities` → [HTML Entities](#html-entities)
- `/security-tools/iban-validator` → [Iban Validator](#iban-validator)
- `/security-tools/iso8583-bitmap-decoder` → [Iso8583 Bitmap Decoder](#iso8583-bitmap-decoder)
- `/security-tools/iso8583-message-parser` → [Iso8583 Message Parser](#iso8583-message-parser)
- `/security-tools/jwt-decoder` → [JWT Decoder](#jwt-decoder)
- `/security-tools/oauth-token-decoder` → [Oauth Token Decoder](#oauth-token-decoder)
- `/security-tools/password-generator` → [Password Generator](#password-generator)
- `/security-tools/pbkdf2-generator` → [Pbkdf2 Generator](#pbkdf2-generator)
- `/security-tools/pem-viewer` → [Pem Viewer](#pem-viewer)
- `/security-tools/private-key-checker` → [Private Key Checker](#private-key-checker)
- `/security-tools/public-key-inspector` → [Public Key Inspector](#public-key-inspector)
- `/security-tools/rsa-encrypt-decrypt` → [Rsa Encrypt Decrypt](#rsa-encrypt-decrypt)
- `/security-tools/rsa-key-generator` → [Rsa Key Generator](#rsa-key-generator)
- `/security-tools/rsa-sign-verify` → [Rsa Sign Verify](#rsa-sign-verify)
- `/security-tools/saml-decoder` → [Saml Decoder](#saml-decoder)
- `/security-tools/tlv-parser` → [Tlv Parser](#tlv-parser)
- `/security-tools/x509-viewer` → [X509 Viewer](#x509-viewer)
- `/seo-tools/image-seo` → [Image Seo](#image-seo)
- `/seo-tools/meta-tags` → [Meta Tags](#meta-tags)
- `/seo-tools/og-preview` → [Og Preview](#og-preview)
- `/seo-tools/robots-txt` → [Robots Txt](#robots-txt)
- `/seo-tools/seo-title` → [Seo Title](#seo-title)
- `/seo-tools/sitemap-generator` → [Sitemap Generator](#sitemap-generator)
- `/seo-tools/slug-generator` → [Slug Generator](#slug-generator)
- `/text/grammar-checker` → [Grammar & Spell Checker](#grammar-checker)
- `/utilities/barcode-scanner` → [Barcode & QR Scanner](#barcode-scanner)
- `/utilities/internet-speed-test` → [Speed Tester](#internet-speed-test)
- `/utilities/markdown` → [Markdown Editor](#markdown)
- `/utilities/mic-camera-tester` → [Mic & Camera Tester](#mic-camera-tester)
- `/utilities/qrcode` → [QR Code Generator](#qrcode)
- `/utilities/split-copy` → [Split & Copy](#split-copy)
- `/utilities/task-reminder` → [Task Reminder](#task-reminder)
- `/utilities/text-utility` → [Text Utility](#text-utility)
- `/utilities/url-cleaner` → [URL Cleaner](#url-cleaner)
- `/utilities/validate` → [File Validator](#validate)

---

## Tool Reference Details By Category

## Category: Break Time

### <a id="game-2048"></a>2048

#### Identity
- **ID:** `game-2048`
- **Name:** 2048
- **Category:** Break Time
- **Route:** `/break-time-tools/game-2048`

#### Purpose
> Slide and merge tiles to reach 2048. Addictive puzzle game — fully offline.

#### Features
- Support for 2048
- Support for puzzle
- Support for game
- Support for sliding tiles
- Support for merge
- Support for brain training
- Support for fun

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `framer-motion`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `logger` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/break-time-tools/game-2048/page.tsx`
- **Client Component:** `app/(tools)/break-time-tools/game-2048/Game2048Client.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/game-2048.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | Yes |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** Yes
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** `tic-tac-toe`, `memory-match`
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/break-time-tools/game-2048/page.tsx`
  - `app/(tools)/break-time-tools/game-2048/Game2048Client.tsx`
  - `app/(tools)/break-time-tools/game-2048/Game2048ClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="color-match"></a>Color Match

#### Identity
- **ID:** `color-match`
- **Name:** Color Match
- **Category:** Break Time
- **Route:** `/break-time-tools/color-match`

#### Purpose
> Pick the exact color swatch under time pressure to test your visual accuracy.

#### Features
- Support for color match
- Support for color test
- Support for swatch
- Support for visual accuracy
- Support for reflex
- Support for game

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `framer-motion`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `logger` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/break-time-tools/color-match/page.tsx`
- **Client Component:** `app/(tools)/break-time-tools/color-match/ColorMatchClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/color-match.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | Yes |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** Yes
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** `reaction-time`, `memory-match`
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/break-time-tools/color-match/page.tsx`
  - `app/(tools)/break-time-tools/color-match/ColorMatchClient.tsx`
  - `app/(tools)/break-time-tools/color-match/ColorMatchClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="memory-match"></a>Memory Match

#### Identity
- **ID:** `memory-match`
- **Name:** Memory Match
- **Category:** Break Time
- **Route:** `/break-time-tools/memory-match`

#### Purpose
> Flip cards and match pairs. A classic memory-training game with best-score tracking.

#### Features
- Support for memory match
- Support for card flip
- Support for pairs
- Support for concentration
- Support for brain training
- Support for game
- Support for fun

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `framer-motion`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `logger` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/break-time-tools/memory-match/page.tsx`
- **Client Component:** `app/(tools)/break-time-tools/memory-match/MemoryMatchClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/memory-match.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | Yes |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** Yes
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** `tic-tac-toe`, `game-2048`
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/break-time-tools/memory-match/page.tsx`
  - `app/(tools)/break-time-tools/memory-match/MemoryMatchClient.tsx`
  - `app/(tools)/break-time-tools/memory-match/MemoryMatchClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="minesweeper"></a>Minesweeper

> ⚠️ Added outside the standard approval process

#### Identity
- **ID:** `minesweeper`
- **Name:** Minesweeper
- **Category:** Break Time
- **Route:** `/break-time-tools/minesweeper`

#### Purpose
> Classic Minesweeper puzzle. Clear the board without clicking on hidden mines. Multiple difficulties and mobile friendly controls.

#### Features
- Support for minesweeper
- Support for mines
- Support for logic game
- Support for classic game
- Support for brain break
- Support for offline

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `framer-motion`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `logger` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/break-time-tools/minesweeper/page.tsx`
- **Client Component:** `app/(tools)/break-time-tools/minesweeper/MinesweeperClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/minesweeper.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | Yes |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** Yes
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** `sudoku`, `game-2048`, `memory-match`
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/break-time-tools/minesweeper/page.tsx`
  - `app/(tools)/break-time-tools/minesweeper/MinesweeperClient.tsx`
  - `app/(tools)/break-time-tools/minesweeper/MinesweeperClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="reaction-time"></a>Reaction Time Test

#### Identity
- **ID:** `reaction-time`
- **Name:** Reaction Time Test
- **Category:** Break Time
- **Route:** `/break-time-tools/reaction-time`

#### Purpose
> Test your reflexes and measure your reaction speed in milliseconds.

#### Features
- Support for reaction time
- Support for reflexes
- Support for speed
- Support for test
- Support for brain game
- Support for cognitive

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `framer-motion`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `logger` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/break-time-tools/reaction-time/page.tsx`
- **Client Component:** `app/(tools)/break-time-tools/reaction-time/ReactionTimeClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/reaction-time.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | Yes |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** Yes
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** `color-match`, `tic-tac-toe`
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/break-time-tools/reaction-time/page.tsx`
  - `app/(tools)/break-time-tools/reaction-time/ReactionTimeClient.tsx`
  - `app/(tools)/break-time-tools/reaction-time/ReactionTimeClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="snake-game"></a>Snake Game

> ⚠️ Added outside the standard approval process

#### Identity
- **ID:** `snake-game`
- **Name:** Snake Game
- **Category:** Break Time
- **Route:** `/break-time-tools/snake-game`

#### Purpose
> Play the classic retro Snake game. Eat food, grow longer, and set new high scores entirely in your browser.

#### Features
- Support for snake
- Support for arcade
- Support for retro
- Support for classic game
- Support for brain break
- Support for fun
- Support for offline

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `framer-motion`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `logger` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/break-time-tools/snake-game/page.tsx`
- **Client Component:** `app/(tools)/break-time-tools/snake-game/SnakeGameClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/snake-game.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | Yes |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** Yes
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** `game-2048`, `reaction-time`, `tic-tac-toe`
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/break-time-tools/snake-game/page.tsx`
  - `app/(tools)/break-time-tools/snake-game/SnakeGameClient.tsx`
  - `app/(tools)/break-time-tools/snake-game/SnakeGameClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="sudoku"></a>Sudoku

> ⚠️ Added outside the standard approval process

#### Identity
- **ID:** `sudoku`
- **Name:** Sudoku
- **Category:** Break Time
- **Route:** `/break-time-tools/sudoku`

#### Purpose
> Classic 9x9 Sudoku logical number placement puzzle with multiple difficulty modes, hints, and local best times.

#### Features
- Support for sudoku
- Support for number puzzle
- Support for logic game
- Support for brain training
- Support for puzzle
- Support for offline

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `framer-motion`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `logger` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/break-time-tools/sudoku/page.tsx`
- **Client Component:** `app/(tools)/break-time-tools/sudoku/SudokuClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/sudoku.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | Yes |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** Yes
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** `game-2048`, `memory-match`, `word-guess`
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/break-time-tools/sudoku/page.tsx`
  - `app/(tools)/break-time-tools/sudoku/SudokuClient.tsx`
  - `app/(tools)/break-time-tools/sudoku/SudokuClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="tic-tac-toe"></a>Tic-Tac-Toe

#### Identity
- **ID:** `tic-tac-toe`
- **Name:** Tic-Tac-Toe
- **Category:** Break Time
- **Route:** `/break-time-tools/tic-tac-toe`

#### Purpose
> Classic 2-player Tic-Tac-Toe right in your browser. No downloads, no sign-in.

#### Features
- Support for tic tac toe
- Support for game
- Support for fun
- Support for brain break
- Support for two player
- Support for noughts and crosses

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `framer-motion`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `logger` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/break-time-tools/tic-tac-toe/page.tsx`
- **Client Component:** `app/(tools)/break-time-tools/tic-tac-toe/TicTacToeClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/tic-tac-toe.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | Yes |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** Yes
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** `memory-match`, `game-2048`
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/break-time-tools/tic-tac-toe/page.tsx`
  - `app/(tools)/break-time-tools/tic-tac-toe/TicTacToeClient.tsx`
  - `app/(tools)/break-time-tools/tic-tac-toe/TicTacToeClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="word-guess"></a>Word Guess

> ⚠️ Added outside the standard approval process

#### Identity
- **ID:** `word-guess`
- **Name:** Word Guess
- **Category:** Break Time
- **Route:** `/break-time-tools/word-guess`

#### Purpose
> A word guessing puzzle game. Find the secret 5-letter word in 6 tries using visual feedback.

#### Features
- Support for word guess
- Support for wordle
- Support for word game
- Support for puzzle
- Support for vocabulary
- Support for brain training
- Support for spelling
- Support for offline

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `framer-motion`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `logger` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/break-time-tools/word-guess/page.tsx`
- **Client Component:** `app/(tools)/break-time-tools/word-guess/WordGuessClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/word-guess.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | Yes |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** Yes
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** `memory-match`, `color-match`, `tic-tac-toe`
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/break-time-tools/word-guess/page.tsx`
  - `app/(tools)/break-time-tools/word-guess/WordGuessClient.tsx`
  - `app/(tools)/break-time-tools/word-guess/WordGuessClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---


## Category: Calculators

### <a id="age-calculator"></a>Age Calculator

#### Identity
- **ID:** `age-calculator`
- **Name:** Age Calculator
- **Category:** Calculators
- **Route:** `/calculators/age-calculator`

#### Purpose
> 
The KaruviLab Age Calculator provides an accurate way to calculate the precise time between any two dates.

#### Features
- Filling out official government forms that require age in years, months, and days.
- Determining the exact number of days until a significant upcoming milestone or birthday.
- Calculating the precise age of documents, historical buildings, or projects.
- Tracking how many days an infant has been alive for pediatric or developmental milestones.

#### Functionality
Set Date of Birth: Click the birth date field to open the calendar and select your date of birth. Choose Target Date: The tool defaults to the current date. You can change this to calculate your age as of a specific past or future date. Calculate: Click 'Calculate Age'. The tool will immediately return your precise age broken down by years, total months, total weeks, and total days. Next Birthday: The tool also calculates the time remaining until your next upcoming birthday.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `HybridDateInput`, `ShareButton`, `SharedResultBanner`, `QRModal`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `useUrlState` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/age-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/age-calculator/AgeCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/age-calculator.ts`
- **Registry File:** `src/registry/tools/age-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** `date-calculator`, `time-calculator`
- **Shared Components Used:** `ToolShell`, `MetricCard`, `HybridDateInput`, `ShareButton`, `SharedResultBanner`, `QRModal`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Age is off by one day, Resolve issues relating to: Future birth date error
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/age-calculator/page.tsx`
  - `app/(tools)/calculators/age-calculator/AgeCalculatorClient.tsx`
  - `app/(tools)/calculators/age-calculator/AgeCalculatorClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="bmi-calculator"></a>Bmi Calculator

#### Identity
- **ID:** `bmi-calculator`
- **Name:** Bmi Calculator
- **Category:** Calculators
- **Route:** `/calculators/bmi-calculator`

#### Purpose
> Calculate your Body Mass Index (BMI) and health category to track fitness goals.

#### Features
- Support for bmi calculator
- Support for calculators

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `ShareButton`, `SharedResultBanner`, `QRModal`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `utils`, `useUrlState`, `types`, `constants`, `BmiGauge` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/bmi-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/bmi-calculator/BmiCalculatorClient.tsx`
- **Feature Directory:** `src/features/bmi-calculator`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/bmi-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `ShareButton`, `SharedResultBanner`, `QRModal`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/bmi-calculator/page.tsx`
  - `app/(tools)/calculators/bmi-calculator/BmiCalculatorClient.tsx`
  - `app/(tools)/calculators/bmi-calculator/BmiCalculatorWrapper.tsx`
  - `src/features/bmi-calculator/components/BmiGauge.tsx`
  - `src/features/bmi-calculator/constants/index.ts`
  - `src/features/bmi-calculator/types/index.ts`
  - `src/features/bmi-calculator/utils/index.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="cagr-calculator"></a>CAGR Calculator

#### Identity
- **ID:** `cagr-calculator`
- **Name:** CAGR Calculator
- **Category:** Calculators
- **Route:** `/calculators/cagr-calculator`

#### Purpose
> Compound Annual Growth Rate (CAGR) is the best way to measure the mean annual growth of an investment over time, smoothing out volatility.

#### Features
- Evaluating the performance of a stock or mutual fund portfolio
- Comparing business growth over several years
- Determining the annualized yield of real estate investments

#### Functionality
Enter the initial investment value. Enter the final (current) investment value. Enter the duration in years. The tool calculates the CAGR percentage instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `ToolInput`, `CopyButton`, `ShareButton`, `SharedResultBanner`, `QRModal`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `useUrlState` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/cagr-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/cagr-calculator/CAGRCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/cagr-calculator.ts`
- **Registry File:** `src/registry/tools/cagr-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `ToolInput`, `CopyButton`, `ShareButton`, `SharedResultBanner`, `QRModal`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/cagr-calculator/page.tsx`
  - `app/(tools)/calculators/cagr-calculator/CAGRCalculatorClient.tsx`
  - `app/(tools)/calculators/cagr-calculator/CAGRCalculatorClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="calculator"></a>Calculator

#### Identity
- **ID:** `calculator`
- **Name:** Calculator
- **Category:** Calculators
- **Route:** `/calculators/calculator`

#### Purpose
> 
    The Calculator provides a fully integrated mathematical workspace that merges standard and scientific functionalities into one premium interface.

#### Features
- Support for calculator
- Support for math
- Support for scientific
- Support for standard
- Support for trigonometry

#### Functionality
Enter an expression using the on-screen keypad or your physical keyboard. On mobile, rotate your device to landscape or toggle the sidebar to access scientific functions. Access your calculation history from the panel to reuse previous results. Use memory keys (MC, MR, M+, M-) for running subtotals. Change settings like angle unit (Deg/Rad) or precision from the options menu.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `zustand`, `lucide-react`, `framer-motion`, `decimal.js` |
| **Shared Internal Modules** | `calculatorClientWrapper`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/calculator/page.tsx`
- **Client Component:** `Not Present in Repository`
- **Feature Directory:** `src/features/calculator`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `src/features/calculator/store.ts`
- **Content File:** `src/content/tools/calculator.ts`
- **Registry File:** `src/registry/tools/calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | Yes |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** Yes
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** `unit-converter`, `percentage-calculator`
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/calculator/page.tsx`
  - `src/features/calculator/calculatorClient.tsx`
  - `src/features/calculator/calculatorClientWrapper.tsx`
  - `src/features/calculator/components/CalculatorDisplay.tsx`
  - `src/features/calculator/components/CalculatorKey.tsx`
  - `src/features/calculator/components/HistoryPanel.tsx`
  - `src/features/calculator/components/ScientificKeypad.tsx`
  - `src/features/calculator/components/StandardKeypad.tsx`
  - `src/features/calculator/engine/parser.ts`
  - `src/features/calculator/store.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="compound-interest"></a>Compound Interest Calculator

#### Identity
- **ID:** `compound-interest`
- **Name:** Compound Interest Calculator
- **Category:** Calculators
- **Route:** `/calculators/compound-interest`

#### Purpose
> Calculate the future value of an investment using the compound interest formula.

#### Features
- Projecting the growth of a fixed deposit or savings account
- Comparing compounding frequencies when evaluating financial products
- Understanding how reinvesting dividends compounds returns
- Setting a savings goal and working backwards to find the required principal

#### Functionality
Enter the principal (initial investment). Enter the annual interest rate. Enter the investment period in years. Choose compounding frequency. Optionally add a monthly contribution and click 'Calculate'.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `SliderField`, `CalculatorActionBar`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `calculator-utils` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/compound-interest/page.tsx`
- **Client Component:** `app/(tools)/calculators/compound-interest/CompoundInterestClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/compound-interest.ts`
- **Registry File:** `src/registry/tools/compound-interest.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `SliderField`, `CalculatorActionBar`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Result doesn't match the bank's stated maturity amount, Resolve issues relating to: Entered rate as a decimal instead of percentage
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/compound-interest/page.tsx`
  - `app/(tools)/calculators/compound-interest/CompoundInterestClient.tsx`
  - `app/(tools)/calculators/compound-interest/CompoundInterestClientWrapper.tsx`
  - `app/(tools)/calculators/compound-interest/layout.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="currency-converter"></a>Currency Converter

#### Identity
- **ID:** `currency-converter`
- **Name:** Currency Converter
- **Category:** Calculators
- **Route:** `/calculators/currency-converter`

#### Purpose
> 
The Currency Converter is a real-time financial utility that allows you to calculate exchange values between global currencies instantly.

#### Features
- Support for currency
- Support for exchange
- Support for forex
- Support for usd
- Support for eur
- Support for inr

#### Functionality
Select Base: Choose the currency you currently have from the first dropdown menu. Select Target: Choose the currency you want to convert into from the second dropdown. Enter Amount: Type the value you wish to convert into the input field. View Result: See the converted value instantly based on the latest exchange rates. Swap: Use the 'Swap' button to quickly reverse the conversion direction.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton`, `MetricCard`, `ToolInput` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion`, `zustand` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `CurrencyConverterClient`, `db`, `utils` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/currency-converter/page.tsx`
- **Client Component:** `app/(tools)/calculators/currency-converter/CurrencyConverterClient.tsx`
- **Feature Directory:** `src/features/currency-converter`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `src/features/currency-converter/store.ts`
- **Content File:** `src/content/tools/currency-converter.ts`
- **Registry File:** `src/registry/tools/currency-converter.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | No |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** Yes
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** No
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`, `MetricCard`, `ToolInput`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/currency-converter/page.tsx`
  - `app/(tools)/calculators/currency-converter/CurrencyConverterClient.tsx`
  - `app/(tools)/calculators/currency-converter/CurrencyConverterClientWrapper.tsx`
  - `app/(tools)/calculators/currency-converter/layout.tsx`
  - `src/features/currency-converter/components/CurrencyConverterClient.tsx`
  - `src/features/currency-converter/components/CurrencySelect.tsx`
  - `src/features/currency-converter/rates-service.ts`
  - `src/features/currency-converter/store.ts`
  - `src/features/currency-converter/types.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="data-calculator"></a>Data Calculator

#### Identity
- **ID:** `data-calculator`
- **Name:** Data Calculator
- **Category:** Calculators
- **Route:** `/calculators/data-calculator`

#### Purpose
> A comprehensive data utility suite for engineers, students, and digital professionals.

#### Features
- Verifying integrity of a large ISO download using SHA-256
- Estimating how long a 50GB backup will take on a 10Mbps upload
- Converting GiB to GB to understand why a '500GB' drive shows up smaller
- Budgeting cloud storage costs for a medium-term data archive

#### Functionality
Switch between the four tabs: Unit Converter, Transfer Time, Storage Cost, or Checksum. For Unit Converter: Enter a value and select source/target units to see the conversion instantly. For Transfer Time: Enter file size and connection speed. Adjust the overhead slider for real-world estimates. For Storage Cost: Enter data volume, monthly cost per GB, and duration. Use presets for common cloud providers like AWS S3. For Checksum: Paste text or drop a file. Select an algorithm (MD5, SHA-256, etc.) and click generate to compute the hash locally.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell` |
| **Processing Packages** | `next`, `zustand` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/data-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/data-calculator/DataCalculatorWrapper.tsx`
- **Feature Directory:** `src/features/data-calculator`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `src/features/data-calculator/store.ts`
- **Content File:** `src/content/tools/data-calculator.ts`
- **Registry File:** `src/registry/tools/data-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** `unit-converter`, `json-formatter`, `qrcode`
- **Shared Components Used:** `ToolShell`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/data-calculator/page.tsx`
  - `app/(tools)/calculators/data-calculator/DataCalculatorWrapper.tsx`
  - `src/features/data-calculator/store.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="date-calculator"></a>Date Calculator

#### Identity
- **ID:** `date-calculator`
- **Name:** Date Calculator
- **Category:** Calculators
- **Route:** `/calculators/date-calculator`

#### Purpose
> Add or subtract days, weeks, months, or years from a given date, or calculate the exact difference between two dates in multiple units.

#### Features
- Finding the deadline date N days from today
- Calculating how many days until a project delivery
- Determining someone's age in total days
- Computing the number of days between two contract dates

#### Functionality
To find a future or past date: enter the start date, select an operation (add/subtract), and enter the number of days/weeks/months/years. To find the difference between two dates: enter both dates in the 'Date Difference' tab. The result is displayed in days, weeks, months, and years.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `ToolInput`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `utils` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/date-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/date-calculator/DateCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/date-calculator.ts`
- **Registry File:** `src/registry/tools/date-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `ToolInput`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Date result is off by one day, Resolve issues relating to: Adding months gives an unexpected end date
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/date-calculator/page.tsx`
  - `app/(tools)/calculators/date-calculator/DateCalculatorClient.tsx`
  - `app/(tools)/calculators/date-calculator/DateCalculatorClientWrapper.tsx`
  - `app/(tools)/calculators/date-calculator/layout.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="discount-calculator"></a>Discount Calculator

#### Identity
- **ID:** `discount-calculator`
- **Name:** Discount Calculator
- **Category:** Calculators
- **Route:** `/calculators/discount-calculator`

#### Purpose
> Calculate the sale price after applying a percentage discount, the percentage discount from original and sale prices, or the original price from a sale price and discount percentage.

#### Features
- Checking the final price of a product during a sale
- Calculating how much you save with a coupon code
- Finding the original price of a clearance item
- Comparing two sales offers to find the better deal

#### Functionality
Select the calculation mode: 'Final Price', 'Discount %', or 'Original Price'. Enter the known values. The missing value and total savings are displayed immediately.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `SliderField`, `CopyButton`, `ToolInput`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/discount-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/discount-calculator/DiscountCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/discount-calculator.ts`
- **Registry File:** `src/registry/tools/discount-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `SliderField`, `CopyButton`, `ToolInput`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Combined discounts don't add up to the sum of percentages, Resolve issues relating to: Result is the discount amount, not the final price
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/discount-calculator/page.tsx`
  - `app/(tools)/calculators/discount-calculator/DiscountCalculatorClient.tsx`
  - `app/(tools)/calculators/discount-calculator/DiscountCalculatorClientWrapper.tsx`
  - `app/(tools)/calculators/discount-calculator/layout.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="emi-calculator"></a>EMI Calculator

#### Identity
- **ID:** `emi-calculator`
- **Name:** EMI Calculator
- **Category:** Calculators
- **Route:** `/calculators/emi-calculator`

#### Purpose
> 
An **EMI (Equated Monthly Installment)** is the fixed amount you pay every month to repay a loan.

#### Features
- Home Loan EMI Calculator: Plan for your dream house with long-term tenure simulations.
- Personal Loan EMI Calculator: Check affordability for short-term needs or emergencies.
- Car Loan EMI Calculator: Determine the right monthly installment for your next vehicle.
- Education Loan EMI Calculator: Estimate future repayments for student loans.
- Business Loan EMI Calculator: Analyze the impact of capital borrowing on company cash flow.

#### Functionality
**Step 1:** Enter the loan amount you wish to borrow in the principal field. **Step 2:** Input the annual interest rate offered by the lender. **Step 3:** Select the loan tenure in years or months. **Step 4:** View the monthly EMI result, total interest payable, and total repayment amount instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell` |
| **Processing Packages** | `next`, `zustand` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `emi-calculations` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/emi-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/emi-calculator/EmiCalculatorClientWrapper.tsx`
- **Feature Directory:** `src/features/emi-calculator`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `src/features/emi-calculator/store.ts`
- **Content File:** `src/content/tools/emi-calculator.ts`
- **Registry File:** `src/registry/tools/emi-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | Yes |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** Yes
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** `sip-calculator`, `salary-calculator`, `compound-interest`
- **Shared Components Used:** `ToolShell`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Miscalculating the Monthly Interest Rate, Resolve issues relating to: Ignoring Processing Fees
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/emi-calculator/page.tsx`
  - `app/(tools)/calculators/emi-calculator/EmiCalculatorClientWrapper.tsx`
  - `app/(tools)/calculators/emi-calculator/layout.tsx`
  - `src/features/emi-calculator/store.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="financial-freedom-calculator"></a>Financial Freedom Calculator

#### Identity
- **ID:** `financial-freedom-calculator`
- **Name:** Financial Freedom Calculator
- **Category:** Calculators
- **Route:** `/calculators/financial-freedom-calculator`

#### Purpose
> 
The **Financial Freedom Calculator** (often associated with the FIRE movement—Financial Independence, Retire Early) is a comprehensive planning tool designed to help you determine exactly when you can safely stop working for money.

#### Features
- Planning for Early Retirement (FIRE) to determine the exact age you can quit your job.
- Standard Retirement Planning to ensure you have enough corpus at age 60.
- Scenario Analysis to see how a salary increase or lifestyle inflation impacts your financial timeline.
- Visualizing compound interest over long periods using the net worth projection chart.

#### Functionality
**Step 1:** Enter your **Current Age** and your **Target Retirement Age**. **Step 2:** Input your **Current Savings** (invested assets) and your post-tax **Monthly Income** and **Monthly Expenses**. **Step 3:** Set your expectations for the market with **Expected Annual Return**. **Step 4:** Review the results panel to see your **Required Corpus** and the exact **Years to FI**. **Step 5:** Open the Advanced Settings to fine-tune inflation, income growth, and withdrawal rates. **Step 6:** Save different scenarios (e.g., 'Aggressive Savings' vs 'Normal') and compare them side-by-side using the Compare feature.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton`, `ToolResultArea`, `SliderField`, `Accordion`, `ToolInput`, `MetricCard` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion`, `@radix-ui/react-slider`, `zustand` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `financial-freedom-calculator`, `utils` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/financial-freedom-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/financial-freedom-calculator/FinancialFreedomCalculatorClientWrapper.tsx`
- **Feature Directory:** `src/features/financial-freedom-calculator`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `src/features/financial-freedom-calculator/store.ts`
- **Content File:** `src/content/tools/financial-freedom-calculator.ts`
- **Registry File:** `src/registry/tools/financial-freedom-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | Yes |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** Yes
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** `emi-calculator`, `sip-calculator`, `retirement-calculator`, `cagr-calculator`, `safe-to-spend`
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`, `ToolResultArea`, `SliderField`, `Accordion`, `ToolInput`, `MetricCard`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Using Nominal Returns vs Real Returns, Resolve issues relating to: Including Illiquid Assets in Current Savings
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/financial-freedom-calculator/page.tsx`
  - `app/(tools)/calculators/financial-freedom-calculator/FinancialFreedomCalculatorClientWrapper.tsx`
  - `src/features/financial-freedom-calculator/FinancialFreedomCalculatorClient.tsx`
  - `src/features/financial-freedom-calculator/components/ComparisonView.tsx`
  - `src/features/financial-freedom-calculator/components/InputPanel.tsx`
  - `src/features/financial-freedom-calculator/components/ProjectionChart.tsx`
  - `src/features/financial-freedom-calculator/components/ResultsPanel.tsx`
  - `src/features/financial-freedom-calculator/constants.ts`
  - `src/features/financial-freedom-calculator/store.ts`
  - `src/features/financial-freedom-calculator/types.ts`
  - `src/features/financial-freedom-calculator/utils.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="fd-calculator"></a>Fixed Deposit (FD)

#### Identity
- **ID:** `fd-calculator`
- **Name:** Fixed Deposit (FD)
- **Category:** Calculators
- **Route:** `/calculators/fd-calculator`

#### Purpose
> Fixed Deposits (FD) offer guaranteed returns over a set period.

#### Features
- Planning for short-term financial needs
- Comparing FD returns across different banks
- Calculating interest income for tax planning

#### Functionality
Enter the FD principal amount. Enter the annual interest rate. Select the tenure in days, months, or years. Choose the compounding frequency (Quarterly is most common). The tool calculates the maturity amount instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `SliderField`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/fd-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/fd-calculator/FDCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/fd-calculator.ts`
- **Registry File:** `src/registry/tools/fd-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `SliderField`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/fd-calculator/page.tsx`
  - `app/(tools)/calculators/fd-calculator/FDCalculatorClient.tsx`
  - `app/(tools)/calculators/fd-calculator/FDCalculatorClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="gratuity-calculator"></a>Gratuity Calculator

#### Identity
- **ID:** `gratuity-calculator`
- **Name:** Gratuity Calculator
- **Category:** Calculators
- **Route:** `/calculators/gratuity-calculator`

#### Purpose
> Estimate standard gratuity benefits based on salary and tenure.

#### Features
- Support for gratuity calculator
- Support for calculators

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `utils` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/gratuity-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/gratuity-calculator/GratuityCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/gratuity-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/gratuity-calculator/page.tsx`
  - `app/(tools)/calculators/gratuity-calculator/GratuityCalculatorClient.tsx`
  - `app/(tools)/calculators/gratuity-calculator/GratuityCalculatorWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="gst-calculator"></a>GST Calculator

#### Identity
- **ID:** `gst-calculator`
- **Name:** GST Calculator
- **Category:** Calculators
- **Route:** `/calculators/gst-calculator`

#### Purpose
> 
The GST (Goods and Services Tax) Calculator is an essential financial tool for business owners, accountants, and consumers in India.

#### Features
- Support for gst calculator
- Support for calculate gst india
- Support for gst tax calculator
- Support for add gst remove gst
- Support for reverse gst calculator
- Support for cgst sgst igst calculator
- Support for online gst calculator
- Support for gst amount calculator

#### Functionality
Enter Amount: Type the numerical value you want to calculate in the 'Amount' field. Select Slab: Choose the applicable GST rate (5%, 12%, 18%, or 28%) from the dropdown. Choose Type: Select 'Add GST' for exclusive amounts or 'Remove GST' for inclusive amounts. Review Split: Observe the breakdown of Net Amount, CGST, SGST, and the Total Amount. Copy Results: Use the results to populate your invoices or verify your purchase bills.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `CalculatorActionBar`, `ToolInput`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `calculator-utils` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/gst-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/gst-calculator/GSTCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/gst-calculator.ts`
- **Registry File:** `src/registry/tools/gst-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `CalculatorActionBar`, `ToolInput`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/gst-calculator/page.tsx`
  - `app/(tools)/calculators/gst-calculator/GSTCalculatorClient.tsx`
  - `app/(tools)/calculators/gst-calculator/GSTCalculatorClientWrapper.tsx`
  - `app/(tools)/calculators/gst-calculator/layout.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="hra-calculator"></a>Hra Calculator

#### Identity
- **ID:** `hra-calculator`
- **Name:** Hra Calculator
- **Category:** Calculators
- **Route:** `/calculators/hra-calculator`

#### Purpose
> Calculate your House Rent Allowance tax exemptions.

#### Features
- Support for hra calculator
- Support for calculators

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `ShareButton`, `SharedResultBanner`, `QRModal`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `utils`, `useUrlState` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/hra-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/hra-calculator/HraCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/hra-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `ShareButton`, `SharedResultBanner`, `QRModal`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/hra-calculator/page.tsx`
  - `app/(tools)/calculators/hra-calculator/HraCalculatorClient.tsx`
  - `app/(tools)/calculators/hra-calculator/HraCalculatorWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="income-tax"></a>Income Tax

#### Identity
- **ID:** `income-tax`
- **Name:** Income Tax
- **Category:** Calculators
- **Route:** `/calculators/income-tax`

#### Purpose
> Calculate annual income tax estimates and select the best tax regime.

#### Features
- Support for income tax
- Support for calculators

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `ShareButton`, `SharedResultBanner`, `QRModal`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `utils`, `useUrlState` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/income-tax/page.tsx`
- **Client Component:** `app/(tools)/calculators/income-tax/IncomeTaxClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/income-tax.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `ShareButton`, `SharedResultBanner`, `QRModal`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/income-tax/page.tsx`
  - `app/(tools)/calculators/income-tax/IncomeTaxClient.tsx`
  - `app/(tools)/calculators/income-tax/IncomeTaxWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="inflation-calculator"></a>Inflation Calculator

#### Identity
- **ID:** `inflation-calculator`
- **Name:** Inflation Calculator
- **Category:** Calculators
- **Route:** `/calculators/inflation-calculator`

#### Purpose
> Inflation erodes the value of money over time.

#### Features
- Adjusting long-term goals (like a child's college fund) for inflation
- Comparing historical prices to today's values
- Estimating future cost of living

#### Functionality
Enter the amount of money. Enter the average annual inflation rate. Enter the time period in years. Choose between 'Forward' (Future Value) or 'Backward' (Purchasing Power) calculation. The tool displays the adjusted value.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `SliderField`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/inflation-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/inflation-calculator/InflationCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/inflation-calculator.ts`
- **Registry File:** `src/registry/tools/inflation-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `SliderField`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/inflation-calculator/page.tsx`
  - `app/(tools)/calculators/inflation-calculator/InflationCalculatorClient.tsx`
  - `app/(tools)/calculators/inflation-calculator/InflationCalculatorClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="invoice-generator"></a>Invoice Generator

#### Identity
- **ID:** `invoice-generator`
- **Name:** Invoice Generator
- **Category:** Calculators
- **Route:** `/calculators/invoice-generator`

#### Purpose
> Create professional, branded invoices instantly with KaruviLab's Invoice Generator.

#### Features
- Freelancers creating professional billing for international clients
- Small business owners generating quick, tax-compliant invoices
- Agencies looking for a private, no-signup invoice creation workspace
- Consultants needing a simple way to track billable hours and expenses

#### Functionality
Step 1: Choose a visual style (Modern, Professional, or Classic) and upload your company logo. Step 2: Enter your business details (From) and your client's information (Bill To). Step 3: Add line items for services or products, specifying quantity and unit price. Step 4: Set the GST/Tax rate and any applicable discounts. Step 5: Review the totals, add professional terms or notes, and click 'Download PDF' to save your invoice locally.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolInput`, `Toast`, `StatusBadge`, `DropZone`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `hooks`, `useAutoSave`, `types`, `pdf-generator`, `LineItemsSection`, `InvoiceSummarySection` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/invoice-generator/page.tsx`
- **Client Component:** `app/(tools)/calculators/invoice-generator/InvoiceGeneratorClient.tsx`
- **Feature Directory:** `src/features/invoice-generator`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/invoice-generator.ts`
- **Registry File:** `src/registry/tools/invoice-generator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolInput`, `Toast`, `StatusBadge`, `DropZone`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/invoice-generator/page.tsx`
  - `app/(tools)/calculators/invoice-generator/InvoiceGeneratorClient.tsx`
  - `app/(tools)/calculators/invoice-generator/InvoiceGeneratorClientWrapper.tsx`
  - `src/features/invoice-generator/components/InvoiceSummarySection.tsx`
  - `src/features/invoice-generator/components/LineItemsSection.tsx`
  - `src/features/invoice-generator/types/index.ts`
  - `src/features/invoice-generator/utils/pdf-generator.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="lumpsum-calculator"></a>Lumpsum Calculator

#### Identity
- **ID:** `lumpsum-calculator`
- **Name:** Lumpsum Calculator
- **Category:** Calculators
- **Route:** `/calculators/lumpsum-calculator`

#### Purpose
> Calculate the future value of a one-time investment using the power of compounding.

#### Features
- Estimating the maturity of a one-time fixed deposit
- Planning for a goal with a single large investment
- Visualizing the impact of long-term compounding

#### Functionality
Enter the one-time investment amount. Enter the expected annual interest/return rate. Enter the number of years you plan to stay invested. The tool displays the total maturity value and total interest earned.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `SliderField`, `CalculatorActionBar`, `Toast`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `calculator-utils` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/lumpsum-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/lumpsum-calculator/LumpsumCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/lumpsum-calculator.ts`
- **Registry File:** `src/registry/tools/lumpsum-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `SliderField`, `CalculatorActionBar`, `Toast`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/lumpsum-calculator/page.tsx`
  - `app/(tools)/calculators/lumpsum-calculator/LumpsumCalculatorClient.tsx`
  - `app/(tools)/calculators/lumpsum-calculator/LumpsumCalculatorClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="mutual-fund-returns"></a>Mutual Fund Returns

#### Identity
- **ID:** `mutual-fund-returns`
- **Name:** Mutual Fund Returns
- **Category:** Calculators
- **Route:** `/calculators/mutual-fund-returns`

#### Purpose
> Estimate the growth of your mutual fund investments based on past performance or expected returns.

#### Features
- Projecting long-term wealth creation through mutual funds
- Comparing different fund categories (Equity vs Debt) based on assumed returns
- Planning for financial goals like a house or education

#### Functionality
Enter the initial investment amount or monthly SIP. Set the expected annual return rate based on historical data. Select the investment duration in years. The tool will instantly show the estimated future value and total gains.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `SliderField`, `CalculatorActionBar`, `Toast`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `calculator-utils` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/mutual-fund-returns/page.tsx`
- **Client Component:** `app/(tools)/calculators/mutual-fund-returns/MutualFundReturnsClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/mutual-fund-returns.ts`
- **Registry File:** `src/registry/tools/mutual-fund-returns.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `SliderField`, `CalculatorActionBar`, `Toast`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/mutual-fund-returns/page.tsx`
  - `app/(tools)/calculators/mutual-fund-returns/MutualFundReturnsClient.tsx`
  - `app/(tools)/calculators/mutual-fund-returns/MutualFundReturnsClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="nps-calculator"></a>Nps Calculator

#### Identity
- **ID:** `nps-calculator`
- **Name:** Nps Calculator
- **Category:** Calculators
- **Route:** `/calculators/nps-calculator`

#### Purpose
> Calculate National Pension Scheme (NPS) maturity amounts.

#### Features
- Support for nps calculator
- Support for calculators

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `ShareButton`, `SharedResultBanner`, `QRModal`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `utils`, `useUrlState` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/nps-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/nps-calculator/NpsCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/nps-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `ShareButton`, `SharedResultBanner`, `QRModal`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/nps-calculator/page.tsx`
  - `app/(tools)/calculators/nps-calculator/NpsCalculatorClient.tsx`
  - `app/(tools)/calculators/nps-calculator/NpsCalculatorWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="numeral-converter"></a>Numeral & Encoding Converter

#### Identity
- **ID:** `numeral-converter`
- **Name:** Numeral & Encoding Converter
- **Category:** Calculators
- **Route:** `/calculators/numeral-converter`

#### Purpose
> A comprehensive Numeral and Text Converter for Binary, Hexadecimal, Decimal, Octal, ASCII, Base64, URL encoding, HTML entities, and developer escape sequences.

#### Features
- Encoding and decoding developer strings (HTML entities, URL params, Base64, Unicode escapes)
- Converting memory addresses and pointer values across binary/hex formats
- Decoding JSON Web Tokens (JWT) locally to inspect header and payload data safely
- Analyzing text files or inputs down to the raw byte level (UTF-8/UTF-16/UTF-32/CP1252)
- Learning number representations, including custom bases (2-36) and IEEE 754 floating points

#### Functionality
Choose your mode from the tabs: 'Smart Converter' for auto-detection, 'Single Number' for bases/bits/floats, 'Encode/Decode' for format translation, 'Text/Bytes' for multi-byte details, or 'JWT' to decode tokens. In Smart Converter mode, paste any value (hex, binary, base64, URL encoded, HTML entities, Morse, etc.). The tool auto-detects the format and converts it to all other encodings instantly. Use the override dropdown in Smart mode if the auto-detected format needs correction. In Single Number mode, convert numbers across bases 2 to 36, view their two's complement, and interact with the IEEE 754 float visualizer by toggling bits. In JWT mode, paste a JSON Web Token to decode and format the header and payload segments instantly without sending any data to a server.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `Toast`, `ToolSkeleton`, `CopyButton`, `MetricCard` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `conversion-helpers`, `TabNavigation`, `useDebounce`, `InputArea`, `SmartPanel`, `NumberPanel`, `EncodingPanel`, `TextPanel`, `JwtPanel`, `WorkerOrchestrator`, `utils`, `useDragScroll` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/numeral-converter/page.tsx`
- **Client Component:** `app/(tools)/calculators/numeral-converter/NumeralConverterClient.tsx`
- **Feature Directory:** `src/features/numeral-converter`
- **Worker File:** `src/workers/WorkerOrchestrator, src/workers/karuvi.worker.ts`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/numeral-converter.ts`
- **Registry File:** `src/registry/tools/numeral-converter.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | Yes (ComputeWorker) |
| **Concurrency Limit** | 3 |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Worker Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** Yes
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** size > 1
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** Yes
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Worker

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `Toast`, `ToolSkeleton`, `CopyButton`, `MetricCard`
- **Shared Workers Used:** `WorkerOrchestrator`, `karuvi.worker.ts`
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-02 (Worker Concurrency), KL-05 (AbortSignal Propagation), KL-10 (WorkerOrchestrator entry)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/numeral-converter/page.tsx`
  - `app/(tools)/calculators/numeral-converter/NumeralConverterClient.tsx`
  - `app/(tools)/calculators/numeral-converter/NumeralConverterClientWrapper.tsx`
  - `app/(tools)/calculators/numeral-converter/helpers.ts`
  - `app/(tools)/calculators/numeral-converter/layout.tsx`
  - `src/features/numeral-converter/components/EncodingPanel.tsx`
  - `src/features/numeral-converter/components/InputArea.tsx`
  - `src/features/numeral-converter/components/JwtPanel.tsx`
  - `src/features/numeral-converter/components/NumberPanel.tsx`
  - `src/features/numeral-converter/components/SmartPanel.tsx`
  - `src/features/numeral-converter/components/TabNavigation.tsx`
  - `src/features/numeral-converter/components/TextPanel.tsx`
  - `src/features/numeral-converter/hooks/useNumeralConversion.ts`
  - `src/features/numeral-converter/utils/conversion-helpers.ts`
  - `src/features/numeral-converter/utils/morse-map.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="percentage-calculator"></a>Percentage Calculator

#### Identity
- **ID:** `percentage-calculator`
- **Name:** Percentage Calculator
- **Category:** Calculators
- **Route:** `/calculators/percentage-calculator`

#### Purpose
> A versatile percentage calculator covering the most common percentage operations: percentage of a number, percentage change between two values, and finding what percentage one number is of another.

#### Features
- Calculating a percentage discount on a purchase
- Finding the percentage increase in monthly sales
- Computing the percentage of marks scored in an exam
- Splitting a tip as a percentage of a restaurant bill

#### Functionality
Select the type of calculation from the tabs. Enter the required values in the input fields. The result is calculated and displayed instantly. Use the 'Show steps' toggle to see the formula and working.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/percentage-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/percentage-calculator/PercentageCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/percentage-calculator.ts`
- **Registry File:** `src/registry/tools/percentage-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Result is multiplied by 100 when it shouldn't be
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/percentage-calculator/page.tsx`
  - `app/(tools)/calculators/percentage-calculator/PercentageCalculatorClient.tsx`
  - `app/(tools)/calculators/percentage-calculator/PercentageCalculatorClientWrapper.tsx`
  - `app/(tools)/calculators/percentage-calculator/layout.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="ppf-calculator"></a>PPF Calculator

#### Identity
- **ID:** `ppf-calculator`
- **Name:** PPF Calculator
- **Category:** Calculators
- **Route:** `/calculators/ppf-calculator`

#### Purpose
> The Public Provident Fund (PPF) is one of India's most popular long-term tax-saving investments.

#### Features
- Retirement planning with tax-free returns
- Building a low-risk long-term corpus
- Optimizing Section 80C tax deductions

#### Functionality
Enter your annual investment amount (Max ₹1.5 Lakh). The current PPF interest rate is usually pre-filled but can be adjusted. The tenure is fixed at 15 years by default. View the year-by-year balance and total interest earned.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `SliderField`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/ppf-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/ppf-calculator/PPFCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/ppf-calculator.ts`
- **Registry File:** `src/registry/tools/ppf-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `SliderField`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/ppf-calculator/page.tsx`
  - `app/(tools)/calculators/ppf-calculator/PPFCalculatorClient.tsx`
  - `app/(tools)/calculators/ppf-calculator/PPFCalculatorClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="rd-calculator"></a>Recurring Deposit (RD)

#### Identity
- **ID:** `rd-calculator`
- **Name:** Recurring Deposit (RD)
- **Category:** Calculators
- **Route:** `/calculators/rd-calculator`

#### Purpose
> A Recurring Deposit (RD) allows you to save a fixed amount every month and earn interest similar to an FD.

#### Features
- Disciplined monthly savings for a specific goal
- Building a corpus for annual expenses like insurance or school fees
- Low-risk monthly investment strategy

#### Functionality
Enter your monthly deposit amount. Enter the annual interest rate. Enter the deposit tenure in months or years. The tool calculates the total maturity amount and interest earned.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `SliderField`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/rd-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/rd-calculator/RDCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/rd-calculator.ts`
- **Registry File:** `src/registry/tools/rd-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `SliderField`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/rd-calculator/page.tsx`
  - `app/(tools)/calculators/rd-calculator/RDCalculatorClient.tsx`
  - `app/(tools)/calculators/rd-calculator/RDCalculatorClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="retirement-calculator"></a>Retirement Planner

#### Identity
- **ID:** `retirement-calculator`
- **Name:** Retirement Planner
- **Category:** Calculators
- **Route:** `/calculators/retirement-calculator`

#### Purpose
> Planning for retirement requires accounting for current expenses, inflation, and life expectancy.

#### Features
- Early retirement planning (FIRE movement)
- Determining if your current savings are on track
- Visualizing the impact of inflation on future expenses

#### Functionality
Enter your current age and planned retirement age. Enter your current monthly expenses. Set the expected inflation rate (usually 6-7% in India). Enter the expected return on your retirement corpus. The tool calculates the total corpus required and the monthly savings needed to reach it.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `SliderField`, `CopyButton`, `Accordion`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/retirement-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/retirement-calculator/RetirementCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/retirement-calculator.ts`
- **Registry File:** `src/registry/tools/retirement-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `SliderField`, `CopyButton`, `Accordion`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/retirement-calculator/page.tsx`
  - `app/(tools)/calculators/retirement-calculator/RetirementCalculatorClient.tsx`
  - `app/(tools)/calculators/retirement-calculator/RetirementCalculatorClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="safe-to-spend"></a>Safe-to-Spend

#### Identity
- **ID:** `safe-to-spend`
- **Name:** Safe-to-Spend
- **Category:** Calculators
- **Route:** `/calculators/safe-to-spend`

#### Purpose
> Take control of your finances with the Safe-to-Spend budget planner.

#### Features
- Managing monthly discretionary spending
- Planning for a savings goal while maintaining a lifestyle
- Getting a reality check on monthly expenses
- Daily expense tracking for students or professionals

#### Functionality
Enter your monthly after-tax income. List your fixed expenses like rent, bills, and insurance. Set a savings goal as a percentage of your total income. Input your estimated variable expenses (groceries, transport). View your remaining daily and weekly 'safe-to-spend' budget instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `SliderField`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/safe-to-spend/page.tsx`
- **Client Component:** `app/(tools)/calculators/safe-to-spend/SafeToSpendClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/safe-to-spend.ts`
- **Registry File:** `src/registry/tools/safe-to-spend.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `SliderField`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/safe-to-spend/page.tsx`
  - `app/(tools)/calculators/safe-to-spend/SafeToSpendClient.tsx`
  - `app/(tools)/calculators/safe-to-spend/SafeToSpendClientWrapper.tsx`
  - `app/(tools)/calculators/safe-to-spend/layout.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="salary-calculator"></a>Salary Calculator

#### Identity
- **ID:** `salary-calculator`
- **Name:** Salary Calculator
- **Category:** Calculators
- **Route:** `/calculators/salary-calculator`

#### Purpose
> Break down an Indian CTC (Cost to Company) package into its take-home components: basic salary, HRA, PF, professional tax, income tax (new regime), and net monthly in-hand salary.

#### Features
- Understanding your take-home from a job offer
- Comparing two job offers with different CTC structures
- Estimating income tax liability before filing a return
- Explaining salary components to a new employee

#### Functionality
Enter your annual CTC in the input field. Optionally enter your city type (metro/non-metro) for the HRA calculation. Select the tax regime (old or new) if applicable. Click 'Calculate' to see the full salary breakdown. Download or share the breakdown if needed.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/salary-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/salary-calculator/SalaryCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/salary-calculator.ts`
- **Registry File:** `src/registry/tools/salary-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Calculated in-hand is much lower than expected, Resolve issues relating to: Tax deduction seems too high
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/salary-calculator/page.tsx`
  - `app/(tools)/calculators/salary-calculator/SalaryCalculatorClient.tsx`
  - `app/(tools)/calculators/salary-calculator/SalaryCalculatorClientWrapper.tsx`
  - `app/(tools)/calculators/salary-calculator/layout.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="sip-calculator"></a>SIP Calculator

#### Identity
- **ID:** `sip-calculator`
- **Name:** SIP Calculator
- **Category:** Calculators
- **Route:** `/calculators/sip-calculator`

#### Purpose
> 
The SIP (Systematic Investment Plan) Calculator is a powerful wealth-planning tool designed to help you estimate the future value of your mutual fund investments.

#### Features
- Support for sip
- Support for investment
- Support for mutual fund
- Support for returns

#### Functionality
Monthly Investment: Enter the amount you plan to invest every month. Return Rate: Input the expected annual rate of return (e.g., 12 for 12%). Investment Period: Set the number of years you intend to stay invested. Calculate: Click 'Calculate' to see the projected maturity value and total gains. Adjust Goals: Modify the values to see how increasing your SIP or tenure impacts the final corpus.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `SliderField`, `ToolInput`, `CopyButton`, `Accordion`, `Toast`, `CalculatorActionBar`, `ShareButton`, `SharedResultBanner`, `QRModal`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `calculator-utils`, `db` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/sip-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/sip-calculator/SIPCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/sip-calculator.ts`
- **Registry File:** `src/registry/tools/sip-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** `compound-interest`, `emi-calculator`
- **Shared Components Used:** `ToolShell`, `MetricCard`, `SliderField`, `ToolInput`, `CopyButton`, `Accordion`, `Toast`, `CalculatorActionBar`, `ShareButton`, `SharedResultBanner`, `QRModal`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/sip-calculator/page.tsx`
  - `app/(tools)/calculators/sip-calculator/SIPCalculatorClient.tsx`
  - `app/(tools)/calculators/sip-calculator/SIPCalculatorClientWrapper.tsx`
  - `app/(tools)/calculators/sip-calculator/layout.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="smart-converter"></a>Smart Unit Converter

#### Identity
- **ID:** `smart-converter`
- **Name:** Smart Unit Converter
- **Category:** Calculators
- **Route:** `/calculators/smart-converter`

#### Purpose
> A natural-language unit converter that understands requests like '10 km to miles' or '500g in lbs'.

#### Features
- Quickly converting kitchen measurements while cooking
- Converting travel distances between miles and kilometres
- Changing temperatures between Celsius and Fahrenheit
- Converting currency (if supported) or large unit sets

#### Functionality
Type your conversion request in plain English (e.g., '5kg to lbs'). The tool parses your input and displays the result instantly. Use the swap button to reverse the units if needed. Refine your query if the engine doesn't catch it on the first try.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/smart-converter/page.tsx`
- **Client Component:** `app/(tools)/calculators/smart-converter/SmartConverterClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/smart-converter.ts`
- **Registry File:** `src/registry/tools/smart-converter.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/smart-converter/page.tsx`
  - `app/(tools)/calculators/smart-converter/SmartConverterClient.tsx`
  - `app/(tools)/calculators/smart-converter/SmartConverterClientWrapper.tsx`
  - `app/(tools)/calculators/smart-converter/layout.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="stock-average-calculator"></a>Stock Average

#### Identity
- **ID:** `stock-average-calculator`
- **Name:** Stock Average
- **Category:** Calculators
- **Route:** `/calculators/stock-average-calculator`

#### Purpose
> When you buy the same stock at different prices (averaging down or up), it's hard to track your true cost basis.

#### Features
- Managing a stock portfolio with multiple buy orders
- Planning an 'average down' strategy for a falling stock
- Calculating the break-even point for a trade

#### Functionality
Add multiple 'Buy' entries with quantity and price per share. The tool calculates the total shares, total cost, and average price. You can also add a 'Target Average' to see how many more shares you need to buy at a certain price.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `ToolInput`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/stock-average-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/stock-average-calculator/StockAverageCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/stock-average-calculator.ts`
- **Registry File:** `src/registry/tools/stock-average-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `ToolInput`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/stock-average-calculator/page.tsx`
  - `app/(tools)/calculators/stock-average-calculator/StockAverageCalculatorClient.tsx`
  - `app/(tools)/calculators/stock-average-calculator/StockAverageCalculatorClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="swp-calculator"></a>SWP Calculator

#### Identity
- **ID:** `swp-calculator`
- **Name:** SWP Calculator
- **Category:** Calculators
- **Route:** `/calculators/swp-calculator`

#### Purpose
> A Systematic Withdrawal Plan (SWP) is the opposite of an SIP.

#### Features
- Generating a monthly pension from a retirement corpus
- Planning for regular income during a career break
- Managing cash flow from a large lumpsum windfall

#### Functionality
Enter the total initial investment (corpus). Enter the monthly withdrawal amount. Enter the expected annual return rate. Enter the duration for which you want to withdraw. The tool shows the remaining balance and total withdrawals made.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `SliderField`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/swp-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/swp-calculator/SWPCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/swp-calculator.ts`
- **Registry File:** `src/registry/tools/swp-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `SliderField`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/swp-calculator/page.tsx`
  - `app/(tools)/calculators/swp-calculator/SWPCalculatorClient.tsx`
  - `app/(tools)/calculators/swp-calculator/SWPCalculatorClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="tds-calculator"></a>Tds Calculator

#### Identity
- **ID:** `tds-calculator`
- **Name:** Tds Calculator
- **Category:** Calculators
- **Route:** `/calculators/tds-calculator`

#### Purpose
> Calculate Tax Deducted at Source (TDS) percentages.

#### Features
- Support for tds calculator
- Support for calculators

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `utils` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/tds-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/tds-calculator/TdsCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/tds-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/tds-calculator/page.tsx`
  - `app/(tools)/calculators/tds-calculator/TdsCalculatorClient.tsx`
  - `app/(tools)/calculators/tds-calculator/TdsCalculatorWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="time-calculator"></a>Time Calculator

#### Identity
- **ID:** `time-calculator`
- **Name:** Time Calculator
- **Category:** Calculators
- **Route:** `/calculators/time-calculator`

#### Purpose
> Add or subtract time durations with ease.

#### Features
- Calculating total hours worked in a day
- Finding the duration of a video or audio file
- Planning travel times with layovers
- Timing cooking durations with multiple steps

#### Functionality
Select a calculation mode: 'Time Difference' or 'Add/Subtract Time'. Enter the start and end times, or the duration values. The result is calculated instantly in HH:MM:SS format. Toggle between 12-hour and 24-hour formats if needed.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/time-calculator/page.tsx`
- **Client Component:** `app/(tools)/calculators/time-calculator/TimeCalculatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/time-calculator.ts`
- **Registry File:** `src/registry/tools/time-calculator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/time-calculator/page.tsx`
  - `app/(tools)/calculators/time-calculator/TimeCalculatorClient.tsx`
  - `app/(tools)/calculators/time-calculator/TimeCalculatorClientWrapper.tsx`
  - `app/(tools)/calculators/time-calculator/layout.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="unit-converter"></a>Unit Converter

#### Identity
- **ID:** `unit-converter`
- **Name:** Unit Converter
- **Category:** Calculators
- **Route:** `/calculators/unit-converter`

#### Purpose
> Convert units across categories including length, weight, volume, temperature, speed, area, and time.

#### Features
- Converting recipe measurements from US cups to millilitres
- Converting a vehicle speed from mph to km/h
- Checking a running pace in minutes per kilometre vs. per mile
- Converting property area from square feet to square metres

#### Functionality
Select the unit category (e.g., Length, Weight, Temperature). Enter the value to convert in the left input. Select the source unit and the target unit from the dropdowns. The converted value updates instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/unit-converter/page.tsx`
- **Client Component:** `app/(tools)/calculators/unit-converter/UnitConverterClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/unit-converter.ts`
- **Registry File:** `src/registry/tools/unit-converter.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Temperature conversion gives a nonsensical result, Resolve issues relating to: Result has many decimal places
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/unit-converter/page.tsx`
  - `app/(tools)/calculators/unit-converter/UnitConverterClient.tsx`
  - `app/(tools)/calculators/unit-converter/UnitConverterClientWrapper.tsx`
  - `app/(tools)/calculators/unit-converter/layout.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="utc-ist-converter"></a>UTC ↔ IST

#### Identity
- **ID:** `utc-ist-converter`
- **Name:** UTC ↔ IST
- **Category:** Calculators
- **Route:** `/calculators/utc-ist-converter`

#### Purpose
> Quickly convert between Coordinated Universal Time (UTC) and Indian Standard Time (IST).

#### Features
- Decoding server log timestamps into local Indian time
- Scheduling meetings between Indian and international teams
- Calculating trade settlement times for global markets
- Converting GitHub commit times to local time

#### Functionality
Enter a time in the UTC field to see the equivalent IST time. Alternatively, enter an IST time to convert it back to UTC. Use the 'Current Time' button to instantly convert the present moment. The 5-hour 30-minute offset is automatically applied.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/utc-ist-converter/page.tsx`
- **Client Component:** `app/(tools)/calculators/utc-ist-converter/UtcIstConverterClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/utc-ist-converter.ts`
- **Registry File:** `src/registry/tools/utc-ist-converter.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/utc-ist-converter/page.tsx`
  - `app/(tools)/calculators/utc-ist-converter/UtcIstConverterClient.tsx`
  - `app/(tools)/calculators/utc-ist-converter/UtcIstConverterClientWrapper.tsx`
  - `app/(tools)/calculators/utc-ist-converter/layout.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="work-hours"></a>Work Hours

#### Identity
- **ID:** `work-hours`
- **Name:** Work Hours
- **Category:** Calculators
- **Route:** `/calculators/work-hours`

#### Purpose
> Track your daily work hours, including breaks and overtime, with this simple timesheet utility.

#### Features
- Filling out weekly timesheets for work
- Calculating pay for freelance or hourly gigs
- Tracking study or project hours
- Verifying payroll accuracy

#### Functionality
Enter your work start time and end time. Specify any break duration in minutes (e.g., 30 for lunch). Enter your hourly rate if you wish to see estimated earnings. The tool calculates total work hours, decimal hours, and total pay.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `CopyButton`, `Toast`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion`, `zustand` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/work-hours/page.tsx`
- **Client Component:** `app/(tools)/calculators/work-hours/WorkHoursClient.tsx`
- **Feature Directory:** `src/features/work-hours`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `src/features/work-hours/store.ts`
- **Content File:** `src/content/tools/work-hours.ts`
- **Registry File:** `src/registry/tools/work-hours.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | Yes |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** Yes
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `MetricCard`, `CopyButton`, `Toast`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/work-hours/page.tsx`
  - `app/(tools)/calculators/work-hours/WorkHoursClient.tsx`
  - `app/(tools)/calculators/work-hours/WorkHoursClientWrapper.tsx`
  - `app/(tools)/calculators/work-hours/layout.tsx`
  - `src/features/work-hours/store.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="world-clock"></a>World Clock

#### Identity
- **ID:** `world-clock`
- **Name:** World Clock
- **Category:** Calculators
- **Route:** `/calculators/world-clock`

#### Purpose
> Track current time across multiple global cities simultaneously with our responsive World Clock.

#### Features
- Coordinating calls with offshore development teams
- Tracking opening hours of global stock exchanges
- Staying connected with family living in different time zones
- Planning international travel itineraries

#### Functionality
Search for a city or country in the search bar. Click 'Add' to include the location in your dashboard. View the current time, date, and time zone for all saved cities. Remove cities by clicking the 'X' or 'Remove' button. Toggle between digital and analog views (if available).

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `Toast`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, `lucide-react`, `@radix-ui/react-popover`, `@dnd-kit/core`, `zustand` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `utils`, `FullscreenContext` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/calculators/world-clock/page.tsx`
- **Client Component:** `app/(tools)/calculators/world-clock/WorldClockClient.tsx`
- **Feature Directory:** `src/features/world-clock`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `src/features/world-clock/store.ts`
- **Content File:** `src/content/tools/world-clock.ts`
- **Registry File:** `src/registry/tools/world-clock.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | Yes |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** Yes
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `Toast`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** `useSupportStore`
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/calculators/world-clock/page.tsx`
  - `app/(tools)/calculators/world-clock/ClockCard.tsx`
  - `app/(tools)/calculators/world-clock/WorldClockClient.tsx`
  - `app/(tools)/calculators/world-clock/WorldClockClientWrapper.tsx`
  - `app/(tools)/calculators/world-clock/layout.tsx`
  - `app/(tools)/calculators/world-clock/utils.ts`
  - `src/features/world-clock/store.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---


## Category: Daily Utilities

### <a id="barcode-scanner"></a>Barcode & QR Scanner

#### Identity
- **ID:** `barcode-scanner`
- **Name:** Barcode & QR Scanner
- **Category:** Daily Utilities
- **Route:** `/utilities/barcode-scanner`

#### Purpose
> The Barcode Scanner tool is a highly secure, high-performance utility designed to decode barcodes directly within your browser.

#### Features
- Warehouse workers scanning inventory items in areas with poor or no Wi-Fi connectivity.
- Retail employees quickly verifying product codes without needing dedicated hardware.
- Event organizers validating attendee tickets or badges using QR codes directly from a laptop or mobile device.
- Consumers scanning promotional codes securely without exposing their data to tracking servers.

#### Functionality
Click the 'Start Camera' button to allow the tool access to your device's webcam, or choose to upload an image file containing a barcode. If using the camera, align the barcode within the designated scanning area on your screen. Wait a brief moment for the local engine to detect and decode the barcode data. Review the extracted information displayed in the results section below the scanner. Use the 'Copy' or 'Export' buttons to save the decoded data to your clipboard or local storage.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `DropZone`, `ToolResultArea`, `Toast`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `hooks` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/utilities/barcode-scanner/page.tsx`
- **Client Component:** `app/(tools)/utilities/barcode-scanner/BarcodeScannerClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/barcode-scanner.ts`
- **Registry File:** `src/registry/tools/barcode-scanner.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** Camera, Microphone

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `DropZone`, `ToolResultArea`, `Toast`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Barcode Not Detected, Resolve issues relating to: Camera Access Denied
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/utilities/barcode-scanner/page.tsx`
  - `app/(tools)/utilities/barcode-scanner/BarcodeScannerClient.tsx`
  - `app/(tools)/utilities/barcode-scanner/BarcodeScannerClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="validate"></a>File Validator

#### Identity
- **ID:** `validate`
- **Name:** File Validator
- **Category:** Daily Utilities
- **Route:** `/utilities/validate`

#### Purpose
> Validate files against specific requirements before uploading them to government portals or applications.

#### Features
- Checking passport photos for portal upload compatibility
- Ensuring tax documents are under the 2MB size limit
- Validating signatures for online application forms
- Verifying file extensions match the actual file content

#### Functionality
Select a validation profile (e.g., 'Passport Seva', 'PAN Card', or 'Custom'). Upload the file you want to validate. Review the pass/fail indicators for size, type, and dimensions. Follow the provided instructions to fix any failed requirements.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `hooks` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/utilities/validate/page.tsx`
- **Client Component:** `app/(tools)/utilities/validate/FileValidatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/validate.ts`
- **Registry File:** `src/registry/tools/validate.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | E-001 |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** size > 100
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/utilities/validate/page.tsx`
  - `app/(tools)/utilities/validate/FileValidatorClient.tsx`
  - `app/(tools)/utilities/validate/FileValidatorClientWrapper.tsx`
  - `app/(tools)/utilities/validate/layout.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="grammar-checker"></a>Grammar & Spell Checker

#### Identity
- **ID:** `grammar-checker`
- **Name:** Grammar & Spell Checker
- **Category:** Daily Utilities
- **Route:** `/text/grammar-checker`

#### Purpose
> Check your text for common grammar, spelling, and punctuation issues using a client-side rule engine.

#### Features
- Quick proofreading of an email before sending
- Catching common typos in a blog post draft
- Checking subject-verb agreement in a short paragraph
- Spotting double words or missing articles

#### Functionality
Paste or type your text into the editor. Click 'Check Grammar' to run the analysis. Highlighted errors appear with suggested corrections in a tooltip. Click a suggestion to apply the correction automatically. Review all changes before copying the final text.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `MetricCard`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-placeholder`, `@tiptap/pm`, `zustand`, `nspell`, `compromise`, `syllable` |
| **Shared Internal Modules** | `GrammarCheckerClientWrapper`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/text/grammar-checker/page.tsx`
- **Client Component:** `Not Present in Repository`
- **Feature Directory:** `src/features/grammar-checker`
- **Worker File:** `src/workers/manager`
- **Zustand Store:** `src/features/grammar-checker/store.ts`
- **Content File:** `src/content/tools/grammar-checker.ts`
- **Registry File:** `src/registry/tools/grammar-checker.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | Yes (ComputeWorker) |
| **Concurrency Limit** | 3 |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Worker Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Heavy
- **CPU Intensive:** Yes
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Large
- **Worker-Based:** Yes
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Worker

#### Relations & Enhancements
- **Related Tools:** `markdown`
- **Shared Components Used:** `ToolShell`, `MetricCard`, `ToolSkeleton`
- **Shared Workers Used:** `manager`
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Tool flags correctly spelled words as errors, Resolve issues relating to: No errors found but the text reads awkwardly
- **Manifest Safety Rules Enforced:** KL-02 (Worker Concurrency), KL-05 (AbortSignal Propagation), KL-10 (WorkerOrchestrator entry)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/text/grammar-checker/page.tsx`
  - `src/features/grammar-checker/GrammarCheckerClient.tsx`
  - `src/features/grammar-checker/GrammarCheckerClientWrapper.tsx`
  - `src/features/grammar-checker/store.ts`
  - `src/features/grammar-checker/utils/engine.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="markdown"></a>Markdown Editor

#### Identity
- **ID:** `markdown`
- **Name:** Markdown Editor
- **Category:** Daily Utilities
- **Route:** `/utilities/markdown`

#### Purpose
> 
The KaruviLab Markdown Editor is a professional, browser-native writing environment designed for developers, technical writers, and content creators.

#### Features
- Writing and previewing README files for GitHub projects.
- Drafting technical blog posts or newsletters.
- Creating well-formatted project documentation offline.
- Learning and practicing Markdown syntax in a live, interactive environment.

#### Functionality
Start Typing: Enter your text in the left editor pane using standard Markdown syntax (e.g., `# Heading`, `**Bold**`). Preview: The right pane renders your content into clean HTML in real-time. Use Shortcuts: Utilize the built-in toolbar buttons to quickly insert bold, italic, list, or code formatting tags. Export: Once your document is ready, click 'Copy HTML' to use the code, or download your work as a `.md` file.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `EngineLoader`, `ToolSkeleton`, `SegmentedControl`, `DropZone`, `Toast`, `CopyButton` |
| **Processing Packages** | `next`, `react`, `marked`, `lucide-react`, `framer-motion`, `isomorphic-dompurify` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `MarkdownEditorWrapper`, `EngineLoader`, `security`, `logger`, `utils`, `FullscreenContext`, `FocusModeControlsContext`, `blob-manager`, `blobManager` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/utilities/markdown/page.tsx`
- **Client Component:** `Not Present in Repository`
- **Feature Directory:** `src/features/markdown`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/markdown.ts`
- **Registry File:** `src/registry/tools/markdown.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | Yes |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (DOMPurify)
- **Sanitization:** Yes (DOMPurify)
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** `html-viewer`, `code-minifier`, `text-utility`, `word-counter`
- **Shared Components Used:** `ToolShell`, `EngineLoader`, `ToolSkeleton`, `SegmentedControl`, `DropZone`, `Toast`, `CopyButton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Tables look disorganized, Resolve issues relating to: Code blocks look strange
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/utilities/markdown/page.tsx`
  - `app/(tools)/utilities/markdown/layout.tsx`
  - `src/features/markdown/MarkdownEditorWrapper.client.tsx`
  - `src/features/markdown/MarkdownEditorWrapper.tsx`
  - `src/features/markdown/MarkdownService.ts`
  - `src/features/markdown/components/FindBar.tsx`
  - `src/features/markdown/components/MarkdownEditor.tsx`
  - `src/features/markdown/components/MarkdownPreview.tsx`
  - `src/features/markdown/components/StatBar.tsx`
  - `src/features/markdown/components/Toolbar.tsx`
  - `src/features/markdown/constants.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="mic-camera-tester"></a>Mic & Camera Tester

#### Identity
- **ID:** `mic-camera-tester`
- **Name:** Mic & Camera Tester
- **Category:** Daily Utilities
- **Route:** `/utilities/mic-camera-tester`

#### Purpose
> The Mic & Camera Tester tool is a secure, browser-native utility designed to help you with your daily tasks.

#### Features
- Support for mic test
- Support for camera test
- Support for webcam
- Support for microphone
- Support for online meeting

#### Functionality
Upload or enter the required data for Mic & Camera Tester. Configure any available settings or options. Click the action button to process your request. Download or copy the results directly to your device.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/utilities/mic-camera-tester/page.tsx`
- **Client Component:** `app/(tools)/utilities/mic-camera-tester/MicCameraTesterClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/mic-camera-tester.ts`
- **Registry File:** `src/registry/tools/mic-camera-tester.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** Camera, Microphone

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/utilities/mic-camera-tester/page.tsx`
  - `app/(tools)/utilities/mic-camera-tester/MicCameraTesterClient.tsx`
  - `app/(tools)/utilities/mic-camera-tester/MicCameraTesterClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="qrcode"></a>QR Code Generator

#### Identity
- **ID:** `qrcode`
- **Name:** QR Code Generator
- **Category:** Daily Utilities
- **Route:** `/utilities/qrcode`

#### Purpose
> 
The KaruviLab QR Code Generator is a versatile, browser-native tool that lets you create high-quality QR codes for a wide variety of use cases.

#### Features
- Instant guest Wi-Fi access in cafes, hotels, or offices.
- Connecting printed marketing materials to digital landing pages.
- Encoding vCard contact information for business card distribution.
- Quick, contactless payment links for merchants and market stalls.

#### Functionality
Enter Data: Choose the content type (URL, Text, or Wi-Fi) and enter the information you want to encode. Customize: Use the settings panel to change the color, size, and error correction level. Preview: The QR code updates in real-time as you make adjustments. Download: Select 'Download PNG' for digital use or 'Download SVG' if you need an infinitely scalable format for professional printing.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `SliderField`, `QRCodeLoader`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `hooks` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/utilities/qrcode/page.tsx`
- **Client Component:** `app/(tools)/utilities/qrcode/QRCodeGeneratorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/qrcode.ts`
- **Registry File:** `src/registry/tools/qrcode.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `SliderField`, `QRCodeLoader`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: The QR code doesn't scan, Resolve issues relating to: URL link is incorrect
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/utilities/qrcode/page.tsx`
  - `app/(tools)/utilities/qrcode/QRCodeGeneratorClient.tsx`
  - `app/(tools)/utilities/qrcode/QRCodeGeneratorClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="internet-speed-test"></a>Speed Tester

#### Identity
- **ID:** `internet-speed-test`
- **Name:** Speed Tester
- **Category:** Daily Utilities
- **Route:** `/utilities/internet-speed-test`

#### Purpose
> Measure your internet connection speed — including download, upload, and ping latency — using a private, browser-side tester.

#### Features
- Verifying your ISP's promised connection speed
- Troubleshooting slow video calls or streaming issues
- Testing VPN performance before and after connection
- Checking Wi-Fi dead zones in your home or office

#### Functionality
Click the 'Start Test' button to begin the measurement process. The tool will first measure your Ping (latency) and Jitter. Next, it will perform multiple download segments to calculate your Mbps. Finally, it will test your upload speed by sending a small amount of data. Once finished, your results will be displayed prominently.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `StatusBadge`, `PrivacyBadge`, `Toast`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `utils` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/utilities/internet-speed-test/page.tsx`
- **Client Component:** `app/(tools)/utilities/internet-speed-test/InternetSpeedTestClient.tsx`
- **Feature Directory:** `src/features/internet-speed-test`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/internet-speed-test.ts`
- **Registry File:** `src/registry/tools/internet-speed-test.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | No |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** 2 * 1024 * 1024
- **Network Access Required:** Yes
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** No
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `StatusBadge`, `PrivacyBadge`, `Toast`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/utilities/internet-speed-test/page.tsx`
  - `app/(tools)/utilities/internet-speed-test/InternetSpeedTestClient.tsx`
  - `app/(tools)/utilities/internet-speed-test/InternetSpeedTestClientWrapper.tsx`
  - `app/(tools)/utilities/internet-speed-test/SpeedGauge.tsx`
  - `app/(tools)/utilities/internet-speed-test/layout.tsx`
  - `app/(tools)/utilities/internet-speed-test/useSpeedTest.ts`
  - `src/features/internet-speed-test/components/IntelligenceCard.tsx`
  - `src/features/internet-speed-test/components/MetricSmall.tsx`
  - `src/features/internet-speed-test/components/PulseRing.tsx`
  - `src/features/internet-speed-test/types/index.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="split-copy"></a>Split & Copy

#### Identity
- **ID:** `split-copy`
- **Name:** Split & Copy
- **Category:** Daily Utilities
- **Route:** `/utilities/split-copy`

#### Purpose
> Split a long block of text into equal-sized chunks of N characters, useful for pasting into character-limited inputs like SMS, Twitter (legacy), or form fields.

#### Features
- Splitting a long message to send over SMS
- Breaking a prompt into chunks for a character-limited API
- Dividing a large text for manual entry into multiple fields
- Preparing paginated content for a multi-step form

#### Functionality
Paste your long text into the input field. Set the chunk size (number of characters per chunk). The text is split and each chunk is displayed with its index. Copy individual chunks using each chunk's copy button.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/utilities/split-copy/page.tsx`
- **Client Component:** `app/(tools)/utilities/split-copy/SplitCopyClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/split-copy.ts`
- **Registry File:** `src/registry/tools/split-copy.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Last chunk is empty, Resolve issues relating to: Emoji characters cause misaligned chunks
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/utilities/split-copy/page.tsx`
  - `app/(tools)/utilities/split-copy/SplitCopyClient.tsx`
  - `app/(tools)/utilities/split-copy/SplitCopyClientWrapper.tsx`
  - `app/(tools)/utilities/split-copy/layout.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="task-reminder"></a>Task Reminder

#### Identity
- **ID:** `task-reminder`
- **Name:** Task Reminder
- **Category:** Daily Utilities
- **Route:** `/utilities/task-reminder`

#### Purpose
> A lightweight to-do list manager that stores tasks in your browser's `localStorage` so they persist across page reloads — no account or server required.

#### Features
- Keeping a quick to-do list while working in the browser
- Tracking tasks for a single project session
- Making a shopping list accessible on your desktop
- Reminding yourself of steps in a workflow

#### Functionality
Type a task description in the input field and press Enter or click 'Add'. Optionally set a due date for the task. Click the checkbox next to a task to mark it as complete. Click the trash icon to delete a task. Tasks are automatically saved to localStorage and reload with the page.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolInput`, `Toast`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `notifications` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/utilities/task-reminder/page.tsx`
- **Client Component:** `app/(tools)/utilities/task-reminder/TaskReminderClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/task-reminder.ts`
- **Registry File:** `src/registry/tools/task-reminder.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** Notifications

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolInput`, `Toast`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Tasks disappear after closing the browser, Resolve issues relating to: Tasks don't save in Safari
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/utilities/task-reminder/page.tsx`
  - `app/(tools)/utilities/task-reminder/TaskReminderClient.tsx`
  - `app/(tools)/utilities/task-reminder/TaskReminderClientWrapper.tsx`
  - `app/(tools)/utilities/task-reminder/layout.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="text-utility"></a>Text Utility

#### Identity
- **ID:** `text-utility`
- **Name:** Text Utility
- **Category:** Daily Utilities
- **Route:** `/utilities/text-utility`

#### Purpose
> A Swiss-army-knife text manipulation tool covering case conversion (upper, lower, title, camel, snake, kebab), word and character counts, whitespace cleanup, line sorting, and duplicate removal.

#### Features
- Converting a list of names to title case for a report
- Counting words in an essay or article
- Removing blank lines from a pasted CSV
- Converting a camelCase variable name to snake_case

#### Functionality
Paste your text into the input area. Choose a transformation from the toolbar (e.g., 'Title Case', 'Remove Extra Spaces'). The transformed text appears in the output area immediately. Chain multiple transformations by applying them one after another. Copy the final result using the copy button.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/utilities/text-utility/page.tsx`
- **Client Component:** `app/(tools)/utilities/text-utility/TextUtilityClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/text-utility.ts`
- **Registry File:** `src/registry/tools/text-utility.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Title case capitalizes articles and prepositions, Resolve issues relating to: Line count differs from word processor
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/utilities/text-utility/page.tsx`
  - `app/(tools)/utilities/text-utility/TextUtilityClient.tsx`
  - `app/(tools)/utilities/text-utility/TextUtilityClientWrapper.tsx`
  - `app/(tools)/utilities/text-utility/layout.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="url-cleaner"></a>URL Cleaner

#### Identity
- **ID:** `url-cleaner`
- **Name:** URL Cleaner
- **Category:** Daily Utilities
- **Route:** `/utilities/url-cleaner`

#### Purpose
> Strip UTM parameters, ad tracking tokens, and other query string clutter from URLs to produce a clean, shareable link.

#### Features
- Cleaning a URL before sharing it in a chat or email
- Removing tracking tokens from URLs before bookmarking
- Generating canonical URLs for content without analytics noise
- Simplifying affiliate links before sharing publicly

#### Functionality
Paste the full URL (including query parameters) into the input field. The cleaned URL with all tracking parameters removed appears instantly. Review the list of removed parameters shown below. Copy the clean URL.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/utilities/url-cleaner/page.tsx`
- **Client Component:** `app/(tools)/utilities/url-cleaner/URLCleanerClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/url-cleaner.ts`
- **Registry File:** `src/registry/tools/url-cleaner.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Cleaned URL breaks the page, Resolve issues relating to: URL still contains tracking parameters after cleaning
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/utilities/url-cleaner/page.tsx`
  - `app/(tools)/utilities/url-cleaner/URLCleanerClient.tsx`
  - `app/(tools)/utilities/url-cleaner/URLCleanerClientWrapper.tsx`
  - `app/(tools)/utilities/url-cleaner/layout.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---


## Category: Developer Tools

### <a id="banking-tools"></a>Banking Tools

#### Identity
- **ID:** `banking-tools`
- **Name:** Banking Tools
- **Category:** Developer Tools
- **Route:** `/developer-tools/banking-tools`

#### Purpose
> Advanced financial data parsers for EMV, SWIFT, and core banking logs

#### Features
- Support for banking tools
- Support for iso 8583
- Support for emv tlv
- Support for swift parser
- Support for track 2
- Support for developer

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton`, `ToolInput`, `ToolResultArea` |
| **Processing Packages** | `next`, `react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `parser` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/developer-tools/banking-tools/page.tsx`
- **Client Component:** `app/(tools)/developer-tools/banking-tools/BankingToolsClientWrapper.tsx`
- **Feature Directory:** `src/features/banking-tools`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/banking-tools.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`, `ToolInput`, `ToolResultArea`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/developer-tools/banking-tools/page.tsx`
  - `app/(tools)/developer-tools/banking-tools/BankingToolsClientWrapper.tsx`
  - `src/features/banking-tools/BankingToolsClient.tsx`
  - `src/features/banking-tools/components/CoreBankingParserClient.tsx`
  - `src/features/banking-tools/components/EmvTlvTreeClient.tsx`
  - `src/features/banking-tools/components/SwiftMtMxClient.tsx`
  - `src/features/banking-tools/components/Track2ParserClient.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="base64"></a>Base64 Encode/Decode

#### Identity
- **ID:** `base64`
- **Name:** Base64 Encode/Decode
- **Category:** Developer Tools
- **Route:** `/developer-tools/base64`

#### Purpose
> Encode plain text or binary data to Base64 and decode Base64 strings back to readable text, all inside your browser.

#### Features
- Encoding a JSON payload for a JWT token
- Embedding a small image as a Base64 data URI in CSS
- Decoding a Base64-encoded API response for inspection
- Passing binary data through a text-only protocol

#### Functionality
Select 'Encode' or 'Decode' mode using the toggle. Paste your input text into the left panel. The result appears instantly in the right panel. Toggle 'URL-safe' if you need the `-_` variant instead of `+/`. Click 'Copy' to copy the result to your clipboard.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolInput`, `ToolResultArea`, `DropZone`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `utils`, `hooks`, `types`, `logger` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/developer-tools/base64/page.tsx`
- **Client Component:** `app/(tools)/developer-tools/base64/Base64Client.tsx`
- **Feature Directory:** `src/features/base64`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/base64.ts`
- **Registry File:** `src/registry/tools/base64.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** `url-encoder`, `hash-generator`, `jwt-decoder`
- **Shared Components Used:** `ToolShell`, `ToolInput`, `ToolResultArea`, `DropZone`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: 'Invalid Base64' error when decoding, Resolve issues relating to: Output has unexpected line breaks, Resolve issues relating to: URL-safe decode fails on standard Base64
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/developer-tools/base64/page.tsx`
  - `app/(tools)/developer-tools/base64/Base64Client.tsx`
  - `app/(tools)/developer-tools/base64/Base64ClientWrapper.tsx`
  - `src/features/base64/processor.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="box-shadow-generator"></a>Box Shadow Generator

#### Identity
- **ID:** `box-shadow-generator`
- **Name:** Box Shadow Generator
- **Category:** Developer Tools
- **Route:** `/developer-tools/box-shadow-generator`

#### Purpose
> Design CSS box shadows visually and copy clean CSS snippets for layouts.

#### Features
- Support for box shadow generator
- Support for developer

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `utils`, `constants` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/developer-tools/box-shadow-generator/page.tsx`
- **Client Component:** `app/(tools)/developer-tools/box-shadow-generator/BoxShadowGeneratorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/box-shadow-generator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/developer-tools/box-shadow-generator/page.tsx`
  - `app/(tools)/developer-tools/box-shadow-generator/BoxShadowGeneratorClient.tsx`
  - `app/(tools)/developer-tools/box-shadow-generator/BoxShadowGeneratorWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="format"></a>Code Formatter

#### Identity
- **ID:** `format`
- **Name:** Code Formatter
- **Category:** Developer Tools
- **Route:** `/developer-tools/format`

#### Purpose
> A multi-language code formatter supporting JSON, HTML, CSS, SQL, and Markdown.

#### Features
- Cleaning up HTML copied from a CMS or email builder
- Formatting a long SQL query for readability
- Standardising CSS before a code review
- Rendering a Markdown document to check its preview

#### Functionality
Select the language from the format tabs (JSON, HTML, CSS, SQL, Markdown). Paste your unformatted code into the editor. Click 'Format' or wait for the auto-format trigger. Copy the formatted output or switch tabs to format another language.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton`, `CopyButton` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `FocusModeControlsContext`, `formatter-utils` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/developer-tools/format/page.tsx`
- **Client Component:** `app/(tools)/developer-tools/format/CodeFormatterClientWrapper.tsx`
- **Feature Directory:** `src/features/format`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/format.ts`
- **Registry File:** `src/registry/tools/format.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`, `CopyButton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Formatter does nothing to the input, Resolve issues relating to: SQL formatter reorders clauses unexpectedly
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/developer-tools/format/page.tsx`
  - `app/(tools)/developer-tools/format/CodeFormatterClientWrapper.tsx`
  - `app/(tools)/developer-tools/format/layout.tsx`
  - `src/features/format/components/CodeFormatterClient.tsx`
  - `src/features/format/index.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="code-minifier"></a>Code Minifier

#### Identity
- **ID:** `code-minifier`
- **Name:** Code Minifier
- **Category:** Developer Tools
- **Route:** `/developer-tools/code-minifier`

#### Purpose
> Minify CSS, JavaScript, and HTML to reduce file sizes for faster web page loading.

#### Features
- Reducing CSS bundle size before deploying a website
- Preparing a single-file HTML page for distribution
- Minimizing inline JavaScript in an email template
- Learning how build tools like webpack transform code

#### Functionality
Select the language tab: CSS, JavaScript, or HTML. Paste your source code into the input editor. Click 'Minify' to generate the compressed output. View the size reduction percentage shown below the output. Copy or download the minified code.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton`, `BatchQueue`, `DropZone`, `SegmentedControl`, `ToolInput`, `CopyButton`, `StatusBadge`, `PrivacyBadge` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `zip`, `hooks`, `FocusModeControlsContext` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/developer-tools/code-minifier/page.tsx`
- **Client Component:** `app/(tools)/developer-tools/code-minifier/CodeMinifierClientWrapper.tsx`
- **Feature Directory:** `src/features/code-minifier`
- **Worker File:** `src/workers/manager`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/code-minifier.ts`
- **Registry File:** `src/registry/tools/code-minifier.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | Yes (ComputeWorker) |
| **Concurrency Limit** | 3 |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Worker Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** Yes
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** Yes
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Worker

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`, `BatchQueue`, `DropZone`, `SegmentedControl`, `ToolInput`, `CopyButton`, `StatusBadge`, `PrivacyBadge`
- **Shared Workers Used:** `manager`
- **Shared Stores Used:** `useBatchStore`, `useRecoveryStore`
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Minified JavaScript throws a syntax error, Resolve issues relating to: CSS variables or custom properties are removed, Resolve issues relating to: HTML minifier removes whitespace inside `<pre>` tags
- **Manifest Safety Rules Enforced:** KL-02 (Worker Concurrency), KL-05 (AbortSignal Propagation), KL-10 (WorkerOrchestrator entry)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/developer-tools/code-minifier/page.tsx`
  - `app/(tools)/developer-tools/code-minifier/CodeMinifierClientWrapper.tsx`
  - `app/(tools)/developer-tools/code-minifier/layout.tsx`
  - `src/features/code-minifier/components/CodeMinifierClient.tsx`
  - `src/features/code-minifier/index.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="color-converter"></a>Color Converter

#### Identity
- **ID:** `color-converter`
- **Name:** Color Converter
- **Category:** Developer Tools
- **Route:** `/developer-tools/color-converter`

#### Purpose
> Color Converter & Picker helps you translate colors between different color spaces including HEX, RGB, HSL, HSV, and CMYK.

#### Features
- Support for color converter
- Support for developer

#### Functionality
Select a color using the built-in color picker. Or, type a color value into any of the input fields (e.g., #4F46E5). The other fields will automatically update with the converted values. Copy any format you need by clicking the copy icon next to the field.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ShareButton`, `SharedResultBanner`, `QRModal`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `framer-motion`, `lucide-react` |
| **Shared Internal Modules** | `seo`, `tool-registry`, `utils`, `useUrlState`, `constants` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/developer-tools/color-converter/page.tsx`
- **Client Component:** `app/(tools)/developer-tools/color-converter/ColorConverterClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/color-converter.ts`
- **Registry File:** `src/registry/tools/color-converter.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ShareButton`, `SharedResultBanner`, `QRModal`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** `useColorStore`
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/developer-tools/color-converter/page.tsx`
  - `app/(tools)/developer-tools/color-converter/ColorConverterClient.tsx`
  - `app/(tools)/developer-tools/color-converter/ColorConverterClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="command-cheat-sheet"></a>Command Cheat Sheet

#### Identity
- **ID:** `command-cheat-sheet`
- **Name:** Command Cheat Sheet
- **Category:** Developer Tools
- **Route:** `/developer-tools/command-cheat-sheet`

#### Purpose
> Standardized content for Command Cheat Sheet.

#### Features
- Lookup Git commands

#### Functionality
Step 1 Step 2 Step 3 Step 4

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton`, `LiveFilterBar`, `CopyButton` |
| **Processing Packages** | `next`, `react`, `framer-motion`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `useDragScroll` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/developer-tools/command-cheat-sheet/page.tsx`
- **Client Component:** `app/(tools)/developer-tools/command-cheat-sheet/ClientWrapper.tsx`
- **Feature Directory:** `src/features/command-cheat-sheet`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/command-cheat-sheet.ts`
- **Registry File:** `src/registry/tools/command-cheat-sheet.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`, `LiveFilterBar`, `CopyButton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/developer-tools/command-cheat-sheet/page.tsx`
  - `app/(tools)/developer-tools/command-cheat-sheet/ClientWrapper.tsx`
  - `src/features/command-cheat-sheet/index.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="contrast-checker"></a>Contrast Checker

#### Identity
- **ID:** `contrast-checker`
- **Name:** Contrast Checker
- **Category:** Developer Tools
- **Route:** `/developer-tools/contrast-checker`

#### Purpose
> Verify background and foreground contrast to meet WCAG accessibility standards.

#### Features
- Support for contrast checker
- Support for developer

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `utils` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/developer-tools/contrast-checker/page.tsx`
- **Client Component:** `app/(tools)/developer-tools/contrast-checker/ContrastCheckerClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/contrast-checker.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/developer-tools/contrast-checker/page.tsx`
  - `app/(tools)/developer-tools/contrast-checker/ContrastCheckerClient.tsx`
  - `app/(tools)/developer-tools/contrast-checker/ContrastCheckerWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="core-banking-parser"></a>Core Banking Parser

#### Identity
- **ID:** `core-banking-parser`
- **Name:** Core Banking Parser
- **Category:** Developer Tools
- **Route:** `/banking-tools/core-banking-parser`

#### Purpose
> Parse core banking trace logs into JSON

#### Features
- Support for finacle tools
- Support for banking

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolInput`, `ToolResultArea`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `core-banking-parser`, `seo`, `parser` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/banking-tools/core-banking-parser/page.tsx`
- **Client Component:** `app/(tools)/banking-tools/core-banking-parser/ToolClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/core-banking-parser.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolInput`, `ToolResultArea`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/banking-tools/core-banking-parser/page.tsx`
  - `app/(tools)/banking-tools/core-banking-parser/ToolClient.tsx`
  - `app/(tools)/banking-tools/core-banking-parser/ToolClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="crontab-editor"></a>Crontab Editor

#### Identity
- **ID:** `crontab-editor`
- **Name:** Crontab Editor
- **Category:** Developer Tools
- **Route:** `/developer-tools/crontab-editor`

#### Purpose
> Build crontab expressions visually and translate them to plain English.

#### Features
- Support for crontab editor
- Support for developer

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ShareButton`, `SharedResultBanner`, `QRModal`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `utils`, `FocusModeControlsContext`, `useUrlState`, `cron-logic` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/developer-tools/crontab-editor/page.tsx`
- **Client Component:** `app/(tools)/developer-tools/crontab-editor/CrontabEditorClient.tsx`
- **Feature Directory:** `src/features/crontab-editor`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/crontab-editor.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ShareButton`, `SharedResultBanner`, `QRModal`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/developer-tools/crontab-editor/page.tsx`
  - `app/(tools)/developer-tools/crontab-editor/CrontabEditorClient.tsx`
  - `app/(tools)/developer-tools/crontab-editor/CrontabEditorWrapper.tsx`
  - `src/features/crontab-editor/components/ExecutionSchedule.tsx`
  - `src/features/crontab-editor/components/FieldBreakdown.tsx`
  - `src/features/crontab-editor/constants/index.ts`
  - `src/features/crontab-editor/types/index.ts`
  - `src/features/crontab-editor/utils/cron-parser.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="csv-to-json"></a>Csv To Json

#### Identity
- **ID:** `csv-to-json`
- **Name:** Csv To Json
- **Category:** Developer Tools
- **Route:** `/developer-tools/csv-to-json`

#### Purpose
> Convert tabular CSV file content into structured JSON objects.

#### Features
- Support for csv to json
- Support for developer

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `utils`, `blob-manager`, `blobManager` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/developer-tools/csv-to-json/page.tsx`
- **Client Component:** `app/(tools)/developer-tools/csv-to-json/CsvToJsonClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/csv-to-json.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/developer-tools/csv-to-json/page.tsx`
  - `app/(tools)/developer-tools/csv-to-json/CsvToJsonClient.tsx`
  - `app/(tools)/developer-tools/csv-to-json/CsvToJsonWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="diff-checker"></a>Diff Checker

#### Identity
- **ID:** `diff-checker`
- **Name:** Diff Checker
- **Category:** Developer Tools
- **Route:** `/developer-tools/diff-checker`

#### Purpose
> Perform a line-by-line comparison of two text blocks to highlight additions, deletions, and unchanged lines — similar to `git diff`.

#### Features
- Reviewing changes to a configuration file before deploying
- Comparing two versions of a contract or document
- Verifying that a code refactor did not change behaviour
- Checking what changed between two API responses

#### Functionality
Paste the original text into the left panel ('Before'). Paste the updated text into the right panel ('After'). The diff is computed instantly with added lines in green and removed lines in red. Scroll through the diff to review all changes. Use 'Unified' or 'Split' view to switch display modes.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton`, `CopyButton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `utils` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/developer-tools/diff-checker/page.tsx`
- **Client Component:** `app/(tools)/developer-tools/diff-checker/DiffCheckerClientWrapper.tsx`
- **Feature Directory:** `src/features/diff-checker`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/diff-checker.ts`
- **Registry File:** `src/registry/tools/diff-checker.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`, `CopyButton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Entire file shows as changed when only one line differs, Resolve issues relating to: Diff is very slow for large files, Resolve issues relating to: Colors are hard to read
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/developer-tools/diff-checker/page.tsx`
  - `app/(tools)/developer-tools/diff-checker/DiffCheckerClientWrapper.tsx`
  - `app/(tools)/developer-tools/diff-checker/layout.tsx`
  - `src/features/diff-checker/components/DiffCheckerClient.tsx`
  - `src/features/diff-checker/index.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="emv-tlv-tree"></a>Emv Tlv Tree

#### Identity
- **ID:** `emv-tlv-tree`
- **Name:** Emv Tlv Tree
- **Category:** Developer Tools
- **Route:** `/banking-tools/emv-tlv-tree`

#### Purpose
> Inspect and parse EMV TLV payment packets for bank transaction analysis.

#### Features
- Support for emv tlv tree
- Support for banking

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolInput`, `ToolResultArea`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `emv-tlv-tree`, `seo`, `tlv` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/banking-tools/emv-tlv-tree/page.tsx`
- **Client Component:** `app/(tools)/banking-tools/emv-tlv-tree/ToolClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/emv-tlv-tree.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolInput`, `ToolResultArea`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/banking-tools/emv-tlv-tree/page.tsx`
  - `app/(tools)/banking-tools/emv-tlv-tree/ToolClient.tsx`
  - `app/(tools)/banking-tools/emv-tlv-tree/ToolClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="fake-data-generator"></a>Fake Data Generator

#### Identity
- **ID:** `fake-data-generator`
- **Name:** Fake Data Generator
- **Category:** Developer Tools
- **Route:** `/developer-tools/fake-data-generator`

#### Purpose
> The Fake Data Generator tool is a secure, browser-native utility designed to help you with your daily tasks.

#### Features
- Support for fake data
- Support for mock data
- Support for generator
- Support for csv
- Support for json
- Support for sql

#### Functionality
Upload or enter the required data for Fake Data Generator. Configure any available settings or options. Click the action button to process your request. Download or copy the results directly to your device.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolInput`, `Checkbox`, `ToolResultArea`, `SegmentedControl`, `WorkflowSuggestions`, `ToolSkeleton` |
| **Processing Packages** | `next`, `lucide-react`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `hooks` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/developer-tools/fake-data-generator/page.tsx`
- **Client Component:** `app/(tools)/developer-tools/fake-data-generator/FakeDataGeneratorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/fake-data-generator.ts`
- **Registry File:** `src/registry/tools/fake-data-generator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolInput`, `Checkbox`, `ToolResultArea`, `SegmentedControl`, `WorkflowSuggestions`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** `useWorkflowStore`
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/developer-tools/fake-data-generator/page.tsx`
  - `app/(tools)/developer-tools/fake-data-generator/FakeDataGeneratorClient.tsx`
  - `app/(tools)/developer-tools/fake-data-generator/FakeDataGeneratorClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="file-viewer-diff"></a>File Viewer & Diff

#### Identity
- **ID:** `file-viewer-diff`
- **Name:** File Viewer & Diff
- **Category:** Developer Tools
- **Route:** `/file-tools/file-viewer-diff`

#### Purpose
> Local text editor and diff checker

#### Features
- Support for file viewer
- Support for diff
- Support for compare
- Support for editor
- Support for source code

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton` |
| **Processing Packages** | `next`, `zustand` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/file-tools/file-viewer-diff/page.tsx`
- **Client Component:** `app/(tools)/file-tools/file-viewer-diff/FileViewerDiffClientWrapper.tsx`
- **Feature Directory:** `src/features/file-viewer-diff`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `src/features/file-viewer-diff/store.ts`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/file-viewer-diff.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | Yes |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** Yes
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/file-tools/file-viewer-diff/page.tsx`
  - `app/(tools)/file-tools/file-viewer-diff/FileViewerDiffClientWrapper.tsx`
  - `src/features/file-viewer-diff/store.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="glassmorphism-generator"></a>Glassmorphism Generator

#### Identity
- **ID:** `glassmorphism-generator`
- **Name:** Glassmorphism Generator
- **Category:** Developer Tools
- **Route:** `/developer-tools/glassmorphism-generator`

#### Purpose
> Generate CSS code for modern frosted-glass card designs.

#### Features
- Support for glassmorphism generator
- Support for developer

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `utils` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/developer-tools/glassmorphism-generator/page.tsx`
- **Client Component:** `app/(tools)/developer-tools/glassmorphism-generator/GlassmorphismGeneratorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/glassmorphism-generator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/developer-tools/glassmorphism-generator/page.tsx`
  - `app/(tools)/developer-tools/glassmorphism-generator/GlassmorphismGeneratorClient.tsx`
  - `app/(tools)/developer-tools/glassmorphism-generator/GlassmorphismGeneratorWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="gradient-generator"></a>Gradient Generator

#### Identity
- **ID:** `gradient-generator`
- **Name:** Gradient Generator
- **Category:** Developer Tools
- **Route:** `/developer-tools/gradient-generator`

#### Purpose
> Design linear and radial CSS gradients visually for backgrounds.

#### Features
- Support for gradient generator
- Support for developer

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `utils` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/developer-tools/gradient-generator/page.tsx`
- **Client Component:** `app/(tools)/developer-tools/gradient-generator/GradientGeneratorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/gradient-generator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/developer-tools/gradient-generator/page.tsx`
  - `app/(tools)/developer-tools/gradient-generator/GradientGeneratorClient.tsx`
  - `app/(tools)/developer-tools/gradient-generator/GradientGeneratorWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="hash-map-visualizer"></a>Hash Map Visualizer

#### Identity
- **ID:** `hash-map-visualizer`
- **Name:** Hash Map Visualizer
- **Category:** Developer Tools
- **Route:** `/developer-tools/hash-map-visualizer`

#### Purpose
> Standardized content for Hash Map Visualizer.

#### Features
- Visualize hashing

#### Functionality
Step 1 Step 2 Step 3 Step 4

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton`, `ToolInput` |
| **Processing Packages** | `next`, `react`, `framer-motion`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/developer-tools/hash-map-visualizer/page.tsx`
- **Client Component:** `app/(tools)/developer-tools/hash-map-visualizer/ClientWrapper.tsx`
- **Feature Directory:** `src/features/hash-map-visualizer`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/hash-map-visualizer.ts`
- **Registry File:** `src/registry/tools/hash-map-visualizer.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`, `ToolInput`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/developer-tools/hash-map-visualizer/page.tsx`
  - `app/(tools)/developer-tools/hash-map-visualizer/ClientWrapper.tsx`
  - `src/features/hash-map-visualizer/index.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="html-viewer"></a>HTML Online Viewer

#### Identity
- **ID:** `html-viewer`
- **Name:** HTML Online Viewer
- **Category:** Developer Tools
- **Route:** `/developer-tools/html-viewer`

#### Purpose
> A professional-grade, live HTML, CSS, and JavaScript editor with a real-time sandboxed preview.

#### Features
- Quickly prototyping UI components
- Testing CSS layouts and animations
- Debugging JavaScript snippets
- Sharing code examples with colleagues
- Learning HTML5 and modern web standards

#### Functionality
Select a tab (HTML, CSS, or JS) to start writing code. The preview pane updates automatically as you type. Use the 'Libraries' menu to add external CSS or JS frameworks (e.g., Bootstrap, Tailwind). Open the 'Console' tab in the preview area to see logs and errors. Click 'Download' to save your work as a single, portable HTML file. Use 'Share' to generate a permanent link that contains your entire project in the URL.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton`, `SegmentedControl`, `EngineLoader`, `DropZone` |
| **Processing Packages** | `next`, `react`, `framer-motion`, `lucide-react`, `@monaco-editor/react`, `lz-string`, `isomorphic-dompurify` |
| **Shared Internal Modules** | `seo`, `tool-registry`, `utils`, `hooks`, `useDebounce`, `logger`, `EngineLoader` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/developer-tools/html-viewer/page.tsx`
- **Client Component:** `app/(tools)/developer-tools/html-viewer/HtmlViewerClientWrapper.tsx`
- **Feature Directory:** `src/features/html-viewer`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/html-viewer.ts`
- **Registry File:** `src/registry/tools/html-viewer.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | Yes |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (DOMPurify)
- **Sanitization:** Yes (DOMPurify)
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** `code-minifier`, `format`, `json-formatter`
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`, `SegmentedControl`, `EngineLoader`, `DropZone`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/developer-tools/html-viewer/page.tsx`
  - `app/(tools)/developer-tools/html-viewer/HtmlViewerClientWrapper.tsx`
  - `src/features/html-viewer/components/CdnOverlay.tsx`
  - `src/features/html-viewer/components/ConsoleDrawer.tsx`
  - `src/features/html-viewer/components/HtmlViewerClient.tsx`
  - `src/features/html-viewer/index.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="image-seo"></a>Image Seo

#### Identity
- **ID:** `image-seo`
- **Name:** Image Seo
- **Category:** Developer Tools
- **Route:** `/seo-tools/image-seo`

#### Purpose
> 
Optimizing your images for search engines (SEO) is one of the most overlooked aspects of digital marketing and website performance.

#### Features
- E-commerce SEO: Optimizing product catalogs for Google Image search to drive organic traffic.
- Blogger Workflow: Quickly renaming raw camera uploads into descriptive, SEO-friendly assets for WordPress or Next.js.
- Accessibility Audits: Using the SEO Analyzer to refine alt text for compliance with WCAG standards.
- Developer Productivity: Batch renaming assets for code projects using consistent, slugified naming patterns.

#### Functionality
**Step 1:** Upload your image or select multiple files for batch processing using the 'Select Files' button. **Step 2:** Provide a brief context or description of what is happening in the image. **Step 3:** Click 'Generate SEO Plan' to create a natural language alt text string and a clean, hyphenated filename slug. **Step 4:** For individual files, download the optimized version instantly. For batch tasks, use the 'Batch Renamer' tab to process entire folders with consistent naming conventions. **Step 5:** Use the 'SEO Analyzer' to verify the health of your existing alt tags against character count and keyword density benchmarks.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton` |
| **Processing Packages** | `next` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `ImageSeoClient` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/seo-tools/image-seo/page.tsx`
- **Client Component:** `app/(tools)/seo-tools/image-seo/ImageSeoClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/image-seo.ts`
- **Registry File:** `src/registry/tools/image-seo.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | Yes |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Using 'image of' or 'picture of' in alt text, Resolve issues relating to: Keyword Stuffing
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/seo-tools/image-seo/page.tsx`
  - `app/(tools)/seo-tools/image-seo/ImageSeoClient.tsx`
  - `app/(tools)/seo-tools/image-seo/ImageSeoClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="json-csv"></a>JSON ↔ CSV

#### Identity
- **ID:** `json-csv`
- **Name:** JSON ↔ CSV
- **Category:** Developer Tools
- **Route:** `/developer-tools/json-csv`

#### Purpose
> Convert a JSON array of objects to a CSV file and back with a single click.

#### Features
- Exporting API data to Excel for reporting
- Importing a CSV dataset into a JavaScript application as JSON
- Preparing data for a spreadsheet from a REST API
- Converting a database export between formats

#### Functionality
Select the conversion direction: 'JSON → CSV' or 'CSV → JSON'. Paste your JSON array or CSV text into the input panel. The converted output appears in the right panel. Download the result as a file or copy it to the clipboard.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton`, `CopyButton`, `WorkflowSuggestions` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `workflow-hook` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/developer-tools/json-csv/page.tsx`
- **Client Component:** `app/(tools)/developer-tools/json-csv/JSONCSVConverterClientWrapper.tsx`
- **Feature Directory:** `src/features/json-csv`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/json-csv.ts`
- **Registry File:** `src/registry/tools/json-csv.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** `json-formatter`, `unit-converter`
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`, `CopyButton`, `WorkflowSuggestions`
- **Shared Workers Used:** None
- **Shared Stores Used:** `useWorkflowStore`
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: JSON input is not an array, Resolve issues relating to: CSV output has misaligned columns, Resolve issues relating to: Non-ASCII characters appear garbled in Excel
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/developer-tools/json-csv/page.tsx`
  - `app/(tools)/developer-tools/json-csv/JSONCSVConverterClientWrapper.tsx`
  - `app/(tools)/developer-tools/json-csv/layout.tsx`
  - `src/features/json-csv/components/JSONCSVConverterClient.tsx`
  - `src/features/json-csv/index.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="json-formatter"></a>JSON Formatter

#### Identity
- **ID:** `json-formatter`
- **Name:** JSON Formatter
- **Category:** Developer Tools
- **Route:** `/developer-tools/json-formatter`

#### Purpose
> 
The JSON Formatter and Validator is a professional-grade development utility built to simplify the way you work with JSON data.

#### Features
- Debugging error-prone API responses from backend services.
- Formatting minified JSON output for easier structural inspection.
- Verifying JSON integrity before committing to a version control system (Git).
- Understanding the hierarchical structure of large, unfamiliar data schemas.

#### Functionality
Input: Paste your raw JSON payload into the main editor area. Beautify: Click the 'Format' button to apply standard indentation and structure. Minify: Click 'Minify' to remove all whitespace for compact transmission. Validate: If there is a syntax error, the tool will automatically highlight the line and explain what's wrong. Navigate: Switch to 'Tree View' to explore complex, nested data objects interactively.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton`, `CopyButton`, `ToolInput`, `SegmentedControl`, `StatusBadge`, `EmptyState`, `PrivacyBadge`, `WorkflowSuggestions` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `hooks`, `utils`, `formatError`, `FocusModeControlsContext`, `workflow-hook` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/developer-tools/json-formatter/page.tsx`
- **Client Component:** `app/(tools)/developer-tools/json-formatter/JSONFormatterClientWrapper.tsx`
- **Feature Directory:** `src/features/json-formatter`
- **Worker File:** `src/workers/manager`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/json-formatter.ts`
- **Registry File:** `src/registry/tools/json-formatter.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | Yes (ComputeWorker) |
| **Concurrency Limit** | 3 |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Worker Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** Yes
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** Yes
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Worker

#### Relations & Enhancements
- **Related Tools:** `json-csv`, `base64`, `format`
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`, `CopyButton`, `ToolInput`, `SegmentedControl`, `StatusBadge`, `EmptyState`, `PrivacyBadge`, `WorkflowSuggestions`
- **Shared Workers Used:** `manager`
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Unexpected token at line X, Resolve issues relating to: Syntax error: expected double-quoted key
- **Manifest Safety Rules Enforced:** KL-02 (Worker Concurrency), KL-05 (AbortSignal Propagation), KL-10 (WorkerOrchestrator entry)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/developer-tools/json-formatter/page.tsx`
  - `app/(tools)/developer-tools/json-formatter/JSONFormatterClientWrapper.tsx`
  - `app/(tools)/developer-tools/json-formatter/layout.tsx`
  - `src/features/json-formatter/components/JSONFormatterClient.tsx`
  - `src/features/json-formatter/index.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="json-to-ts"></a>JSON to TypeScript

#### Identity
- **ID:** `json-to-ts`
- **Name:** JSON to TypeScript
- **Category:** Developer Tools
- **Route:** `/developer-tools/json-to-ts`

#### Purpose
> 
The JSON to TypeScript tool is designed for developers who need to quickly generate TypeScript interfaces from JSON objects.

#### Features
- Generating types from API payloads.
- Quickly typing configuration objects.
- Prototyping TypeScript data models.

#### Functionality
Input JSON: Paste your raw JSON data in the left panel. View Interfaces: The generated TypeScript interfaces will appear immediately in the right panel. Copy: Click the 'Copy' button to copy the TypeScript code to your clipboard.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `@monaco-editor/react`, `lucide-react` |
| **Shared Internal Modules** | `JsonToTsClientWrapper`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/developer-tools/json-to-ts/page.tsx`
- **Client Component:** `Not Present in Repository`
- **Feature Directory:** `src/features/json-to-ts`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/json-to-ts.ts`
- **Registry File:** `src/registry/tools/json-to-ts.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** `json-formatter`, `base64`
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Invalid JSON format
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/developer-tools/json-to-ts/page.tsx`
  - `src/features/json-to-ts/JsonToTsClient.tsx`
  - `src/features/json-to-ts/JsonToTsClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="log-analyzer"></a>Log Analyzer

#### Identity
- **ID:** `log-analyzer`
- **Name:** Log Analyzer
- **Category:** Developer Tools
- **Route:** `/developer-tools/log-analyzer`

#### Purpose
> Analyze and filter server and application access log files.

#### Features
- Support for log analyzer
- Support for developer

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/developer-tools/log-analyzer/page.tsx`
- **Client Component:** `app/(tools)/developer-tools/log-analyzer/LogAnalyzerClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/log-analyzer.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/developer-tools/log-analyzer/page.tsx`
  - `app/(tools)/developer-tools/log-analyzer/LogAnalyzerClient.tsx`
  - `app/(tools)/developer-tools/log-analyzer/LogAnalyzerClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="lorem-ipsum"></a>Lorem Ipsum

#### Identity
- **ID:** `lorem-ipsum`
- **Name:** Lorem Ipsum
- **Category:** Developer Tools
- **Route:** `/developer-tools/lorem-ipsum`

#### Purpose
> Generate custom dummy placeholder text for layouts and copy.

#### Features
- Support for lorem ipsum
- Support for developer

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `utils`, `blob-manager`, `blobManager` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/developer-tools/lorem-ipsum/page.tsx`
- **Client Component:** `app/(tools)/developer-tools/lorem-ipsum/LoremIpsumClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/lorem-ipsum.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/developer-tools/lorem-ipsum/page.tsx`
  - `app/(tools)/developer-tools/lorem-ipsum/LoremIpsumClient.tsx`
  - `app/(tools)/developer-tools/lorem-ipsum/LoremIpsumWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="luhn-validator"></a>Luhn Validator

#### Identity
- **ID:** `luhn-validator`
- **Name:** Luhn Validator
- **Category:** Developer Tools
- **Route:** `/developer-tools/luhn-validator`

#### Purpose
> Check identification card numbers using the Luhn checksum algorithm.

#### Features
- Support for luhn validator
- Support for developer

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/developer-tools/luhn-validator/page.tsx`
- **Client Component:** `app/(tools)/developer-tools/luhn-validator/LuhnClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/luhn-validator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/developer-tools/luhn-validator/page.tsx`
  - `app/(tools)/developer-tools/luhn-validator/LuhnClient.tsx`
  - `app/(tools)/developer-tools/luhn-validator/LuhnClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="meta-tags"></a>Meta Tags

#### Identity
- **ID:** `meta-tags`
- **Name:** Meta Tags
- **Category:** Developer Tools
- **Route:** `/seo-tools/meta-tags`

#### Purpose
> Generate complete HTML meta tag markup for a web page including title, description, Open Graph, Twitter Card, and basic SEO tags.

#### Features
- Adding Open Graph tags to a new landing page
- Generating Twitter Card markup for article pages
- Creating consistent meta tags across a site
- Auditing what meta tags a page currently has before adding more

#### Functionality
Fill in the page title, description, URL, and optional image URL. Select the content type (website, article, product). Preview the search snippet and social media card previews. Click 'Copy HTML' to copy all meta tags ready to paste.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton` |
| **Processing Packages** | `next` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `MetaTagsGeneratorClient` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/seo-tools/meta-tags/page.tsx`
- **Client Component:** `app/(tools)/seo-tools/meta-tags/MetaTagsClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/meta-tags.ts`
- **Registry File:** `src/registry/tools/meta-tags.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: og:image not showing on social media, Resolve issues relating to: Title is truncated in search results
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/seo-tools/meta-tags/page.tsx`
  - `app/(tools)/seo-tools/meta-tags/MetaTagsClient.tsx`
  - `app/(tools)/seo-tools/meta-tags/MetaTagsClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="nanoid-generator"></a>Nanoid Generator

#### Identity
- **ID:** `nanoid-generator`
- **Name:** Nanoid Generator
- **Category:** Developer Tools
- **Route:** `/developer-tools/nanoid-generator`

#### Purpose
> Generate secure, URL-friendly unique string IDs using NanoID.

#### Features
- Support for nanoid generator
- Support for developer

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/developer-tools/nanoid-generator/page.tsx`
- **Client Component:** `app/(tools)/developer-tools/nanoid-generator/NanoIdClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/nanoid-generator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/developer-tools/nanoid-generator/page.tsx`
  - `app/(tools)/developer-tools/nanoid-generator/NanoIdClient.tsx`
  - `app/(tools)/developer-tools/nanoid-generator/NanoIdClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="og-preview"></a>Og Preview

#### Identity
- **ID:** `og-preview`
- **Name:** Og Preview
- **Category:** Developer Tools
- **Route:** `/seo-tools/og-preview`

#### Purpose
> Simulate how a URL's Open Graph (og:) meta tags will appear when shared on Facebook, Twitter, LinkedIn, and WhatsApp.

#### Features
- Previewing a blog post's share card before publishing
- Testing Open Graph tags for a product page
- Verifying that og:image loads correctly at the correct aspect ratio
- Comparing card appearance across different platforms

#### Functionality
Enter the URL of the page you want to preview, or paste your og: meta tags directly. Select the platform tab (Facebook, Twitter, LinkedIn, WhatsApp). The rendered preview card is displayed. Adjust your meta tags based on the preview and regenerate.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton` |
| **Processing Packages** | `next` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `OgPreviewClient` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/seo-tools/og-preview/page.tsx`
- **Client Component:** `app/(tools)/seo-tools/og-preview/OgPreviewClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/og-preview.ts`
- **Registry File:** `src/registry/tools/og-preview.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Preview shows no image, Resolve issues relating to: Old image or description still shows
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/seo-tools/og-preview/page.tsx`
  - `app/(tools)/seo-tools/og-preview/OgPreviewClient.tsx`
  - `app/(tools)/seo-tools/og-preview/OgPreviewClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="regex-tester"></a>Regex Tester

#### Identity
- **ID:** `regex-tester`
- **Name:** Regex Tester
- **Category:** Developer Tools
- **Route:** `/developer-tools/regex`

#### Purpose
> Test regular expressions against sample text in real time with live match highlighting.

#### Features
- Building and testing an email validation regex
- Extracting dates or phone numbers from a block of text
- Debugging a complex search-and-replace pattern
- Learning regex syntax interactively

#### Functionality
Enter your regular expression in the pattern field. Type or paste the sample text in the test area. All matches are highlighted immediately as you type. Review the match list below showing each match's value, index, and groups. Toggle flags (`g`, `i`, `m`, etc.) using the flag buttons.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton` |
| **Processing Packages** | `next` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/developer-tools/regex/page.tsx`
- **Client Component:** `app/(tools)/developer-tools/regex/RegexTesterClientWrapper.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/regex-tester.ts`
- **Registry File:** `src/registry/tools/regex-tester.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Regex throws 'Invalid regular expression', Resolve issues relating to: Pattern only matches once even with the global flag, Resolve issues relating to: Catastrophic backtracking causes the browser to hang
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/developer-tools/regex/page.tsx`
  - `app/(tools)/developer-tools/regex/RegexTesterClientWrapper.tsx`
  - `app/(tools)/developer-tools/regex/layout.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="robots-txt"></a>Robots Txt

#### Identity
- **ID:** `robots-txt`
- **Name:** Robots Txt
- **Category:** Developer Tools
- **Route:** `/seo-tools/robots-txt`

#### Purpose
> Generate a valid `robots.

#### Features
- Blocking search engines from indexing an admin panel
- Preventing crawlers from accessing test or staging directories
- Adding a sitemap reference to robots.txt
- Setting a crawl delay for a resource-constrained server

#### Functionality
Add user agent rules using the form (choose 'All' or a specific bot). Add disallow and allow paths for each user agent. Optionally set a crawl delay and sitemap URL. Click 'Generate' to preview the `robots.txt` content. Download the file and upload it to your website's root directory.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton` |
| **Processing Packages** | `next` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `RobotsTxtBuilderClient` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/seo-tools/robots-txt/page.tsx`
- **Client Component:** `app/(tools)/seo-tools/robots-txt/RobotsTxtClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/robots-txt.ts`
- **Registry File:** `src/registry/tools/robots-txt.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Robots.txt is blocking the entire site, Resolve issues relating to: File is not being respected by a crawler
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/seo-tools/robots-txt/page.tsx`
  - `app/(tools)/seo-tools/robots-txt/RobotsTxtClient.tsx`
  - `app/(tools)/seo-tools/robots-txt/RobotsTxtClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="seo-title"></a>Seo Title

#### Identity
- **ID:** `seo-title`
- **Name:** Seo Title
- **Category:** Developer Tools
- **Route:** `/seo-tools/seo-title`

#### Purpose
> Preview how your page title and meta description will appear in Google Search results with a pixel-accurate SERP snippet simulator.

#### Features
- Optimising a page title to fit within Google's display limit
- Writing a compelling meta description to improve click-through rate
- Reviewing titles across a site before a content audit
- Training a content team on SERP best practices

#### Functionality
Type your page title in the title field. Type your meta description in the description field. The SERP preview updates in real time below. Adjust the text until the preview shows no truncation. Copy the title and description for use in your CMS.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton` |
| **Processing Packages** | `next` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `SeoTitleTesterClient` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/seo-tools/seo-title/page.tsx`
- **Client Component:** `app/(tools)/seo-tools/seo-title/SeoTitleClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/seo-title.ts`
- **Registry File:** `src/registry/tools/seo-title.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Title appears truncated in the preview, Resolve issues relating to: Description is being rewritten by Google
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/seo-tools/seo-title/page.tsx`
  - `app/(tools)/seo-tools/seo-title/SeoTitleClient.tsx`
  - `app/(tools)/seo-tools/seo-title/SeoTitleClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="seo-tools"></a>Seo Tools

#### Identity
- **ID:** `seo-tools`
- **Name:** Seo Tools
- **Category:** Developer Tools
- **Route:** `/developer-tools/seo-tools`

#### Purpose
> Inspect and optimize website SEO meta tags and preview search snippets.

#### Features
- Support for seo tools
- Support for developer

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton`, `CopyButton`, `BatchQueue`, `ToolInput`, `Toast`, `Checkbox` |
| **Processing Packages** | `next`, `react`, `framer-motion`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `blob-manager`, `utils`, `blobManager`, `hooks` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/developer-tools/seo-tools/page.tsx`
- **Client Component:** `app/(tools)/developer-tools/seo-tools/SeoToolsClientWrapper.tsx`
- **Feature Directory:** `src/features/seo-tools`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/seo-tools.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`, `CopyButton`, `BatchQueue`, `ToolInput`, `Toast`, `Checkbox`
- **Shared Workers Used:** None
- **Shared Stores Used:** `useBatchStore`
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/developer-tools/seo-tools/page.tsx`
  - `app/(tools)/developer-tools/seo-tools/SeoToolsClientWrapper.tsx`
  - `src/features/seo-tools/SeoToolsClient.tsx`
  - `src/features/seo-tools/components/ImageSeoClient.tsx`
  - `src/features/seo-tools/components/MetaTagsGeneratorClient.tsx`
  - `src/features/seo-tools/components/OgPreviewClient.tsx`
  - `src/features/seo-tools/components/RobotsTxtBuilderClient.tsx`
  - `src/features/seo-tools/components/SeoTitleTesterClient.tsx`
  - `src/features/seo-tools/components/SitemapGeneratorClient.tsx`
  - `src/features/seo-tools/components/SlugGeneratorClient.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="sitemap-generator"></a>Sitemap Generator

#### Identity
- **ID:** `sitemap-generator`
- **Name:** Sitemap Generator
- **Category:** Developer Tools
- **Route:** `/seo-tools/sitemap-generator`

#### Purpose
> Build a standards-compliant XML sitemap by entering your URLs along with priority, change frequency, and last modification date.

#### Features
- Creating a sitemap for a new website before launch
- Regenerating a sitemap after adding new pages
- Submitting additional URLs to Google Search Console
- Building a sitemap for a static site that has no CMS plugin

#### Functionality
Enter your website's base URL. Add URLs one by one using the form, or paste a list of URLs. For each URL, set the priority (0.1 to 1.0) and change frequency. Click 'Generate Sitemap' to produce the XML. Download `sitemap.xml` and upload it to your website's root directory.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton` |
| **Processing Packages** | `next` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `SitemapGeneratorClient` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/seo-tools/sitemap-generator/page.tsx`
- **Client Component:** `app/(tools)/seo-tools/sitemap-generator/SitemapClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/sitemap-generator.ts`
- **Registry File:** `src/registry/tools/sitemap-generator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Google rejects the sitemap with 'Could not fetch', Resolve issues relating to: URLs with query strings are not indexing
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/seo-tools/sitemap-generator/page.tsx`
  - `app/(tools)/seo-tools/sitemap-generator/SitemapClient.tsx`
  - `app/(tools)/seo-tools/sitemap-generator/SitemapClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="slug-generator"></a>Slug Generator

#### Identity
- **ID:** `slug-generator`
- **Name:** Slug Generator
- **Category:** Developer Tools
- **Route:** `/seo-tools/slug-generator`

#### Purpose
> Convert any page title or phrase into a clean, SEO-friendly URL slug.

#### Features
- Generating a URL slug for a new blog post
- Creating consistent URL patterns for a product catalogue
- Converting user-submitted titles to safe URL components
- Batch-generating slugs for an imported content library

#### Functionality
Type or paste your page title into the input field. The slug is generated instantly below. Toggle 'Remove stop words' to strip common words (the, a, an, in, etc.) for a shorter slug. Copy the slug and use it in your CMS or URL structure.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton` |
| **Processing Packages** | `next` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `SlugGeneratorClient` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/seo-tools/slug-generator/page.tsx`
- **Client Component:** `app/(tools)/seo-tools/slug-generator/SlugClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/slug-generator.ts`
- **Registry File:** `src/registry/tools/slug-generator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Slug contains consecutive hyphens, Resolve issues relating to: Slug starts or ends with a hyphen
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/seo-tools/slug-generator/page.tsx`
  - `app/(tools)/seo-tools/slug-generator/SlugClient.tsx`
  - `app/(tools)/seo-tools/slug-generator/SlugClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="sql-formatter"></a>Sql Formatter

#### Identity
- **ID:** `sql-formatter`
- **Name:** Sql Formatter
- **Category:** Developer Tools
- **Route:** `/developer-tools/sql-formatter`

#### Purpose
> Beautify and format complex SQL queries to improve readability.

#### Features
- Support for sql formatter
- Support for developer

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/developer-tools/sql-formatter/page.tsx`
- **Client Component:** `app/(tools)/developer-tools/sql-formatter/SqlFormatterClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/sql-formatter.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/developer-tools/sql-formatter/page.tsx`
  - `app/(tools)/developer-tools/sql-formatter/SqlFormatterClient.tsx`
  - `app/(tools)/developer-tools/sql-formatter/SqlFormatterClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="swift-mt-mx"></a>Swift Mt Mx

#### Identity
- **ID:** `swift-mt-mx`
- **Name:** Swift Mt Mx
- **Category:** Developer Tools
- **Route:** `/banking-tools/swift-mt-mx`

#### Purpose
> Parse and inspect SWIFT MT and MX banking message structures.

#### Features
- Support for swift mt mx
- Support for banking

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolInput`, `ToolResultArea`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `swift-mt-mx`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/banking-tools/swift-mt-mx/page.tsx`
- **Client Component:** `app/(tools)/banking-tools/swift-mt-mx/ToolClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/swift-mt-mx.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolInput`, `ToolResultArea`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/banking-tools/swift-mt-mx/page.tsx`
  - `app/(tools)/banking-tools/swift-mt-mx/ToolClient.tsx`
  - `app/(tools)/banking-tools/swift-mt-mx/ToolClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="track-2-parser"></a>Track 2 Parser

#### Identity
- **ID:** `track-2-parser`
- **Name:** Track 2 Parser
- **Category:** Developer Tools
- **Route:** `/banking-tools/track-2-parser`

#### Purpose
> Decode magnetic stripe Track 2 data for payment card testing.

#### Features
- Support for track 2 parser
- Support for banking

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolInput`, `ToolResultArea`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `track-2-parser`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/banking-tools/track-2-parser/page.tsx`
- **Client Component:** `app/(tools)/banking-tools/track-2-parser/ToolClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/track-2-parser.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolInput`, `ToolResultArea`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/banking-tools/track-2-parser/page.tsx`
  - `app/(tools)/banking-tools/track-2-parser/ToolClient.tsx`
  - `app/(tools)/banking-tools/track-2-parser/ToolClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="unix-timestamp"></a>Unix Timestamp

#### Identity
- **ID:** `unix-timestamp`
- **Name:** Unix Timestamp
- **Category:** Developer Tools
- **Route:** `/developer-tools/unix-timestamp`

#### Purpose
> Convert between epoch timestamps and human-readable dates.

#### Features
- Support for unix timestamp
- Support for developer

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ShareButton`, `SharedResultBanner`, `QRModal`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `utils`, `useUrlState` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/developer-tools/unix-timestamp/page.tsx`
- **Client Component:** `app/(tools)/developer-tools/unix-timestamp/UnixTimestampClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/unix-timestamp.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ShareButton`, `SharedResultBanner`, `QRModal`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/developer-tools/unix-timestamp/page.tsx`
  - `app/(tools)/developer-tools/unix-timestamp/UnixTimestampClient.tsx`
  - `app/(tools)/developer-tools/unix-timestamp/UnixTimestampWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="url-encoder"></a>URL Encoder

#### Identity
- **ID:** `url-encoder`
- **Name:** URL Encoder
- **Category:** Developer Tools
- **Route:** `/developer-tools/url-encoder`

#### Purpose
> Percent-encode and decode URLs and query string parameters to ensure they are safely transmitted in HTTP requests.

#### Features
- Encoding a search query before appending it to a URL
- Decoding a URL copied from a browser address bar
- Fixing a broken link that contains unencoded special characters
- Preparing query parameters for an API request

#### Functionality
Choose 'Encode' or 'Decode' mode. Paste your URL or query string into the input field. The encoded or decoded result appears immediately. Copy the output using the copy button.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/developer-tools/url-encoder/page.tsx`
- **Client Component:** `app/(tools)/developer-tools/url-encoder/URLEncoderClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/url-encoder.ts`
- **Registry File:** `src/registry/tools/url-encoder.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Double-encoding (e.g., `%2520` instead of `%20`), Resolve issues relating to: Encoding the entire URL including `://`, Resolve issues relating to: `+` signs disappear after decoding
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/developer-tools/url-encoder/page.tsx`
  - `app/(tools)/developer-tools/url-encoder/URLEncoderClient.tsx`
  - `app/(tools)/developer-tools/url-encoder/URLEncoderClientWrapper.tsx`
  - `app/(tools)/developer-tools/url-encoder/layout.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="uuid-generator"></a>Uuid Generator

#### Identity
- **ID:** `uuid-generator`
- **Name:** Uuid Generator
- **Category:** Developer Tools
- **Route:** `/developer-tools/uuid-generator`

#### Purpose
> Generate secure v4 UUIDs for database and entity keys.

#### Features
- Support for uuid generator
- Support for developer

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `utils` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/developer-tools/uuid-generator/page.tsx`
- **Client Component:** `app/(tools)/developer-tools/uuid-generator/UuidGeneratorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/uuid-generator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/developer-tools/uuid-generator/page.tsx`
  - `app/(tools)/developer-tools/uuid-generator/UuidGeneratorClient.tsx`
  - `app/(tools)/developer-tools/uuid-generator/UuidGeneratorWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="xml-formatter"></a>Xml Formatter

#### Identity
- **ID:** `xml-formatter`
- **Name:** Xml Formatter
- **Category:** Developer Tools
- **Route:** `/developer-tools/xml-formatter`

#### Purpose
> Format and prettify nested XML documents to inspect data tags.

#### Features
- Support for xml formatter
- Support for developer

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `utils`, `blob-manager`, `FocusModeControlsContext`, `FullscreenContext`, `blobManager` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/developer-tools/xml-formatter/page.tsx`
- **Client Component:** `app/(tools)/developer-tools/xml-formatter/XmlFormatterClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/xml-formatter.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/developer-tools/xml-formatter/page.tsx`
  - `app/(tools)/developer-tools/xml-formatter/XmlFormatterClient.tsx`
  - `app/(tools)/developer-tools/xml-formatter/XmlFormatterWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="yaml-json-converter"></a>Yaml Json Converter

#### Identity
- **ID:** `yaml-json-converter`
- **Name:** Yaml Json Converter
- **Category:** Developer Tools
- **Route:** `/developer-tools/yaml-json-converter`

#### Purpose
> Convert between YAML formatting and JSON objects.

#### Features
- Support for yaml json converter
- Support for developer

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `yaml`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/developer-tools/yaml-json-converter/page.tsx`
- **Client Component:** `app/(tools)/developer-tools/yaml-json-converter/YamlJsonClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/yaml-json-converter.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/developer-tools/yaml-json-converter/page.tsx`
  - `app/(tools)/developer-tools/yaml-json-converter/YamlJsonClient.tsx`
  - `app/(tools)/developer-tools/yaml-json-converter/YamlJsonClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="yaml-validator"></a>Yaml Validator

#### Identity
- **ID:** `yaml-validator`
- **Name:** Yaml Validator
- **Category:** Developer Tools
- **Route:** `/developer-tools/yaml-validator`

#### Purpose
> The YAML Validator is an essential developer utility engineered to instantly parse, validate, and format your YAML configuration files entirely within your browser.

#### Features
- DevOps engineers validating complex Kubernetes manifests before applying them to a production cluster.
- Software developers debugging syntax errors in their continuous integration (CI) workflow files.
- System administrators ensuring that infrastructure-as-code (IaC) configurations are perfectly formatted.
- Technical writers standardizing YAML code blocks within software documentation or tutorials.

#### Functionality
Paste or type your YAML configuration data directly into the input editor. Wait a split second as the local validation engine automatically parses the syntax. Review any errors or warnings highlighted by the validator, complete with line numbers and explanations. Make the necessary corrections to resolve the syntax issues. Use the formatting options or click 'Copy' to retrieve your validated, well-structured YAML.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton`, `CopyButton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `seo`, `tool-registry`, `WorkerOrchestrator` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/developer-tools/yaml-validator/page.tsx`
- **Client Component:** `app/(tools)/developer-tools/yaml-validator/YamlValidatorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `src/workers/WorkerOrchestrator, src/workers/karuvi.worker.ts`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/yaml-validator.ts`
- **Registry File:** `src/registry/tools/yaml-validator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | Yes (ComputeWorker) |
| **Concurrency Limit** | 3 |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Worker Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** Yes
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** Yes
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Worker

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`, `CopyButton`
- **Shared Workers Used:** `WorkerOrchestrator`, `karuvi.worker.ts`
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Indentation Error, Resolve issues relating to: Duplicate Key Error
- **Manifest Safety Rules Enforced:** KL-02 (Worker Concurrency), KL-05 (AbortSignal Propagation), KL-10 (WorkerOrchestrator entry)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/developer-tools/yaml-validator/page.tsx`
  - `app/(tools)/developer-tools/yaml-validator/YamlClientWrapper.tsx`
  - `app/(tools)/developer-tools/yaml-validator/YamlValidatorClient.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---


## Category: Image Tools

### <a id="bg-remover"></a>Background Remover

#### Identity
- **ID:** `bg-remover`
- **Name:** Background Remover
- **Category:** Image Tools
- **Route:** `/image-tools/bg-remover`

#### Purpose
> 
The Background Remover is a specialized image editing utility that allows you to isolate subjects by removing their backgrounds with a single click.

#### Features
- Support for image
- Support for background
- Support for remove
- Support for transparent

#### Functionality
Upload Image: Select or drag a photo into the tool area. Click Subject: Click on the background color you want to remove. Adjust Tolerance: Use the sensitivity slider to fine-tune the removal if edges are too sharp or too soft. Preview: Check the transparency against the checkerboard grid. Download PNG: Save your subject with a transparent background to your device.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `SliderField`, `DropZone`, `StatusBadge`, `EmptyState`, `PrivacyBadge`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `hooks`, `safe-process`, `formatError` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/image-tools/bg-remover/page.tsx`
- **Client Component:** `app/(tools)/image-tools/bg-remover/BgRemoverClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `src/workers/manager`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/bg-remover.ts`
- **Registry File:** `src/registry/tools/bg-remover.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | Yes (MediaWorker) |
| **Concurrency Limit** | 3 |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Worker Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** Yes
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** Yes
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Worker

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `SliderField`, `DropZone`, `StatusBadge`, `EmptyState`, `PrivacyBadge`, `ToolSkeleton`
- **Shared Workers Used:** `manager`
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-02 (Worker Concurrency), KL-05 (AbortSignal Propagation), KL-10 (WorkerOrchestrator entry)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/image-tools/bg-remover/page.tsx`
  - `app/(tools)/image-tools/bg-remover/BgRemoverClient.tsx`
  - `app/(tools)/image-tools/bg-remover/BgRemoverClientWrapper.tsx`
  - `app/(tools)/image-tools/bg-remover/layout.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="bulk-resizer"></a>Bulk Image Resize

#### Identity
- **ID:** `bulk-resizer`
- **Name:** Bulk Image Resize
- **Category:** Image Tools
- **Route:** `/image-tools/bulk-resizer`

#### Purpose
> Resize multiple images at once directly in your browser.

#### Features
- Preparing product images for a web gallery
- Batch resizing photos for email attachments
- Creating thumbnails for a blog or portfolio
- Normalizing image sizes for a social media campaign

#### Functionality
Drag and drop multiple images or click 'Select Files'. Set your target dimensions or percentage scale. Choose whether to 'Fit', 'Fill', or 'Stretch' the images. Click 'Process All' and download the resized images in a ZIP file.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `BatchQueue`, `DropZone`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `hooks`, `zip`, `safe-process` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/image-tools/bulk-resizer/page.tsx`
- **Client Component:** `app/(tools)/image-tools/bulk-resizer/BulkImageResizerClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `src/workers/manager, src/workers/types`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/bulk-resizer.ts`
- **Registry File:** `src/registry/tools/bulk-resizer.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | Yes (MediaWorker) |
| **Concurrency Limit** | 3 |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Worker Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** Yes
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** Yes
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Worker

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `BatchQueue`, `DropZone`, `ToolSkeleton`
- **Shared Workers Used:** `manager`, `types`
- **Shared Stores Used:** `useBatchStore`
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-02 (Worker Concurrency), KL-05 (AbortSignal Propagation), KL-10 (WorkerOrchestrator entry)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/image-tools/bulk-resizer/page.tsx`
  - `app/(tools)/image-tools/bulk-resizer/BulkImageResizerClient.tsx`
  - `app/(tools)/image-tools/bulk-resizer/BulkImageResizerClientWrapper.tsx`
  - `app/(tools)/image-tools/bulk-resizer/layout.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="color-palette-extractor"></a>Color Palette Extractor

#### Identity
- **ID:** `color-palette-extractor`
- **Name:** Color Palette Extractor
- **Category:** Image Tools
- **Route:** `/image-tools/color-palette-extractor`

#### Purpose
> The Color Palette Extractor tool is a secure, browser-native utility designed to help you with your daily tasks.

#### Features
- Support for color palette extractor
- Support for image

#### Functionality
Upload or enter the required data for Color Palette Extractor. Configure any available settings or options. Click the action button to process your request. Download or copy the results directly to your device.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `DropZone`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion` |
| **Shared Internal Modules** | `seo`, `tool-registry`, `hooks`, `WorkerOrchestrator` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/image-tools/color-palette-extractor/page.tsx`
- **Client Component:** `app/(tools)/image-tools/color-palette-extractor/ColorPaletteExtractorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `src/workers/WorkerOrchestrator, src/workers/karuvi.worker.ts`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/color-palette-extractor.ts`
- **Registry File:** `src/registry/tools/color-palette-extractor.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | Yes (MediaWorker) |
| **Concurrency Limit** | 3 |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Worker Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** Yes
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** Yes
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Worker

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `DropZone`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** `WorkerOrchestrator`, `karuvi.worker.ts`
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-02 (Worker Concurrency), KL-05 (AbortSignal Propagation), KL-10 (WorkerOrchestrator entry)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/image-tools/color-palette-extractor/page.tsx`
  - `app/(tools)/image-tools/color-palette-extractor/ColorPaletteExtractorClient.tsx`
  - `app/(tools)/image-tools/color-palette-extractor/ColorPaletteExtractorClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="compress"></a>Compress

#### Identity
- **ID:** `compress`
- **Name:** Compress
- **Category:** Image Tools
- **Route:** `/image-tools/compress`

#### Purpose
> Bundle files and folders into optimized ZIP archives to save storage space.

#### Features
- Support for compress
- Support for image

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell` |
| **Processing Packages** | `next` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/image-tools/compress/page.tsx`
- **Client Component:** `Not Present in Repository`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/compress.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/image-tools/compress/page.tsx`
  - `app/(tools)/image-tools/compress/layout.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="image-compress"></a>Image Compressor

#### Identity
- **ID:** `image-compress`
- **Name:** Image Compressor
- **Category:** Image Tools
- **Route:** `/image-tools/image-compressor`

#### Purpose
> 
The Image Compressor is an essential utility for anyone looking to optimize their digital presence without sacrificing visual integrity.

#### Features
- Optimizing e-commerce product photos for faster load times.
- Reducing high-resolution camera shots for web-based portfolios.
- Shrinking screenshots for email attachments or forum posts.
- Passing Core Web Vitals performance benchmarks for SEO.

#### Functionality
Select the image you want to optimize by dragging it into the upload zone or using the file picker. Adjust the 'Quality' slider to your desired level; lower quality results in smaller files, while higher quality preserves more detail. Use the live preview feature to compare the original image with the compressed version in real-time. Choose your preferred output format, such as JPEG or WebP, to further optimize for specific platforms. Click the 'Download' button once you are satisfied with the results to save the compressed image to your device.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell` |
| **Processing Packages** | `next` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/image-tools/image-compressor/page.tsx`
- **Client Component:** `app/(tools)/image-tools/image-compressor/ImageCompressorClientWrapper.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/image-compress.ts`
- **Registry File:** `src/registry/tools/image-compress.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | Yes |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Compressed file looks slightly blurry, Resolve issues relating to: Transparency is lost
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/image-tools/image-compressor/page.tsx`
  - `app/(tools)/image-tools/image-compressor/ImageCompressorClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="image-converter"></a>Image Converter

#### Identity
- **ID:** `image-converter`
- **Name:** Image Converter
- **Category:** Image Tools
- **Route:** `/image-tools/image-converter`

#### Purpose
> Convert images between JPEG, PNG, WebP, and BMP formats using the browser's Canvas API.

#### Features
- Converting a PNG screenshot to JPEG to reduce file size
- Converting WebP images downloaded from the web to JPEG for compatibility
- Preparing images in WebP format for a modern website
- Converting BMP images from legacy software to a web-friendly format

#### Functionality
Upload an image by clicking or dragging it into the tool. Select the target format from the dropdown (JPEG, PNG, WebP, BMP). Adjust quality if converting to a lossy format like JPEG or WebP. Click 'Convert' and then 'Download' to save the output.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `Toast`, `BatchQueue`, `DropZone`, `ToolSkeleton`, `SliderField`, `Accordion` |
| **Processing Packages** | `next`, `react`, `framer-motion`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `hooks`, `safe-process`, `ImageConverterControls`, `types`, `zip-utils` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/image-tools/image-converter/page.tsx`
- **Client Component:** `app/(tools)/image-tools/image-converter/ImageConverterClient.tsx`
- **Feature Directory:** `src/features/image-converter`
- **Worker File:** `src/workers/manager`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/image-converter.ts`
- **Registry File:** `src/registry/tools/image-converter.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | Yes (MediaWorker) |
| **Concurrency Limit** | 3 |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | Yes |
| **Engine Loader Usage** | No |
| **Threading Model** | Worker Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** Yes
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** Yes
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Worker

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `Toast`, `BatchQueue`, `DropZone`, `ToolSkeleton`, `SliderField`, `Accordion`
- **Shared Workers Used:** `manager`
- **Shared Stores Used:** `useBatchStore`
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Transparent PNG turns white after converting to JPEG, Resolve issues relating to: Output file is unexpectedly large
- **Manifest Safety Rules Enforced:** KL-02 (Worker Concurrency), KL-05 (AbortSignal Propagation), KL-10 (WorkerOrchestrator entry)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/image-tools/image-converter/page.tsx`
  - `app/(tools)/image-tools/image-converter/ImageConverterClient.tsx`
  - `app/(tools)/image-tools/image-converter/ImageConverterClientWrapper.tsx`
  - `app/(tools)/image-tools/image-converter/layout.tsx`
  - `src/features/image-converter/components/ImageConverterControls.tsx`
  - `src/features/image-converter/types.ts`
  - `src/features/image-converter/utils/zip-utils.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="image-crop"></a>Image Crop

#### Identity
- **ID:** `image-crop`
- **Name:** Image Crop
- **Category:** Image Tools
- **Route:** `/image-tools/image-crop`

#### Purpose
> Crop images interactively with freeform selection or locked aspect ratios (1:1, 4:3, 16:9, etc.

#### Features
- Cropping a profile photo to a square for social media
- Removing unwanted borders or watermarks from an image
- Extracting a region of interest from a screenshot
- Preparing a 16:9 thumbnail for a video upload

#### Functionality
Upload an image using the file picker. Drag the crop handles to define the crop area, or set a fixed aspect ratio. Fine-tune the crop region by dragging it. Click 'Apply Crop' to render the cropped image. Download the result.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `DropZone`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `react-image-crop` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `hooks` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/image-tools/image-crop/page.tsx`
- **Client Component:** `app/(tools)/image-tools/image-crop/ImageCropClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/image-crop.ts`
- **Registry File:** `src/registry/tools/image-crop.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | Yes |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `DropZone`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Crop area snaps back unexpectedly, Resolve issues relating to: Cropped output is blurry
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/image-tools/image-crop/page.tsx`
  - `app/(tools)/image-tools/image-crop/ImageCropClient.tsx`
  - `app/(tools)/image-tools/image-crop/ImageCropClientWrapper.tsx`
  - `app/(tools)/image-tools/image-crop/layout.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="image-resizer"></a>Image Resizer

#### Identity
- **ID:** `image-resizer`
- **Name:** Image Resizer
- **Category:** Image Tools
- **Route:** `/image-tools/image-resizer`

#### Purpose
> Resize images to exact pixel dimensions or by a percentage scale using the browser's Canvas API.

#### Features
- Resizing a profile photo to the exact dimensions required by a platform
- Reducing image dimensions before uploading to a CMS
- Creating thumbnail images for a gallery
- Preparing images at multiple resolutions for responsive design

#### Functionality
Upload your image using the file picker or drag-and-drop. Enter the desired width and/or height in pixels. Toggle 'Lock aspect ratio' to resize proportionally. Click 'Resize' to process the image. Download the resized image.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `DropZone`, `Checkbox`, `ToolInput`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `hooks`, `safe-process` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/image-tools/image-resizer/page.tsx`
- **Client Component:** `app/(tools)/image-tools/image-resizer/ImageResizerClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `src/workers/manager`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/image-resizer.ts`
- **Registry File:** `src/registry/tools/image-resizer.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | Yes (MediaWorker) |
| **Concurrency Limit** | 3 |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | Yes |
| **Engine Loader Usage** | No |
| **Threading Model** | Worker Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** Yes
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** Yes
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Worker

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `DropZone`, `Checkbox`, `ToolInput`, `ToolSkeleton`
- **Shared Workers Used:** `manager`
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Resized image appears stretched, Resolve issues relating to: Image appears rotated after resizing
- **Manifest Safety Rules Enforced:** KL-02 (Worker Concurrency), KL-05 (AbortSignal Propagation), KL-10 (WorkerOrchestrator entry)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/image-tools/image-resizer/page.tsx`
  - `app/(tools)/image-tools/image-resizer/ImageResizerClient.tsx`
  - `app/(tools)/image-tools/image-resizer/ImageResizerClientWrapper.tsx`
  - `app/(tools)/image-tools/image-resizer/layout.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="image-base64"></a>Image to Base64

#### Identity
- **ID:** `image-base64`
- **Name:** Image to Base64
- **Category:** Image Tools
- **Route:** `/image-tools/image-base64`

#### Purpose
> Convert any image file to a Base64-encoded data URI that can be embedded directly in HTML, CSS, or JSON without referencing an external file.

#### Features
- Embedding a logo in a single-file HTML email template
- Inlining a small icon in a CSS `background-image` property
- Storing an image in a JSON configuration file
- Creating a self-contained HTML page with no external assets

#### Functionality
Upload an image file using the file picker. The Base64 data URI is generated and displayed in the output field. Copy the full data URI (including the `data:image/...;base64,` prefix) for use in your code. To decode, paste a data URI into the input and click 'Decode' to download the image.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/image-tools/image-base64/page.tsx`
- **Client Component:** `app/(tools)/image-tools/image-base64/ImageBase64Client.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/image-base64.ts`
- **Registry File:** `src/registry/tools/image-base64.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | Yes |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Image does not display in the browser when using the data URI, Resolve issues relating to: Data URI is too long for the use case
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/image-tools/image-base64/page.tsx`
  - `app/(tools)/image-tools/image-base64/ImageBase64Client.tsx`
  - `app/(tools)/image-tools/image-base64/ImageBase64ClientWrapper.tsx`
  - `app/(tools)/image-tools/image-base64/layout.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="phone-mockup-generator"></a>Phone Mockup Generator

#### Identity
- **ID:** `phone-mockup-generator`
- **Name:** Phone Mockup Generator
- **Category:** Image Tools
- **Route:** `/image-tools/phone-mockup-generator`

#### Purpose
> The Phone Mockup Generator tool is a secure, browser-native utility designed to help you with your daily tasks.

#### Features
- Support for mockup
- Support for phone
- Support for iphone
- Support for android
- Support for screenshot
- Support for presentation

#### Functionality
Upload or enter the required data for Phone Mockup Generator. Configure any available settings or options. Click the action button to process your request. Download or copy the results directly to your device.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `DropZone`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `hooks` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/image-tools/phone-mockup-generator/page.tsx`
- **Client Component:** `app/(tools)/image-tools/phone-mockup-generator/PhoneMockupGeneratorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/phone-mockup-generator.ts`
- **Registry File:** `src/registry/tools/phone-mockup-generator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `DropZone`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/image-tools/phone-mockup-generator/page.tsx`
  - `app/(tools)/image-tools/phone-mockup-generator/PhoneMockupGeneratorClient.tsx`
  - `app/(tools)/image-tools/phone-mockup-generator/PhoneMockupGeneratorClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---


## Category: Media Tools

### <a id="audio-converter"></a>Audio Converter

#### Identity
- **ID:** `audio-converter`
- **Name:** Audio Converter
- **Category:** Media Tools
- **Route:** `/media-tools/audio-converter`

#### Purpose
> Convert your audio files between popular formats like WAV and MP3 entirely in your browser.

#### Features
- Converting voice memos for better compatibility
- Compressing large WAV files into smaller MP3s
- Extracting audio from supported media containers
- Pre-processing audio for web or application use

#### Functionality
Upload your source audio file. Select the desired output format (MP3 or WAV). Click 'Convert' to process the file locally. Download the converted file once ready.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton`, `MediaDropZone`, `MediaPreviewPlayer`, `MediaStatusBadge`, `MediaErrorBanner`, `MetricCard` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `hooks`, `logger` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/media-tools/audio-converter/page.tsx`
- **Client Component:** `app/(tools)/media-tools/audio-converter/AudioConverterClientWrapper.tsx`
- **Feature Directory:** `src/features/audio-converter`
- **Worker File:** `src/workers/manager`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/audio-converter.ts`
- **Registry File:** `src/registry/tools/audio-converter.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | Yes (MediaWorker) |
| **Concurrency Limit** | 3 |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Worker Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** Yes
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** Yes
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Worker

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`, `MediaDropZone`, `MediaPreviewPlayer`, `MediaStatusBadge`, `MediaErrorBanner`, `MetricCard`
- **Shared Workers Used:** `manager`
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-02 (Worker Concurrency), KL-05 (AbortSignal Propagation), KL-10 (WorkerOrchestrator entry)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/media-tools/audio-converter/page.tsx`
  - `app/(tools)/media-tools/audio-converter/AudioConverterClientWrapper.tsx`
  - `src/features/audio-converter/components/AudioConverterClient.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="gif-creator"></a>Gif Creator

#### Identity
- **ID:** `gif-creator`
- **Name:** Gif Creator
- **Category:** Media Tools
- **Route:** `/media-tools/gif-creator`

#### Purpose
> Turn your static images into professional animated GIFs.

#### Features
- Creating simple product walkthroughs
- Making memes from photos
- Building animated banners for websites
- Converting slide presentations into short animations

#### Functionality
Upload the images you want to use as frames. Drag and drop frames to reorder them as needed. Adjust the frame delay (in milliseconds). Click 'Create Animated GIF' to start the local encoding. Download your new GIF file.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton`, `DropZone`, `MetricCard`, `MediaErrorBanner` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `hooks`, `logger` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/media-tools/gif-creator/page.tsx`
- **Client Component:** `app/(tools)/media-tools/gif-creator/GifCreatorClientWrapper.tsx`
- **Feature Directory:** `src/features/gif-creator`
- **Worker File:** `src/workers/manager`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/gif-creator.ts`
- **Registry File:** `src/registry/tools/gif-creator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | Yes (MediaWorker) |
| **Concurrency Limit** | 3 |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Worker Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** Yes
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** Yes
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Worker

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`, `DropZone`, `MetricCard`, `MediaErrorBanner`
- **Shared Workers Used:** `manager`
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-02 (Worker Concurrency), KL-05 (AbortSignal Propagation), KL-10 (WorkerOrchestrator entry)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/media-tools/gif-creator/page.tsx`
  - `app/(tools)/media-tools/gif-creator/GifCreatorClientWrapper.tsx`
  - `src/features/gif-creator/components/GifCreatorClient.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="video-metadata-viewer"></a>Video Metadata Viewer

#### Identity
- **ID:** `video-metadata-viewer`
- **Name:** Video Metadata Viewer
- **Category:** Media Tools
- **Route:** `/media-tools/video-metadata-viewer`

#### Purpose
> Instantly analyze your video files to view resolution, codec, bitrate, and other technical metadata.

#### Features
- Checking the exact resolution of a video file
- Verifying video codecs for compatibility
- Analyzing bitrate to optimize storage
- Troubleshooting unplayable or corrupted video files

#### Functionality
Select or drop your video file. Wait a moment while the browser analyzes the file header. Review the detailed technical report, including codec and average bitrate. Copy the data as JSON or export it for your records.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton`, `MediaDropZone`, `MetricCard`, `MediaStatusBadge`, `MediaErrorBanner`, `Toast` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `hooks`, `utils`, `logger` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/media-tools/video-metadata-viewer/page.tsx`
- **Client Component:** `app/(tools)/media-tools/video-metadata-viewer/VideoMetadataViewerClientWrapper.tsx`
- **Feature Directory:** `src/features/video-metadata-viewer`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/video-metadata-viewer.ts`
- **Registry File:** `src/registry/tools/video-metadata-viewer.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`, `MediaDropZone`, `MetricCard`, `MediaStatusBadge`, `MediaErrorBanner`, `Toast`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/media-tools/video-metadata-viewer/page.tsx`
  - `app/(tools)/media-tools/video-metadata-viewer/VideoMetadataViewerClientWrapper.tsx`
  - `src/features/video-metadata-viewer/components/VideoMetadataViewerClient.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="video-trim"></a>Video Trim

#### Identity
- **ID:** `video-trim`
- **Name:** Video Trim
- **Category:** Media Tools
- **Route:** `/media-tools/video-trim`

#### Purpose
> Cut and trim your videos locally without any server-side processing.

#### Features
- Removing unwanted intros or outros from videos
- Creating short clips for social media sharing
- Cutting specific highlights from recorded meetings
- Trimming large video files to save storage locally

#### Functionality
Select or drop your video file (MP4, WebM, or MOV). Use the timeline sliders to select the start and end points for your trim. Preview the selection using the 'Play Selection' button. Click 'Trim Video' to generate the new file. Download your trimmed video instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton`, `MediaDropZone`, `MediaStatusBadge`, `MediaErrorBanner`, `MetricCard` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `@radix-ui/react-slider`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `hooks`, `utils`, `logger` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/media-tools/video-trim/page.tsx`
- **Client Component:** `app/(tools)/media-tools/video-trim/VideoTrimClientWrapper.tsx`
- **Feature Directory:** `src/features/video-trim`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/video-trim.ts`
- **Registry File:** `src/registry/tools/video-trim.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`, `MediaDropZone`, `MediaStatusBadge`, `MediaErrorBanner`, `MetricCard`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/media-tools/video-trim/page.tsx`
  - `app/(tools)/media-tools/video-trim/VideoTrimClientWrapper.tsx`
  - `src/features/video-trim/components/VideoTrimClient.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---


## Category: PDF Tools

### <a id="compress-pdf"></a>Compress PDF

#### Identity
- **ID:** `compress-pdf`
- **Name:** Compress PDF
- **Category:** PDF Tools
- **Route:** `/pdf-tools/compress-pdf`

#### Purpose
> 
The KaruviLab PDF Compressor is a secure, browser-native tool designed to reduce the file size of your PDF documents instantly.

#### Features
- Reducing PDF size for email attachments that exceed provider limits.
- Preparing documents for fast uploading to online job portals.
- Archiving old digital paperwork while minimizing storage usage.
- Optimizing documents for mobile viewing where bandwidth is limited.

#### Functionality
Upload: Click the 'Upload PDF' button to select your document. Configure: Choose your preferred compression level (Low, Medium, or High) based on your needs. Compress: Hit the 'Compress' button to start the local optimization process. Review & Download: Once complete, compare the original and new file sizes, then click 'Download' to save the optimized PDF to your device.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton`, `BatchQueue`, `DropZone`, `PrivacyBadge`, `WorkflowSuggestions` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `hooks`, `formatError`, `useWorkflowInput` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/pdf-tools/compress-pdf/page.tsx`
- **Client Component:** `app/(tools)/pdf-tools/compress-pdf/CompressPdfClientWrapper.tsx`
- **Feature Directory:** `src/features/compress-pdf`
- **Worker File:** `src/workers/manager`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/compress-pdf.ts`
- **Registry File:** `src/registry/tools/compress-pdf.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | Yes (HeavyWorker) |
| **Concurrency Limit** | 1 |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | Yes |
| **Engine Loader Usage** | No |
| **Threading Model** | Worker Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** Yes
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** Yes
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Worker

#### Relations & Enhancements
- **Related Tools:** `merge-pdf`, `split-pdf`, `lock-unlock-pdf`, `watermark-pdf`
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`, `BatchQueue`, `DropZone`, `PrivacyBadge`, `WorkflowSuggestions`
- **Shared Workers Used:** `manager`
- **Shared Stores Used:** `useBatchStore`
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Document text became blurry
- **Manifest Safety Rules Enforced:** KL-02 (Worker Concurrency), KL-05 (AbortSignal Propagation), KL-10 (WorkerOrchestrator entry)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/pdf-tools/compress-pdf/page.tsx`
  - `app/(tools)/pdf-tools/compress-pdf/CompressPdfClientWrapper.tsx`
  - `app/(tools)/pdf-tools/compress-pdf/layout.tsx`
  - `src/features/compress-pdf/components/CompressPdfClient.tsx`
  - `src/features/compress-pdf/index.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="convert-to-a4"></a>Convert to A4

#### Identity
- **ID:** `convert-to-a4`
- **Name:** Convert to A4
- **Category:** PDF Tools
- **Route:** `//pdf-tools/convert-to-a4`

#### Purpose
> Standardize PDF pages to A4 size

#### Features
- Support for pdf
- Support for a4
- Support for resize
- Support for layout

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolSkeleton` |
| **Processing Packages** | `next` |
| **Shared Internal Modules** | `PdfLayoutEditor` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `Not Present in Repository`
- **Client Component:** `Not Present in Repository`
- **Feature Directory:** `src/features/convert-to-a4`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/convert-to-a4.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `src/features/convert-to-a4/convert-to-a4Client.tsx`
  - `src/features/convert-to-a4/convert-to-a4ClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="convert-to-legal"></a>Convert to Legal

#### Identity
- **ID:** `convert-to-legal`
- **Name:** Convert to Legal
- **Category:** PDF Tools
- **Route:** `//pdf-tools/convert-to-legal`

#### Purpose
> Standardize PDF pages to US Legal size

#### Features
- Support for pdf
- Support for legal
- Support for resize
- Support for layout

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolSkeleton` |
| **Processing Packages** | `next` |
| **Shared Internal Modules** | `PdfLayoutEditor` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `Not Present in Repository`
- **Client Component:** `Not Present in Repository`
- **Feature Directory:** `src/features/convert-to-legal`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/convert-to-legal.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `src/features/convert-to-legal/convert-to-legalClient.tsx`
  - `src/features/convert-to-legal/convert-to-legalClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="convert-to-letter"></a>Convert to Letter

#### Identity
- **ID:** `convert-to-letter`
- **Name:** Convert to Letter
- **Category:** PDF Tools
- **Route:** `//pdf-tools/convert-to-letter`

#### Purpose
> Standardize PDF pages to US Letter size

#### Features
- Support for pdf
- Support for letter
- Support for resize
- Support for layout

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolSkeleton` |
| **Processing Packages** | `next` |
| **Shared Internal Modules** | `PdfLayoutEditor` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `Not Present in Repository`
- **Client Component:** `Not Present in Repository`
- **Feature Directory:** `src/features/convert-to-letter`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/convert-to-letter.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `src/features/convert-to-letter/convert-to-letterClient.tsx`
  - `src/features/convert-to-letter/convert-to-letterClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="crop-pdf"></a>Crop PDF

#### Identity
- **ID:** `crop-pdf`
- **Name:** Crop PDF
- **Category:** PDF Tools
- **Route:** `//pdf-tools/crop-pdf`

#### Purpose
> Crop PDF pages to a specific area

#### Features
- Support for pdf
- Support for crop
- Support for edit
- Support for layout

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolSkeleton` |
| **Processing Packages** | `next` |
| **Shared Internal Modules** | `PdfLayoutEditor` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `Not Present in Repository`
- **Client Component:** `Not Present in Repository`
- **Feature Directory:** `src/features/crop-pdf`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/crop-pdf.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | Yes |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `src/features/crop-pdf/crop-pdfClient.tsx`
  - `src/features/crop-pdf/crop-pdfClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="delete-blank-pages"></a>Delete Blank Pages

#### Identity
- **ID:** `delete-blank-pages`
- **Name:** Delete Blank Pages
- **Category:** PDF Tools
- **Route:** `/pdf-tools/delete-blank-pages`

#### Purpose
> Automatically detect and remove blank pages from your PDF document.

#### Features
- Support for delete blank pages
- Support for remove empty pages
- Support for clean pdf

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton` |
| **Processing Packages** | `next` |
| **Shared Internal Modules** | `delete-blank-pagesClientWrapper`, `seo`, `PdfOrganizer` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/pdf-tools/delete-blank-pages/page.tsx`
- **Client Component:** `Not Present in Repository`
- **Feature Directory:** `src/features/delete-blank-pages`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/delete-blank-pages.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/pdf-tools/delete-blank-pages/page.tsx`
  - `src/features/delete-blank-pages/delete-blank-pagesClient.tsx`
  - `src/features/delete-blank-pages/delete-blank-pagesClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="duplicate-pages"></a>Duplicate PDF Pages

#### Identity
- **ID:** `duplicate-pages`
- **Name:** Duplicate PDF Pages
- **Category:** PDF Tools
- **Route:** `/pdf-tools/duplicate-pages`

#### Purpose
> Duplicate and copy specific pages in a PDF document offline.

#### Features
- Support for duplicate pdf pages
- Support for copy pages
- Support for clone pages

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton` |
| **Processing Packages** | `next` |
| **Shared Internal Modules** | `duplicate-pagesClientWrapper`, `seo`, `BasicPdfEditor` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/pdf-tools/duplicate-pages/page.tsx`
- **Client Component:** `Not Present in Repository`
- **Feature Directory:** `src/features/duplicate-pages`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/duplicate-pages.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/pdf-tools/duplicate-pages/page.tsx`
  - `src/features/duplicate-pages/duplicate-pagesClient.tsx`
  - `src/features/duplicate-pages/duplicate-pagesClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="edit-metadata"></a>Edit PDF Metadata

#### Identity
- **ID:** `edit-metadata`
- **Name:** Edit PDF Metadata
- **Category:** PDF Tools
- **Route:** `//pdf-tools/edit-metadata`

#### Purpose
> View and edit PDF properties like Title, Author, and Subject

#### Features
- Support for pdf
- Support for metadata
- Support for properties
- Support for author
- Support for title

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolSkeleton` |
| **Processing Packages** | `next` |
| **Shared Internal Modules** | `MetadataEditor` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `Not Present in Repository`
- **Client Component:** `Not Present in Repository`
- **Feature Directory:** `src/features/edit-metadata`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/edit-metadata.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `src/features/edit-metadata/edit-metadataClient.tsx`
  - `src/features/edit-metadata/edit-metadataClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="even-pages-extractor"></a>Even Pages Extractor

#### Identity
- **ID:** `even-pages-extractor`
- **Name:** Even Pages Extractor
- **Category:** PDF Tools
- **Route:** `/pdf-tools/even-pages-extractor`

#### Purpose
> Extract only the even-numbered pages from a PDF document.

#### Features
- Support for extract even pages
- Support for even pages only
- Support for pdf even pages

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton` |
| **Processing Packages** | `next` |
| **Shared Internal Modules** | `even-pages-extractorClientWrapper`, `seo`, `BasicPdfEditor` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/pdf-tools/even-pages-extractor/page.tsx`
- **Client Component:** `Not Present in Repository`
- **Feature Directory:** `src/features/even-pages-extractor`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/even-pages-extractor.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/pdf-tools/even-pages-extractor/page.tsx`
  - `src/features/even-pages-extractor/even-pages-extractorClient.tsx`
  - `src/features/even-pages-extractor/even-pages-extractorClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="extract-images"></a>Extract Images

#### Identity
- **ID:** `extract-images`
- **Name:** Extract Images
- **Category:** PDF Tools
- **Route:** `/pdf-tools/extract-images`

#### Purpose
> The Extract Images tool is a specialized, high-efficiency utility built to seamlessly pull embedded images out of documents and PDF files directly within your browser.

#### Features
- Graphic designers needing to recover original high-resolution assets from a client's flattened PDF brochure.
- Researchers extracting scientific charts and diagrams from published academic papers for citation and review.
- Legal professionals separating scanned evidence photos from a large, consolidated digital case file.
- Marketing teams retrieving product images from older promotional PDFs where the original image files have been lost.

#### Functionality
Select and upload the PDF or document file containing the embedded images you wish to extract. Allow a few seconds for the local engine to parse the file structure securely within your browser. Review the gallery of extracted images that will appear in the results section below. Select individual images you wish to keep, or choose the 'Download All' option to save them as a ZIP file. Verify that the images have been saved securely to your device's local storage.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton`, `BatchQueue`, `DropZone`, `PrivacyBadge`, `WorkflowSuggestions` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `hooks`, `formatError`, `useWorkflowInput`, `WorkerOrchestrator` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/pdf-tools/extract-images/page.tsx`
- **Client Component:** `app/(tools)/pdf-tools/extract-images/ExtractImagesClientWrapper.tsx`
- **Feature Directory:** `src/features/extract-images`
- **Worker File:** `src/workers/WorkerOrchestrator, src/workers/karuvi.worker.ts`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/extract-images.ts`
- **Registry File:** `src/registry/tools/extract-images.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | Yes (HeavyWorker) |
| **Concurrency Limit** | 1 |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | Yes |
| **Engine Loader Usage** | No |
| **Threading Model** | Worker Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** Yes
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** Yes
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Worker

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`, `BatchQueue`, `DropZone`, `PrivacyBadge`, `WorkflowSuggestions`
- **Shared Workers Used:** `WorkerOrchestrator`, `karuvi.worker.ts`
- **Shared Stores Used:** `useBatchStore`
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: No images found in document, Resolve issues relating to: Browser runs out of memory
- **Manifest Safety Rules Enforced:** KL-02 (Worker Concurrency), KL-05 (AbortSignal Propagation), KL-10 (WorkerOrchestrator entry)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/pdf-tools/extract-images/page.tsx`
  - `app/(tools)/pdf-tools/extract-images/ExtractImagesClientWrapper.tsx`
  - `app/(tools)/pdf-tools/extract-images/layout.tsx`
  - `src/features/extract-images/components/ExtractImagesClient.tsx`
  - `src/features/extract-images/index.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="extract-pages"></a>Extract PDF Pages

#### Identity
- **ID:** `extract-pages`
- **Name:** Extract PDF Pages
- **Category:** PDF Tools
- **Route:** `/pdf-tools/extract-pages`

#### Purpose
> Extract specific pages or page ranges from a PDF into a new document.

#### Features
- Support for extract pdf pages
- Support for split pdf pages
- Support for save pages

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton` |
| **Processing Packages** | `next` |
| **Shared Internal Modules** | `extract-pagesClientWrapper`, `seo`, `BasicPdfEditor` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/pdf-tools/extract-pages/page.tsx`
- **Client Component:** `Not Present in Repository`
- **Feature Directory:** `src/features/extract-pages`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/extract-pages.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/pdf-tools/extract-pages/page.tsx`
  - `src/features/extract-pages/extract-pagesClient.tsx`
  - `src/features/extract-pages/extract-pagesClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="image-to-pdf"></a>Image to PDF

#### Identity
- **ID:** `image-to-pdf`
- **Name:** Image to PDF
- **Category:** PDF Tools
- **Route:** `/pdf-tools/image-to-pdf`

#### Purpose
> Combine one or more images (JPEG, PNG, WebP) into a single PDF document using pdf-lib in the browser.

#### Features
- Scanning physical documents by photographing each page
- Combining receipt photos into a single PDF for expense reporting
- Creating a photo album in PDF format
- Submitting multiple images as a single file to a portal

#### Functionality
Upload one or more images using the file picker. Drag images to reorder them as desired. Choose page size (A4, Letter) and orientation (portrait/landscape). Click 'Convert to PDF' and download the result.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton`, `DropZone` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `hooks` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/pdf-tools/image-to-pdf/page.tsx`
- **Client Component:** `app/(tools)/pdf-tools/image-to-pdf/ImageToPdfClientWrapper.tsx`
- **Feature Directory:** `src/features/image-to-pdf`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/image-to-pdf.ts`
- **Registry File:** `src/registry/tools/image-to-pdf.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | Yes |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`, `DropZone`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Images appear rotated in the PDF, Resolve issues relating to: PDF file is very large
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/pdf-tools/image-to-pdf/page.tsx`
  - `app/(tools)/pdf-tools/image-to-pdf/ImageToPdfClientWrapper.tsx`
  - `app/(tools)/pdf-tools/image-to-pdf/layout.tsx`
  - `src/features/image-to-pdf/components/ImageToPdfClient.tsx`
  - `src/features/image-to-pdf/index.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="lock-unlock-pdf"></a>Lock / Unlock PDF

#### Identity
- **ID:** `lock-unlock-pdf`
- **Name:** Lock / Unlock PDF
- **Category:** PDF Tools
- **Route:** `/pdf-tools/lock-unlock`

#### Purpose
> The Lock/Unlock PDF tool is an enterprise-grade security utility that empowers you to encrypt or decrypt PDF documents securely within your browser.

#### Features
- HR professionals encrypting employee tax documents and payroll records before distributing them via email.
- Individuals removing passwords from their monthly utility bills so they can easily merge them into a personal archive.
- Lawyers securing confidential case files to ensure that only authorized parties with the password can review the evidence.
- Freelancers locking their invoice PDFs to prevent accidental modifications by clients during the payment process.

#### Functionality
Upload the PDF document you wish to either lock with a password or unlock. Select the desired action: 'Lock PDF' to add security, or 'Unlock PDF' to remove existing protections. Enter the required password. For locking, create a strong password; for unlocking, enter the current valid password. Click the action button to process the cryptography locally on your device. Download the newly secured or decrypted PDF directly to your local file system.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton` |
| **Processing Packages** | `next` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/pdf-tools/lock-unlock/page.tsx`
- **Client Component:** `app/(tools)/pdf-tools/lock-unlock/LockUnlockPdfClientWrapper.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/lock-unlock-pdf.ts`
- **Registry File:** `src/registry/tools/lock-unlock-pdf.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | Yes |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Incorrect Password Error, Resolve issues relating to: Corrupted PDF File
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/pdf-tools/lock-unlock/page.tsx`
  - `app/(tools)/pdf-tools/lock-unlock/LockUnlockPdfClientWrapper.tsx`
  - `app/(tools)/pdf-tools/lock-unlock/layout.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="margin-adjustment"></a>Margin Adjustment

#### Identity
- **ID:** `margin-adjustment`
- **Name:** Margin Adjustment
- **Category:** PDF Tools
- **Route:** `//pdf-tools/margin-adjustment`

#### Purpose
> Adjust margins of PDF pages

#### Features
- Support for pdf
- Support for margin
- Support for padding
- Support for layout

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolSkeleton` |
| **Processing Packages** | `next` |
| **Shared Internal Modules** | `PdfLayoutEditor` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `Not Present in Repository`
- **Client Component:** `Not Present in Repository`
- **Feature Directory:** `src/features/margin-adjustment`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/margin-adjustment.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `src/features/margin-adjustment/margin-adjustmentClient.tsx`
  - `src/features/margin-adjustment/margin-adjustmentClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="merge-pdf"></a>Merge PDF

#### Identity
- **ID:** `merge-pdf`
- **Name:** Merge PDF
- **Category:** PDF Tools
- **Route:** `/pdf-tools/merge-pdf`

#### Purpose
> Combine multiple PDF files into a single document in any order using pdf-lib running in your browser.

#### Features
- Combining multiple invoice PDFs into a single monthly report
- Assembling chapters of a document written in separate files
- Merging a cover page with a main document
- Combining form pages before submission

#### Functionality
Upload two or more PDF files using the file picker or drag-and-drop. Drag the files in the list to set the desired page order. Click 'Merge PDFs'. Download the merged PDF when processing completes.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton`, `DropZone`, `WorkflowSuggestions` |
| **Processing Packages** | `next`, `react`, `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `ProgressContext`, `hooks`, `useWorkflowInput` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/pdf-tools/merge-pdf/page.tsx`
- **Client Component:** `app/(tools)/pdf-tools/merge-pdf/MergePdfClientWrapper.tsx`
- **Feature Directory:** `src/features/merge-pdf`
- **Worker File:** `src/workers/manager, src/workers/types`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/merge-pdf.ts`
- **Registry File:** `src/registry/tools/merge-pdf.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | Yes (HeavyWorker) |
| **Concurrency Limit** | 1 |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | Yes |
| **Engine Loader Usage** | No |
| **Threading Model** | Worker Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** Yes
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Size > 30
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** Yes
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Worker

#### Relations & Enhancements
- **Related Tools:** `split-pdf`, `compress-pdf`, `page-numbering`
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`, `DropZone`, `WorkflowSuggestions`
- **Shared Workers Used:** `manager`, `types`
- **Shared Stores Used:** `useWorkflowStore`
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Some pages are blank in the merged PDF, Resolve issues relating to: Merge fails with a large number of files
- **Manifest Safety Rules Enforced:** KL-02 (Worker Concurrency), KL-05 (AbortSignal Propagation), KL-10 (WorkerOrchestrator entry)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/pdf-tools/merge-pdf/page.tsx`
  - `app/(tools)/pdf-tools/merge-pdf/MergePdfClientWrapper.tsx`
  - `app/(tools)/pdf-tools/merge-pdf/layout.tsx`
  - `src/features/merge-pdf/components/MergePdfClient.tsx`
  - `src/features/merge-pdf/index.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="move-pages"></a>Move PDF Pages

#### Identity
- **ID:** `move-pages`
- **Name:** Move PDF Pages
- **Category:** PDF Tools
- **Route:** `/pdf-tools/move-pages`

#### Purpose
> Drag and drop to move pages around in your PDF document.

#### Features
- Support for move pdf pages
- Support for shift pages
- Support for pdf order

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton` |
| **Processing Packages** | `next` |
| **Shared Internal Modules** | `move-pagesClientWrapper`, `seo`, `PdfOrganizer` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/pdf-tools/move-pages/page.tsx`
- **Client Component:** `Not Present in Repository`
- **Feature Directory:** `src/features/move-pages`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/move-pages.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/pdf-tools/move-pages/page.tsx`
  - `src/features/move-pages/move-pagesClient.tsx`
  - `src/features/move-pages/move-pagesClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="odd-pages-extractor"></a>Odd Pages Extractor

#### Identity
- **ID:** `odd-pages-extractor`
- **Name:** Odd Pages Extractor
- **Category:** PDF Tools
- **Route:** `/pdf-tools/odd-pages-extractor`

#### Purpose
> Extract only the odd-numbered pages from a PDF document.

#### Features
- Support for extract odd pages
- Support for odd pages only
- Support for pdf odd pages

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton` |
| **Processing Packages** | `next` |
| **Shared Internal Modules** | `odd-pages-extractorClientWrapper`, `seo`, `BasicPdfEditor` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/pdf-tools/odd-pages-extractor/page.tsx`
- **Client Component:** `Not Present in Repository`
- **Feature Directory:** `src/features/odd-pages-extractor`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/odd-pages-extractor.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/pdf-tools/odd-pages-extractor/page.tsx`
  - `src/features/odd-pages-extractor/odd-pages-extractorClient.tsx`
  - `src/features/odd-pages-extractor/odd-pages-extractorClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="organize-pdf"></a>Organize PDF

#### Identity
- **ID:** `organize-pdf`
- **Name:** Organize PDF
- **Category:** PDF Tools
- **Route:** `/pdf-tools/organize-pdf`

#### Purpose
> Sort, reorder, and organize pages in your PDF document visually.

#### Features
- Support for organize pdf
- Support for rearrange pages
- Support for sort pdf

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton` |
| **Processing Packages** | `next` |
| **Shared Internal Modules** | `organize-pdfClientWrapper`, `seo`, `PdfOrganizer` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/pdf-tools/organize-pdf/page.tsx`
- **Client Component:** `Not Present in Repository`
- **Feature Directory:** `src/features/organize-pdf`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/organize-pdf.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | Yes |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/pdf-tools/organize-pdf/page.tsx`
  - `src/features/organize-pdf/organize-pdfClient.tsx`
  - `src/features/organize-pdf/organize-pdfClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="page-numbering"></a>Page Numbering

#### Identity
- **ID:** `page-numbering`
- **Name:** Page Numbering
- **Category:** PDF Tools
- **Route:** `/pdf-tools/page-numbering`

#### Purpose
> The Page Numbering tool is an essential document formatting utility designed to seamlessly stamp page numbers onto your PDFs directly in your browser.

#### Features
- University students formatting their final dissertations according to strict academic submission guidelines.
- Legal professionals ensuring that court briefs have sequential, easily referenceable page numbers across multiple merged documents.
- Corporate administrative assistants adding professional 'Page X of Y' markers to board meeting presentations.
- Authors finalizing manuscripts for self-publishing by ensuring accurate pagination for the table of contents.

#### Functionality
Upload the PDF document that requires page numbering. Configure the numbering settings, including the starting number, position (e.g., bottom-right), and format. Click the action button to apply the page numbers locally to the document. Preview the modified document to ensure the numbers are placed correctly. Download the updated PDF file directly to your device's local storage.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton`, `SliderField` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `hooks` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/pdf-tools/page-numbering/page.tsx`
- **Client Component:** `app/(tools)/pdf-tools/page-numbering/PageNumberingClientWrapper.tsx`
- **Feature Directory:** `src/features/page-numbering`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/page-numbering.ts`
- **Registry File:** `src/registry/tools/page-numbering.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`, `SliderField`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Numbers overlapping text, Resolve issues relating to: Encrypted PDF Error
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/pdf-tools/page-numbering/page.tsx`
  - `app/(tools)/pdf-tools/page-numbering/PageNumberingClientWrapper.tsx`
  - `app/(tools)/pdf-tools/page-numbering/layout.tsx`
  - `src/features/page-numbering/components/PageNumberingClient.tsx`
  - `src/features/page-numbering/index.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="page-size-converter"></a>Page Size Converter

#### Identity
- **ID:** `page-size-converter`
- **Name:** Page Size Converter
- **Category:** PDF Tools
- **Route:** `//pdf-tools/page-size-converter`

#### Purpose
> Convert PDF pages to a specific size

#### Features
- Support for pdf
- Support for resize
- Support for scale
- Support for layout

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolSkeleton` |
| **Processing Packages** | `next` |
| **Shared Internal Modules** | `PdfLayoutEditor` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `Not Present in Repository`
- **Client Component:** `Not Present in Repository`
- **Feature Directory:** `src/features/page-size-converter`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/page-size-converter.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `src/features/page-size-converter/page-size-converterClient.tsx`
  - `src/features/page-size-converter/page-size-converterClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="pdf-editor"></a>PDF Editor

#### Identity
- **ID:** `pdf-editor`
- **Name:** PDF Editor
- **Category:** PDF Tools
- **Route:** `/pdf-tools/pdf-editor`

#### Purpose
> View and annotate PDF documents

#### Features
- Support for pdf
- Support for editor
- Support for annotate
- Support for draw
- Support for text
- Support for black out

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton`, `DropZone` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, `zustand` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `ProgressContext`, `hooks` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/pdf-tools/pdf-editor/page.tsx`
- **Client Component:** `app/(tools)/pdf-tools/pdf-editor/PdfEditorClientWrapper.tsx`
- **Feature Directory:** `src/features/pdf-editor`
- **Worker File:** `src/workers/manager`
- **Zustand Store:** `src/features/pdf-editor/store.ts`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/pdf-editor.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | Yes (HeavyWorker) |
| **Concurrency Limit** | 1 |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | Yes |
| **Engine Loader Usage** | No |
| **Threading Model** | Worker Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** Yes
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** 50 * 1024 * 1024
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** Yes
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Worker

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`, `DropZone`
- **Shared Workers Used:** `manager`
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-02 (Worker Concurrency), KL-05 (AbortSignal Propagation), KL-10 (WorkerOrchestrator entry)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/pdf-tools/pdf-editor/page.tsx`
  - `app/(tools)/pdf-tools/pdf-editor/PdfEditorClientWrapper.tsx`
  - `app/(tools)/pdf-tools/pdf-editor/layout.tsx`
  - `src/features/pdf-editor/components/AnnotationLayer.tsx`
  - `src/features/pdf-editor/components/EditorCanvas.tsx`
  - `src/features/pdf-editor/components/PdfEditorClient.tsx`
  - `src/features/pdf-editor/components/PdfWorkspace.tsx`
  - `src/features/pdf-editor/components/ThumbnailSidebar.tsx`
  - `src/features/pdf-editor/index.ts`
  - `src/features/pdf-editor/store.ts`
  - `src/features/pdf-editor/utils/device.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="pdf-to-image"></a>PDF to Image

#### Identity
- **ID:** `pdf-to-image`
- **Name:** PDF to Image
- **Category:** PDF Tools
- **Route:** `/pdf-tools/pdf-to-image`

#### Purpose
> The PDF to Image tool is a specialized, high-efficiency utility built to seamlessly convert PDF pages into JPG or PNG images directly within your browser.

#### Features
- Graphic designers needing to convert a PDF into individual image layers.
- Marketing teams retrieving product images from older promotional PDFs where the original image files have been lost.

#### Functionality
Select and upload the PDF you wish to convert. Choose your desired output format (JPG or PNG) and select the pages you want to extract. Allow a few seconds for the local engine to render the pages securely within your browser. Review the gallery of converted images that will appear in the results section below. Select individual images you wish to keep, or choose the 'Download All' option to save them as a ZIP file.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton`, `EngineLoader`, `DropZone` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `hooks`, `logger`, `EngineLoader` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/pdf-tools/pdf-to-image/page.tsx`
- **Client Component:** `app/(tools)/pdf-tools/pdf-to-image/PdfToImageClientWrapper.tsx`
- **Feature Directory:** `src/features/pdf-to-image`
- **Worker File:** `src/workers/manager`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/pdf-to-image.ts`
- **Registry File:** `src/registry/tools/pdf-to-image.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | Yes (HeavyWorker) |
| **Concurrency Limit** | 1 |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | Yes |
| **Engine Loader Usage** | Yes |
| **Threading Model** | Worker Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** Yes
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** Yes
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Worker

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`, `EngineLoader`, `DropZone`
- **Shared Workers Used:** `manager`
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Browser runs out of memory
- **Manifest Safety Rules Enforced:** KL-02 (Worker Concurrency), KL-05 (AbortSignal Propagation), KL-10 (WorkerOrchestrator entry)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/pdf-tools/pdf-to-image/page.tsx`
  - `app/(tools)/pdf-tools/pdf-to-image/PdfToImageClientWrapper.tsx`
  - `src/features/pdf-to-image/components/PdfToImageClient.tsx`
  - `src/features/pdf-to-image/index.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="pdf-to-word"></a>PDF to Word

#### Identity
- **ID:** `pdf-to-word`
- **Name:** PDF to Word
- **Category:** PDF Tools
- **Route:** `/pdf-tools/pdf-to-word`

#### Purpose
> 
The PDF to Word Converter is a sophisticated, browser-native utility designed to bridge the gap between static documents and editable content.

#### Features
- Support for pdf
- Support for word
- Support for docx
- Support for convert

#### Functionality
Select the PDF file you wish to convert by clicking the 'Upload PDF' button or dragging and dropping the file. Review the file details to ensure you have selected the correct document. Click the 'Convert to Word' button to initiate the local transformation process. Wait a few seconds for the tool to parse the document and generate the editable file. Click the 'Download Word Document' button to save the converted .docx file to your computer.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton`, `CopyButton`, `Toast`, `EngineLoader` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `hooks`, `logger`, `ProgressContext`, `EngineLoader`, `WorkerOrchestrator` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/pdf-tools/pdf-to-word/page.tsx`
- **Client Component:** `app/(tools)/pdf-tools/pdf-to-word/PdfToWordClientWrapper.tsx`
- **Feature Directory:** `src/features/pdf-to-word`
- **Worker File:** `src/workers/WorkerOrchestrator, src/workers/karuvi.worker.ts`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/pdf-to-word.ts`
- **Registry File:** `src/registry/tools/pdf-to-word.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | Yes (HeavyWorker) |
| **Concurrency Limit** | 1 |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | Yes |
| **Engine Loader Usage** | Yes |
| **Threading Model** | Worker Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** Yes
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** Yes
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Worker

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`, `CopyButton`, `Toast`, `EngineLoader`
- **Shared Workers Used:** `WorkerOrchestrator`, `karuvi.worker.ts`
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-02 (Worker Concurrency), KL-05 (AbortSignal Propagation), KL-10 (WorkerOrchestrator entry)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/pdf-tools/pdf-to-word/page.tsx`
  - `app/(tools)/pdf-tools/pdf-to-word/PdfToWordClientWrapper.tsx`
  - `app/(tools)/pdf-tools/pdf-to-word/layout.tsx`
  - `src/features/pdf-to-word/components/PdfToWordClient.tsx`
  - `src/features/pdf-to-word/index.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="remove-metadata"></a>Remove PDF Metadata

#### Identity
- **ID:** `remove-metadata`
- **Name:** Remove PDF Metadata
- **Category:** PDF Tools
- **Route:** `//pdf-tools/remove-metadata`

#### Purpose
> Clear all metadata and properties from a PDF document

#### Features
- Support for pdf
- Support for metadata
- Support for properties
- Support for remove
- Support for clear
- Support for privacy

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolSkeleton` |
| **Processing Packages** | `next` |
| **Shared Internal Modules** | `MetadataEditor` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `Not Present in Repository`
- **Client Component:** `Not Present in Repository`
- **Feature Directory:** `src/features/remove-metadata`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/remove-metadata.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `src/features/remove-metadata/remove-metadataClient.tsx`
  - `src/features/remove-metadata/remove-metadataClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="remove-pages"></a>Remove PDF Pages

#### Identity
- **ID:** `remove-pages`
- **Name:** Remove PDF Pages
- **Category:** PDF Tools
- **Route:** `/pdf-tools/remove-pages`

#### Purpose
> Easily delete and remove unwanted pages from any PDF document offline.

#### Features
- Support for remove pdf pages
- Support for delete pdf pages
- Support for extract

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton` |
| **Processing Packages** | `next` |
| **Shared Internal Modules** | `remove-pagesClientWrapper`, `seo`, `BasicPdfEditor` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/pdf-tools/remove-pages/page.tsx`
- **Client Component:** `Not Present in Repository`
- **Feature Directory:** `src/features/remove-pages`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/remove-pages.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/pdf-tools/remove-pages/page.tsx`
  - `src/features/remove-pages/remove-pagesClient.tsx`
  - `src/features/remove-pages/remove-pagesClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="reorder-pages"></a>Reorder PDF Pages

#### Identity
- **ID:** `reorder-pages`
- **Name:** Reorder PDF Pages
- **Category:** PDF Tools
- **Route:** `/pdf-tools/reorder-pages`

#### Purpose
> Easily reorder the pages of your PDF document.

#### Features
- Support for reorder pdf pages
- Support for change page order
- Support for move pages

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton` |
| **Processing Packages** | `next` |
| **Shared Internal Modules** | `reorder-pagesClientWrapper`, `seo`, `PdfOrganizer` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/pdf-tools/reorder-pages/page.tsx`
- **Client Component:** `Not Present in Repository`
- **Feature Directory:** `src/features/reorder-pages`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/reorder-pages.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/pdf-tools/reorder-pages/page.tsx`
  - `src/features/reorder-pages/reorder-pagesClient.tsx`
  - `src/features/reorder-pages/reorder-pagesClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="reverse-pages"></a>Reverse PDF Pages

#### Identity
- **ID:** `reverse-pages`
- **Name:** Reverse PDF Pages
- **Category:** PDF Tools
- **Route:** `/pdf-tools/reverse-pages`

#### Purpose
> Reverse the order of pages in a PDF document instantly.

#### Features
- Support for reverse pdf
- Support for reverse page order
- Support for flip pages

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton` |
| **Processing Packages** | `next` |
| **Shared Internal Modules** | `reverse-pagesClientWrapper`, `seo`, `BasicPdfEditor` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/pdf-tools/reverse-pages/page.tsx`
- **Client Component:** `Not Present in Repository`
- **Feature Directory:** `src/features/reverse-pages`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/reverse-pages.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/pdf-tools/reverse-pages/page.tsx`
  - `src/features/reverse-pages/reverse-pagesClient.tsx`
  - `src/features/reverse-pages/reverse-pagesClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="rotate-pdf"></a>Rotate PDF

#### Identity
- **ID:** `rotate-pdf`
- **Name:** Rotate PDF
- **Category:** PDF Tools
- **Route:** `/pdf-tools/rotate-pdf`

#### Purpose
> The Rotate PDF tool is a highly efficient utility designed to instantly correct the orientation of your PDF pages directly within your browser.

#### Features
- Administrative staff fixing large batches of incorrectly oriented documents generated by legacy scanning hardware.
- Accounting professionals rotating sideways photos of expense receipts before submitting them for reimbursement.
- Students adjusting specific landscape diagram pages in their digital textbooks for easier reading on a tablet.
- Legal assistants ensuring all pages of a digital evidence binder are uniformly oriented in portrait mode before court submission.

#### Functionality
Upload the PDF document that contains pages needing rotation. Select whether you want to rotate all pages in the document or select specific individual pages. Choose the rotation direction: 90 degrees clockwise, 90 degrees counter-clockwise, or 180 degrees. Click the action button to apply the rotation locally using your device's processing power. Download the newly oriented PDF file directly to your local file system.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton`, `Checkbox`, `PdfPagePreview` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `hooks`, `ProgressContext` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/pdf-tools/rotate-pdf/page.tsx`
- **Client Component:** `app/(tools)/pdf-tools/rotate-pdf/RotatePdfClientWrapper.tsx`
- **Feature Directory:** `src/features/rotate-pdf`
- **Worker File:** `src/workers/manager`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/rotate-pdf.ts`
- **Registry File:** `src/registry/tools/rotate-pdf.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | Yes (HeavyWorker) |
| **Concurrency Limit** | 1 |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | Yes |
| **Engine Loader Usage** | No |
| **Threading Model** | Worker Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** Yes
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** Yes
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Worker

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`, `Checkbox`, `PdfPagePreview`
- **Shared Workers Used:** `manager`
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Encrypted PDF Error, Resolve issues relating to: Visual Cache Not Updating
- **Manifest Safety Rules Enforced:** KL-02 (Worker Concurrency), KL-05 (AbortSignal Propagation), KL-10 (WorkerOrchestrator entry)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/pdf-tools/rotate-pdf/page.tsx`
  - `app/(tools)/pdf-tools/rotate-pdf/RotatePdfClientWrapper.tsx`
  - `app/(tools)/pdf-tools/rotate-pdf/layout.tsx`
  - `src/features/rotate-pdf/components/RotatePdfClient.tsx`
  - `src/features/rotate-pdf/index.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="rotate-selected-pages"></a>Rotate Selected Pages

#### Identity
- **ID:** `rotate-selected-pages`
- **Name:** Rotate Selected Pages
- **Category:** PDF Tools
- **Route:** `/pdf-tools/rotate-selected-pages`

#### Purpose
> Rotate specific pages in your PDF without rotating the whole document.

#### Features
- Support for rotate specific pages
- Support for rotate pdf pages
- Support for pdf page rotation

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton` |
| **Processing Packages** | `next` |
| **Shared Internal Modules** | `rotate-selected-pagesClientWrapper`, `seo`, `PdfOrganizer` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/pdf-tools/rotate-selected-pages/page.tsx`
- **Client Component:** `Not Present in Repository`
- **Feature Directory:** `src/features/rotate-selected-pages`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/rotate-selected-pages.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/pdf-tools/rotate-selected-pages/page.tsx`
  - `src/features/rotate-selected-pages/rotate-selected-pagesClient.tsx`
  - `src/features/rotate-selected-pages/rotate-selected-pagesClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="split-pdf"></a>Split PDF

#### Identity
- **ID:** `split-pdf`
- **Name:** Split PDF
- **Category:** PDF Tools
- **Route:** `//pdf-tools/split-pdf`

#### Purpose
> Extract specific pages or page ranges from a PDF to create new, smaller documents.

#### Features
- Extracting a single chapter from a large eBook PDF
- Sharing specific slides from a PDF presentation
- Separating receipts from a merged expense report
- Extracting a signed signature page from a contract

#### Functionality
Upload your PDF file. Enter the pages or page ranges to extract (e.g., `1-3, 5, 8-10`). Click 'Split'. Download the extracted pages as a new PDF.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `Checkbox`, `ToolInput`, `DropZone`, `PrivacyBadge` |
| **Processing Packages** | `react` |
| **Shared Internal Modules** | `tool-registry`, `hooks`, `ProgressContext` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `Not Present in Repository`
- **Client Component:** `Not Present in Repository`
- **Feature Directory:** `src/features/split-pdf`
- **Worker File:** `src/workers/manager, src/workers/types`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/split-pdf.ts`
- **Registry File:** `src/registry/tools/split-pdf.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | Yes (HeavyWorker) |
| **Concurrency Limit** | 1 |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | Yes |
| **Engine Loader Usage** | No |
| **Threading Model** | Worker Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** Yes
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** Yes
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Worker

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `Checkbox`, `ToolInput`, `DropZone`, `PrivacyBadge`
- **Shared Workers Used:** `manager`, `types`
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Entered page number is out of range, Resolve issues relating to: Downloaded ZIP is empty
- **Manifest Safety Rules Enforced:** KL-02 (Worker Concurrency), KL-05 (AbortSignal Propagation), KL-10 (WorkerOrchestrator entry)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `src/features/split-pdf/components/SplitPdfClient.tsx`
  - `src/features/split-pdf/index.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="watermark-pdf"></a>Watermark PDF

#### Identity
- **ID:** `watermark-pdf`
- **Name:** Watermark PDF
- **Category:** PDF Tools
- **Route:** `/pdf-tools/watermark-pdf`

#### Purpose
> The Watermark PDF tool is a powerful document protection utility that allows you to overlay custom text onto your PDFs entirely within your browser.

#### Features
- Legal professionals applying a 'CONFIDENTIAL' watermark to sensitive case files before sharing them with opposing counsel.
- Authors and writers stamping 'DRAFT' on unfinished manuscripts to ensure beta readers do not mistake them for final versions.
- Graphic designers adding a copyright notice to PDF portfolios to deter unauthorized use of their creative work.
- Corporate executives marking internal memos as 'INTERNAL USE ONLY' to prevent accidental leaks by employees.

#### Functionality
Upload the PDF document you wish to protect with a watermark. Enter the text you want to use for the watermark (e.g., 'CONFIDENTIAL' or 'DRAFT'). Adjust the formatting options, including font size, color, opacity, and rotation angle. Click the action button to apply the watermark locally to all pages in the document. Preview the result and download the watermarked PDF directly to your device.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton`, `BatchQueue`, `DropZone`, `PrivacyBadge`, `SliderField`, `WorkflowSuggestions` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `hooks`, `formatError`, `useWorkflowInput` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/pdf-tools/watermark-pdf/page.tsx`
- **Client Component:** `app/(tools)/pdf-tools/watermark-pdf/WatermarkPdfClientWrapper.tsx`
- **Feature Directory:** `src/features/watermark-pdf`
- **Worker File:** `src/workers/manager`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/watermark-pdf.ts`
- **Registry File:** `src/registry/tools/watermark-pdf.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | Yes (HeavyWorker) |
| **Concurrency Limit** | 1 |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | Yes |
| **Engine Loader Usage** | No |
| **Threading Model** | Worker Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** Yes
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** Yes
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Worker

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`, `BatchQueue`, `DropZone`, `PrivacyBadge`, `SliderField`, `WorkflowSuggestions`
- **Shared Workers Used:** `manager`
- **Shared Stores Used:** `useBatchStore`
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Watermark Too Dark, Resolve issues relating to: Encrypted PDF Error
- **Manifest Safety Rules Enforced:** KL-02 (Worker Concurrency), KL-05 (AbortSignal Propagation), KL-10 (WorkerOrchestrator entry)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/pdf-tools/watermark-pdf/page.tsx`
  - `app/(tools)/pdf-tools/watermark-pdf/WatermarkPdfClientWrapper.tsx`
  - `app/(tools)/pdf-tools/watermark-pdf/layout.tsx`
  - `src/features/watermark-pdf/components/WatermarkPdfClient.tsx`
  - `src/features/watermark-pdf/index.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="word-to-pdf"></a>Word To Pdf

#### Identity
- **ID:** `word-to-pdf`
- **Name:** Word To Pdf
- **Category:** PDF Tools
- **Route:** `/pdf-tools/word-to-pdf`

#### Purpose
> Convert Word documents (DOCX) into standard PDF files locally.

#### Features
- Support for word to pdf
- Support for pdf

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton`, `Toast`, `DropZone` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `hooks`, `ProgressContext`, `WorkerOrchestrator` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/pdf-tools/word-to-pdf/page.tsx`
- **Client Component:** `app/(tools)/pdf-tools/word-to-pdf/WordToPdfClientWrapper.tsx`
- **Feature Directory:** `src/features/word-to-pdf`
- **Worker File:** `src/workers/WorkerOrchestrator, src/workers/karuvi.worker.ts`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/word-to-pdf.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | Yes (HeavyWorker) |
| **Concurrency Limit** | 1 |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | Yes |
| **Engine Loader Usage** | No |
| **Threading Model** | Worker Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** Yes
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** Yes
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Worker

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`, `Toast`, `DropZone`
- **Shared Workers Used:** `WorkerOrchestrator`, `karuvi.worker.ts`
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-02 (Worker Concurrency), KL-05 (AbortSignal Propagation), KL-10 (WorkerOrchestrator entry)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/pdf-tools/word-to-pdf/page.tsx`
  - `app/(tools)/pdf-tools/word-to-pdf/WordToPdfClientWrapper.tsx`
  - `src/features/word-to-pdf/components/WordToPdfClient.tsx`
  - `src/features/word-to-pdf/index.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---


## Category: Productivity

### <a id="calendar"></a>Calendar

#### Identity
- **ID:** `calendar`
- **Name:** Calendar
- **Category:** Productivity
- **Route:** `/productivity/calendar`

#### Purpose
> The Calendar tool provides a comprehensive, interactive date management and scheduling utility entirely within your browser.

#### Features
- Project Managers calculating the total number of working days available before a major milestone.
- Event Planners checking future weekdays for scheduling conferences or weddings.
- Developers needing to verify leap years or epoch timestamps for their coding projects.
- Students organizing their study schedules by accurately determining the remaining weeks before final exams.

#### Functionality
Navigate to the Calendar tool interface from the main dashboard. Select the target month and year using the intuitive navigation controls. Click on any specific date to view detailed properties, such as day of the year or week number. Utilize the built-in duration calculator by picking a start date and an end date. Review the generated results instantly on the screen without any page reloads.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton`, `Toast`, `ToolInput`, `Checkbox` |
| **Processing Packages** | `next`, `react`, `framer-motion`, `date-fns`, `zustand`, `lucide-react`, `@radix-ui/react-toggle-group`, `@radix-ui/react-popover`, `@radix-ui/react-dialog` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `utils`, `useDragScroll`, `blob-manager`, `blobManager`, `db` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/productivity/calendar/page.tsx`
- **Client Component:** `app/(tools)/productivity/calendar/ToolClientWrapper.tsx`
- **Feature Directory:** `src/features/calendar`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `src/features/calendar/store.ts`
- **Content File:** `src/content/tools/calendar.ts`
- **Registry File:** `src/registry/tools/calendar.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** Notifications

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`, `Toast`, `ToolInput`, `Checkbox`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Invalid Date Format, Resolve issues relating to: End Date Before Start Date
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/productivity/calendar/page.tsx`
  - `app/(tools)/productivity/calendar/ToolClientWrapper.tsx`
  - `src/features/calendar/CalendarPage.tsx`
  - `src/features/calendar/components/AgendaView.tsx`
  - `src/features/calendar/components/CalendarHeader.tsx`
  - `src/features/calendar/components/CalendarSidebar.tsx`
  - `src/features/calendar/components/DayDetailsSheet.tsx`
  - `src/features/calendar/components/DayView.tsx`
  - `src/features/calendar/components/EventModal.tsx`
  - `src/features/calendar/components/MiniCalendar.tsx`
  - `src/features/calendar/components/MonthView.tsx`
  - `src/features/calendar/components/SearchModal.tsx`
  - `src/features/calendar/components/TimeGridView.tsx`
  - `src/features/calendar/components/WeekView.tsx`
  - `src/features/calendar/components/WorldEventPanel.tsx`
  - `src/features/calendar/components/YearView.tsx`
  - `src/features/calendar/constants.ts`
  - `src/features/calendar/data/static-data.ts`
  - `src/features/calendar/event-resolver.ts`
  - `src/features/calendar/hooks/useReminders.ts`
  - `src/features/calendar/store.ts`
  - `src/features/calendar/types.ts`
  - `src/features/calendar/utils/ics.ts`
  - `src/features/calendar/utils/layout-solver.ts`
  - `src/features/calendar/utils/recurrence.ts`
  - `src/features/calendar/utils.ts`
  - `src/features/calendar/world-events-db.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="chart-generator"></a>Chart & Graph Generator

#### Identity
- **ID:** `chart-generator`
- **Name:** Chart & Graph Generator
- **Category:** Productivity
- **Route:** `/productivity/chart-generator`

#### Purpose
> 
The KaruviLab Chart & Graph Generator is a professional-grade visualization utility designed to transform raw data into beautiful, production-ready charts instantly.

#### Features
- Visualizing monthly budget breakdowns and expense categories.
- Creating clear data representations for academic or business reports.
- Generating quick trend lines for project milestones and progress tracking.
- Designing social-media-ready data snippets with a clean, modern aesthetic.

#### Functionality
Input Your Data: Use the sidebar to add data points with labels and numerical values. Choose Your Chart Type: Toggle between Bar, Pie, Doughnut, and Line charts using the selector at the top. Customize Styles: Select from pre-defined professional color palettes or assign custom colors to specific data points. Export and Share: Download your finished visualization as a high-resolution PNG for documents or a perfectly scalable SVG for web and design projects.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `Toast`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `utils` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/productivity/chart-generator/page.tsx`
- **Client Component:** `app/(tools)/productivity/chart-generator/ChartGeneratorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/chart-generator.ts`
- **Registry File:** `src/registry/tools/chart-generator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `Toast`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/productivity/chart-generator/page.tsx`
  - `app/(tools)/productivity/chart-generator/ChartControls.tsx`
  - `app/(tools)/productivity/chart-generator/ChartGeneratorClient.tsx`
  - `app/(tools)/productivity/chart-generator/ChartGeneratorClientWrapper.tsx`
  - `app/(tools)/productivity/chart-generator/ChartPreview.tsx`
  - `app/(tools)/productivity/chart-generator/types.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="countdown-timer"></a>Countdown Timer

#### Identity
- **ID:** `countdown-timer`
- **Name:** Countdown Timer
- **Category:** Productivity
- **Route:** `/productivity/countdown-timer`

#### Purpose
> Set timers for upcoming milestones or deadlines to keep track of tasks.

#### Features
- Support for countdown timer
- Support for productivity

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `@radix-ui/react-popover`, `zustand` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `utils`, `FullscreenContext`, `notifications` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/productivity/countdown-timer/page.tsx`
- **Client Component:** `app/(tools)/productivity/countdown-timer/CountdownTimerClient.tsx`
- **Feature Directory:** `src/features/countdown-timer`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `src/features/countdown-timer/store.ts`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/countdown-timer.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | Yes |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** Notifications

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** Yes
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/productivity/countdown-timer/page.tsx`
  - `app/(tools)/productivity/countdown-timer/CountdownTimerClient.tsx`
  - `app/(tools)/productivity/countdown-timer/CountdownTimerClientWrapper.tsx`
  - `src/features/countdown-timer/store.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="notes"></a>Notes

#### Identity
- **ID:** `notes`
- **Name:** Notes
- **Category:** Productivity
- **Route:** `/productivity/notes`

#### Purpose
> KV Secure Notes is a premium, zero-transmission note-taking tool designed for top-tier security, privacy, and speed.

#### Features
- Quickly capturing ideas and brainstorming sessions
- Managing daily to-do lists and grocery lists
- Writing structured documentation with Markdown
- Private journaling and personal reflection
- Temporary data storage for links, snippets, and research

#### Functionality
Click the floating '+' button to create a new note. To encrypt a note, open it, click the three-dots menu, select 'Encrypt Note', and set a secure password. To view or edit a locked note, click on it and enter the correct password. It remains unlocked for the session. Toggle between 'Note' mode (Markdown) and 'Checklist' mode using the icons in the header. Add tags in the footer to categorize your notes. Just type and press Enter. To share a note securely, select 'Copy Ciphertext' from the three-dots menu. The recipient can click the 'Decrypt Note' button in the toolbar to import it. Pin important notes to keep them at the top of your list.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton`, `Toast` |
| **Processing Packages** | `next`, `react`, `framer-motion`, `lucide-react`, `zustand`, `@radix-ui/react-dialog`, `@radix-ui/react-popover`, `date-fns` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `utils`, `FocusModeControlsContext`, `logger`, `db` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/productivity/notes/page.tsx`
- **Client Component:** `app/(tools)/productivity/notes/NotesClientWrapper.tsx`
- **Feature Directory:** `src/features/notes`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `src/features/notes/store.ts`
- **Content File:** `src/content/tools/notes.ts`
- **Registry File:** `src/registry/tools/notes.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (DOMPurify)
- **Sanitization:** Yes (DOMPurify)
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`, `Toast`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/productivity/notes/page.tsx`
  - `app/(tools)/productivity/notes/NotesClientWrapper.tsx`
  - `src/features/notes/NotesPage.client.tsx`
  - `src/features/notes/components/DrawingModal.tsx`
  - `src/features/notes/components/FolderSidebar.tsx`
  - `src/features/notes/components/ImportNoteModal.tsx`
  - `src/features/notes/components/NoteCard.tsx`
  - `src/features/notes/components/NoteEditor.tsx`
  - `src/features/notes/components/NoteHeader.tsx`
  - `src/features/notes/components/NoteList.tsx`
  - `src/features/notes/components/NotePasswordGate.tsx`
  - `src/features/notes/components/OCRButton.tsx`
  - `src/features/notes/components/SearchBar.tsx`
  - `src/features/notes/components/TagFilter.tsx`
  - `src/features/notes/constants.ts`
  - `src/features/notes/crypto.ts`
  - `src/features/notes/hooks/useAutoSave.ts`
  - `src/features/notes/hooks/useSpeechRecognition.ts`
  - `src/features/notes/store.ts`
  - `src/features/notes/types.ts`
  - `src/features/notes/utils.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="pomodoro-timer"></a>Pomodoro Timer

#### Identity
- **ID:** `pomodoro-timer`
- **Name:** Pomodoro Timer
- **Category:** Productivity
- **Route:** `/productivity/pomodoro-timer`

#### Purpose
> 
The Pomodoro Technique is a world-renowned time management method developed by Francesco Cirillo in the late 1980s.

#### Features
- Software development and deep-coding sessions.
- Intensive studying and academic research.
- Writing blog posts, documentation, or creative content.
- Managing household chores or repetitive daily tasks.
- Practicing mindful focus for ADHD management.

#### Functionality
Choose Your Mode: Select 'Focus' for deep work or 'Break' for relaxation. Start the Timer: Click the large Play button to begin your session. Stay Focused: Work until the timer reaches zero and the alert sounds. Take a Break: Use the break interval to step away from your screen and recharge. Customize: Use the Settings icon to adjust the duration of your focus and break periods.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton`, `SliderField`, `SessionRestoredBanner` |
| **Processing Packages** | `next`, `@radix-ui/react-dialog`, `lucide-react`, `zustand`, `react`, `framer-motion` |
| **Shared Internal Modules** | `seo`, `tool-registry`, `utils`, `notifications`, `FullscreenContext` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/productivity/pomodoro-timer/page.tsx`
- **Client Component:** `app/(tools)/productivity/pomodoro-timer/PomodoroTimerClient.tsx`
- **Feature Directory:** `src/features/pomodoro-timer`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `src/features/pomodoro-timer/store.ts`
- **Content File:** `src/content/tools/pomodoro-timer.ts`
- **Registry File:** `src/registry/tools/pomodoro-timer.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | Yes |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** Notifications

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** Yes
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`, `SliderField`, `SessionRestoredBanner`
- **Shared Workers Used:** None
- **Shared Stores Used:** `useSessionStore`
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/productivity/pomodoro-timer/page.tsx`
  - `app/(tools)/productivity/pomodoro-timer/PomodoroClientWrapper.tsx`
  - `app/(tools)/productivity/pomodoro-timer/PomodoroSettings.tsx`
  - `app/(tools)/productivity/pomodoro-timer/PomodoroTimerClient.tsx`
  - `src/features/pomodoro-timer/store.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="stopwatch"></a>Stopwatch

#### Identity
- **ID:** `stopwatch`
- **Name:** Stopwatch
- **Category:** Productivity
- **Route:** `/productivity/stopwatch`

#### Purpose
> Track elapsed time with lap support for productivity logging.

#### Features
- Support for stopwatch
- Support for productivity

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `@radix-ui/react-popover`, `zustand` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `utils`, `FullscreenContext` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/productivity/stopwatch/page.tsx`
- **Client Component:** `app/(tools)/productivity/stopwatch/StopwatchClient.tsx`
- **Feature Directory:** `src/features/stopwatch`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `src/features/stopwatch/store.ts`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/stopwatch.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | Yes |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** Yes
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/productivity/stopwatch/page.tsx`
  - `app/(tools)/productivity/stopwatch/StopwatchClient.tsx`
  - `app/(tools)/productivity/stopwatch/StopwatchClientWrapper.tsx`
  - `src/features/stopwatch/store.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="text-case-converter"></a>Text Case Converter

#### Identity
- **ID:** `text-case-converter`
- **Name:** Text Case Converter
- **Category:** Productivity
- **Route:** `/productivity/text-case-converter`

#### Purpose
> The Text Case Converter is an incredibly fast, highly versatile text manipulation utility that operates completely locally on your device.

#### Features
- Software developers converting plain text into camelCase or snake_case for variable naming conventions.
- Copywriters standardizing the capitalization of article headlines using Title Case.
- Data entry professionals fixing large batches of text that were accidentally typed with Caps Lock on.
- Social media managers creating alternating case text for stylistic posts or memes.

#### Functionality
Paste or type the text you wish to format directly into the designated input area. Select the desired text case format from the available options (e.g., Title Case, snake_case). Watch the output area update instantly as the text is processed locally. Review the resulting text to ensure it meets your formatting requirements. Click the 'Copy' button to quickly send the formatted text to your system clipboard.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolInput`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `@radix-ui/react-toggle-group` |
| **Shared Internal Modules** | `seo`, `tool-registry`, `utils` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/productivity/text-case-converter/page.tsx`
- **Client Component:** `app/(tools)/productivity/text-case-converter/TextCaseConverterClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/text-case-converter.ts`
- **Registry File:** `src/registry/tools/text-case-converter.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolInput`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Unexpected output with acronyms, Resolve issues relating to: Clipboard access denied
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/productivity/text-case-converter/page.tsx`
  - `app/(tools)/productivity/text-case-converter/TextCaseConverterClient.tsx`
  - `app/(tools)/productivity/text-case-converter/TextCaseConverterClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="text-sorter-deduper"></a>Text Sorter & Deduplicator

#### Identity
- **ID:** `text-sorter-deduper`
- **Name:** Text Sorter & Deduplicator
- **Category:** Productivity
- **Route:** `/productivity/text-sorter-deduper`

#### Purpose
> The Text Sorter & Deduper tool is a secure, browser-native utility designed to help you with your daily tasks.

#### Features
- Support for sort
- Support for deduplicate
- Support for text
- Support for lines
- Support for alphabetical

#### Functionality
Upload or enter the required data for Text Sorter & Deduper. Configure any available settings or options. Click the action button to process your request. Download or copy the results directly to your device.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolInput`, `ToolResultArea`, `Toast`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/productivity/text-sorter-deduper/page.tsx`
- **Client Component:** `app/(tools)/productivity/text-sorter-deduper/TextSorterDeduperClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/text-sorter-deduper.ts`
- **Registry File:** `src/registry/tools/text-sorter-deduper.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolInput`, `ToolResultArea`, `Toast`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/productivity/text-sorter-deduper/page.tsx`
  - `app/(tools)/productivity/text-sorter-deduper/TextSorterDeduperClient.tsx`
  - `app/(tools)/productivity/text-sorter-deduper/TextSorterDeduperClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="timezone-converter"></a>Time Zone Converter

#### Identity
- **ID:** `timezone-converter`
- **Name:** Time Zone Converter
- **Category:** Productivity
- **Route:** `/productivity/timezone-converter`

#### Purpose
> The KaruviLab Time Zone Converter is a professional-grade, browser-native utility designed for global teams, digital nomads, and remote workers.

#### Features
- Support for timezone
- Support for converter
- Support for world clock
- Support for time
- Support for iana
- Support for dst
- Support for meeting planner
- Support for utc converter
- Support for local time

#### Functionality
Select your 'Base Time' by choosing a date and time from the picker. This is usually your local time or the time of the event you are planning. Choose your 'Base Time Zone' using the searchable dropdown. You can search by city name (e.g., 'London'), country, or the specific IANA zone name (e.g., 'Europe/London'). Add 'Target Time Zones' by typing in the search box in the right panel. You can add multiple zones to compare them side-by-side in a grid view. Observe the real-time conversions. Each card shows the local time, date, and the positive or negative offset relative to your base zone. Use the 'Set to Now' button to quickly synchronize the converter with the current moment. Copy specific converted times to your clipboard using the copy icon on each timezone card for easy sharing in emails or calendar invites.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolInput`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `timezone-data` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/productivity/timezone-converter/page.tsx`
- **Client Component:** `app/(tools)/productivity/timezone-converter/TimeZoneConverterClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/timezone-converter.ts`
- **Registry File:** `src/registry/tools/timezone-converter.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** `world-clock`, `utc-ist-converter`, `date-calculator`, `time-calculator`
- **Shared Components Used:** `ToolShell`, `ToolInput`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/productivity/timezone-converter/page.tsx`
  - `app/(tools)/productivity/timezone-converter/TimeZoneConverterClient.tsx`
  - `app/(tools)/productivity/timezone-converter/TimeZoneConverterClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="typing-speed-test"></a>Typing Speed Test

#### Identity
- **ID:** `typing-speed-test`
- **Name:** Typing Speed Test
- **Category:** Productivity
- **Route:** `/productivity/typing-speed-test`

#### Purpose
> The Typing Speed Test tool is a secure, browser-native utility designed to help you with your daily tasks.

#### Features
- Support for typing test
- Support for wpm
- Support for accuracy
- Support for keyboard
- Support for typing speed

#### Functionality
Upload or enter the required data for Typing Speed Test. Configure any available settings or options. Click the action button to process your request. Download or copy the results directly to your device.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `logger` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/productivity/typing-speed-test/page.tsx`
- **Client Component:** `app/(tools)/productivity/typing-speed-test/TypingSpeedTestClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/typing-speed-test.ts`
- **Registry File:** `src/registry/tools/typing-speed-test.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | Yes |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** Yes
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/productivity/typing-speed-test/page.tsx`
  - `app/(tools)/productivity/typing-speed-test/TypingSpeedTestClient.tsx`
  - `app/(tools)/productivity/typing-speed-test/TypingSpeedTestClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="wifi-qr-code"></a>WiFi QR Code Generator

#### Identity
- **ID:** `wifi-qr-code`
- **Name:** WiFi QR Code Generator
- **Category:** Productivity
- **Route:** `/productivity/wifi-qr-code`

#### Purpose
> The WiFi QR Code tool is a secure, browser-native utility designed to help you with your daily tasks.

#### Features
- Support for wifi
- Support for qr code
- Support for generator
- Support for wpa
- Support for wep
- Support for network

#### Functionality
Upload or enter the required data for WiFi QR Code. Configure any available settings or options. Click the action button to process your request. Download or copy the results directly to your device.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolInput`, `Checkbox`, `QRCodeLoader`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `hooks` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/productivity/wifi-qr-code/page.tsx`
- **Client Component:** `app/(tools)/productivity/wifi-qr-code/WifiQrCodeClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/wifi-qr-code.ts`
- **Registry File:** `src/registry/tools/wifi-qr-code.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolInput`, `Checkbox`, `QRCodeLoader`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/productivity/wifi-qr-code/page.tsx`
  - `app/(tools)/productivity/wifi-qr-code/WifiQrCodeClient.tsx`
  - `app/(tools)/productivity/wifi-qr-code/WifiQrCodeClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="word-counter"></a>Word Counter

#### Identity
- **ID:** `word-counter`
- **Name:** Word Counter
- **Category:** Productivity
- **Route:** `/productivity/word-counter`

#### Purpose
> 
The Word Counter is an essential text analysis utility for writers, students, SEO professionals, and editors.

#### Features
- Support for word counter
- Support for productivity

#### Functionality
Input Text: Type or paste your content into the large text area. Monitor Stats: Watch the real-time counters at the top or side of the tool update instantly. Check Metrics: Review characters, sentences, and estimated reading time for a full analysis. Refine: Edit your text to meet specific word count goals or character limits. Copy/Clear: Use the utility buttons to quickly copy the analyzed text or start a new session.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `ToolInput`, `MetricCard`, `DropZone`, `Toast`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `seo`, `tool-registry`, `WorkerOrchestrator` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/productivity/word-counter/page.tsx`
- **Client Component:** `app/(tools)/productivity/word-counter/WordCounterClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `src/workers/WorkerOrchestrator, src/workers/karuvi.worker.ts`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/word-counter.ts`
- **Registry File:** `src/registry/tools/word-counter.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | Yes (ComputeWorker) |
| **Concurrency Limit** | 3 |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Worker Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** Yes
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** size > 2
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** Yes
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Worker

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `ToolInput`, `MetricCard`, `DropZone`, `Toast`, `ToolSkeleton`
- **Shared Workers Used:** `WorkerOrchestrator`, `karuvi.worker.ts`
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-02 (Worker Concurrency), KL-05 (AbortSignal Propagation), KL-10 (WorkerOrchestrator entry)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/productivity/word-counter/page.tsx`
  - `app/(tools)/productivity/word-counter/WordCounterClient.tsx`
  - `app/(tools)/productivity/word-counter/WordCounterClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---


## Category: Security

### <a id="aes-encrypt-decrypt"></a>Aes Encrypt Decrypt

#### Identity
- **ID:** `aes-encrypt-decrypt`
- **Name:** Aes Encrypt Decrypt
- **Category:** Security
- **Route:** `/security-tools/aes-encrypt-decrypt`

#### Purpose
> Encrypt and decrypt text or files using AES, entirely in your browser.

#### Features
- Support for aes encrypt decrypt
- Support for security

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `WorkerOrchestrator` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/security-tools/aes-encrypt-decrypt/page.tsx`
- **Client Component:** `app/(tools)/security-tools/aes-encrypt-decrypt/AesClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `src/workers/WorkerOrchestrator, src/workers/karuvi.worker.ts`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/aes-encrypt-decrypt.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | Yes (ComputeWorker) |
| **Concurrency Limit** | 3 |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Worker Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** Yes
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** Yes
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Worker

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** `WorkerOrchestrator`, `karuvi.worker.ts`
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-02 (Worker Concurrency), KL-05 (AbortSignal Propagation), KL-10 (WorkerOrchestrator entry)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/security-tools/aes-encrypt-decrypt/page.tsx`
  - `app/(tools)/security-tools/aes-encrypt-decrypt/AesClient.tsx`
  - `app/(tools)/security-tools/aes-encrypt-decrypt/AesClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="base64url-converter"></a>Base64url Converter

#### Identity
- **ID:** `base64url-converter`
- **Name:** Base64url Converter
- **Category:** Security
- **Route:** `/security-tools/base64url-converter`

#### Purpose
> Encode or decode text to URL-safe Base64 format to safely transmit data.

#### Features
- Support for base64url converter
- Support for security

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `tokens` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/security-tools/base64url-converter/page.tsx`
- **Client Component:** `app/(tools)/security-tools/base64url-converter/Base64UrlClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/base64url-converter.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/security-tools/base64url-converter/page.tsx`
  - `app/(tools)/security-tools/base64url-converter/Base64UrlClient.tsx`
  - `app/(tools)/security-tools/base64url-converter/Base64UrlClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="card-masker"></a>Card Masker

#### Identity
- **ID:** `card-masker`
- **Name:** Card Masker
- **Category:** Security
- **Route:** `/security-tools/card-masker`

#### Purpose
> Mask card numbers automatically to securely display and store sensitive financial info.

#### Features
- Support for card masker
- Support for security

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/security-tools/card-masker/page.tsx`
- **Client Component:** `app/(tools)/security-tools/card-masker/CardMaskerClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/card-masker.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/security-tools/card-masker/page.tsx`
  - `app/(tools)/security-tools/card-masker/CardMaskerClient.tsx`
  - `app/(tools)/security-tools/card-masker/CardMaskerClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="cipher-tools"></a>Cipher Tools

#### Identity
- **ID:** `cipher-tools`
- **Name:** Cipher Tools
- **Category:** Security
- **Route:** `/security-tools/cipher-tools`

#### Purpose
> Encrypt and decrypt text using classical ciphers like Caesar or Vigenère.

#### Features
- Support for cipher tools
- Support for security

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `SegmentedControl`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `utils` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/security-tools/cipher-tools/page.tsx`
- **Client Component:** `app/(tools)/security-tools/cipher-tools/CipherToolsClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/cipher-tools.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `SegmentedControl`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/security-tools/cipher-tools/page.tsx`
  - `app/(tools)/security-tools/cipher-tools/CipherToolsClient.tsx`
  - `app/(tools)/security-tools/cipher-tools/CipherToolsWrapper.tsx`
  - `app/(tools)/security-tools/cipher-tools/useCiphers.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="csp-builder"></a>Csp Builder

#### Identity
- **ID:** `csp-builder`
- **Name:** Csp Builder
- **Category:** Security
- **Route:** `/security-tools/csp-builder`

#### Purpose
> Construct secure Content Security Policy headers to protect sites from XSS.

#### Features
- Support for csp builder
- Support for security

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `utils` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/security-tools/csp-builder/page.tsx`
- **Client Component:** `app/(tools)/security-tools/csp-builder/CspBuilderClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/csp-builder.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/security-tools/csp-builder/page.tsx`
  - `app/(tools)/security-tools/csp-builder/CspBuilderClient.tsx`
  - `app/(tools)/security-tools/csp-builder/CspBuilderWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="csr-generator"></a>Csr Generator

#### Identity
- **ID:** `csr-generator`
- **Name:** Csr Generator
- **Category:** Security
- **Route:** `/security-tools/csr-generator`

#### Purpose
> Generate CSR requests and private keys locally to secure web servers.

#### Features
- Support for csr generator
- Support for security

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `blob-manager`, `blobManager` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/security-tools/csr-generator/page.tsx`
- **Client Component:** `app/(tools)/security-tools/csr-generator/CsrClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `src/workers/manager`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/csr-generator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | Yes (ComputeWorker) |
| **Concurrency Limit** | 3 |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Worker Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** Yes
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** Yes
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Worker

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** `manager`
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-02 (Worker Concurrency), KL-05 (AbortSignal Propagation), KL-10 (WorkerOrchestrator entry)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/security-tools/csr-generator/page.tsx`
  - `app/(tools)/security-tools/csr-generator/CsrClient.tsx`
  - `app/(tools)/security-tools/csr-generator/CsrClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="directory-manifest"></a>Directory Manifest

#### Identity
- **ID:** `directory-manifest`
- **Name:** Directory Manifest
- **Category:** Security
- **Route:** `/security-tools/directory-manifest`

#### Purpose
> Generate recursive folder maps of local directories to document structure.

#### Features
- Support for directory manifest
- Support for security

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `blob-manager`, `blobManager` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/security-tools/directory-manifest/page.tsx`
- **Client Component:** `app/(tools)/security-tools/directory-manifest/DirectoryManifestClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `src/workers/manager, src/workers/types`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/directory-manifest.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | Yes (ComputeWorker) |
| **Concurrency Limit** | 3 |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Worker Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** Yes
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** Yes
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Worker

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** `manager`, `types`
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-02 (Worker Concurrency), KL-05 (AbortSignal Propagation), KL-10 (WorkerOrchestrator entry)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/security-tools/directory-manifest/page.tsx`
  - `app/(tools)/security-tools/directory-manifest/DirectoryManifestClient.tsx`
  - `app/(tools)/security-tools/directory-manifest/DirectoryManifestClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="ecdh-key-exchange"></a>Ecdh Key Exchange

#### Identity
- **ID:** `ecdh-key-exchange`
- **Name:** Ecdh Key Exchange
- **Category:** Security
- **Route:** `/security-tools/ecdh-key-exchange`

#### Purpose
> Generate shared cryptographic keys using ECDH protocols.

#### Features
- Support for ecdh key exchange
- Support for security

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/security-tools/ecdh-key-exchange/page.tsx`
- **Client Component:** `app/(tools)/security-tools/ecdh-key-exchange/EcdhClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `src/workers/manager`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/ecdh-key-exchange.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | Yes (ComputeWorker) |
| **Concurrency Limit** | 3 |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Worker Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** Yes
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** Yes
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Worker

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** `manager`
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-02 (Worker Concurrency), KL-05 (AbortSignal Propagation), KL-10 (WorkerOrchestrator entry)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/security-tools/ecdh-key-exchange/page.tsx`
  - `app/(tools)/security-tools/ecdh-key-exchange/EcdhClient.tsx`
  - `app/(tools)/security-tools/ecdh-key-exchange/EcdhClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="ecdsa-sign"></a>Ecdsa Sign

#### Identity
- **ID:** `ecdsa-sign`
- **Name:** Ecdsa Sign
- **Category:** Security
- **Route:** `/security-tools/ecdsa-sign`

#### Purpose
> Sign and verify payload strings using secure ECDSA certificates.

#### Features
- Support for ecdsa sign
- Support for security

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/security-tools/ecdsa-sign/page.tsx`
- **Client Component:** `app/(tools)/security-tools/ecdsa-sign/EcdsaClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `src/workers/manager`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/ecdsa-sign.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | Yes (ComputeWorker) |
| **Concurrency Limit** | 3 |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Worker Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** Yes
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** Yes
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Worker

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** `manager`
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-02 (Worker Concurrency), KL-05 (AbortSignal Propagation), KL-10 (WorkerOrchestrator entry)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/security-tools/ecdsa-sign/page.tsx`
  - `app/(tools)/security-tools/ecdsa-sign/EcdsaClient.tsx`
  - `app/(tools)/security-tools/ecdsa-sign/EcdsaClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="hash-generator"></a>Hash Generator

#### Identity
- **ID:** `hash-generator`
- **Name:** Hash Generator
- **Category:** Security
- **Route:** `/security-tools/hash-generator`

#### Purpose
> 
A **Hash Generator** creates a unique digital fingerprint (hash value) from any text or file.

#### Features
- Verify File Downloads: Compare your local hash with the vendor's published SHA-256 checksum.
- Confirm Data Integrity: Detect if a file or configuration has been modified or corrupted.
- Software Development: Generate unique identifiers for content and track modifications in repositories.
- Cybersecurity Education: Experiment with the 'avalanche effect' where changing one character changes the entire hash.

#### Functionality
**Step 1:** Type or paste the text you want to hash into the main input field. **Step 2:** Select your desired hash algorithm (MD5, SHA-1, SHA-256, or SHA-512). **Step 3:** If using HMAC mode, enter your secret key to sign the message. **Step 4:** The hash is generated instantly. Use the 'Copy' button to save the result to your clipboard.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `DropZone`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `hooks`, `utils` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/security-tools/hash-generator/page.tsx`
- **Client Component:** `app/(tools)/security-tools/hash-generator/HashGeneratorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `src/workers/manager, src/workers/types`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/hash-generator.ts`
- **Registry File:** `src/registry/tools/hash-generator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | Yes (ComputeWorker) |
| **Concurrency Limit** | 3 |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Worker Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** Yes
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** Yes
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Worker

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `DropZone`, `ToolSkeleton`
- **Shared Workers Used:** `manager`, `types`
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Output differs from other tools, Resolve issues relating to: MD5/SHA-1 Security Warnings
- **Manifest Safety Rules Enforced:** KL-02 (Worker Concurrency), KL-05 (AbortSignal Propagation), KL-10 (WorkerOrchestrator entry)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/security-tools/hash-generator/page.tsx`
  - `app/(tools)/security-tools/hash-generator/HashGeneratorClient.tsx`
  - `app/(tools)/security-tools/hash-generator/HashGeneratorClientWrapper.tsx`
  - `app/(tools)/security-tools/hash-generator/layout.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="hkdf-generator"></a>Hkdf Generator

#### Identity
- **ID:** `hkdf-generator`
- **Name:** Hkdf Generator
- **Category:** Security
- **Route:** `/security-tools/hkdf-generator`

#### Purpose
> Derive cryptographically strong keys from raw input using HKDF.

#### Features
- Support for hkdf generator
- Support for security

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/security-tools/hkdf-generator/page.tsx`
- **Client Component:** `app/(tools)/security-tools/hkdf-generator/HkdfClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `src/workers/manager`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/hkdf-generator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | Yes (ComputeWorker) |
| **Concurrency Limit** | 3 |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Worker Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** Yes
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** Yes
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Worker

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** `manager`
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-02 (Worker Concurrency), KL-05 (AbortSignal Propagation), KL-10 (WorkerOrchestrator entry)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/security-tools/hkdf-generator/page.tsx`
  - `app/(tools)/security-tools/hkdf-generator/HkdfClient.tsx`
  - `app/(tools)/security-tools/hkdf-generator/HkdfClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="hmac-generator"></a>Hmac Generator

#### Identity
- **ID:** `hmac-generator`
- **Name:** Hmac Generator
- **Category:** Security
- **Route:** `/security-tools/hmac-generator`

#### Purpose
> Calculate keyed-hash message authentication codes (HMAC) to verify integrity.

#### Features
- Support for hmac generator
- Support for security

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `utils` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/security-tools/hmac-generator/page.tsx`
- **Client Component:** `app/(tools)/security-tools/hmac-generator/HmacGeneratorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/hmac-generator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/security-tools/hmac-generator/page.tsx`
  - `app/(tools)/security-tools/hmac-generator/HmacGeneratorClient.tsx`
  - `app/(tools)/security-tools/hmac-generator/HmacGeneratorWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="html-entities"></a>HTML Entities

#### Identity
- **ID:** `html-entities`
- **Name:** HTML Entities
- **Category:** Security
- **Route:** `/security-tools/html-entities`

#### Purpose
> Convert special HTML characters to their named or numeric entity equivalents (e.

#### Features
- Escaping user input before inserting it into an HTML page
- Decoding HTML entities in a scraped web page
- Preparing code samples to display in a blog post
- Fixing corrupted text that shows raw entity codes

#### Functionality
Select 'Encode' to escape HTML characters or 'Decode' to unescape entities. Paste your HTML snippet or plain text into the input box. The converted output appears instantly. Copy the result and use it in your code.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/security-tools/html-entities/page.tsx`
- **Client Component:** `app/(tools)/security-tools/html-entities/HTMLEntitiesClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/html-entities.ts`
- **Registry File:** `src/registry/tools/html-entities.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Light
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Small
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: Double-encoding entities (e.g., `&amp;amp;`), Resolve issues relating to: Encoded output breaks inside a JavaScript string
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/security-tools/html-entities/page.tsx`
  - `app/(tools)/security-tools/html-entities/HTMLEntitiesClient.tsx`
  - `app/(tools)/security-tools/html-entities/HTMLEntitiesClientWrapper.tsx`
  - `app/(tools)/security-tools/html-entities/layout.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="iban-validator"></a>Iban Validator

#### Identity
- **ID:** `iban-validator`
- **Name:** Iban Validator
- **Category:** Security
- **Route:** `/security-tools/iban-validator`

#### Purpose
> Check the validity and checksums of IBAN bank account numbers.

#### Features
- Support for iban validator
- Support for security

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/security-tools/iban-validator/page.tsx`
- **Client Component:** `app/(tools)/security-tools/iban-validator/IbanClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/iban-validator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/security-tools/iban-validator/page.tsx`
  - `app/(tools)/security-tools/iban-validator/IbanClient.tsx`
  - `app/(tools)/security-tools/iban-validator/IbanClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="iso8583-bitmap-decoder"></a>Iso8583 Bitmap Decoder

#### Identity
- **ID:** `iso8583-bitmap-decoder`
- **Name:** Iso8583 Bitmap Decoder
- **Category:** Security
- **Route:** `/security-tools/iso8583-bitmap-decoder`

#### Purpose
> Parse and visualize ISO 8583 payment card transaction bitmaps.

#### Features
- Support for iso8583 bitmap decoder
- Support for security

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/security-tools/iso8583-bitmap-decoder/page.tsx`
- **Client Component:** `app/(tools)/security-tools/iso8583-bitmap-decoder/ISO8583BitmapClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/iso8583-bitmap-decoder.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/security-tools/iso8583-bitmap-decoder/page.tsx`
  - `app/(tools)/security-tools/iso8583-bitmap-decoder/ISO8583BitmapClient.tsx`
  - `app/(tools)/security-tools/iso8583-bitmap-decoder/ISO8583BitmapClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="iso8583-message-parser"></a>Iso8583 Message Parser

#### Identity
- **ID:** `iso8583-message-parser`
- **Name:** Iso8583 Message Parser
- **Category:** Security
- **Route:** `/security-tools/iso8583-message-parser`

#### Purpose
> Decode raw financial transaction strings into human-readable messages.

#### Features
- Support for iso8583 message parser
- Support for security

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `parser` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/security-tools/iso8583-message-parser/page.tsx`
- **Client Component:** `app/(tools)/security-tools/iso8583-message-parser/ISO8583ParserClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/iso8583-message-parser.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/security-tools/iso8583-message-parser/page.tsx`
  - `app/(tools)/security-tools/iso8583-message-parser/ISO8583ParserClient.tsx`
  - `app/(tools)/security-tools/iso8583-message-parser/ISO8583ParserClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="jwt-decoder"></a>JWT Decoder

#### Identity
- **ID:** `jwt-decoder`
- **Name:** JWT Decoder
- **Category:** Security
- **Route:** `/security-tools/jwt-decoder`

#### Purpose
> Decode and inspect the header and payload sections of any JSON Web Token (JWT) without needing a secret key.

#### Features
- Inspecting token claims during API development and debugging
- Checking whether a JWT has expired
- Reading user roles and permissions embedded in a token
- Teaching JWT structure in a workshop or tutorial

#### Functionality
Paste the full JWT string (three dot-separated parts) into the input field. The header and payload JSON are automatically decoded and displayed. Review the claims such as `iss`, `exp`, `sub`, and custom fields. Check the expiry (`exp`) timestamp to see if the token is still valid.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `blob-manager`, `blobManager` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/security-tools/jwt-decoder/page.tsx`
- **Client Component:** `app/(tools)/security-tools/jwt-decoder/JWTDecoderClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/jwt-decoder.ts`
- **Registry File:** `src/registry/tools/jwt-decoder.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** Resolve issues relating to: 'Invalid JWT' with a token that looks correct, Resolve issues relating to: Payload shows garbled characters, Resolve issues relating to: `exp` claim shows a date in the past
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/security-tools/jwt-decoder/page.tsx`
  - `app/(tools)/security-tools/jwt-decoder/JWTDecoderClient.tsx`
  - `app/(tools)/security-tools/jwt-decoder/JWTDecoderClientWrapper.tsx`
  - `app/(tools)/security-tools/jwt-decoder/components/ApiSnippets.tsx`
  - `app/(tools)/security-tools/jwt-decoder/components/DeveloperAnalysis.tsx`
  - `app/(tools)/security-tools/jwt-decoder/components/JwtPartsView.tsx`
  - `app/(tools)/security-tools/jwt-decoder/components/SecurityInsights.tsx`
  - `app/(tools)/security-tools/jwt-decoder/layout.tsx`
  - `app/(tools)/security-tools/jwt-decoder/utils.ts`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="oauth-token-decoder"></a>Oauth Token Decoder

#### Identity
- **ID:** `oauth-token-decoder`
- **Name:** Oauth Token Decoder
- **Category:** Security
- **Route:** `/security-tools/oauth-token-decoder`

#### Purpose
> Inspect and decode OAuth 2.0 access and refresh token payloads.

#### Features
- Support for oauth token decoder
- Support for security

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `tokens` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/security-tools/oauth-token-decoder/page.tsx`
- **Client Component:** `app/(tools)/security-tools/oauth-token-decoder/OAuthClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/oauth-token-decoder.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/security-tools/oauth-token-decoder/page.tsx`
  - `app/(tools)/security-tools/oauth-token-decoder/OAuthClient.tsx`
  - `app/(tools)/security-tools/oauth-token-decoder/OAuthClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="password-generator"></a>Password Generator

#### Identity
- **ID:** `password-generator`
- **Name:** Password Generator
- **Category:** Security
- **Route:** `/security-tools/password-generator`

#### Purpose
> 
The Password Generator is a critical security utility designed to help you create cryptographically strong, unique passwords for every online account.

#### Features
- Support for password
- Support for random
- Support for strong
- Support for generator

#### Functionality
Set Length: Use the slider or input field to choose how long you want your password to be. Toggle Options: Choose which character sets (Numbers, Symbols, etc.) to include based on your security needs. Generate: Click the 'Generate' button to create a new random string. Copy: Use the one-click copy button to add the password to your clipboard. Paste & Save: Immediately paste the password into your account settings and save it in your password manager.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `Checkbox`, `SliderField`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react`, `framer-motion` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `utils` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/security-tools/password-generator/page.tsx`
- **Client Component:** `app/(tools)/security-tools/password-generator/PasswordGeneratorClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `src/content/tools/password-generator.ts`
- **Registry File:** `src/registry/tools/password-generator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** `hash-generator`, `base64`
- **Shared Components Used:** `ToolShell`, `CopyButton`, `Checkbox`, `SliderField`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/security-tools/password-generator/page.tsx`
  - `app/(tools)/security-tools/password-generator/PasswordGeneratorClient.tsx`
  - `app/(tools)/security-tools/password-generator/PasswordGeneratorClientWrapper.tsx`
  - `app/(tools)/security-tools/password-generator/layout.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="pbkdf2-generator"></a>Pbkdf2 Generator

#### Identity
- **ID:** `pbkdf2-generator`
- **Name:** Pbkdf2 Generator
- **Category:** Security
- **Route:** `/security-tools/pbkdf2-generator`

#### Purpose
> Derive cryptographic keys using PBKDF2 password hashing.

#### Features
- Support for pbkdf2 generator
- Support for security

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/security-tools/pbkdf2-generator/page.tsx`
- **Client Component:** `app/(tools)/security-tools/pbkdf2-generator/Pbkdf2Client.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `src/workers/manager`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/pbkdf2-generator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | Yes (ComputeWorker) |
| **Concurrency Limit** | 3 |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Worker Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** Yes
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** Yes
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Worker

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** `manager`
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-02 (Worker Concurrency), KL-05 (AbortSignal Propagation), KL-10 (WorkerOrchestrator entry)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/security-tools/pbkdf2-generator/page.tsx`
  - `app/(tools)/security-tools/pbkdf2-generator/Pbkdf2Client.tsx`
  - `app/(tools)/security-tools/pbkdf2-generator/Pbkdf2ClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="pem-viewer"></a>Pem Viewer

#### Identity
- **ID:** `pem-viewer`
- **Name:** Pem Viewer
- **Category:** Security
- **Route:** `/security-tools/pem-viewer`

#### Purpose
> Inspect and parse PEM certificate and private key files.

#### Features
- Support for pem viewer
- Support for security

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `asn1` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/security-tools/pem-viewer/page.tsx`
- **Client Component:** `app/(tools)/security-tools/pem-viewer/PemViewerClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/pem-viewer.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/security-tools/pem-viewer/page.tsx`
  - `app/(tools)/security-tools/pem-viewer/PemViewerClient.tsx`
  - `app/(tools)/security-tools/pem-viewer/PemViewerClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="private-key-checker"></a>Private Key Checker

#### Identity
- **ID:** `private-key-checker`
- **Name:** Private Key Checker
- **Category:** Security
- **Route:** `/security-tools/private-key-checker`

#### Purpose
> Validate private key structures and format compatibility.

#### Features
- Support for private key checker
- Support for security

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `asn1` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/security-tools/private-key-checker/page.tsx`
- **Client Component:** `app/(tools)/security-tools/private-key-checker/PrivateKeyClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `src/workers/manager`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/private-key-checker.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | Yes (ComputeWorker) |
| **Concurrency Limit** | 3 |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Worker Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** Yes
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** Yes
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Worker

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** `manager`
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-02 (Worker Concurrency), KL-05 (AbortSignal Propagation), KL-10 (WorkerOrchestrator entry)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/security-tools/private-key-checker/page.tsx`
  - `app/(tools)/security-tools/private-key-checker/PrivateKeyClient.tsx`
  - `app/(tools)/security-tools/private-key-checker/PrivateKeyClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="public-key-inspector"></a>Public Key Inspector

#### Identity
- **ID:** `public-key-inspector`
- **Name:** Public Key Inspector
- **Category:** Security
- **Route:** `/security-tools/public-key-inspector`

#### Purpose
> Inspect and display properties of public keys.

#### Features
- Support for public key inspector
- Support for security

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `asn1` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/security-tools/public-key-inspector/page.tsx`
- **Client Component:** `app/(tools)/security-tools/public-key-inspector/PublicKeyClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `src/workers/manager`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/public-key-inspector.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | Yes (ComputeWorker) |
| **Concurrency Limit** | 3 |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Worker Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** Yes
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** Yes
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Worker

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** `manager`
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-02 (Worker Concurrency), KL-05 (AbortSignal Propagation), KL-10 (WorkerOrchestrator entry)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/security-tools/public-key-inspector/page.tsx`
  - `app/(tools)/security-tools/public-key-inspector/PublicKeyClient.tsx`
  - `app/(tools)/security-tools/public-key-inspector/PublicKeyClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="rsa-encrypt-decrypt"></a>Rsa Encrypt Decrypt

#### Identity
- **ID:** `rsa-encrypt-decrypt`
- **Name:** Rsa Encrypt Decrypt
- **Category:** Security
- **Route:** `/security-tools/rsa-encrypt-decrypt`

#### Purpose
> Encrypt or decrypt payloads using secure RSA key pairs.

#### Features
- Support for rsa encrypt decrypt
- Support for security

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/security-tools/rsa-encrypt-decrypt/page.tsx`
- **Client Component:** `app/(tools)/security-tools/rsa-encrypt-decrypt/RsaCryptClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `src/workers/manager`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/rsa-encrypt-decrypt.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | Yes (ComputeWorker) |
| **Concurrency Limit** | 3 |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Worker Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** Yes
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** Yes
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Worker

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** `manager`
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-02 (Worker Concurrency), KL-05 (AbortSignal Propagation), KL-10 (WorkerOrchestrator entry)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/security-tools/rsa-encrypt-decrypt/page.tsx`
  - `app/(tools)/security-tools/rsa-encrypt-decrypt/RsaCryptClient.tsx`
  - `app/(tools)/security-tools/rsa-encrypt-decrypt/RsaCryptClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="rsa-key-generator"></a>Rsa Key Generator

#### Identity
- **ID:** `rsa-key-generator`
- **Name:** Rsa Key Generator
- **Category:** Security
- **Route:** `/security-tools/rsa-key-generator`

#### Purpose
> Generate public and private RSA key pairs locally for authentication.

#### Features
- Support for rsa key generator
- Support for security

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `blob-manager`, `blobManager` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/security-tools/rsa-key-generator/page.tsx`
- **Client Component:** `app/(tools)/security-tools/rsa-key-generator/RsaKeyGenClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `src/workers/manager`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/rsa-key-generator.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | Yes (ComputeWorker) |
| **Concurrency Limit** | 3 |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Worker Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** Yes
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** Yes
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Worker

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** `manager`
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-02 (Worker Concurrency), KL-05 (AbortSignal Propagation), KL-10 (WorkerOrchestrator entry)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/security-tools/rsa-key-generator/page.tsx`
  - `app/(tools)/security-tools/rsa-key-generator/RsaKeyGenClient.tsx`
  - `app/(tools)/security-tools/rsa-key-generator/RsaKeyGenClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="rsa-sign-verify"></a>Rsa Sign Verify

#### Identity
- **ID:** `rsa-sign-verify`
- **Name:** Rsa Sign Verify
- **Category:** Security
- **Route:** `/security-tools/rsa-sign-verify`

#### Purpose
> Sign messages or verify signatures using RSA keys.

#### Features
- Support for rsa sign verify
- Support for security

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/security-tools/rsa-sign-verify/page.tsx`
- **Client Component:** `app/(tools)/security-tools/rsa-sign-verify/RsaSignClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `src/workers/manager`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/rsa-sign-verify.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | Yes (ComputeWorker) |
| **Concurrency Limit** | 3 |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Worker Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** Yes
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** Yes
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Worker

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** `manager`
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-02 (Worker Concurrency), KL-05 (AbortSignal Propagation), KL-10 (WorkerOrchestrator entry)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/security-tools/rsa-sign-verify/page.tsx`
  - `app/(tools)/security-tools/rsa-sign-verify/RsaSignClient.tsx`
  - `app/(tools)/security-tools/rsa-sign-verify/RsaSignClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="saml-decoder"></a>Saml Decoder

#### Identity
- **ID:** `saml-decoder`
- **Name:** Saml Decoder
- **Category:** Security
- **Route:** `/security-tools/saml-decoder`

#### Purpose
> Decode and format SAML assertion payloads for identity analysis.

#### Features
- Support for saml decoder
- Support for security

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `tokens` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/security-tools/saml-decoder/page.tsx`
- **Client Component:** `app/(tools)/security-tools/saml-decoder/SamlClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/saml-decoder.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/security-tools/saml-decoder/page.tsx`
  - `app/(tools)/security-tools/saml-decoder/SamlClient.tsx`
  - `app/(tools)/security-tools/saml-decoder/SamlClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="tlv-parser"></a>Tlv Parser

#### Identity
- **ID:** `tlv-parser`
- **Name:** Tlv Parser
- **Category:** Security
- **Route:** `/security-tools/tlv-parser`

#### Purpose
> Parse and visualize EMV TLV hex streams into clear tree structures.

#### Features
- Support for tlv parser
- Support for security

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `tlv` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/security-tools/tlv-parser/page.tsx`
- **Client Component:** `app/(tools)/security-tools/tlv-parser/TlvParserClient.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/tlv-parser.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | No (None) |
| **Concurrency Limit** | Not Applicable |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Main Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** No
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** No
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** No
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Native

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/security-tools/tlv-parser/page.tsx`
  - `app/(tools)/security-tools/tlv-parser/TlvParserClient.tsx`
  - `app/(tools)/security-tools/tlv-parser/TlvParserClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="x509-viewer"></a>X509 Viewer

#### Identity
- **ID:** `x509-viewer`
- **Name:** X509 Viewer
- **Category:** Security
- **Route:** `/security-tools/x509-viewer`

#### Purpose
> Inspect and validate X.509 security certificates and expiry details.

#### Features
- Support for x509 viewer
- Support for security

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `tool-registry`, `seo`, `asn1` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/security-tools/x509-viewer/page.tsx`
- **Client Component:** `app/(tools)/security-tools/x509-viewer/X509Client.tsx`
- **Feature Directory:** `Not Present in Repository`
- **Worker File:** `src/workers/manager`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/x509-viewer.ts`

#### Architecture Notes
| Parameter | Value |
| --- | --- |
| **Worker Thread Pool Usage** | Yes (ComputeWorker) |
| **Concurrency Limit** | 3 |
| **Offline Capability** | Yes |
| **Manifest Exceptions** | None |
| **Sample Asset Bundled** | No |
| **Engine Loader Usage** | No |
| **Threading Model** | Worker Thread |
| **WebAssembly (WASM)** | No |
| **IndexedDB** | No |

#### Performance Characteristics
- **Memory Profile:** Medium
- **CPU Intensive:** Yes
- **Lazy Loaded (ssr:false):** Yes
- **Code Splitting Boundaries:** Yes

#### Security Review
- **Input Validation:** Yes
- **XSS Protection:** Yes (React escaping)
- **Sanitization:** No
- **File Upload Limits:** Not Present in Repository
- **Network Access Required:** No
- **Hardware/Device Permissions:** None

#### Metrics
- **Bundle Impact:** Medium
- **Worker-Based:** Yes
- **Offline-First:** Yes
- **IndexedDB Persistence:** No
- **WebAssembly Processing:** No
- **Engine Architecture:** Worker

#### Relations & Enhancements
- **Related Tools:** None
- **Shared Components Used:** `ToolShell`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** `manager`
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-02 (Worker Concurrency), KL-05 (AbortSignal Propagation), KL-10 (WorkerOrchestrator entry)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/security-tools/x509-viewer/page.tsx`
  - `app/(tools)/security-tools/x509-viewer/X509Client.tsx`
  - `app/(tools)/security-tools/x509-viewer/X509ClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---


## Global Cross-Reference Maps

### Shared Components Map
This map displays which tools import specific shared UI or system components.

| Shared Component | Tools Utilizing It |
| --- | --- |
| `Accordion` | `financial-freedom-calculator`, `image-converter`, `retirement-calculator`, `sip-calculator` |
| `BatchQueue` | `bulk-resizer`, `code-minifier`, `compress-pdf`, `extract-images`, `image-converter`, `seo-tools`, `watermark-pdf` |
| `CalculatorActionBar` | `compound-interest`, `gst-calculator`, `lumpsum-calculator`, `mutual-fund-returns`, `sip-calculator` |
| `Checkbox` | `calendar`, `fake-data-generator`, `image-resizer`, `password-generator`, `rotate-pdf`, `seo-tools`, `split-pdf`, `wifi-qr-code` |
| `CopyButton` | `aes-encrypt-decrypt`, `base64url-converter`, `box-shadow-generator`, `cagr-calculator`, `card-masker`, `cipher-tools`, `code-minifier`, `color-converter`, `color-palette-extractor`, `command-cheat-sheet`, `contrast-checker`, `csp-builder`, `csr-generator`, `csv-to-json`, `date-calculator`, `diff-checker`, `directory-manifest`, `discount-calculator`, `ecdh-key-exchange`, `ecdsa-sign`, `fd-calculator`, `format`, `glassmorphism-generator`, `gradient-generator`, `hash-generator`, `hkdf-generator`, `hmac-generator`, `html-entities`, `iban-validator`, `image-base64`, `inflation-calculator`, `iso8583-bitmap-decoder`, `iso8583-message-parser`, `json-csv`, `json-formatter`, `json-to-ts`, `jwt-decoder`, `log-analyzer`, `lorem-ipsum`, `luhn-validator`, `markdown`, `nanoid-generator`, `numeral-converter`, `oauth-token-decoder`, `password-generator`, `pbkdf2-generator`, `pdf-to-word`, `pem-viewer`, `percentage-calculator`, `ppf-calculator`, `private-key-checker`, `public-key-inspector`, `rd-calculator`, `retirement-calculator`, `rsa-encrypt-decrypt`, `rsa-key-generator`, `rsa-sign-verify`, `safe-to-spend`, `salary-calculator`, `saml-decoder`, `seo-tools`, `sip-calculator`, `split-copy`, `sql-formatter`, `stock-average-calculator`, `swp-calculator`, `text-case-converter`, `text-utility`, `time-calculator`, `timezone-converter`, `tlv-parser`, `unix-timestamp`, `url-cleaner`, `url-encoder`, `utc-ist-converter`, `uuid-generator`, `work-hours`, `x509-viewer`, `xml-formatter`, `yaml-json-converter`, `yaml-validator` |
| `DropZone` | `barcode-scanner`, `base64`, `bg-remover`, `bulk-resizer`, `code-minifier`, `color-palette-extractor`, `compress-pdf`, `extract-images`, `gif-creator`, `hash-generator`, `html-viewer`, `image-converter`, `image-crop`, `image-resizer`, `image-to-pdf`, `invoice-generator`, `markdown`, `merge-pdf`, `pdf-editor`, `pdf-to-image`, `phone-mockup-generator`, `split-pdf`, `watermark-pdf`, `word-counter`, `word-to-pdf` |
| `EmptyState` | `bg-remover`, `json-formatter` |
| `EngineLoader` | `html-viewer`, `markdown`, `pdf-to-image`, `pdf-to-word` |
| `HybridDateInput` | `age-calculator` |
| `LiveFilterBar` | `command-cheat-sheet` |
| `MediaDropZone` | `audio-converter`, `video-metadata-viewer`, `video-trim` |
| `MediaErrorBanner` | `audio-converter`, `gif-creator`, `video-metadata-viewer`, `video-trim` |
| `MediaPreviewPlayer` | `audio-converter` |
| `MediaStatusBadge` | `audio-converter`, `video-metadata-viewer`, `video-trim` |
| `MetricCard` | `age-calculator`, `audio-converter`, `bmi-calculator`, `cagr-calculator`, `compound-interest`, `currency-converter`, `date-calculator`, `discount-calculator`, `fd-calculator`, `financial-freedom-calculator`, `gif-creator`, `grammar-checker`, `gratuity-calculator`, `gst-calculator`, `hra-calculator`, `income-tax`, `inflation-calculator`, `lumpsum-calculator`, `mutual-fund-returns`, `nps-calculator`, `numeral-converter`, `ppf-calculator`, `rd-calculator`, `retirement-calculator`, `safe-to-spend`, `salary-calculator`, `sip-calculator`, `stock-average-calculator`, `swp-calculator`, `tds-calculator`, `time-calculator`, `video-metadata-viewer`, `video-trim`, `word-counter`, `work-hours` |
| `PdfPagePreview` | `rotate-pdf` |
| `PrivacyBadge` | `bg-remover`, `code-minifier`, `compress-pdf`, `extract-images`, `internet-speed-test`, `json-formatter`, `split-pdf`, `watermark-pdf` |
| `QRCodeLoader` | `qrcode`, `wifi-qr-code` |
| `QRModal` | `age-calculator`, `bmi-calculator`, `cagr-calculator`, `color-converter`, `crontab-editor`, `hra-calculator`, `income-tax`, `nps-calculator`, `sip-calculator`, `unix-timestamp` |
| `SegmentedControl` | `cipher-tools`, `code-minifier`, `fake-data-generator`, `html-viewer`, `json-formatter`, `markdown` |
| `SessionRestoredBanner` | `pomodoro-timer` |
| `ShareButton` | `age-calculator`, `bmi-calculator`, `cagr-calculator`, `color-converter`, `crontab-editor`, `hra-calculator`, `income-tax`, `nps-calculator`, `sip-calculator`, `unix-timestamp` |
| `SharedResultBanner` | `age-calculator`, `bmi-calculator`, `cagr-calculator`, `color-converter`, `crontab-editor`, `hra-calculator`, `income-tax`, `nps-calculator`, `sip-calculator`, `unix-timestamp` |
| `SliderField` | `bg-remover`, `compound-interest`, `discount-calculator`, `fd-calculator`, `financial-freedom-calculator`, `image-converter`, `inflation-calculator`, `lumpsum-calculator`, `mutual-fund-returns`, `page-numbering`, `password-generator`, `pomodoro-timer`, `ppf-calculator`, `qrcode`, `rd-calculator`, `retirement-calculator`, `safe-to-spend`, `sip-calculator`, `swp-calculator`, `watermark-pdf` |
| `StatusBadge` | `bg-remover`, `code-minifier`, `internet-speed-test`, `invoice-generator`, `json-formatter` |
| `Toast` | `barcode-scanner`, `calendar`, `chart-generator`, `image-converter`, `internet-speed-test`, `invoice-generator`, `lumpsum-calculator`, `markdown`, `mutual-fund-returns`, `notes`, `numeral-converter`, `pdf-to-word`, `seo-tools`, `sip-calculator`, `task-reminder`, `text-sorter-deduper`, `video-metadata-viewer`, `word-counter`, `word-to-pdf`, `work-hours`, `world-clock` |
| `ToolInput` | `banking-tools`, `base64`, `cagr-calculator`, `calendar`, `code-minifier`, `core-banking-parser`, `currency-converter`, `date-calculator`, `discount-calculator`, `emv-tlv-tree`, `fake-data-generator`, `financial-freedom-calculator`, `gst-calculator`, `hash-map-visualizer`, `image-resizer`, `invoice-generator`, `json-formatter`, `seo-tools`, `sip-calculator`, `split-pdf`, `stock-average-calculator`, `swift-mt-mx`, `task-reminder`, `text-case-converter`, `text-sorter-deduper`, `timezone-converter`, `track-2-parser`, `wifi-qr-code`, `word-counter` |
| `ToolResultArea` | `banking-tools`, `barcode-scanner`, `base64`, `core-banking-parser`, `emv-tlv-tree`, `fake-data-generator`, `financial-freedom-calculator`, `swift-mt-mx`, `text-sorter-deduper`, `track-2-parser` |
| `ToolShell` | `aes-encrypt-decrypt`, `age-calculator`, `audio-converter`, `banking-tools`, `barcode-scanner`, `base64`, `base64url-converter`, `bg-remover`, `bmi-calculator`, `box-shadow-generator`, `bulk-resizer`, `cagr-calculator`, `calculator`, `calendar`, `card-masker`, `chart-generator`, `cipher-tools`, `code-minifier`, `color-converter`, `color-match`, `color-palette-extractor`, `command-cheat-sheet`, `compound-interest`, `compress-pdf`, `compress`, `contrast-checker`, `core-banking-parser`, `countdown-timer`, `crontab-editor`, `csp-builder`, `csr-generator`, `csv-to-json`, `currency-converter`, `data-calculator`, `date-calculator`, `delete-blank-pages`, `diff-checker`, `directory-manifest`, `discount-calculator`, `duplicate-pages`, `ecdh-key-exchange`, `ecdsa-sign`, `emi-calculator`, `emv-tlv-tree`, `even-pages-extractor`, `extract-images`, `extract-pages`, `fake-data-generator`, `fd-calculator`, `file-viewer-diff`, `financial-freedom-calculator`, `format`, `game-2048`, `gif-creator`, `glassmorphism-generator`, `gradient-generator`, `grammar-checker`, `gratuity-calculator`, `gst-calculator`, `hash-generator`, `hash-map-visualizer`, `hkdf-generator`, `hmac-generator`, `hra-calculator`, `html-entities`, `html-viewer`, `iban-validator`, `image-base64`, `image-compress`, `image-converter`, `image-crop`, `image-resizer`, `image-seo`, `image-to-pdf`, `income-tax`, `inflation-calculator`, `internet-speed-test`, `invoice-generator`, `iso8583-bitmap-decoder`, `iso8583-message-parser`, `json-csv`, `json-formatter`, `json-to-ts`, `jwt-decoder`, `lock-unlock-pdf`, `log-analyzer`, `lorem-ipsum`, `luhn-validator`, `lumpsum-calculator`, `markdown`, `memory-match`, `merge-pdf`, `meta-tags`, `mic-camera-tester`, `minesweeper`, `move-pages`, `mutual-fund-returns`, `nanoid-generator`, `notes`, `nps-calculator`, `numeral-converter`, `oauth-token-decoder`, `odd-pages-extractor`, `og-preview`, `organize-pdf`, `page-numbering`, `password-generator`, `pbkdf2-generator`, `pdf-editor`, `pdf-to-image`, `pdf-to-word`, `pem-viewer`, `percentage-calculator`, `phone-mockup-generator`, `pomodoro-timer`, `ppf-calculator`, `private-key-checker`, `public-key-inspector`, `qrcode`, `rd-calculator`, `reaction-time`, `regex-tester`, `remove-pages`, `reorder-pages`, `retirement-calculator`, `reverse-pages`, `robots-txt`, `rotate-pdf`, `rotate-selected-pages`, `rsa-encrypt-decrypt`, `rsa-key-generator`, `rsa-sign-verify`, `safe-to-spend`, `salary-calculator`, `saml-decoder`, `seo-title`, `seo-tools`, `sip-calculator`, `sitemap-generator`, `slug-generator`, `smart-converter`, `snake-game`, `split-copy`, `split-pdf`, `sql-formatter`, `stock-average-calculator`, `stopwatch`, `sudoku`, `swift-mt-mx`, `swp-calculator`, `task-reminder`, `tds-calculator`, `text-case-converter`, `text-sorter-deduper`, `text-utility`, `tic-tac-toe`, `time-calculator`, `timezone-converter`, `tlv-parser`, `track-2-parser`, `typing-speed-test`, `unit-converter`, `unix-timestamp`, `url-cleaner`, `url-encoder`, `utc-ist-converter`, `uuid-generator`, `validate`, `video-metadata-viewer`, `video-trim`, `watermark-pdf`, `wifi-qr-code`, `word-counter`, `word-guess`, `word-to-pdf`, `work-hours`, `world-clock`, `x509-viewer`, `xml-formatter`, `yaml-json-converter`, `yaml-validator` |
| `ToolSkeleton` | `aes-encrypt-decrypt`, `age-calculator`, `audio-converter`, `banking-tools`, `barcode-scanner`, `base64`, `base64url-converter`, `bg-remover`, `bmi-calculator`, `box-shadow-generator`, `bulk-resizer`, `cagr-calculator`, `calculator`, `calendar`, `card-masker`, `chart-generator`, `cipher-tools`, `code-minifier`, `color-converter`, `color-match`, `color-palette-extractor`, `command-cheat-sheet`, `compound-interest`, `compress-pdf`, `contrast-checker`, `convert-to-a4`, `convert-to-legal`, `convert-to-letter`, `core-banking-parser`, `countdown-timer`, `crontab-editor`, `crop-pdf`, `csp-builder`, `csr-generator`, `csv-to-json`, `currency-converter`, `date-calculator`, `delete-blank-pages`, `diff-checker`, `directory-manifest`, `discount-calculator`, `duplicate-pages`, `ecdh-key-exchange`, `ecdsa-sign`, `edit-metadata`, `emv-tlv-tree`, `even-pages-extractor`, `extract-images`, `extract-pages`, `fake-data-generator`, `fd-calculator`, `file-viewer-diff`, `financial-freedom-calculator`, `format`, `game-2048`, `gif-creator`, `glassmorphism-generator`, `gradient-generator`, `grammar-checker`, `gratuity-calculator`, `gst-calculator`, `hash-generator`, `hash-map-visualizer`, `hkdf-generator`, `hmac-generator`, `hra-calculator`, `html-entities`, `html-viewer`, `iban-validator`, `image-base64`, `image-converter`, `image-crop`, `image-resizer`, `image-seo`, `image-to-pdf`, `income-tax`, `inflation-calculator`, `internet-speed-test`, `invoice-generator`, `iso8583-bitmap-decoder`, `iso8583-message-parser`, `json-csv`, `json-formatter`, `json-to-ts`, `jwt-decoder`, `lock-unlock-pdf`, `log-analyzer`, `lorem-ipsum`, `luhn-validator`, `lumpsum-calculator`, `margin-adjustment`, `markdown`, `memory-match`, `merge-pdf`, `meta-tags`, `mic-camera-tester`, `minesweeper`, `move-pages`, `mutual-fund-returns`, `nanoid-generator`, `notes`, `nps-calculator`, `numeral-converter`, `oauth-token-decoder`, `odd-pages-extractor`, `og-preview`, `organize-pdf`, `page-numbering`, `page-size-converter`, `password-generator`, `pbkdf2-generator`, `pdf-editor`, `pdf-to-image`, `pdf-to-word`, `pem-viewer`, `percentage-calculator`, `phone-mockup-generator`, `pomodoro-timer`, `ppf-calculator`, `private-key-checker`, `public-key-inspector`, `qrcode`, `rd-calculator`, `reaction-time`, `regex-tester`, `remove-metadata`, `remove-pages`, `reorder-pages`, `retirement-calculator`, `reverse-pages`, `robots-txt`, `rotate-pdf`, `rotate-selected-pages`, `rsa-encrypt-decrypt`, `rsa-key-generator`, `rsa-sign-verify`, `safe-to-spend`, `salary-calculator`, `saml-decoder`, `seo-title`, `seo-tools`, `sip-calculator`, `sitemap-generator`, `slug-generator`, `smart-converter`, `snake-game`, `split-copy`, `sql-formatter`, `stock-average-calculator`, `stopwatch`, `sudoku`, `swift-mt-mx`, `swp-calculator`, `task-reminder`, `tds-calculator`, `text-case-converter`, `text-sorter-deduper`, `text-utility`, `tic-tac-toe`, `time-calculator`, `timezone-converter`, `tlv-parser`, `track-2-parser`, `typing-speed-test`, `unit-converter`, `unix-timestamp`, `url-cleaner`, `url-encoder`, `utc-ist-converter`, `uuid-generator`, `validate`, `video-metadata-viewer`, `video-trim`, `watermark-pdf`, `wifi-qr-code`, `word-counter`, `word-guess`, `word-to-pdf`, `work-hours`, `world-clock`, `x509-viewer`, `xml-formatter`, `yaml-json-converter`, `yaml-validator` |
| `WorkflowSuggestions` | `compress-pdf`, `extract-images`, `fake-data-generator`, `json-csv`, `json-formatter`, `merge-pdf`, `watermark-pdf` |

### Shared Workers Map
This map displays which tools execute background tasks using shared worker files.

| Shared Worker | Tools Utilizing It |
| --- | --- |
| `WorkerOrchestrator` | `aes-encrypt-decrypt`, `color-palette-extractor`, `extract-images`, `numeral-converter`, `pdf-to-word`, `word-counter`, `word-to-pdf`, `yaml-validator` |
| `karuvi.worker.ts` | `aes-encrypt-decrypt`, `color-palette-extractor`, `extract-images`, `numeral-converter`, `pdf-to-word`, `word-counter`, `word-to-pdf`, `yaml-validator` |
| `manager` | `audio-converter`, `bg-remover`, `bulk-resizer`, `code-minifier`, `compress-pdf`, `csr-generator`, `directory-manifest`, `ecdh-key-exchange`, `ecdsa-sign`, `gif-creator`, `grammar-checker`, `hash-generator`, `hkdf-generator`, `image-converter`, `image-resizer`, `json-formatter`, `merge-pdf`, `pbkdf2-generator`, `pdf-editor`, `pdf-to-image`, `private-key-checker`, `public-key-inspector`, `rotate-pdf`, `rsa-encrypt-decrypt`, `rsa-key-generator`, `rsa-sign-verify`, `split-pdf`, `watermark-pdf`, `x509-viewer` |
| `types` | `bulk-resizer`, `directory-manifest`, `hash-generator`, `merge-pdf`, `split-pdf` |

### Shared Stores Map
This map displays which tools utilize shared global stores (e.g. Zustand stores).

| Shared Store | Tools Utilizing It |
| --- | --- |
| `useBatchStore` | `bulk-resizer`, `code-minifier`, `compress-pdf`, `extract-images`, `image-converter`, `seo-tools`, `watermark-pdf` |
| `useColorStore` | `color-converter` |
| `useRecoveryStore` | `code-minifier` |
| `useSessionStore` | `pomodoro-timer` |
| `useSupportStore` | `world-clock` |
| `useWorkflowStore` | `fake-data-generator`, `json-csv`, `merge-pdf` |
