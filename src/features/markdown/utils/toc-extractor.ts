/**
 * Table of Contents (TOC) Extractor for Markdown documents.
 * Extracts hierarchical headings (H1-H6) while safely ignoring code blocks.
 */

export interface TocHeading {
  id: string;
  text: string;
  level: number; // 1 to 6
  lineNumber: number; // 1-based line number in source
  slug: string;
}

export function extractTableOfContents(markdown: string): TocHeading[] {
  if (!markdown || typeof markdown !== 'string') return [];

  const lines = markdown.split('\n');
  const headings: TocHeading[] = [];
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line === undefined) continue;
    const trimmed = line.trim();

    // Check for fenced code blocks
    if (trimmed.startsWith('```') || trimmed.startsWith('~~~')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) continue;

    // Check for ATX headings (# Heading)
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match && match[1] && match[2]) {
      const level = match[1].length;
      const rawText = match[2].trim();
      // Clean markdown formatting from heading text (e.g. bold, code, links)
      const cleanText = rawText
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // [link](url) -> link
        .replace(/[*_~`]/g, '') // strip formatting chars
        .trim();

      const slug = cleanText
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

      headings.push({
        id: `toc-heading-${i + 1}-${headings.length}`,
        text: cleanText || rawText,
        level,
        lineNumber: i + 1,
        slug,
      });
    }
  }

  return headings;
}

/**
 * Generates Markdown formatted Table of Contents text from headings.
 */
export function generateMarkdownTocText(headings: TocHeading[]): string {
  if (!headings || headings.length === 0) return '';
  let toc = '## Table of Contents\n\n';
  for (const h of headings) {
    const indent = '  '.repeat(Math.max(0, h.level - 1));
    toc += `${indent}- [${h.text}](#${h.slug})\n`;
  }
  return toc + '\n';
}
