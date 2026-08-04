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


