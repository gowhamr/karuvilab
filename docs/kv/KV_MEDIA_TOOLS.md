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


