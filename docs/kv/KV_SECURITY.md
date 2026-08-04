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


