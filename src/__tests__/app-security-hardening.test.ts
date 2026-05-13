import { describe, it, expect } from 'vitest';
import { sanitizeHtml, parseAndSanitizeMarkdownSync } from '../lib/security';
import { blobManager } from '../lib/blob-manager';

describe('XSS Protection', () => {
  it('sanitizes dangerous HTML', () => {
    const dangerous = '<img src="x" onerror="alert(1)">';
    const sanitized = sanitizeHtml(dangerous);
    expect(sanitized).not.toContain('onerror');
    expect(sanitized).toContain('src="x"');
  });

  it('removes script tags', () => {
    const dangerous = '<script>alert(1)</script><p>Hello</p>';
    const sanitized = sanitizeHtml(dangerous);
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).toContain('<p>Hello</p>');
  });

  it('sanitizes markdown with XSS payload', () => {
    const dangerousMd = '[click me](javascript:alert(1)) <img src=x onerror=alert(1)>';
    const html = parseAndSanitizeMarkdownSync(dangerousMd);
    expect(html).not.toContain('javascript:');
    expect(html).not.toContain('onerror');
    expect(html).toContain('<img');
  });
});

describe('Blob URL Governance', () => {
  it('tracks and revokes Blob URLs', () => {
    // Mock URL.createObjectURL and URL.revokeObjectURL
    const originalCreate = URL.createObjectURL;
    const originalRevoke = URL.revokeObjectURL;
    let revoked = false;
    
    URL.createObjectURL = () => 'blob:test';
    URL.revokeObjectURL = (url) => { if (url === 'blob:test') revoked = true; };

    const url = blobManager.create(new Blob(['test']));
    expect(url).toBe('blob:test');
    expect(blobManager.getStats().count).toBe(1);

    blobManager.revoke(url);
    expect(revoked).toBe(true);
    expect(blobManager.getStats().count).toBe(0);

    // Restore
    URL.createObjectURL = originalCreate;
    URL.revokeObjectURL = originalRevoke;
  });
});
