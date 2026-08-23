import { describe, it, expect } from 'vitest';
import { tokenizeMarkdownForSpellCheck } from '../../features/markdown/utils/markdown-spell-tokenizer';

describe('markdown-spell-tokenizer', () => {
  it('extracts plain text and preserves offsets', () => {
    const rawMd = "# Hello Wrold\n\nThis is a test.";
    const result = tokenizeMarkdownForSpellCheck(rawMd);
    
    expect(result.plainText).toBe("Hello Wrold This is a test. ");
    // "Hello Wrold" starts at index 2 in rawMd
    expect(result.offsetMap[0]).toBe(2);
    expect(result.offsetMap[11]).toBe(13); // end of "Wrold"
  });

  it('skips fenced code blocks', () => {
    const rawMd = "Start\n```javascript\nconst x = 1;\n```\nEnd";
    const result = tokenizeMarkdownForSpellCheck(rawMd);
    
    expect(result.plainText).toBe("Start End ");
  });

  it('skips inline code', () => {
    const rawMd = "This is `code block` text";
    const result = tokenizeMarkdownForSpellCheck(rawMd);
    
    expect(result.plainText).toBe("This is  text ");
  });

  it('skips URLs and retains link text', () => {
    const rawMd = "Click [here](https://example.com) for info.";
    const result = tokenizeMarkdownForSpellCheck(rawMd);
    
    expect(result.plainText).toBe("Click here  for info. ");
  });

  it('skips image syntax', () => {
    const rawMd = "Look: ![alt text](https://img.com) nice.";
    const result = tokenizeMarkdownForSpellCheck(rawMd);
    
    expect(result.plainText).toBe("Look:  nice. ");
  });
});
