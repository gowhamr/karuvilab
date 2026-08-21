import { describe, it, expect } from 'vitest';
import { markdownToTipTap, tipTapToMarkdown } from '../../features/markdown/transformer/markdown-tiptap';
describe('Markdown Transformer (Phase 2)', () => {
    describe('markdownToTipTap Parser', () => {
        it('handles empty and whitespace-only strings', () => {
            const doc1 = markdownToTipTap('');
            expect(doc1.type).toBe('doc');
            expect(doc1.content.length).toBeGreaterThan(0);
            const doc2 = markdownToTipTap('   \n\n  ');
            expect(doc2.type).toBe('doc');
            expect(doc2.content.length).toBeGreaterThan(0);
        });
        it('handles headings of all levels H1-H6', () => {
            const doc = markdownToTipTap('# H1\n## H2\n### H3\n#### H4\n##### H5\n###### H6');
            expect(doc.content).toHaveLength(6);
            expect(doc.content[0]?.attrs?.level).toBe(1);
            expect(doc.content[1]?.attrs?.level).toBe(2);
            expect(doc.content[2]?.attrs?.level).toBe(3);
            expect(doc.content[3]?.attrs?.level).toBe(4);
            expect(doc.content[4]?.attrs?.level).toBe(5);
            expect(doc.content[5]?.attrs?.level).toBe(6);
        });
        it('handles text formatting: bold, italic, strike, inline code', () => {
            const doc = markdownToTipTap('**bold** *italic* ~~strike~~ `code`');
            const p = doc.content[0];
            expect(p?.type).toBe('paragraph');
            const textNodes = p?.content || [];
            expect(textNodes.some(n => n.marks?.some(m => m.type === 'bold'))).toBe(true);
            expect(textNodes.some(n => n.marks?.some(m => m.type === 'italic'))).toBe(true);
            expect(textNodes.some(n => n.marks?.some(m => m.type === 'strike'))).toBe(true);
            expect(textNodes.some(n => n.marks?.some(m => m.type === 'code'))).toBe(true);
        });
        it('handles links and images', () => {
            const doc = markdownToTipTap('[KaruviLab](https://karuvilab.com "Home") ![Logo](logo.png "Alt")');
            const p = doc.content[0];
            const textNodes = p?.content || [];
            const linkNode = textNodes.find(n => n.marks?.some(m => m.type === 'link'));
            expect(linkNode).toBeDefined();
            expect(linkNode?.marks?.[0]?.attrs?.href).toBe('https://karuvilab.com');
            const imgNode = textNodes.find(n => n.type === 'image');
            expect(imgNode).toBeDefined();
            expect(imgNode?.attrs?.src).toBe('logo.png');
        });
        it('handles single and nested blockquotes', () => {
            const doc = markdownToTipTap('> Outer quote\n>\n> > Inner nested quote');
            expect(doc.content[0]?.type).toBe('blockquote');
        });
        it('handles unordered and ordered lists', () => {
            const docU = markdownToTipTap('- Apple\n- Banana\n- Cherry');
            expect(docU.content[0]?.type).toBe('bulletList');
            expect(docU.content[0]?.content).toHaveLength(3);
            const docO = markdownToTipTap('1. Step One\n2. Step Two\n3. Step Three');
            expect(docO.content[0]?.type).toBe('orderedList');
            expect(docO.content[0]?.attrs?.start).toBe(1);
            expect(docO.content[0]?.content).toHaveLength(3);
        });
        it('handles task lists with checked and unchecked states', () => {
            const doc = markdownToTipTap('- [ ] Pending item\n- [x] Completed item');
            expect(doc.content[0]?.type).toBe('taskList');
            const items = doc.content[0]?.content || [];
            expect(items[0]?.attrs?.checked).toBe(false);
            expect(items[1]?.attrs?.checked).toBe(true);
        });
        it('handles fenced code blocks and languages', () => {
            const doc = markdownToTipTap('```typescript\nconst x: number = 42;\n```');
            expect(doc.content[0]?.type).toBe('codeBlock');
            expect(doc.content[0]?.attrs?.language).toBe('typescript');
            expect(doc.content[0]?.content?.[0]?.text).toContain('const x: number = 42;');
        });
        it('handles Mermaid diagram code blocks', () => {
            const doc = markdownToTipTap('```mermaid\nflowchart TD\n  A --> B\n```');
            expect(doc.content[0]?.type).toBe('codeBlock');
            expect(doc.content[0]?.attrs?.language).toBe('mermaid');
            expect(doc.content[0]?.content?.[0]?.text).toContain('flowchart TD');
        });
        it('handles GFM tables', () => {
            const doc = markdownToTipTap('| Name | Age | Role |\n|---|---|---|\n| Alice | 30 | Admin |\n| Bob | 25 | User |');
            expect(doc.content[0]?.type).toBe('table');
            const rows = doc.content[0]?.content || [];
            expect(rows).toHaveLength(3); // header + 2 data rows
            expect(rows[0]?.type).toBe('tableRow');
            expect(rows[0]?.content?.[0]?.type).toBe('tableHeader');
            expect(rows[1]?.content?.[0]?.type).toBe('tableCell');
        });
        it('handles horizontal rules', () => {
            const doc = markdownToTipTap('---');
            expect(doc.content[0]?.type).toBe('horizontalRule');
        });
        it('handles malformed markdown safely without throwing', () => {
            const doc1 = markdownToTipTap('[unclosed link(http://');
            expect(doc1.type).toBe('doc');
            const doc2 = markdownToTipTap('| broken table without closing');
            expect(doc2.type).toBe('doc');
            const doc3 = markdownToTipTap('```unclosed code fence');
            expect(doc3.type).toBe('doc');
            const doc4 = markdownToTipTap('**unclosed bold *unclosed italic');
            expect(doc4.type).toBe('doc');
        });
    });
    describe('tipTapToMarkdown Serializer', () => {
        it('serializes headings correctly', () => {
            const md = tipTapToMarkdown({
                type: 'doc',
                content: [
                    { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Main Title' }] },
                    { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Sub section' }] }
                ]
            });
            expect(md).toContain('# Main Title');
            expect(md).toContain('### Sub section');
        });
        it('serializes inline marks correctly', () => {
            const md = tipTapToMarkdown({
                type: 'doc',
                content: [{
                        type: 'paragraph',
                        content: [
                            { type: 'text', text: 'bold', marks: [{ type: 'bold' }] },
                            { type: 'text', text: ' and ' },
                            { type: 'text', text: 'code', marks: [{ type: 'code' }] }
                        ]
                    }]
            });
            expect(md).toBe('**bold** and `code`\n');
        });
        it('serializes fenced code and mermaid blocks', () => {
            const md = tipTapToMarkdown({
                type: 'doc',
                content: [{
                        type: 'codeBlock',
                        attrs: { language: 'mermaid' },
                        content: [{ type: 'text', text: 'graph LR\n  A --> B' }]
                    }]
            });
            expect(md).toContain('```mermaid\ngraph LR\n  A --> B\n```');
        });
        it('serializes task lists and bullet lists', () => {
            const md = tipTapToMarkdown({
                type: 'doc',
                content: [{
                        type: 'taskList',
                        content: [
                            { type: 'taskItem', attrs: { checked: true }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Done' }] }] },
                            { type: 'taskItem', attrs: { checked: false }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Todo' }] }] }
                        ]
                    }]
            });
            expect(md).toContain('- [x] Done');
            expect(md).toContain('- [ ] Todo');
        });
        it('serializes tables into valid GFM markdown', () => {
            const md = tipTapToMarkdown({
                type: 'doc',
                content: [{
                        type: 'table',
                        content: [
                            {
                                type: 'tableRow',
                                content: [
                                    { type: 'tableHeader', content: [{ type: 'text', text: 'Col 1' }] },
                                    { type: 'tableHeader', content: [{ type: 'text', text: 'Col 2' }] }
                                ]
                            },
                            {
                                type: 'tableRow',
                                content: [
                                    { type: 'tableCell', content: [{ type: 'text', text: 'Val 1' }] },
                                    { type: 'tableCell', content: [{ type: 'text', text: 'Val 2' }] }
                                ]
                            }
                        ]
                    }]
            });
            expect(md).toContain('| Col 1 | Col 2 |');
            expect(md).toContain('|---|---|');
            expect(md).toContain('| Val 1 | Val 2 |');
        });
    });
    describe('Round-Trip Transformation Fidelity', () => {
        function testRoundTrip(input) {
            const doc = markdownToTipTap(input);
            const output = tipTapToMarkdown(doc);
            return output;
        }
        it('round-trips standard headings', () => {
            const input = '# Heading 1\n\n## Heading 2\n\n### Heading 3\n';
            expect(testRoundTrip(input)).toBe(input);
        });
        it('round-trips paragraphs and basic text formatting', () => {
            const input = 'This is **bold** and *italic* and ~~strike~~ with `code`.\n';
            expect(testRoundTrip(input)).toBe(input);
        });
        it('round-trips code blocks with languages', () => {
            const input = '```python\ndef add(a, b):\n    return a + b\n```\n';
            expect(testRoundTrip(input)).toBe(input);
        });
        it('round-trips mermaid diagram blocks', () => {
            const input = '```mermaid\nflowchart TD\n    A[Start] --> B[End]\n```\n';
            expect(testRoundTrip(input)).toBe(input);
        });
        it('round-trips unordered and task lists', () => {
            const input = '- Item A\n- Item B\n- Item C\n';
            expect(testRoundTrip(input)).toBe(input);
            const taskInput = '- [ ] Task 1\n- [x] Task 2\n';
            expect(testRoundTrip(taskInput)).toBe(taskInput);
        });
        it('round-trips GFM tables', () => {
            const input = '| Item | Price |\n|---|---|\n| Coffee | $3 |\n| Tea | $2 |\n';
            expect(testRoundTrip(input)).toBe(input);
        });
        it('round-trips horizontal rules', () => {
            const input = '---\n';
            expect(testRoundTrip(input)).toBe(input);
        });
    });
});
