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
- **Route:** `/developer-tools/image-seo`

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
- **Page File:** `app/(tools)/developer-tools/image-seo/page.tsx`
- **Client Component:** `app/(tools)/developer-tools/image-seo/ImageSeoClient.tsx`
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
  - `app/(tools)/developer-tools/image-seo/page.tsx`
  - `app/(tools)/developer-tools/image-seo/ImageSeoClient.tsx`
  - `app/(tools)/developer-tools/image-seo/ImageSeoClientWrapper.tsx`
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
- **Route:** `/developer-tools/meta-tags`

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
- **Page File:** `app/(tools)/developer-tools/meta-tags/page.tsx`
- **Client Component:** `app/(tools)/developer-tools/meta-tags/MetaTagsClient.tsx`
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
  - `app/(tools)/developer-tools/meta-tags/page.tsx`
  - `app/(tools)/developer-tools/meta-tags/MetaTagsClient.tsx`
  - `app/(tools)/developer-tools/meta-tags/MetaTagsClientWrapper.tsx`
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
- **Route:** `/developer-tools/og-preview`

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
- **Page File:** `app/(tools)/developer-tools/og-preview/page.tsx`
- **Client Component:** `app/(tools)/developer-tools/og-preview/OgPreviewClient.tsx`
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
  - `app/(tools)/developer-tools/og-preview/page.tsx`
  - `app/(tools)/developer-tools/og-preview/OgPreviewClient.tsx`
  - `app/(tools)/developer-tools/og-preview/OgPreviewClientWrapper.tsx`
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
- **Route:** `/developer-tools/robots-txt`

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
- **Page File:** `app/(tools)/developer-tools/robots-txt/page.tsx`
- **Client Component:** `app/(tools)/developer-tools/robots-txt/RobotsTxtClient.tsx`
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
  - `app/(tools)/developer-tools/robots-txt/page.tsx`
  - `app/(tools)/developer-tools/robots-txt/RobotsTxtClient.tsx`
  - `app/(tools)/developer-tools/robots-txt/RobotsTxtClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="seo-title"></a>Seo Title

#### Identity
- **ID:** `seo-title`
- **Name:** Seo Title
- **Category:** Developer Tools
- **Route:** `/developer-tools/seo-title`

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
- **Page File:** `app/(tools)/developer-tools/seo-title/page.tsx`
- **Client Component:** `app/(tools)/developer-tools/seo-title/SeoTitleClient.tsx`
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
  - `app/(tools)/developer-tools/seo-title/page.tsx`
  - `app/(tools)/developer-tools/seo-title/SeoTitleClient.tsx`
  - `app/(tools)/developer-tools/seo-title/SeoTitleClientWrapper.tsx`
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
- **Route:** `/developer-tools/sitemap-generator`

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
- **Page File:** `app/(tools)/developer-tools/sitemap-generator/page.tsx`
- **Client Component:** `app/(tools)/developer-tools/sitemap-generator/SitemapClient.tsx`
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
  - `app/(tools)/developer-tools/sitemap-generator/page.tsx`
  - `app/(tools)/developer-tools/sitemap-generator/SitemapClient.tsx`
  - `app/(tools)/developer-tools/sitemap-generator/SitemapClientWrapper.tsx`
- **Confidence Level:** 100%
- **Verification Source:** Repository scan (2026-07-23)

---

### <a id="slug-generator"></a>Slug Generator

#### Identity
- **ID:** `slug-generator`
- **Name:** Slug Generator
- **Category:** Developer Tools
- **Route:** `/developer-tools/slug-generator`

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
- **Page File:** `app/(tools)/developer-tools/slug-generator/page.tsx`
- **Client Component:** `app/(tools)/developer-tools/slug-generator/SlugClient.tsx`
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
  - `app/(tools)/developer-tools/slug-generator/page.tsx`
  - `app/(tools)/developer-tools/slug-generator/SlugClient.tsx`
  - `app/(tools)/developer-tools/slug-generator/SlugClientWrapper.tsx`
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


