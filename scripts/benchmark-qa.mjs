import { performance } from 'perf_hooks';
import fs from 'fs';
import path from 'path';

const DIST_PATH = path.resolve(process.cwd(), '.test-dist');

async function runBenchmark() {
  console.log('🚀 === KARUVILAB COMPREHENSIVE PERFORMANCE QA BENCHMARK ===\n');

  const results = {
    markdown: {},
    mermaid: {},
    monaco: {},
    bgRemover: {},
    exportPipeline: {}
  };

  // ==========================================
  // 1. MARKDOWN SUBSYSTEM BENCHMARK
  // ==========================================
  console.log('📦 1. Measuring Markdown & TipTap AST Transformations...');
  try {
    const { markdownToTipTap, tipTapToMarkdown } = await import(path.join(DIST_PATH, 'src/features/markdown/transformer/markdown-tiptap.js'));

    const baseMdSample = `
# Engineering Architecture Specification
This document describes the **high-performance** offline architecture of KaruviLab.

## Core Pillars
1. *Fast & Offline*: Works natively in browser.
2. *Privacy First*: Zero tracking, no server uploads.
3. *Educational*: Every tool teaches the user.

> Architectural rule: Never block main thread for >5ms on CPU tasks.

### Task Checklist
- [x] Web Worker offloading
- [ ] IndexedDB synchronization
- [x] AST lossless serialization

| Subsystem | Mode | Concurrency | Budget |
| :--- | :--- | :--- | :--- |
| Markdown | Web Worker | 2 | <150MB |
| Mermaid | Main/Worker | 3 | <50MB |
| Monaco | Web Worker | 1 | <20MB |

\`\`\`typescript
export function computeMetrics(input: string): number {
  return input.length * 42;
}
\`\`\`

Here is an inline formula: $E = mc^2$ and a display formula:
$$
\\sum_{i=1}^{n} X_i = \\mu \\times n
$$
`;

    const sizes = [
      { label: '10 KB', targetBytes: 10 * 1024 },
      { label: '50 KB', targetBytes: 50 * 1024 },
      { label: '100 KB', targetBytes: 100 * 1024 },
      { label: '250 KB', targetBytes: 250 * 1024 },
      { label: '500 KB', targetBytes: 500 * 1024 },
      { label: '1 MB', targetBytes: 1024 * 1024 },
      { label: '2 MB', targetBytes: 2 * 1024 * 1024 },
    ];

    for (const { label, targetBytes } of sizes) {
      let doc = '';
      while (Buffer.byteLength(doc, 'utf8') < targetBytes) {
        doc += baseMdSample + '\n\n';
      }

      // Warm up
      markdownToTipTap(baseMdSample);

      const t0 = performance.now();
      const ast = markdownToTipTap(doc);
      const mdToAstMs = performance.now() - t0;

      const t1 = performance.now();
      const serializedMd = tipTapToMarkdown(ast);
      const astToMdMs = performance.now() - t1;

      const nodeCount = ast.content ? ast.content.length : 0;

      results.markdown[label] = {
        bytes: Buffer.byteLength(doc, 'utf8'),
        mdToAstMs: Number(mdToAstMs.toFixed(2)),
        astToMdMs: Number(astToMdMs.toFixed(2)),
        totalRoundtripMs: Number((mdToAstMs + astToMdMs).toFixed(2)),
        astNodes: nodeCount
      };

      console.log(`  • ${label} (${(Buffer.byteLength(doc, 'utf8') / 1024).toFixed(1)} KB): Md→AST: ${mdToAstMs.toFixed(2)}ms | AST→Md: ${astToMdMs.toFixed(2)}ms | Total: ${(mdToAstMs + astToMdMs).toFixed(2)}ms | Nodes: ${nodeCount}`);
    }
  } catch (err) {
    console.error('❌ Markdown benchmark error:', err);
  }

  // ==========================================
  // 2. MERMAID SUBSYSTEM BENCHMARK
  // ==========================================
  console.log('\n📦 2. Measuring Mermaid Preflight, Security, LRU Cache & Hash Generation...');
  try {
    const { MermaidPreflightAnalyzer } = await import(path.join(DIST_PATH, 'src/features/markdown/mermaid/MermaidPreflight.js'));
    const { MermaidSecurity } = await import(path.join(DIST_PATH, 'src/features/markdown/mermaid/MermaidSecurity.js'));
    const { mermaidCache } = await import(path.join(DIST_PATH, 'src/features/markdown/mermaid/MermaidCache.js'));

    const sampleDiagrams = [
      { type: 'flowchart', src: 'graph TD;\n  A[Start] --> B{Is Working?};\n  B -- Yes --> C[Great!];\n  B -- No --> D[Debug];\n  D --> B;' },
      { type: 'sequence', src: 'sequenceDiagram\n  autonumber\n  Alice->>Bob: Hello Bob, how are you?\n  Bob-->>Alice: I am good thanks!' },
      { type: 'class', src: 'classDiagram\n  Animal <|-- Duck\n  Animal <|-- Fish\n  Animal : +int age\n  Animal : +String gender' },
      { type: 'state', src: 'stateDiagram-v2\n  [*] --> Still\n  Still --> [*]\n  Still --> Moving\n  Moving --> Still' },
      { type: 'er', src: 'erDiagram\n  CUSTOMER ||--o{ ORDER : places\n  ORDER ||--|{ LINE-ITEM : contains' },
      { type: 'gitgraph', src: 'gitGraph\n  commit\n  branch hotfix\n  checkout hotfix\n  commit\n  checkout main\n  merge hotfix' }
    ];

    const batchCounts = [1, 5, 10, 25, 50];
    for (const count of batchCounts) {
      const batch = Array.from({ length: count }, (_, i) => sampleDiagrams[i % sampleDiagrams.length]);
      
      const t0 = performance.now();
      for (const diag of batch) {
        MermaidPreflightAnalyzer.preflight(diag.src);
      }
      const preflightTotalMs = performance.now() - t0;

      const t1 = performance.now();
      for (const diag of batch) {
        MermaidSecurity.validate(diag.src);
      }
      const securityTotalMs = performance.now() - t1;

      // LRU Cache insertion
      const t2 = performance.now();
      for (let i = 0; i < batch.length; i++) {
        const hash = MermaidPreflightAnalyzer.computeHash(batch[i].src, 'dark') + `_${i}`;
        mermaidCache.set({
          id: `diag-${i}`,
          hash,
          svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40"/></svg>`,
          theme: 'dark',
          timestamp: Date.now(),
          approxBytes: 500,
          mermaidVersion: '11.x'
        });
      }
      const cacheSetMs = performance.now() - t2;

      // LRU Cache retrieval
      const t3 = performance.now();
      let hits = 0;
      for (let i = 0; i < batch.length; i++) {
        const hash = MermaidPreflightAnalyzer.computeHash(batch[i].src, 'dark') + `_${i}`;
        if (mermaidCache.get(hash, 'dark')) hits++;
      }
      const cacheGetMs = performance.now() - t3;

      results.mermaid[`batch_${count}`] = {
        count,
        preflightTotalMs: Number(preflightTotalMs.toFixed(3)),
        preflightAvgMs: Number((preflightTotalMs / count).toFixed(3)),
        securityTotalMs: Number(securityTotalMs.toFixed(3)),
        cacheSetMs: Number(cacheSetMs.toFixed(3)),
        cacheGetMs: Number(cacheGetMs.toFixed(3)),
        cacheHits: hits
      };

      console.log(`  • ${count} Diagrams: Preflight: ${preflightTotalMs.toFixed(2)}ms (${(preflightTotalMs / count).toFixed(3)}ms/ea) | Security: ${securityTotalMs.toFixed(2)}ms | Cache Set: ${cacheSetMs.toFixed(2)}ms | Cache Get: ${cacheGetMs.toFixed(2)}ms`);
    }
  } catch (err) {
    console.error('❌ Mermaid benchmark error:', err);
  }

  // ==========================================
  // 3. MONACO SUBSYSTEM BENCHMARK
  // ==========================================
  console.log('\n📦 3. Measuring Monaco Models, Theme Tokens & Schemas...');
  try {
    const { apiHeadersSchema, apiRequestSchema } = await import(path.join(DIST_PATH, 'src/core/monaco/schemas/api.schemas.js'));
    
    const sampleJsonPayload = JSON.stringify({
      version: "2.1.0",
      settings: {
        theme: "dark",
        fontSize: 14,
        autoSave: true
      },
      tools: Array.from({ length: 100 }, (_, i) => ({ id: `tool-${i}`, name: `Tool ${i}`, enabled: i % 2 === 0 }))
    }, null, 2);

    const t0 = performance.now();
    // Simulate fast schema validation parse check
    const parsed = JSON.parse(sampleJsonPayload);
    const validateMs = performance.now() - t0;

    results.monaco = {
      headerPropertiesCount: Object.keys(apiHeadersSchema.properties || {}).length,
      requestPropertiesCount: Object.keys(apiRequestSchema.properties || {}).length,
      jsonValidationMs: Number(validateMs.toFixed(3))
    };

    console.log(`  • Loaded Monaco API schemas (${results.monaco.headerPropertiesCount} header props, ${results.monaco.requestPropertiesCount} req props). JSON parsing check: ${validateMs.toFixed(3)}ms`);
  } catch (err) {
    console.error('❌ Monaco benchmark error:', err);
  }

  // ==========================================
  // 4. BACKGROUND REMOVER PIPELINE BENCHMARK
  // ==========================================
  console.log('\n📦 4. Measuring Background Remover Engine Registry & Selector...');
  try {
    const { EngineRegistry } = await import(path.join(DIST_PATH, 'src/features/background-remover/engine-registry.js'));
    const { analyzeImageForRemoval } = await import(path.join(DIST_PATH, 'src/features/background-remover/engine-selector.js'));

    const registry = new EngineRegistry();
    const engines = registry.list();

    console.log(`  • Background Remover Registered Engines (${engines.length}): ${engines.map(e => e.id).join(', ')}`);

    const imageSizes = [
      { label: '720p', width: 1280, height: 720 },
      { label: '1080p', width: 1920, height: 1080 },
      { label: '2K', width: 2560, height: 1440 },
      { label: '4K', width: 3840, height: 2160 }
    ];

    for (const { label, width, height } of imageSizes) {
      const pixels = width * height;
      const memEstMB = (pixels * 4) / (1024 * 1024);

      const t0 = performance.now();
      const selection = analyzeImageForRemoval({
        width,
        height,
        hasAlpha: false,
        estimatedComplexity: 'moderate'
      });
      const selectTimeMs = performance.now() - t0;

      results.bgRemover[label] = {
        width,
        height,
        pixels,
        memEstMB: Number(memEstMB.toFixed(1)),
        selectedEngine: selection.recommendedEngine,
        selectTimeMs: Number(selectTimeMs.toFixed(3))
      };

      console.log(`  • ${label} (${width}x${height}, ~${memEstMB.toFixed(1)}MB frame): Engine Selected: ${selection.recommendedEngine} (confidence: ${selection.confidence}) in ${selectTimeMs.toFixed(3)}ms`);
    }
  } catch (err) {
    console.error('❌ Background remover benchmark error:', err);
  }

  // Save baseline results to file
  fs.writeFileSync(
    path.join(process.cwd(), 'scripts/benchmark-baseline.json'),
    JSON.stringify(results, null, 2)
  );

  console.log('\n✅ Performance benchmark complete! Baseline recorded to scripts/benchmark-baseline.json');
}

runBenchmark().catch(console.error);
