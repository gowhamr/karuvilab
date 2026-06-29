import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { zIndex } from '../theme/zindex';

function getFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results.push(...getFiles(filePath));
    } else {
      results.push(filePath);
    }
  }
  return results;
}

describe('Z-Index Canonical Token Enforcement', () => {
  it('should only use allowed z-index named tokens', () => {
    const rootDir = path.resolve(__dirname, '../../');
    const scanDirs = [
      path.join(rootDir, 'app'),
      path.join(rootDir, 'components'),
      path.join(rootDir, 'src'),
    ];

    const allowedTokens = new Set([
      ...Object.keys(zIndex),
      'auto',
      'normal',
      // Allow kebab-case counterparts for camelCase keys
      'modal-backdrop',
    ]);

    const filesToCheck: string[] = [];
    for (const dir of scanDirs) {
      filesToCheck.push(...getFiles(dir));
    }

    const violations: string[] = [];

    for (const file of filesToCheck) {
      if (
        file.includes('__tests__') ||
        file.includes('src/theme/zindex.ts') ||
        file.includes('src/theme/tokens.ts') ||
        file.endsWith('.d.ts')
      ) {
        continue;
      }

      const ext = path.extname(file);
      if (!['.tsx', '.ts', '.js', '.jsx', '.css'].includes(ext)) {
        continue;
      }

      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');

      const zClassRegex = /\b(-?z)-([a-zA-Z0-9_\[\]\-]+)\b/g;
      const inlineZIndexRegex = /\bzIndex\s*[:=]\s*['"]?(-?\d+)['"]?/gi;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]!;

        // 1. Check Tailwind z-index classes
        let m;
        // Reset regex index
        zClassRegex.lastIndex = 0;
        while ((m = zClassRegex.exec(line)) !== null) {
          const token = m[2];
          if (!token || token === 'index') continue; // Ignore "z-index" keyword/property
          if (!allowedTokens.has(token)) {
            violations.push(`${file}:${i + 1} - Found invalid z-index class "${m[0]}"`);
          }
        }

        // 2. Check inline styles
        let inlineMatch;
        // Reset regex index
        inlineZIndexRegex.lastIndex = 0;
        while ((inlineMatch = inlineZIndexRegex.exec(line)) !== null) {
          violations.push(`${file}:${i + 1} - Found raw inline zIndex setting "${inlineMatch[0]}"`);
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it('should align globals.css variables with zindex.ts design tokens', () => {
    const rootDir = path.resolve(__dirname, '../../');
    const globalsCssPath = path.join(rootDir, 'app/globals.css');
    
    if (!fs.existsSync(globalsCssPath)) {
      return;
    }

    const cssContent = fs.readFileSync(globalsCssPath, 'utf8');
    const cssVarRegex = /--z-([a-zA-Z0-9\-]+)\s*:\s*(-?\d+)\s*;/g;
    const cssTokens: Record<string, number> = {};
    
    let match;
    while ((match = cssVarRegex.exec(cssContent)) !== null) {
      const name = match[1]!;
      const value = parseInt(match[2]!, 10);
      cssTokens[name] = value;
      
      const camelName = name.replace(/-([a-z])/g, (g) => g[1]!.toUpperCase());
      cssTokens[camelName] = value;
    }

    for (const [key, val] of Object.entries(zIndex)) {
      const cssVal = cssTokens[key];
      expect(cssVal).toBeDefined();
      expect(String(cssVal)).toBe(String(val));
    }
  });
});
