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


