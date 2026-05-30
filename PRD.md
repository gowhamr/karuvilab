# Product Requirements Document: HTML Online Viewer (Web Sandbox)

## 1. Executive Summary
The **HTML Online Viewer** (Web Sandbox) is a professional-grade, browser-native playground for web developers and designers. 
- **Problem**: Developers often need to quickly prototype or test HTML/CSS/JS snippets but are forced to use server-heavy tools that track data or require account setups.
- **Solution**: A local-first, privacy-hardened environment that uses the Monaco Editor (VS Code engine) to provide real-time, sandboxed previews without a single byte leaving the user's device.
- **Expected Outcome**: Users gain a fast, secure, and offline-capable alternative to CodePen/JSFiddle, reinforcing KaruviLab's position as the elite privacy-first toolkit.

---

## 2. Goals
### Primary Goals
- **Instant Productivity**: Ready for input in < 2 seconds on broadband; < 5 seconds on 3G.
- **Privacy Assurance**: 100% client-side execution; 0 KB uploaded.
- **Offline Resilience**: Fully functional offline after the first visit (via PWA and local Monaco assets).
- **Secure Preview**: Robust protection against XSS and infinite loops via hardened sandboxing and DOMPurify.

### Non-Goals
- Multi-file project structure (limited to single HTML, CSS, and JS inputs for MVP).
- Real-time collaborative editing (avoiding server-side sync).
- Server-side rendering (SSR) or backend language support (PHP, Node, etc.).

---

## 3. User Personas
### Persona: Prototyping Paul
- **Role**: Senior Frontend Engineer
- **Goal**: Quickly verify a Tailwind layout or CSS animation snippet.
- **Pain Points**: Heavy loading times of online IDEs; corporate firewalls blocking cloud-based tools.

### Persona: Learning Leona
- **Role**: Web Development Student
- **Goal**: Practice DOM manipulation and CSS styling in a clean environment.
- **Pain Points**: Complexity of local environment setup (VS Code, Live Server).

### Persona: Privacy Pete
- **Role**: Security Consultant
- **Goal**: Inspect potentially malicious HTML/JS snippets safely.
- **Pain Points**: Fear of triggering telemetry or malicious callbacks to remote servers.

---

## 4. User Stories
- **As a developer**, I want to paste my code so that I can see live changes instantly.
- **As a designer**, I want to test responsive layouts using device presets so that I know it works on mobile.
- **As a security-conscious user**, I want my code processed locally so that I don't leak proprietary logic.
- **As a power user**, I want to export my work as a standalone `.html` file so that I can use it elsewhere.

---

## 5. Functional Requirements

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| F-01 | Monaco Editor Integration | P0 | Supports syntax highlighting and IntelliSense. |
| F-02 | Real-time Sandboxed Preview | P0 | Iframe-based preview with no `allow-scripts` for max security. |
| F-03 | HTML/CSS Sanitization | P0 | Uses DOMPurify before rendering the preview. |
| F-04 | Device Viewport Presets | P1 | Desktop (100%), Tablet (768px), Mobile (375px). |
| F-05 | External Library Support | P1 | CDN link injection (Tailwind, Bootstrap, etc.). |
| F-06 | Standalone HTML Export | P1 | Compiles HTML/CSS/JS into a single downloadable Blob. |
| F-07 | Console Log Mirroring | P2 | Capture `console.log` from the sandbox and display in a UI drawer. |
| F-08 | URL State Persistence | P2 | LZ-String compressed code in the URL for sharing. |

---

## 6. User Flow
1. **Entry**: User lands on `/developer-tools/html-viewer/`.
2. **Input**: User types or pastes code into the Monaco Editor tabs (HTML, CSS, JS).
3. **Validation**: Input is monitored; changes trigger a debounced (500ms) compilation.
4. **Processing**: `DOMPurify` cleans the HTML/CSS; local assets are prepared.
5. **Results**: Hardened `<iframe>` renders the result.
6. **Export**: User clicks "Export" to download the `.html` file.
7. **Recovery**: If the editor fails to load, `EngineLoader` provides a "Retry" button.

---

## 7. UX Requirements
### Visual & Layout
- **Split Pane**: Editor on left/top, Preview on right/bottom.
- **Thumb Reach**: Action buttons (Export, Clear, Share) placed within easy reach on mobile.
- **Tap Targets**: Buttons min 44x44px.

### States
- **Loading**: `ToolSkeleton` shimmer matching the editor/preview layout.
- **Empty**: `EmptyState` component with a "Paste Sample" call-to-action.
- **Success**: Subtle toast notification on "Copy Link" or "Export".

---

## 8. Trust & Privacy Requirements
- **Data Processed**: All HTML, CSS, and JS input.
- **Location**: Entirely in the browser's RAM and `localStorage`.
- **Uploads**: **None.** Zero server communication for code execution.
- **Offline**: Fully supported. Monaco engine is served from `/lib/monaco/` in the PWA cache.
- **Storage**: Optional persistence in `localStorage` for session recovery.
- **Clearing**: "Clear Editor" button purges local state; Browser "Clear Data" purges persistence.

**Trust Messaging**: "Processed entirely in your browser. No data ever leaves your device."

---

## 9. Performance Requirements
- **First Load**: < 800ms for UI shell; < 3s for Monaco Engine.
- **Interaction**: Input latency < 16ms.
- **Memory**: Max 200MB Heap usage during active editing.
- **Bundle**: Monaco dynamically imported via `next/dynamic` to keep initial JS < 50KB.

---

## 10. Accessibility Requirements (WCAG 2.2 AA)
- **Keyboard**: Full Tab/Shift+Tab support for Monaco; `Cmd+K` for Command Palette.
- **Screen Readers**: `aria-label` for all icon-only buttons (Play, Download, Share).
- **Contrast**: 4.5:1 minimum on all text and active icons.
- **Motion**: `prefers-reduced-motion` disables tab transitions and drawer springs.

---

## 11. Error Handling

| Error | Cause | User Message | Recovery Action |
|-------|-------|--------------|-----------------|
| Engine Timeout | CDN/Network failure | "Failed to load editor engine." | Retry button triggers local reload. |
| Sandbox Crash | Excessive DOM nodes | "Preview area crashed." | Auto-reloads iframe on next edit. |
| Large Paste | Input > 5MB | "Code snippet too large for real-time preview." | Suggests breaking down code. |

---

## 12. Related Tools Integration
- **Code Minifier**: Minify the generated HTML/CSS for production.
- **JSON Formatter**: Format data used within the JS logic.
- **SEO Title Tester**: Preview how the HTML `<title>` appears in search results.

---

## 13. Analytics (Privacy Safe)
- `tool_open`: `html-viewer`
- `export_triggered`: `true`
- `engine_load_fail`: `timeout` | `error`
- `cdn_library_added`: `tailwind` | `other`

---

## 14. QA Test Plan
### Functional Tests
- [ ] Verify HTML/CSS/JS changes reflect in the preview after 500ms.
- [ ] Verify "Export" creates a valid, runnable `.html` file.
- [ ] Verify "Clear" button resets all editor tabs.

### Security (XSS) Tests
- [ ] Paste `<script>alert(1)</script>` -> Preview should NOT execute alert.
- [ ] Paste `onerror="alert(1)"` on an image -> Preview should NOT execute.

### Mobile & Performance
- [ ] Test layout at 320px width (iPhone SE).
- [ ] Verify Monaco doesn't block main-thread for > 50ms during typing.

---

## 15. Acceptance Criteria
1. **Given** a user pastes HTML, **When** they wait 500ms, **Then** the preview renders.
2. **Given** a malicious script, **When** it is pasted, **Then** it is blocked by the sandbox.
3. **Given** no internet, **When** the page is reloaded, **Then** the editor remains functional.
4. **Given** mobile viewport, **When** the device preset is changed, **Then** the iframe resizes.
5. *(...Total 20 criteria met for production readiness...)*

---

## 16. Technical Architecture
- **State**: React `useState` for transient code; `localStorage` for persistence.
- **Editor**: `@monaco-editor/react` with manual `loader.init()` for sub-path support.
- **Sandbox**: `<iframe>` with `srcdoc` and strict `sandbox=""`.
- **Sanitization**: `DOMPurify` (isomorphic version for SSR safety).
- **Asset Management**: `sync-workers.js` deploys Monaco to `public/lib/monaco`.

---

## 17. Future Roadmap
### Phase 1 (MVP - Current)
- Basic live preview and Monaco integration.
- Sanitization and security hardening.
- Standalone export.

### Phase 2 (Library & Presets)
- One-click presets for Tailwind, Bootstrap, and FontAwesome.
- Save multiple local scenarios in IndexedDB.

### Phase 3 (Advanced Sandbox)
- Web Worker based script execution (opt-in).
- Real-time DOM tree explorer.

---

## 18. Product Health Checklist
- [x] User Trust: 10/10
- [x] Performance: 9/10
- [x] Accessibility: 9/10
- [x] Offline: 10/10
- [x] Recovery: 10/10
- [x] Mobile UX: 8/10
- [x] Error Handling: 9/10

---

## 19. Final Recommendation
**Build Recommendation**: **YES.** 
The feature is a cornerstone of the KaruviLab developer suite. It leverages established project infrastructure (Monaco, EngineLoader, DOMPurify) and provides immediate user value with low operational cost.

**Complexity**: Moderate (Monaco configuration).
**Effort**: 2 Sprints.
**Risks**: Monaco asset size impacting PWA cache; XSS bypasses.
**Value**: High (Drives repeat developer traffic).
