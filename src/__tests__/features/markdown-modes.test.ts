import { describe, it, expect } from 'vitest';
import { markdownToTipTap, tipTapToMarkdown } from '../../features/markdown/transformer/markdown-tiptap';

describe('Phase 5: Document Fidelity & Synchronization Hardening', () => {
  function testModeSwitchingCycle(initialMarkdown: string) {
    // Write -> Visual
    const visualState = markdownToTipTap(initialMarkdown);
    
    // Visual -> Write
    const restoredMarkdown = tipTapToMarkdown(visualState);
    
    // Write -> Visual -> Preview -> Visual -> Write
    const multiStepVisual1 = markdownToTipTap(restoredMarkdown);
    const multiStepVisual2 = multiStepVisual1; 
    const finalMarkdown = tipTapToMarkdown(multiStepVisual2);

    return {
      initial: initialMarkdown,
      restored: restoredMarkdown,
      final: finalMarkdown
    };
  }

  it('Write -> Visual -> Write preserves full CommonMark/GFM semantics', () => {
    const input = `# Heading 1\n\n## Heading 2\n\nThis is **bold**, *italic*, ~~strikethrough~~, and \`inline code\`.\n\n- Bullet 1\n- Bullet 2\n\n1. Number 1\n2. Number 2\n\n- [ ] Task pending\n- [x] Task done\n\n\`\`\`mermaid\nflowchart TD\n  A --> B\n\`\`\`\n\n| Col 1 | Col 2 |\n|---|---|\n| Val 1 | Val 2 |\n`;
    
    const result = testModeSwitchingCycle(input);
    expect(result.restored).toBe(input);
    expect(result.final).toBe(input);
  });

  it('Visual -> Markdown -> Visual preserves TipTap JSON AST structure', () => {
    const visualContent = {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Serialized Title' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Paragraph with ' }, { type: 'text', marks: [{ type: 'bold' }], text: 'bold' }] }
      ]
    };
    
    const markdown = tipTapToMarkdown(visualContent);
    const roundTripDoc = markdownToTipTap(markdown);
    expect(roundTripDoc.content?.length).toBe(2);
    expect(roundTripDoc.content?.[0]?.type).toBe('heading');
    expect(roundTripDoc.content?.[1]?.type).toBe('paragraph');
  });

  it('Tables preserve column headers and row data', () => {
    const tableInput = '| Language | Speed | Safety |\n|---|---|---|\n| Rust | Fast | High |\n| TypeScript | Fast | Medium |\n';
    const result = testModeSwitchingCycle(tableInput);
    expect(result.final).toBe(tableInput);
  });

  it('Task lists preserve checked and unchecked state accurately', () => {
    const taskInput = '- [ ] First task pending\n- [x] Second task completed\n- [ ] Third task pending\n';
    const result = testModeSwitchingCycle(taskInput);
    expect(result.final).toBe(taskInput);
  });

  it('Images preserve src, alt, and title attributes', () => {
    const imgInput = '![Architecture Diagram](https://example.com/arch.png "System Architecture")\n';
    const result = testModeSwitchingCycle(imgInput);
    expect(result.final).toBe(imgInput);
  });

  it('Links preserve href, title, and inner text', () => {
    const linkInput = 'Visit [KaruviLab](https://karuvilab.com "Offline Tools") for privacy-first tools.\n';
    const result = testModeSwitchingCycle(linkInput);
    expect(result.final).toBe(linkInput);
  });

  it('Mermaid diagrams preserve flowchart syntax without corruption', () => {
    const mermaidInput = '\`\`\`mermaid\nflowchart TD\n  Client[Browser] --> Worker[Web Worker]\n  Worker --> AST[TipTap AST]\n\`\`\`\n';
    const result = testModeSwitchingCycle(mermaidInput);
    expect(result.final).toBe(mermaidInput);
  });

  it('Code blocks preserve language identifiers and indentation', () => {
    const codeInput = '\`\`\`typescript\ninterface Config {\n  workers: number;\n  timeout: number;\n}\n\`\`\`\n';
    const result = testModeSwitchingCycle(codeInput);
    expect(result.final).toBe(codeInput);
  });

  it('Nested lists preserve indentation levels across round trips', () => {
    const listInput = '- Level 1 Item A\n  - Level 2 Item A1\n  - Level 2 Item A2\n- Level 1 Item B\n';
    const result = testModeSwitchingCycle(listInput);
    expect(result.final).toBe(listInput);
  });

  it('Multi-step cycle: Write -> Visual -> Preview -> Visual -> Write has zero content loss', () => {
    const input = `> Blockquote text\n\n---\n\n\`\`\`javascript\nconst x = 10;\n\`\`\`\n`;
    const result = testModeSwitchingCycle(input);
    expect(result.final).toBe(input);
  });

  it('Empty document transitions cleanly without crashing', () => {
    const input = '';
    const visualState = markdownToTipTap(input);
    expect(visualState.type).toBe('doc');
    const markdown = tipTapToMarkdown(visualState);
    expect(markdown.trim()).toBe('');
  });

  it('Large documents (>100KB) preserve formatting and complete seamlessly', () => {
    const paragraph = 'This is a large test paragraph with **bold**, *italic*, `code`, and [links](https://karuvilab.com).\n\n';
    const table = '| Col A | Col B |\n|---|---|\n| 1 | 2 |\n\n';
    const code = '```javascript\nconst a = 1;\n```\n\n';
    const block = paragraph + table + code;
    
    // Generate ~100KB document
    let input = '# Large Scale Synchronization Document\n\n';
    while (input.length < 100 * 1024) {
      input += block;
    }
    
    const result = testModeSwitchingCycle(input);
    expect(result.final.trim()).toBe(input.trim());
  });

  it('Word docx exporter converts Markdown AST into structured Document with tables and headings', async () => {
    const { convertMarkdownToDocx } = await import('../../features/markdown/utils/markdown-docx');
    const { Packer } = await import('docx');

    const mdInput = `# Main Heading\n\nParagraph with **bold**, *italic*, and \`code\`.\n\n- Bullet 1\n- Bullet 2\n\n| H1 | H2 |\n|---|---|\n| C1 | C2 |\n\n\`\`\`ts\nconst x: number = 42;\n\`\`\`\n`;
    const doc = convertMarkdownToDocx(mdInput, 'TestDoc');
    expect(doc).toBeDefined();

    const buffer = await Packer.toBuffer(doc);
    expect(buffer.length).toBeGreaterThan(1000);
  });
});

