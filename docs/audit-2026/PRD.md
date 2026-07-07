# KaruviLab Product Requirements Document (PRD) - Audit 2026

## Executive Summary
KaruviLab is a fast, offline-capable, and privacy-first browser-native productivity platform. It empowers developers, financial professionals, and everyday users with a massive suite of tools that process data entirely on their device, guaranteeing zero server uploads and absolute data privacy.

## Vision
To be the ultimate local-first digital workbench that replaces the myriad of sketchy, ad-ridden, server-dependent online tools with secure, desktop-grade performance applications that run seamlessly in any modern browser.

## Technology Stack
- **Framework**: Next.js (App Router)
- **UI & Styling**: React, Tailwind CSS
- **State Management**: Zustand
- **Local Persistence**: IndexedDB (via custom `idb-storage`)
- **Off-Main-Thread Processing**: Web Workers (managed via Comlink)
- **Offline & PWA**: Workbox Service Worker (`sw.js`)
- **Language**: TypeScript

## Tool Categories
KaruviLab organizes its extensive utility suite into the following categories:
- **Calculators**: Precision tools for financial, date, and mathematical computations.
- **PDF Tools**: Fast, browser-side PDF merging, compression, and conversion.
- **Image Tools**: Optimize, convert, and resize images locally.
- **Security Tools**: Private password generators, encoders, and hash utilities.
- **Developer Tools**: Utilities for formatting, minifying, diff checking, and debugging.
- **Productivity**: Tools for time management, charting, and reminders (e.g., local Calendar).
- **Media Tools**: Professional browser-native editing for audio, video, and GIFs.
- **Banking Tools**: Specialized parsers for core banking traces, EMV, and SWIFT data.

## Feature Status

### ✅ Implemented
- **Zero-Server-Upload File Processing**: All data manipulation (PDFs, Images, Code) happens directly in the browser via Web Workers and WebAssembly.
- **Offline Resilience via PWA**: Service Workers aggressively cache the app shell, static assets, and tool pages for guaranteed offline access.
- **IndexedDB State Persistence**: User preferences, tool histories, and processed outputs are stored locally and restored on reload.
- **Extensive Tool Registries**: Over 130+ specialized tools systematically categorized and routed.
- **Heavy Computation Offloading**: A robust `WorkerOrchestrator` using Comlink prevents the main thread from blocking during intensive tasks.

### 🚧 Partially Implemented
- **Mobile-first Ergonomics**: Basic responsive design is present, but touch targets, complex UI panels, and layout shifts on small screens require refinement.
- **Multi-Tool Workflows (Batch Processing)**: `BatchStore` and `WorkflowStore` exist, but chaining the output from one tool perfectly into the input of another is not fully seamless yet.

### 🗓️ Planned
- **Multi-tab Workbench**: Allow running multiple isolated tool instances in native UI tabs without leaving the single-page application.
- **Advanced Pipeline Chaining**: UI for connecting tools directly (e.g., PDF Merge -> PDF Compress) as an automated macro.

### ❌ Missing
- **Cloud Sync / Account System**: Intentionally excluded by default to maintain the zero-upload privacy promise.
- **Native Mobile Apps (iOS/Android via App Stores)**: KaruviLab relies entirely on its PWA implementation for mobile deployment, avoiding app store ecosystems.
