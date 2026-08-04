## Category: PDF Tools

### <a id="pdf-compare"></a>Compare PDFs

#### Identity
- **ID:** `pdf-compare`
- **Name:** Compare PDFs
- **Category:** PDF Tools
- **Route:** `/pdf-tools/pdf-compare`

#### Purpose
> Highlight textual and visual differences between two PDF files.

#### Features
- Support for compare
- Support for pdf
- Support for diff
- Support for difference
- Support for compare pdf
- Support for pdf diff

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `DropZone`, `PrivacyBadge`, `CopyButton`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `pdf-compareClientWrapper`, `seo`, `hooks`, `formatError`, `utils` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/pdf-tools/pdf-compare/page.tsx`
- **Client Component:** `Not Present in Repository`
- **Feature Directory:** `src/features/pdf-compare`
- **Worker File:** `src/workers/manager`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/pdf-compare.ts`

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
- **Related Tools:** `diff-checker`, `merge-pdf`, `pdf-editor`
- **Shared Components Used:** `ToolShell`, `DropZone`, `PrivacyBadge`, `CopyButton`, `ToolSkeleton`
- **Shared Workers Used:** `manager`
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-02 (Worker Concurrency), KL-05 (AbortSignal Propagation), KL-10 (WorkerOrchestrator entry)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/pdf-tools/pdf-compare/page.tsx`
  - `src/features/pdf-compare/components/PdfCompareClient.tsx`
  - `src/features/pdf-compare/pdf-compareClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

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

### <a id="pdf-attachments"></a>PDF Attachments

#### Identity
- **ID:** `pdf-attachments`
- **Name:** PDF Attachments
- **Category:** PDF Tools
- **Route:** `//pdf-tools/pdf-attachments`

#### Purpose
> Extract embedded files and attachments from PDFs

#### Features
- Support for pdf
- Support for attachments
- Support for extract
- Support for embedded
- Support for files

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `DropZone`, `PrivacyBadge`, `ToolSkeleton` |
| **Processing Packages** | `react`, `lucide-react`, `next` |
| **Shared Internal Modules** | `tool-registry`, `hooks`, `formatError`, `WorkerOrchestrator` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `Not Present in Repository`
- **Client Component:** `Not Present in Repository`
- **Feature Directory:** `src/features/pdf-attachments`
- **Worker File:** `src/workers/manager, src/workers/WorkerOrchestrator, src/workers/karuvi.worker.ts`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/pdf-attachments.ts`

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
- **Shared Components Used:** `DropZone`, `PrivacyBadge`, `ToolSkeleton`
- **Shared Workers Used:** `manager`, `WorkerOrchestrator`, `karuvi.worker.ts`
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-02 (Worker Concurrency), KL-05 (AbortSignal Propagation), KL-10 (WorkerOrchestrator entry)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `src/features/pdf-attachments/components/PdfAttachmentsClient.tsx`
  - `src/features/pdf-attachments/pdf-attachmentsClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="pdf-bookmarks"></a>PDF Bookmarks

#### Identity
- **ID:** `pdf-bookmarks`
- **Name:** PDF Bookmarks
- **Category:** PDF Tools
- **Route:** `//pdf-tools/pdf-bookmarks`

#### Purpose
> View and export PDF bookmarks (outline)

#### Features
- Support for pdf
- Support for bookmarks
- Support for outline
- Support for toc
- Support for table of contents

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `DropZone`, `PrivacyBadge`, `EngineLoader`, `ToolSkeleton` |
| **Processing Packages** | `react`, `lucide-react`, `next` |
| **Shared Internal Modules** | `tool-registry`, `hooks`, `formatError`, `EngineLoader` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `Not Present in Repository`
- **Client Component:** `Not Present in Repository`
- **Feature Directory:** `src/features/pdf-bookmarks`
- **Worker File:** `src/workers/manager`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/pdf-bookmarks.ts`

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
- **Shared Components Used:** `DropZone`, `PrivacyBadge`, `EngineLoader`, `ToolSkeleton`
- **Shared Workers Used:** `manager`
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-02 (Worker Concurrency), KL-05 (AbortSignal Propagation), KL-10 (WorkerOrchestrator entry)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `src/features/pdf-bookmarks/components/PdfBookmarksClient.tsx`
  - `src/features/pdf-bookmarks/pdf-bookmarksClientWrapper.tsx`
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

### <a id="pdf-preview"></a>Preview PDF

#### Identity
- **ID:** `pdf-preview`
- **Name:** Preview PDF
- **Category:** PDF Tools
- **Route:** `/pdf-tools/pdf-preview`

#### Purpose
> A native, fast, offline PDF viewer with search and zoom capabilities.

#### Features
- Support for preview
- Support for pdf
- Support for viewer
- Support for read pdf
- Support for pdf viewer

#### Functionality
Launches an interactive client view within the ToolShell. Users provide direct inputs or drag-and-drop source files, which are processed entirely inside the browser. Results can be copied or downloaded instantly.

#### Libraries & Dependencies
| Dependency Type | Verified Imports |
| --- | --- |
| **Radix UI / UI Components** | `ToolShell`, `DropZone`, `PrivacyBadge`, `ToolSkeleton` |
| **Processing Packages** | `next`, `react`, `lucide-react` |
| **Shared Internal Modules** | `pdf-previewClientWrapper`, `seo`, `hooks`, `formatError` |
| **Peer Dependencies** | None |

#### File Structure
- **Page File:** `app/(tools)/pdf-tools/pdf-preview/page.tsx`
- **Client Component:** `Not Present in Repository`
- **Feature Directory:** `src/features/pdf-preview`
- **Worker File:** `Not Present in Repository`
- **Zustand Store:** `Not Present in Repository`
- **Content File:** `Not Present in Repository`
- **Registry File:** `src/registry/tools/pdf-preview.ts`

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
- **Related Tools:** `pdf-editor`, `pdf-bookmarks`, `pdf-attachments`
- **Shared Components Used:** `ToolShell`, `DropZone`, `PrivacyBadge`, `ToolSkeleton`
- **Shared Workers Used:** None
- **Shared Stores Used:** None
- **Known Tech Debt / Future Enhancements:** None
- **Manifest Safety Rules Enforced:** KL-07 (ssr:false Dynamic Imports)

#### Verification & Traceability
- **Evidence Files Scanned:**
  - `app/(tools)/pdf-tools/pdf-preview/page.tsx`
  - `src/features/pdf-preview/components/PdfPreviewClient.tsx`
  - `src/features/pdf-preview/pdf-previewClientWrapper.tsx`
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


