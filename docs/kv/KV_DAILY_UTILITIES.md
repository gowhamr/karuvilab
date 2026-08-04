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


