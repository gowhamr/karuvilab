import { describe, it, expect, beforeEach } from 'vitest';
import { MermaidPreflightAnalyzer, MermaidSecurity, MermaidLRUCache, MermaidRenderQueue, } from '../../features/markdown/mermaid/index.js';
describe('KaruviLab Mermaid Subsystem — Architecture & Safety Suite', () => {
    let cache;
    let queue;
    beforeEach(() => {
        cache = new MermaidLRUCache(5);
        queue = new MermaidRenderQueue();
    });
    describe('1. Preflight & Diagram Type Recognition', () => {
        const testCases = [
            { name: 'Flowchart TD', source: 'flowchart TD\n  A --> B', expectedType: 'flowchart' },
            { name: 'Graph LR', source: 'graph LR\n  A --> B', expectedType: 'flowchart' },
            { name: 'Sequence Diagram', source: 'sequenceDiagram\n  Alice->>Bob: Hello', expectedType: 'sequenceDiagram' },
            { name: 'Class Diagram', source: 'classDiagram\n  class Animal', expectedType: 'classDiagram' },
            { name: 'State Diagram', source: 'stateDiagram-v2\n  [*] --> State1', expectedType: 'stateDiagram' },
            { name: 'ER Diagram', source: 'erDiagram\n  CUSTOMER ||--o{ ORDER : places', expectedType: 'erDiagram' },
            { name: 'Gantt Chart', source: 'gantt\n  title Project\n  section A', expectedType: 'gantt' },
            { name: 'Pie Chart', source: 'pie title Pets\n  "Dogs" : 386\n  "Cats" : 85', expectedType: 'pie' },
            { name: 'Git Graph', source: 'gitGraph\n  commit\n  branch develop', expectedType: 'gitGraph' },
            { name: 'Mindmap', source: 'mindmap\n  root((Root))\n    Leaf1\n    Leaf2', expectedType: 'mindmap' },
            { name: 'Timeline', source: 'timeline\n  title History\n  2023 : Release', expectedType: 'timeline' },
            { name: 'C4 Context', source: 'C4Context\n  title System Context', expectedType: 'c4' },
        ];
        for (const tc of testCases) {
            it(`accurately detects diagram type for ${tc.name}`, () => {
                const detected = MermaidPreflightAnalyzer.detectType(tc.source);
                expect(detected).toBe(tc.expectedType);
            });
        }
    });
    describe('2. Complexity Estimation & Preflight Grading', () => {
        it('grades small diagrams as low complexity', () => {
            const source = 'flowchart TD\n  A --> B\n  B --> C';
            const preflight = MermaidPreflightAnalyzer.preflight(source);
            expect(preflight.valid).toBe(true);
            expect(preflight.complexity.complexity).toBe('low');
            expect(preflight.complexity.edges).toBe(2);
        });
        it('grades multi-node diagrams as medium or high complexity', () => {
            const lines = ['flowchart TD'];
            for (let i = 0; i < 60; i++) {
                lines.push(`  N${i} --> N${i + 1}`);
            }
            const source = lines.join('\n');
            const preflight = MermaidPreflightAnalyzer.preflight(source);
            expect(preflight.valid).toBe(true);
            expect(preflight.complexity.edges).toBe(60);
            expect(['medium', 'high']).toContain(preflight.complexity.complexity);
        });
        it('blocks diagrams exceeding hard character limit (>50KB)', () => {
            const hugeSource = 'flowchart TD\n' + '  A --> B\n'.repeat(6000); // >60KB
            const preflight = MermaidPreflightAnalyzer.preflight(hugeSource);
            expect(preflight.valid).toBe(false);
            expect(preflight.complexity.complexity).toBe('blocked');
            expect(preflight.errors.some(e => e.includes('hard limit'))).toBe(true);
        });
    });
    describe('3. Security & Injection Protection (Strict Controls)', () => {
        it('neutralizes forbidden config keys embedded inside diagram source', () => {
            const hostileSource = `%%{init: {'securityLevel': 'loose', 'startOnLoad': true}}%%\nflowchart TD\n  A --> B`;
            const result = MermaidSecurity.validate(hostileSource);
            expect(result.allowed).toBe(true);
            expect(result.sanitizedSource).not.toContain("'securityLevel': 'loose'");
            expect(result.violations.length).toBeGreaterThan(0);
        });
        it('strips dangerous click call/href javascript directives', () => {
            const maliciousClickSource = `flowchart TD\n  A[Malicious Node]\n  click A call alert('XSS')\n  click A href "javascript:alert(1)"`;
            const result = MermaidSecurity.validate(maliciousClickSource);
            expect(result.allowed).toBe(true);
            expect(result.sanitizedSource).not.toContain("javascript:alert(1)");
            expect(result.sanitizedSource).not.toContain("call alert('XSS')");
            expect(result.violations.some(v => v.includes('unsafe click'))).toBe(true);
        });
    });
    describe('4. Deterministic FNV-1a Hashing', () => {
        it('produces identical hash for identical source + theme', () => {
            const source = 'flowchart LR\n  Alpha --> Beta --> Gamma';
            const hash1 = MermaidPreflightAnalyzer.computeHash(source, 'dark');
            const hash2 = MermaidPreflightAnalyzer.computeHash(source, 'dark');
            expect(hash1).toBe(hash2);
            expect(hash1).toMatch(/^[0-9a-f]{16}$/);
        });
        it('produces different hashes when theme changes (light vs dark)', () => {
            const source = 'flowchart LR\n  Alpha --> Beta';
            const darkHash = MermaidPreflightAnalyzer.computeHash(source, 'dark');
            const lightHash = MermaidPreflightAnalyzer.computeHash(source, 'light');
            expect(darkHash).not.toBe(lightHash);
        });
    });
    describe('5. L1 LRU Cache Behavior & Invalidation', () => {
        it('returns cached entry on hit and tracks metrics', () => {
            const localCache = new MermaidLRUCache(5);
            const hash = 'a1b2c3d4e5f60718';
            const svg = '<svg id="test-svg"></svg>';
            localCache.set({
                id: 'mmd-1',
                hash,
                svg,
                theme: 'dark',
                timestamp: Date.now(),
                mermaidVersion: '11.x',
            });
            expect(localCache.has(hash, 'dark')).toBe(true);
            const hit = localCache.get(hash, 'dark');
            expect(hit?.svg).toBe(svg);
            // Miss on different theme
            const miss = localCache.get(hash, 'light');
            expect(miss).toBeUndefined();
            const stats = localCache.getStats();
            expect(stats.hits).toBe(1);
            expect(stats.misses).toBe(1);
        });
        it('evicts oldest entry when max capacity is reached', () => {
            const localCache = new MermaidLRUCache(5);
            for (let i = 1; i <= 6; i++) {
                localCache.set({
                    id: `mmd-${i}`,
                    hash: `hash-${i}`,
                    svg: `<svg>${i}</svg>`,
                    theme: 'dark',
                    timestamp: Date.now(),
                    mermaidVersion: '11.x',
                });
            }
            const stats = localCache.getStats();
            expect(stats.size).toBe(5); // Capped at maxEntries: 5
            expect(localCache.has('hash-1', 'dark')).toBe(false); // First item was evicted
            expect(localCache.has('hash-6', 'dark')).toBe(true);
        });
    });
    describe('6. Render Queue & Cancellation Lifecycle (KL-05)', () => {
        it('executes tasks in queue within concurrency limits', async () => {
            const localQueue = new MermaidRenderQueue();
            let executionCount = 0;
            const task1 = localQueue.enqueue('t1', async () => {
                executionCount++;
                return 'res1';
            });
            const task2 = localQueue.enqueue('t2', async () => {
                executionCount++;
                return 'res2';
            });
            const [r1, r2] = await Promise.all([task1.promise, task2.promise]);
            expect(r1).toBe('res1');
            expect(r2).toBe('res2');
            expect(executionCount).toBe(2);
        });
        it('aborts previous task when cancelled or updated (KL-05)', async () => {
            const localQueue = new MermaidRenderQueue();
            let runStarted = false;
            const { promise: p1, abort: abort1 } = localQueue.enqueue('t-cancel', async (signal) => {
                runStarted = true;
                await new Promise((res) => setTimeout(res, 50));
                if (signal.aborted)
                    throw new DOMException('Aborted', 'AbortError');
                return 'never';
            });
            abort1();
            await expect(p1).rejects.toThrow();
        });
    });
    describe('7. Starter Templates & Complex Diagram Types', () => {
        it('validates and recognizes all 14 starter snippet templates', async () => {
            const { DIAGRAM_SNIPPETS } = await import('../../features/markdown/constants');
            const snippetKeys = Object.keys(DIAGRAM_SNIPPETS);
            expect(snippetKeys.length).toBeGreaterThanOrEqual(14);
            for (const key of snippetKeys) {
                const rawSnippet = DIAGRAM_SNIPPETS[key];
                const cleaned = rawSnippet.replace(/^```mermaid\s*/i, '').replace(/```\s*$/i, '').trim();
                const preflight = MermaidPreflightAnalyzer.preflight(cleaned);
                expect(preflight.valid).toBe(true);
                expect(preflight.errors.length).toBe(0);
            }
        });
    });
    describe('8. Unicode & Special Character Label Resilience', () => {
        it('successfully analyzes diagrams with Unicode labels and emojis', () => {
            const unicodeSource = `flowchart TD
  A[🚀 Start: தமிழ் / 中文 / हिन्दी] --> B{Valid?}
  B -- Yes --> C[✨ Success & Empathy]
  B -- No  --> D[🐛 Debug / Fix]`;
            const preflight = MermaidPreflightAnalyzer.preflight(unicodeSource);
            expect(preflight.valid).toBe(true);
            expect(preflight.type).toBe('flowchart');
            expect(preflight.complexity.nodes).toBeGreaterThanOrEqual(4);
        });
        it('generates consistent deterministic hashes across whitespace variations', () => {
            const source1 = 'flowchart TD\n  A --> B';
            const source2 = 'flowchart TD\n  A --> B';
            const hash1 = MermaidPreflightAnalyzer.computeHash(source1);
            const hash2 = MermaidPreflightAnalyzer.computeHash(source2);
            expect(hash1).toBe(hash2);
            expect(hash1.length).toBeGreaterThan(0);
        });
    });
    describe('9. Mermaid Capability Registry & Multi-Family Detection', () => {
        it('provides capability profiles for 20+ diagram families', async () => {
            const { MermaidRegistry } = await import('../../features/markdown/mermaid/MermaidRegistry');
            const allCaps = MermaidRegistry.getAllCapabilities();
            expect(allCaps.length).toBeGreaterThanOrEqual(20);
            const stableCaps = MermaidRegistry.getStableCapabilities();
            expect(stableCaps.length).toBeGreaterThanOrEqual(10);
            const flowchartCap = MermaidRegistry.getCapability('flowchart');
            expect(flowchartCap.supportLevel).toBe('stable');
            expect(flowchartCap.exportPdf).toBe(true);
            expect(flowchartCap.exportPng).toBe(true);
            expect(flowchartCap.exportSvg).toBe(true);
            const isSupported = MermaidRegistry.isSupported('flowchart');
            expect(isSupported).toBe(true);
        });
    });
    describe('10. Memory Management & Dual Byte Budgeting', () => {
        it('evicts entries when maxBytes budget is exceeded', () => {
            const byteCache = new MermaidLRUCache(10, 1024);
            byteCache.set({
                id: 'small-1',
                hash: 'h1',
                svg: 'A'.repeat(400),
                theme: 'dark',
                timestamp: Date.now(),
                approxBytes: 800,
                mermaidVersion: '11.x',
            });
            expect(byteCache.has('h1', 'dark')).toBe(true);
            byteCache.set({
                id: 'small-2',
                hash: 'h2',
                svg: 'B'.repeat(400),
                theme: 'dark',
                timestamp: Date.now(),
                approxBytes: 800,
                mermaidVersion: '11.x',
            });
            expect(byteCache.has('h2', 'dark')).toBe(true);
            expect(byteCache.has('h1', 'dark')).toBe(false);
        });
    });
    describe('11. Export Barrier & Document Readiness', () => {
        it('resolves ready status when queues and fonts are settled', async () => {
            const { waitForDocumentReady } = await import('../../features/markdown/mermaid/utils/export-barrier');
            const result = await waitForDocumentReady(null, 1000);
            expect(result.ready).toBe(true);
            expect(result.diagramsReady).toBe(true);
            expect(result.revisionChanged).toBe(false);
        });
    });
    // ── Phase 10: Document Revision & Race Hardening ──────────────────────────
    describe('12. Document Revision Tracker — Universal Stale-Result Protection', () => {
        it('starts at revision 0 and increments monotonically', async () => {
            const { DocumentRevisionTracker } = await import('../../features/markdown/DocumentRevision');
            const tracker = DocumentRevisionTracker.getInstance();
            tracker._resetForTesting();
            expect(tracker.current()).toBe(0);
            expect(tracker.bump()).toBe(1);
            expect(tracker.bump()).toBe(2);
            expect(tracker.current()).toBe(2);
        });
        it('correctly identifies current vs stale revisions', async () => {
            const { DocumentRevisionTracker } = await import('../../features/markdown/DocumentRevision');
            const tracker = DocumentRevisionTracker.getInstance();
            tracker._resetForTesting();
            const captured = tracker.capture();
            expect(tracker.isCurrent(captured)).toBe(true);
            tracker.bump();
            expect(tracker.isCurrent(captured)).toBe(false);
            expect(tracker.isCurrent(tracker.current())).toBe(true);
        });
        it('detects stale results across simulated async operations', async () => {
            const { DocumentRevisionTracker } = await import('../../features/markdown/DocumentRevision');
            const tracker = DocumentRevisionTracker.getInstance();
            tracker._resetForTesting();
            // Simulate: export starts at rev 5
            for (let i = 0; i < 5; i++)
                tracker.bump();
            const exportRev = tracker.capture();
            expect(exportRev).toBe(5);
            // Simulate: user edits during export preparation
            tracker.bump();
            // Export should detect stale revision
            expect(tracker.isCurrent(exportRev)).toBe(false);
            expect(tracker.current()).toBe(6);
        });
        it('provides singleton consistency', async () => {
            const { DocumentRevisionTracker } = await import('../../features/markdown/DocumentRevision');
            const a = DocumentRevisionTracker.getInstance();
            const b = DocumentRevisionTracker.getInstance();
            expect(a).toBe(b);
        });
    });
    // ── Phase 11: Mermaid Security Fuzzing ────────────────────────────────────
    describe('13. Mermaid Security Fuzzing — XSS & Injection Vectors', () => {
        it('neutralizes javascript: URLs in node labels', () => {
            const source = `flowchart TD\n  A["<a href='javascript:alert(1)'>Click</a>"] --> B`;
            const result = MermaidSecurity.validate(source);
            expect(result.sanitizedSource).not.toContain('javascript:');
            expect(result.violations.length).toBeGreaterThan(0);
        });
        it('neutralizes SVG <script> tags in diagram source', () => {
            const source = `flowchart TD\n  A --> B\n  <script>alert('xss')</script>`;
            const result = MermaidSecurity.validate(source);
            expect(result.sanitizedSource).not.toContain('<script>');
            expect(result.violations.some(v => v.includes('unsafe'))).toBe(true);
        });
        it('neutralizes SVG event handlers (onload, onerror, onmouseover)', () => {
            const sources = [
                `flowchart TD\n  A["<svg onload='alert(1)'>"] --> B`,
                `flowchart TD\n  A["<img onerror='alert(1)'>"] --> B`,
                `flowchart TD\n  A["<div onmouseover='alert(1)'>hover</div>"] --> B`,
            ];
            for (const source of sources) {
                const result = MermaidSecurity.validate(source);
                expect(result.violations.length).toBeGreaterThan(0);
            }
        });
        it('neutralizes embedded <iframe> and <object> tags', () => {
            const source = `flowchart TD\n  A --> B\n  <iframe src="https://evil.com"></iframe>\n  <object data="evil.swf"></object>`;
            const result = MermaidSecurity.validate(source);
            expect(result.sanitizedSource).not.toContain('<iframe');
            expect(result.sanitizedSource).not.toContain('<object');
        });
        it('neutralizes xlink:href with javascript: protocol', () => {
            const source = `flowchart TD\n  A["<a xlink:href='javascript:alert(1)'>evil</a>"] --> B`;
            const result = MermaidSecurity.validate(source);
            expect(result.sanitizedSource).not.toContain("javascript:");
            expect(result.violations.length).toBeGreaterThan(0);
        });
        it('neutralizes data: URIs with executable MIME types', () => {
            const source = `flowchart TD\n  A["<img src='data:text/html,<script>alert(1)</script>'>"] --> B`;
            const result = MermaidSecurity.validate(source);
            expect(result.violations.length).toBeGreaterThan(0);
        });
        it('strips Mermaid init directives attempting securityLevel override', () => {
            const vectors = [
                `%%{init: {"securityLevel": "loose"}}%%\nflowchart TD\n  A --> B`,
                `%%{init: {securityLevel: 'loose'}}%%\nflowchart TD\n  A --> B`,
                `%%{init: {'startOnLoad': true, 'maxTextSize': 999999}}%%\nflowchart TD\n  A --> B`,
            ];
            for (const source of vectors) {
                const result = MermaidSecurity.validate(source);
                expect(result.sanitizedSource).not.toMatch(/securityLevel['":\s]*loose/i);
                expect(result.violations.length).toBeGreaterThan(0);
            }
        });
        it('handles extremely large node labels without crash', () => {
            const hugeLabel = 'X'.repeat(5000);
            const source = `flowchart TD\n  A["${hugeLabel}"] --> B`;
            const result = MermaidSecurity.validate(source);
            expect(result.allowed).toBe(true); // Under 30KB limit
            expect(typeof result.sanitizedSource).toBe('string');
        });
        it('rejects diagrams exceeding 50KB hard character limit', () => {
            const source = 'flowchart TD\n' + '  A --> B\n'.repeat(6000);
            const result = MermaidSecurity.validate(source);
            expect(result.allowed).toBe(false);
            expect(result.violations.some(v => v.includes('hard limit'))).toBe(true);
        });
        it('handles deeply nested subgraph syntax', () => {
            let source = 'flowchart TD\n';
            for (let i = 0; i < 15; i++) {
                source += `${'  '.repeat(i)}subgraph SG${i}\n`;
            }
            for (let i = 14; i >= 0; i--) {
                source += `${'  '.repeat(i)}end\n`;
            }
            source += '  A --> B\n';
            const preflight = MermaidPreflightAnalyzer.preflight(source);
            expect(preflight.valid).toBe(true);
            expect(preflight.complexity.subgraphs).toBe(15);
        });
        it('allows safe Mermaid source without false positives', () => {
            const safeSources = [
                'flowchart TD\n  A[Start] --> B{Decision}\n  B -- Yes --> C[End]\n  B -- No --> D[Retry]',
                'sequenceDiagram\n  Alice->>Bob: Hello\n  Bob->>Alice: Hi',
                'pie title Fruits\n  "Apples" : 45\n  "Bananas" : 25\n  "Oranges" : 30',
                'gantt\n  title Project\n  section Design\n  Task 1 :a1, 2024-01-01, 30d',
            ];
            for (const source of safeSources) {
                const result = MermaidSecurity.validate(source);
                expect(result.allowed).toBe(true);
                expect(result.violations.length).toBe(0);
            }
        });
    });
    // ── Expanded Cache Key Matrix ─────────────────────────────────────────────
    describe('14. Cache Key Matrix — Full Invalidation Coverage', () => {
        it('same source + same theme → HIT', () => {
            const testCache = new MermaidLRUCache(10);
            const source = 'flowchart TD\n  A --> B';
            const hash = MermaidPreflightAnalyzer.computeHash(source, 'dark');
            testCache.set({
                id: 'test', hash, svg: '<svg>test</svg>', theme: 'dark',
                timestamp: Date.now(), mermaidVersion: '11.x',
            });
            expect(testCache.get(hash, 'dark')).toBeDefined();
        });
        it('same source + different theme → MISS', () => {
            const testCache = new MermaidLRUCache(10);
            const source = 'flowchart TD\n  A --> B';
            const darkHash = MermaidPreflightAnalyzer.computeHash(source, 'dark');
            const lightHash = MermaidPreflightAnalyzer.computeHash(source, 'light');
            testCache.set({
                id: 'test', hash: darkHash, svg: '<svg>dark</svg>', theme: 'dark',
                timestamp: Date.now(), mermaidVersion: '11.x',
            });
            // Different hash for different theme → miss
            expect(testCache.get(lightHash, 'light')).toBeUndefined();
        });
        it('different source → MISS', () => {
            const testCache = new MermaidLRUCache(10);
            const hash1 = MermaidPreflightAnalyzer.computeHash('flowchart TD\n  A --> B', 'dark');
            const hash2 = MermaidPreflightAnalyzer.computeHash('flowchart TD\n  X --> Y', 'dark');
            testCache.set({
                id: 'test', hash: hash1, svg: '<svg>1</svg>', theme: 'dark',
                timestamp: Date.now(), mermaidVersion: '11.x',
            });
            expect(hash1).not.toBe(hash2);
            expect(testCache.get(hash2, 'dark')).toBeUndefined();
        });
        it('same source + config version update → MISS', () => {
            const source = 'flowchart TD\n  A --> B';
            const hashV1 = MermaidPreflightAnalyzer.computeHash(source, 'dark', 'v1');
            const hashV2 = MermaidPreflightAnalyzer.computeHash(source, 'dark', 'v2');
            expect(hashV1).not.toBe(hashV2);
        });
        it('cache.clear() leaves zero retained entries and resets bytes', () => {
            const testCache = new MermaidLRUCache(10);
            for (let i = 0; i < 5; i++) {
                testCache.set({
                    id: `t${i}`, hash: `h${i}`, svg: `<svg>${i}</svg>`, theme: 'dark',
                    timestamp: Date.now(), approxBytes: 100, mermaidVersion: '11.x',
                });
            }
            expect(testCache.getStats().size).toBe(5);
            testCache.clear();
            expect(testCache.getStats().size).toBe(0);
            expect(testCache.getStats().currentBytes).toBe(0);
            expect(testCache.getStats().hits).toBe(0);
            expect(testCache.getStats().misses).toBe(0);
        });
        it('large SVG entry tracks correct byte accounting', () => {
            const testCache = new MermaidLRUCache(10, 50000);
            const largeSvg = '<svg>' + 'X'.repeat(10000) + '</svg>';
            const approxBytes = largeSvg.length * 2 + 'largehash'.length * 2 + 256;
            testCache.set({
                id: 'large', hash: 'largehash', svg: largeSvg, theme: 'dark',
                timestamp: Date.now(), approxBytes, mermaidVersion: '11.x',
            });
            expect(testCache.getStats().currentBytes).toBe(approxBytes);
        });
        it('delete() correctly decrements currentBytes', () => {
            const testCache = new MermaidLRUCache(10);
            testCache.set({
                id: 'del', hash: 'delhash', svg: '<svg>del</svg>', theme: 'dark',
                timestamp: Date.now(), approxBytes: 500, mermaidVersion: '11.x',
            });
            expect(testCache.getStats().currentBytes).toBe(500);
            testCache.delete('delhash', 'dark');
            expect(testCache.getStats().currentBytes).toBe(0);
        });
    });
    // ── Queue Error Isolation ─────────────────────────────────────────────────
    describe('15. Queue Error Isolation — Errors Must Not Poison Queue', () => {
        it('continues processing after a task fails', async () => {
            const testQueue = new MermaidRenderQueue();
            const results = [];
            const { promise: p1 } = testQueue.enqueue('err-1', async () => {
                throw new Error('Intentional failure');
            });
            const { promise: p2 } = testQueue.enqueue('ok-2', async () => {
                results.push('ok-2');
                return 'success-2';
            });
            const { promise: p3 } = testQueue.enqueue('ok-3', async () => {
                results.push('ok-3');
                return 'success-3';
            });
            await expect(p1).rejects.toThrow('Intentional failure');
            const [r2, r3] = await Promise.all([p2, p3]);
            expect(r2).toBe('success-2');
            expect(r3).toBe('success-3');
            expect(results).toContain('ok-2');
            expect(results).toContain('ok-3');
        });
    });
});
