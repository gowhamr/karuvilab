import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { extractTableOfContents, generateMarkdownTocText } from '../../features/markdown/utils/toc-extractor';

describe('Markdown TOC Extractor', () => {
  it('extracts hierarchical headings correctly', () => {
    const md = `# Main Title
Some intro text

## Section 1: Introduction
Details here.

### Subsection 1.1: Architecture
More details.

## Section 2: Getting Started
Setup steps.
`;

    const headings = extractTableOfContents(md);
    assert.equal(headings.length, 4);

    assert.equal(headings[0]?.text, 'Main Title');
    assert.equal(headings[0]?.level, 1);
    assert.equal(headings[0]?.lineNumber, 1);
    assert.equal(headings[0]?.slug, 'main-title');

    assert.equal(headings[1]?.text, 'Section 1: Introduction');
    assert.equal(headings[1]?.level, 2);
    assert.equal(headings[1]?.lineNumber, 4);

    assert.equal(headings[2]?.text, 'Subsection 1.1: Architecture');
    assert.equal(headings[2]?.level, 3);
    assert.equal(headings[2]?.lineNumber, 7);

    assert.equal(headings[3]?.text, 'Section 2: Getting Started');
    assert.equal(headings[3]?.level, 2);
    assert.equal(headings[3]?.lineNumber, 10);
  });

  it('ignores headings inside fenced code blocks', () => {
    const md = `# Document Title

\`\`\`markdown
# This is inside a code block
## Also in code block
\`\`\`

## Real Heading 2
`;

    const headings = extractTableOfContents(md);
    assert.equal(headings.length, 2);
    assert.equal(headings[0]?.text, 'Document Title');
    assert.equal(headings[1]?.text, 'Real Heading 2');
  });

  it('cleans markdown formatting from headings', () => {
    const md = `## **Bold Heading** and *Italic* and [Link Title](https://example.com) and \`code\``;
    const headings = extractTableOfContents(md);

    assert.equal(headings.length, 1);
    assert.equal(headings[0]?.text, 'Bold Heading and Italic and Link Title and code');
    assert.equal(headings[0]?.level, 2);
  });

  it('generates valid markdown Table of Contents text', () => {
    const headings = [
      { id: '1', text: 'Overview', level: 1, lineNumber: 1, slug: 'overview' },
      { id: '2', text: 'Installation', level: 2, lineNumber: 5, slug: 'installation' },
      { id: '3', text: 'Configuration', level: 3, lineNumber: 10, slug: 'configuration' },
    ];

    const toc = generateMarkdownTocText(headings);
    assert.ok(toc.includes('## Table of Contents'));
    assert.ok(toc.includes('- [Overview](#overview)'));
    assert.ok(toc.includes('  - [Installation](#installation)'));
    assert.ok(toc.includes('    - [Configuration](#configuration)'));
  });

  it('handles empty markdown safely', () => {
    assert.deepEqual(extractTableOfContents(''), []);
    assert.equal(generateMarkdownTocText([]), '');
  });
});
