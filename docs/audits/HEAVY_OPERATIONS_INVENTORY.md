# Heavy Operation Inventory

## Heavy Operations (>3s)
- **PDF Merge** (`merge-pdf`, `pdf-merger`)
- **PDF Split** (`split-pdf`)
- **PDF Compress** (`compress-pdf`)
- **PDF to Word** (`pdf-to-word`)
- **Word to PDF** (`word-to-pdf`)
- **Extract Images from PDF** (`extract-images`)
- **GIF Creation** (`gif-creator`)
- **Image Compression** (`image-compressor`)
- **Image Converter** (`image-converter`) - ZIP Creation
- **OCR** (`notes`)
- **JSON Formatting** (large files) (`json-formatter`)
- **Code Minifier** (`code-minifier`)

## Medium Operations (1-3s)
- **Base64 Encoding/Decoding** (large files)
- **Markdown Rendering** (large files)

## Short Operations (300ms-1s)
- **Hash Generation**
- **Numeral Conversion**

## Instant Operations (<300ms)
- **Calculators** (BMI, EMI, Calculator, etc)
- **Timers/Clocks**

This inventory outlines the operations that require the shared Progress System to improve UX without blocking the main thread.
